import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product';
import { FormsModule } from '@angular/forms';
import { MarcasCarrouselComponent } from '../../marcas-carrousel/marcas-carrousel.component';
import { MarcasService } from '../../../services/marcas.service';


@Component({
  selector: 'app-products-grid',
  imports: [ProductCardComponent, CommonModule, FormsModule, MarcasCarrouselComponent],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.css'
})
export class ProductsGridComponent implements OnInit {

  productsSorted: Product[] = [];
  productsSortedPagination: Product[] = [];
  quantityItems : number = 0;
  quantityItemsPerPage : number = 12;
  currentPage : number = 1;
  quantityPages : number = 0;

  selectedSort: string = '';

  marcas : String[] = [];
  marcasSorted : string[] = [];

  @ViewChild('topOfGrid') topOfGrid!: ElementRef;
  
  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _marcasService: MarcasService
  ) {}

  ngOnInit(): void {
    const category = this.route.snapshot.paramMap.get('category');

    if (category) {
      const cached = this._productService.getProductsSortedByCat(category);
      if (cached.length > 0){
        this.productsSorted = [...cached];
        
      } else {
        this._productService.getProductosByCategory(category).subscribe({
          next: (productos) => {
            this.productsSorted = productos;
            this._productService.setProductsSortedByCat(this.productsSorted);

            this.quantityItems = this.productsSorted.length;
            this.quantityPages = Math.ceil(this.quantityItems / this.quantityItemsPerPage);
            this.updatePaginatedProductos();
          },
          error: (err) => {
            console.error("Error obteniendo todos los productos:", err);
          },
          complete: () => {
            console.log('Petición finalizada');
          }
        });
      }
    } 
    setTimeout(() => {
      this.fetchMarcas();
    }, 0);
  }

  fetchMarcas(): void {
    this._marcasService.getMarcas().subscribe({
      next: response => {
        this.marcas = response; 
        this.sortMarcas();
        console.log(this.marcasSorted);
        
      },
      error: err => {
        console.log("Error");        
      }
    });   
  }

  sortMarcas(){
     for(const producto of this.productsSorted){
      if(!this.marcasSorted.includes(producto.marca_nombre))
        this.marcasSorted.push(producto.marca_nombre);
     }
  }

  updatePaginatedProductos() {
    const startIndex = (this.currentPage - 1) * this.quantityItemsPerPage;
    const endIndex = startIndex + this.quantityItemsPerPage;
    this.productsSortedPagination = this.productsSorted.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.quantityPages) {
      this.currentPage = page;
      this.updatePaginatedProductos();

      this.topOfGrid.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  sortedByPriceAsc() {
    this.productsSorted = this.productsSorted.sort((a, b) => a.precio - b.precio);
  }
  
  sortedByPriceDesc() {
    this.productsSorted = this.productsSorted.sort((a, b) => b.precio - a.precio);
  }
  
  sortedByNameAsc() {
    this.productsSorted = this.productsSorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  
  sortedByNameDesc() {
    this.productsSorted = this.productsSorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  handleSort(option: string) {
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
    this.updatePaginatedProductos();
  }

   handleSortItems(option: string) {
    switch (option) {
      case '8':
        this.quantityItemsPerPage = 8;
        break;
      case '12':
        this.quantityItemsPerPage = 12;
        break;
      case '16':
        this.quantityItemsPerPage = 16;
        break;
    }
    this.updatePaginatedProductos();
  }
}
