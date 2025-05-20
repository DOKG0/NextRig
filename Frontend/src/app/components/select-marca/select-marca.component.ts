import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MarcasService } from '../../services/marcas.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-select-marca',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './select-marca.component.html',
  styleUrl: './select-marca.component.css'
})
export class SelectMarcaComponent implements OnInit {
  fetchErrorMsg: string = "";
  @Input() marcaSeleccionada: string = "";
  marcas: { NombreMarca: string }[] = []; //Marcas guardadas en la BD
  marcasHttpService: MarcasService = inject(MarcasService);
  @Output() marcaSeleccionadaEvent = new EventEmitter<any>(); 

  constructor() {}

  ngOnInit(): void {    
      this.fetchMarcas();
  }

  fetchMarcas(): void {
    this.marcasHttpService.getMarcas().subscribe({
      next: response => {
        this.marcas = response; 
        if (!this.marcaSeleccionada) {
          this.marcaSeleccionada = this.marcas[0].NombreMarca;     
        }
        this.marcaSeleccionadaEvent.emit(this.marcaSeleccionada);  
      },
      error: err => {
        this.fetchErrorMsg = `Error al recuperar las marcas: ${err}`          
      }
    });   
  }

  onChangeEmitSelectedMarca(event: any) {
    this.marcaSeleccionada = event;
    this.marcaSeleccionadaEvent.emit(this.marcaSeleccionada);
  }
}
