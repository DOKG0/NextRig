import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marcas-carrousel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marcas-carrousel.component.html',
  styleUrl: './marcas-carrousel.component.css'
})
export class MarcasCarrouselComponent {

  @Input() marcasSorted: string[] = [];
  @Output() marcaSelected = new EventEmitter<string>();
  selectedMarca: string = '';

  posicionScroll: number = 0;
  anchoItem: number = 123; 
  itemsVisibles: number = 4; 

  get puedeMoverIzquierda(): boolean {
    console.log(this.marcasSorted);
    return this.posicionScroll < 0;
  }

  get puedeMoverDerecha(): boolean {
    const totalVisible = this.itemsVisibles * this.anchoItem;
    const totalAncho = this.marcasSorted.length * this.anchoItem;
    return Math.abs(this.posicionScroll) + totalVisible < totalAncho;
  }

  handleMarcaClick(marca: string) {
    this.selectedMarca = this.selectedMarca === marca ? '' : marca;
    this.marcaSelected.emit(this.selectedMarca);
  }

  moverCarrousel(direccion: number) {
    const desplazamiento = this.anchoItem;

    if (direccion === -1 && this.puedeMoverIzquierda) {
      this.posicionScroll += desplazamiento;
    } else if (direccion === 1 && this.puedeMoverDerecha) {
      this.posicionScroll -= desplazamiento;
    }
  }
}