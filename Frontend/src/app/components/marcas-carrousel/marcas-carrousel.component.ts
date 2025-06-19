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
  selectedMarca : string = '';

  handleMarcaClick(marca: string) {
    if (marca !== this.selectedMarca ) {

      this.selectedMarca  = marca;
      this.marcaSelected.emit(marca);
    }else{
      this.selectedMarca  = '';
      this.marcaSelected.emit(this.selectedMarca );
    }
  }

  get esCarrouselActivo(): boolean {
  return this.marcasSorted.length > 5;
}
}
