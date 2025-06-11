import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { Product } from '../../interfaces/product';
import { ProductCardComponent } from "../product/product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-searched-products',
	imports: [CommonModule, ProductCardComponent, FormsModule],
	templateUrl: './searched-products.component.html',
	styleUrl: './searched-products.component.css'
})
export class SearchedProductsComponent implements OnInit, OnDestroy {
	@ViewChild('topOfGrid') topOfGrid!: ElementRef;
	private productService: ProductService = inject(ProductService);
	private route: ActivatedRoute = inject(ActivatedRoute);
	private router: Router = inject(Router);
	private routerSubscription!: Subscription;

	public products: Product[] = [];
	public sortedProducts: Product[] = [];
	public currentSearchValue!: string;
	public message!: string;

	quantityItems: number = 0;
	quantityItemsPerPage: number = 6;
	currentPage: number = 1;
	quantityPages: number = 0;

	ngOnInit(): void {
		this.message = "Buscando los productos...";
		/**
		 * Con esta suscripcion se reinicializa el contenido del componente cuando se modifica la URL, 
		 * sin que sea necesario la reinicializacion completa del componente, que no sucede ante el evento Navigate.
		 * Esto es necesario para que el contenido del componente se cargue correctamente cuando el searchbar 
		 * invoca el evento navigate ( con router.navigate([]) ), luego de haber modificado el url manualmente
		 */
		this.routerSubscription = this.router.events.subscribe((event: Event) => {			
			if (event instanceof NavigationEnd) {	
				this.initialize();
			}
		});
		//solo se ejecuta cuando se crea el componente, pero no cuando se hace un router.navigate()
		this.initialize();
	}

	initialize(): void {		
		const searchValue = this.route.snapshot.paramMap.get('searchValue');
		this.currentSearchValue = searchValue || "";
		this.fetchProducts(this.currentSearchValue);
	}

	fetchProducts(searchValue: string): void {
		this.productService.searchProducts(searchValue || "asd").subscribe({
			next: (response) => {
				this.products = response;
				if (this.products.length === 0) {
					this.updateNoResultsMessage(searchValue);
				}
				this.quantityItems = this.products.length;
				this.quantityPages = Math.ceil(this.quantityItems / this.quantityItemsPerPage);
				this.sortedByNameAsc();
				this.updatePaginatedProducts();
			},
			error: (err) => {
				console.error(err);
			}
		})
	}

	updateNoResultsMessage(searchValue: string) {
		this.message = `No se encontraron productos que contengan '${searchValue}' en el nombre`
	}

	ngOnDestroy(): void {
		this.routerSubscription.unsubscribe();
	}

	handleSortItems(option: string) {
		switch (option) {
			case '6':
				this.quantityItemsPerPage = 6;
				break;
			case '12':
				this.quantityItemsPerPage = 12;
				break;
			case '18':
				this.quantityItemsPerPage = 18;
				break;
		}
		this.quantityPages = Math.ceil(this.quantityItems / this.quantityItemsPerPage);
		this.currentPage = 1;
		this.updatePaginatedProducts();
	}

	updatePaginatedProducts() {
		const startIndex = (this.currentPage - 1) * this.quantityItemsPerPage;
		const endIndex = startIndex + this.quantityItemsPerPage;
		this.sortedProducts = this.products.slice(startIndex, endIndex);
	}


	goToPage(page: number) {
		if (page >= 1 && page <= this.quantityPages) {
			this.currentPage = page;
			this.updatePaginatedProducts();

			this.topOfGrid.nativeElement.scrollIntoView({ behavior: 'smooth' });
		}
	}

	sortedByPriceAsc() {
		this.sortedProducts = this.products.sort((a, b) => a.precio - b.precio);
	}

	sortedByPriceDesc() {
		this.sortedProducts = this.products.sort((a, b) => b.precio - a.precio);
	}

	sortedByNameAsc() {
		this.sortedProducts = this.products.sort((a, b) => a.nombre.localeCompare(b.nombre));
	}

	sortedByNameDesc() {
		this.sortedProducts = this.products.sort((a, b) => b.nombre.localeCompare(a.nombre));
	}

	handleSort(event: any) {
		const option = event?.target?.value || "priceAsc";

		switch (option) {
			case 'priceAsc':
				this.sortedByPriceAsc();
				break;
			case 'priceDesc':
				this.sortedByPriceDesc();
				break;
			case 'nameAsc':
				this.sortedByNameAsc();
				break;
			case 'nameDesc':
				this.sortedByNameDesc();
				break;
		}
		this.updatePaginatedProducts();
	}
}
