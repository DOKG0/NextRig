import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuarios.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
      telefono: ['', [Validators.required,Validators.pattern(/^\+?[0-9]{7,15}$/)]],
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
    return;
    this.usuarioService.crearCompra(this.user,this.total).subscribe({
      
    });

    for (let i = 0; i < this.carrito.length; i++) {
      
    this.usuarioService.comprarCarrito(this.user, this.carrito[i].id,this.carrito[i].precio,this.carrito[i].cantidad).subscribe({
        
});

  }
  this.eliminarTodos();
this.carrito.length = 0;


      if(this.carrito.length === 0) {
      this.hayProductos = false;
      }
}

get f() {
    return this.userForm.controls;
  }

onSubmit() {
    this.submitted = true;
        console.log(this.userForm.get('telefono')?.value);
                console.log(this.userForm.get('departamento')?.value);

                        console.log(this.userForm.get('direccion')?.value);


    if (this.userForm.invalid) return;
    return;

    this.usuarioService.crearCompra(this.user,this.total).subscribe({
      
    });

    for (let i = 0; i < this.carrito.length; i++) {
      
    this.usuarioService.comprarCarrito(this.user, this.carrito[i].id,this.carrito[i].precio,this.carrito[i].cantidad).subscribe({
        
});

  }
  this.eliminarTodos();
this.carrito.length = 0;
this.userForm.reset();
        this.submitted = false;

      if(this.carrito.length === 0) {
      this.hayProductos = false;
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
