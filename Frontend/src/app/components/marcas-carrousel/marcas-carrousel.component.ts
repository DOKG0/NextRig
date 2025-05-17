import { Component, Input } from '@angular/core';
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

}
