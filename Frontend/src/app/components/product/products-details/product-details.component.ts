import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product'
import { ProductCardComponent } from '../product-card/product-card.component';
import { ReviewStarsComponent } from '../../review-stars/review-stars.component';
import { UsuarioService } from '../../../services/usuarios.service';
import { ReviewListComponent } from "../../review-list/review-list.component";
import { ReviewService } from '../../../services/review.service';
import { ReviewFormComponent } from "../../review-form/review-form.component";

import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
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
	contadorQuantity: number = 0;

	@ViewChild('topOfDetails') topOfDetails!: ElementRef;
	@ViewChild('generalInfo') generalInfo!: ElementRef;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private _productService: ProductService,
		private usuarioService: UsuarioService,
		private reviewService: ReviewService,
		private location: Location
	) { }

	ngOnInit(): void {

		const username: string = this.getLoggedUsername();

		this.route.paramMap.subscribe(params => {
			const id = params.get('id');

			this.productosSimilares = this._productService.getProductsSortedByCat(this._productService.getCategory());
			if (id) {
				this._productService.getProductoById(id).subscribe({
					next: (producto) => {
						if (!producto) {
							this.router.navigate(['/404']);
						} else {
							this.producto = producto;
							this.setReviewFormVisibility(username, producto.id as string);
						}
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

		if (!username) {
			this.reviewHabilitado = false;
		} else {
			this.reviewService.getUsuarioHabilitadoParaReviewDeProducto(productId, username).subscribe({
				next: (response: any) => {
					this.reviewHabilitado = response.data?.habilitado || false;
				},
				error: (err) => {
					console.error(err.error);
				}
			});
		}
	}

	getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	minusQuantity() {
		if (this.quantity > 0) {
			this.quantity--;
		}
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

	previousPage() {
		this.location.back();
	}


	async agregarAlCarrito(quantity : number) {

		if (quantity === 0) {
		  quantity = 1;
		}
		
		try {
		    if(this.producto === undefined) return;
			let cantidadEnCarrito = Number(await lastValueFrom(this.usuarioService.getCantidadproducto(this.currentUsername, this.producto.id as string)));
			
			
			if ((cantidadEnCarrito + quantity) > this.producto.stock) {
			  Swal.fire({
				title: "Has alcanzado la cantidad maxima para este producto",
				icon: "warning"
			  }
			  );
			  return;
			} else {
	
			  if (!this.producto || this.producto.id === undefined) {
				console.error('Producto no definido o sin ID');
				return;
			  } else {
				let idProducto = this.producto.id as string;
				this.resetQuantity();
				this.alertProductoCarritoToast(this.producto.nombre);
				this.usuarioService.agregarCarrito(this.currentUsername, idProducto, quantity).subscribe((data: any) => {
				}
				);
			  }
	
			}
		} catch (error) {
		  console.error("error en el agregado", error);
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
}