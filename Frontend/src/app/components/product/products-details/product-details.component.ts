import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product'
import { ProductCardComponent } from '../product-card/product-card.component';
import { ReviewStarsComponent } from '../../review-stars/review-stars.component';
import { UsuarioService } from '../../../services/usuarios.service';
import { ReviewListComponent } from "../../review-list/review-list.component";
import { ReviewService } from '../../../services/review.service';
import { ReviewFormComponent } from "../../review-form/review-form.component";
import Swal from 'sweetalert2';
@Component({
	selector: 'app-product-details',
	imports: [CommonModule, RouterModule, ProductCardComponent, ReviewListComponent, ReviewFormComponent, ReviewStarsComponent],
	templateUrl: './product-details.component.html',
	styleUrl: './product-details.component.css'
})

export class ProductDetailsComponent implements OnInit {
	producto: Product | undefined;
	quantity: number = 0;
	productosSimilares: Product[] = [];
	productosSimilaresRandom: Product[] = [];
	activeTab: 'general' | 'additional' = 'general';
	reviewHabilitado: boolean = false;
	currentUsername: string = "";

	@ViewChild('topOfDetails') topOfDetails!: ElementRef;
	@ViewChild('generalInfo') generalInfo!: ElementRef;
	constructor(
		private route: ActivatedRoute,
		private _productService: ProductService,
		private usuarioService: UsuarioService,
		private reviewService: ReviewService
	) { }

	ngOnInit(): void {

		const username: string = this.getLoggedUsername();

		this.route.paramMap.subscribe(params => {
			const id = params.get('id');

			this.productosSimilares = this._productService.getProductsSortedByCat(this._productService.getCategory());
			if (id) {
				this._productService.getProductoById(id).subscribe({
					next: (producto) => {
						this.producto = producto;
						this.setReviewFormVisibility(username, producto.id as string);
					},
					error: (err) => {
						console.error('Error al obtener el producto:', err);
					}
				});
			}
		});
		this.setRandomProducts();
	}

	getLoggedUsername(): string {
		const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const username = user?.username || "";
		this.currentUsername = username;
		
		return username;
	}

	setReviewFormVisibility(username: string, productId: string): void {
		this.reviewService.getUsuarioHabilitadoParaReviewDeProducto(productId, username).subscribe({
			next: (response: any) => {
				this.reviewHabilitado = response.data?.habilitado || false;
			},
			error: (err) => {
				console.error(err.error);
			}
		});
	}

	getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	minusQuantity() {
		if (this.quantity > 0) {
			this.quantity--;
		}
	}


  	alertProductoCarritoToast(data: string): void {
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: `Producto '${data}' agragado al carrito correctamente`,
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 5000,
        });
      }

	plusQuantity() {
		this.quantity++;
	}

	resetQuantity() {
		this.quantity = 0;
	}

	selectTab(tab: 'general' | 'additional') {
		this.activeTab = tab;
	}

	setRandomProducts() {
		const randomProducts: Product[] = [];
		const usedIndexes = new Set<number>();

		while (randomProducts.length < 3 && this.productosSimilares.length > 0) {
			const randomIndex = this.getRandomInt(0, this.productosSimilares.length - 1);

			if (!usedIndexes.has(randomIndex)) {
				usedIndexes.add(randomIndex);
				randomProducts.push(this.productosSimilares[randomIndex]);
			}
		}
		this.productosSimilaresRandom = randomProducts;
	}

	top() {
		setTimeout(() => {
			this.topOfDetails.nativeElement.scrollIntoView({ behavior: 'smooth' });
		}, 0);
	}

	agregarAlCarrito(quantity: number) {

		if (quantity === 0) {
			quantity = 1;
		}
		let nombreUsuario = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
		if (!this.producto || this.producto.id === undefined) {
			console.error('Producto no definido o sin ID');
			return;
		} else {
			let idProducto = this.producto.id as string;
			console.log('ID del producto:', idProducto);
			console.log('Nombre de usuario:', nombreUsuario);
			console.log('Cantidad:', quantity);
			this.usuarioService.agregarCarrito(nombreUsuario, idProducto, quantity).subscribe((data: any) => {
			}
			);
		}
	}
}