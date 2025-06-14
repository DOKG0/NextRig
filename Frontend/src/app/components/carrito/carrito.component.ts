import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuarios.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-carrito',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
carrito: any[] = [];
  total: number = 0;
  user: string = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
  hayProductos: boolean = false;
  usuario: any;

  quiereComprar: boolean = false;
  userForm: FormGroup;
  submitted = false;
  responseMessage = '';

  constructor(private fb: FormBuilder,private router: Router, private usuarioService: UsuarioService) {
   this.userForm = this.fb.group({
      telefono: ['', [Validators.required,Validators.pattern(/^\+?[0-9]{4,15}$/)]],
      departamento: ['', Validators.required],
      direccion: ['', Validators.required]
    });
    this.getCarrito();
    
  }

  getCarrito() {
    
    this.usuarioService.getCarrito(this.user).subscribe((data: any) => {
      this.carrito = data;
      if (this.carrito.length > 0) {
        this.hayProductos = true;
        for (let i = 0; i < this.carrito.length; i++) {
          if(this.carrito[i].cantidad > 0){
          this.total += Number(this.carrito[i].precio * this.carrito[i].cantidad); 
          }else{
            this.total += Number(this.carrito[i].precio);
            this.carrito[i].cantidad = 1;
          }
        }
     
        
      }
    });
  }

  eliminarProducto(producto: any) {
    console.log(producto.id);
    console.log(this.user);
   this.usuarioService.eliminarProductoCarrito(this.user, producto.id,).subscribe({
     next: () => {
      this.carrito = this.carrito.filter(p => p.id !== producto.id);

      this.total = this.carrito.reduce((sum, p) => sum + Number(p.precio) * p.cantidad, 0);

      if(this.carrito.length === 0) {
      this.hayProductos = false;
      }
    },
   });
   
  }

verProducto(id : string) {
  this.router.navigate(['/products', id]);
}



  comprar() {
    this.quiereComprar = true;
}

get f() {
    return this.userForm.controls;
  }

async onSubmit() {
 
  this.submitted = true;
  
   if (this.userForm.invalid) return;

    let telefonoNumber = this.userForm.get('telefono')?.value;
    console.log(telefonoNumber);
    try{
    await lastValueFrom( this.usuarioService.crearCompra(this.user,this.total - 200,telefonoNumber,this.userForm.get('direccion')?.value,this.userForm.get('departamento')?.value));
    for (let i = 0; i < this.carrito.length; i++) {
      
    await lastValueFrom (this.usuarioService.comprarCarrito(this.user, this.carrito[i].id,this.carrito[i].precio,this.carrito[i].cantidad));

  }
  
  Swal.fire({
          icon: 'success',
          title: '¡Compra realizada con éxito!',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          
          this.eliminarTodos();
          this.carrito.length = 0;
          this.userForm.reset();
          this.submitted = false;
          this.hayProductos = false;
        });
      }catch(error){
        console.error("Error en la compra",error);
      }

       
  }

eliminarTodos(){
  for (let i = 0; i < this.carrito.length; i++) {
    
    this.usuarioService.eliminarProductoCarrito(this.user, this.carrito[i].id).subscribe({
      next: () => {
        this.carrito.length = 0;
        this.hayProductos = false;
        this.total = 0;
      },
    });
  }
}


}
