import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../interfaces/product';
import { ProductCardComponent } from "../product/product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-searched-products',
	imports: [CommonModule, ProductCardComponent, FormsModule],
	templateUrl: './searched-products.component.html',
	styleUrl: './searched-products.component.css'
})
export class SearchedProductsComponent implements OnInit {
	@ViewChild('topOfGrid') topOfGrid!: ElementRef;
	private productService: ProductService = inject(ProductService);
	private route: ActivatedRoute = inject(ActivatedRoute);
	public products: Product[] = [];
	public sortedProducts: Product[] = [];
	public currentSearchValue!: string;

	quantityItems: number = 0;
	quantityItemsPerPage: number = 6;
	currentPage: number = 1;
	quantityPages: number = 0;

	ngOnInit(): void {
		const searchValue = this.route.snapshot.paramMap.get('searchValue');
		this.currentSearchValue = searchValue || "";

		this.productService.searchProducts(searchValue || "").subscribe({
			next: (response) => {
				this.products = response;

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
