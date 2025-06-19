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
  marca: string = '';

  handleMarcaClick(marca: string) {
    if (marca !== this.marca) {

      this.marca = marca;
      this.marcaSelected.emit(marca);
    }else{
      this.marca = '';
      this.marcaSelected.emit(this.marca);
    }
  }

}
