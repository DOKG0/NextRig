import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuarios.service';
import { AuthStateService } from '../../services/authStateService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isRegisterMode = false;
  sidebarState = 'sidebar-hidden';
  isTransitioning = false;
  errorMessage = '';
  isLoading = false;

  loginData = {
    email: '',
    password: ''
  };
  
  registerData = {
    username: '',
    name: '',
    apellido: '',
    fechaNac:'',
    email: '',
    cedula: '',
    password: '',
    confirmPassword: ''
  };
  
  private sidebarStateListener: any;
  private transitionEndListener: any;
  private mutationObserver: MutationObserver | null = null;
  
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private authState: AuthStateService
  ) {}
  
  ngOnInit() {
    // Detectar estado inicial
    this.detectSidebarState();
    
    // Check estado del sidebaar
    this.sidebarStateListener = this.onSidebarStateChanged.bind(this);
    document.addEventListener('sidebarStateChanged', this.sidebarStateListener);
    
    this.transitionEndListener = this.onTransitionEnd.bind(this);
    document.querySelector('.sidebar')?.addEventListener('transitionend', this.transitionEndListener);
    
    // detectar cambios de tamaño
    const mediaQuery = window.matchMedia('(max-width: 700px), (max-height: 683px)');
    mediaQuery.addEventListener('change', () => {
      setTimeout(() => this.detectSidebarState(), 100);
    });
    
    // Observer para cambios en el body
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.target === document.body && 
            mutation.attributeName === 'class' && 
            mutation.oldValue !== document.body.className) {
          // Marca inicio de la transición
          this.isTransitioning = true;
          this.detectSidebarState();
        }
      });
    });
    
    this.mutationObserver.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'],
      attributeOldValue: true
    });
    
    // Observar cambios en el sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      this.mutationObserver.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: true
      });
    }
  }

  ngOnDestroy() {
    // Limpiar listeners
    if (this.sidebarStateListener) {
      document.removeEventListener('sidebarStateChanged', this.sidebarStateListener);
    }
    
    if (this.transitionEndListener) {
      document.querySelector('.sidebar')?.removeEventListener('transitionend', this.transitionEndListener);
    }
    
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
  
  onSidebarStateChanged(event: any) {
    if (event.detail && event.detail.state) {
      this.sidebarState = event.detail.state;
    }
  }
  
  onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'transform' || event.propertyName === 'width') {
      this.isTransitioning = false;
    }
  }
  
  detectSidebarState() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (!sidebar) return;
    
    //Detectar el estado del sidebar
    if (window.innerWidth <= 700 || window.innerHeight <= 683) {
      if (document.body.classList.contains('sidebar-hidden')) {
        this.sidebarState = 'sidebar-visible';
      } else {
        this.sidebarState = 'sidebar-hidden';
      }
    } else {
      if (document.body.classList.contains('sidebar-hidden')) {
        this.sidebarState = 'sidebar-hidden';
      } else if (sidebar.classList.contains('minimize-sidebar')) {
        this.sidebarState = 'sidebar-minimized';
      } else {
        this.sidebarState = 'sidebar-visible';
      }
    }
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }
  
  login() {
    this.isLoading = true;
    this.errorMessage = '';
    this.usuarioService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: (response) => {
          console.log('login exitoso:', response);
          if (response && response.success) {
            const user = {
              name: response.nombre || response.usuario?.nombre || 'Usuario',
              username: response.usuario?.username || '',
              email: this.loginData.email,
              ci: response.usuario?.ci || '',
              isAdmin: response.usuario?.isAdmin || false
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.authState.setUser(user); // <--- notifica el cambio de usuario
            
            //alerta de exito
            Swal.fire({
              icon: 'success',
              title: '¡Bienvenido!',
              text: `Hola ${user.name}, has iniciado sesion correctamente.`,
              timer: 1800,
              showConfirmButton: false,
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
            }).then(() => {
              this.router.navigate(['/']).then(() => {
                window.location.reload();
              });
            });

          } else {
            this.errorMessage = 'Error al iniciar sesion. Formato de respuesta invalido.';
          }
        },
        error: (error) => {
          this.errorMessage = 'Error al iniciar sesion. Verifica tus credenciales.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  register() {
    // Validación básica
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.usuarioService.registro(
      this.registerData.name,
      this.registerData.apellido,
      this.registerData.username, 
      this.registerData.email,
      this.registerData.cedula, 
      this.registerData.password,
      this.registerData.fechaNac
    ).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        
        // Guardar información del usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          name: this.registerData.name,
          email: this.registerData.email,
          token: response.token // si tu API devuelve un token
        }));
        
        // Redirigir al usuario a la página principal
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.errorMessage = 'Error al registrar usuario. Intentalo nuevamente.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
