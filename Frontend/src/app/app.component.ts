import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, ViewEncapsulation, HostListener, OnInit} from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ContentContainerComponent } from './components/content-container/content-container.component';
import { AuthStateService } from './services/authStateService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar!: ElementRef;
  isDarkMode = false;
  isLoginRoute = false;
  title = 'frontend';
  isLoggedIn = false;
  isAdmin = false;
  currentUser: any = null;
  
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private authState: AuthStateService
  ) {}
  
  ngOnInit() {
    // Suscribirse a los eventos de navegacion para detectar la ruta actual
    this.authState.user$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.isAdmin = user.isAdmin === true || user.isAdmin === 'true';
        this.currentUser = user;
      } else {
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.currentUser = null;
      }
      setTimeout(() => this.initializeSidebar(), 0);
    });
    this.updateUserState();
    window.addEventListener('storage', () => this.updateUserState());
  }

  updateUserState(){
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userObj = JSON.parse(user);
      this.isLoggedIn = true;
      this.isAdmin = userObj.isAdmin === true || userObj.isAdmin === 'true';
      this.currentUser = userObj;
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.currentUser = null;
    }
  }

  ngAfterViewInit() {
    this.initializeSidebar();
    this.checkWindowSize();
    window.addEventListener('resize', () => this.checkWindowSize());
    this.loadDarkModePreference();
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  /*agregado probar sidebar*/

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowSize();
    this.dispatchSidebarStateEvent();
  }
  
  // Este metodo dispara un evento personalizado para informar sobre el estado del sidebar
  dispatchSidebarStateEvent() {
    let state = 'sidebar-visible';
    
    if (window.innerWidth <= 700 || window.innerHeight <= 683) {
      // En pantallas pequeñas, el sidebar esta oculto por defecto
      if (document.body.classList.contains('sidebar-hidden')) {
        state = 'sidebar-visible';
      } else {
        state = 'sidebar-hidden';
      }
    } else {
      // En pantallas grandes
      if (this.sidebar.nativeElement.classList.contains('minimize-sidebar')) {
        state = 'sidebar-minimized';
      } else {
        state = 'sidebar-visible';
      }
    }
    
    // Disparar evento personalizado
    const event = new CustomEvent('sidebarStateChanged', { detail: { state } });
    document.dispatchEvent(event);
    
  }

  loadDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
      
      setTimeout(() => {
        document.body.classList.add('dark-mode');
      }, 0);
    }
  }
  
  saveDarkModePreference() {
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }
  
  initializeSidebar() {
    // Boton dark mode
  const darkModeBtn = document.getElementById('dark-mode-btn');
  if (darkModeBtn) {
    const newDarkModeBtn = darkModeBtn.cloneNode(true) as HTMLElement;
    darkModeBtn.replaceWith(newDarkModeBtn);
    newDarkModeBtn.addEventListener('click', () => {
      this.isDarkMode = !this.isDarkMode;
      document.body.classList.toggle('dark-mode');
      this.saveDarkModePreference();
    });
  }

  // Boton sidebar hidden
  const sidebarBtn = document.getElementById('sidebar-btn');
  if (sidebarBtn) {
    const newSidebarBtn = sidebarBtn.cloneNode(true) as HTMLElement;
    sidebarBtn.replaceWith(newSidebarBtn);
    newSidebarBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-hidden');
      this.dispatchSidebarStateEvent();
    });
  }

  // Boton sidebar minimize
  const menuBtn = document.getElementById('menu-btn');
  if (menuBtn) {
    const newMenuBtn = menuBtn.cloneNode(true) as HTMLElement;
    menuBtn.replaceWith(newMenuBtn);
    newMenuBtn.addEventListener('click', () => {
      this.sidebar.nativeElement.classList.toggle('minimize-sidebar');
      this.dispatchSidebarStateEvent();
    });
  }

  // Dropdown menu
  const menusItemsDropDown = document.querySelectorAll('.menu-item-dropdown');
  menusItemsDropDown.forEach((menuItem) => {
    const newMenuItem = menuItem.cloneNode(true) as HTMLElement;
    menuItem.replaceWith(newMenuItem);
    newMenuItem.addEventListener('click', () => {
      const subMenu = newMenuItem.querySelector('.sub-menu');
      const isActive = newMenuItem.classList.toggle('sub-menu-toggle');
      if (subMenu) {
        if (isActive) {
          this.renderer.setStyle(subMenu, 'height', `${subMenu.scrollHeight + 6}px`);
          this.renderer.setStyle(subMenu, 'padding', '0.2rem 0');
        } else {
          this.renderer.setStyle(subMenu, 'height', '0');
          this.renderer.setStyle(subMenu, 'padding', '0');
        }
      }
      // cerrar otros submenus
      menusItemsDropDown.forEach((item) => {
        if (item !== newMenuItem) {
          const otherSubMenu = item.querySelector('.sub-menu');
          if (otherSubMenu) {
            item.classList.remove('sub-menu-toggle');
            this.renderer.setStyle(otherSubMenu, 'height', '0');
            this.renderer.setStyle(otherSubMenu, 'padding', '0');
          }
        }
      });
    });
  });

  // menu statico sub menus
  const menusItemStatic = document.querySelectorAll('.menu-item-static');
  menusItemStatic.forEach((menuItem) => {
    const newMenuItem = menuItem.cloneNode(true) as HTMLElement;
    menuItem.replaceWith(newMenuItem);
    newMenuItem.addEventListener('mouseenter', () => {
      if (!this.sidebar.nativeElement.classList.contains('minimize-sidebar')) return;
      menusItemsDropDown.forEach((item) => {
        if (item !== newMenuItem) {
          const otherSubMenu = item.querySelector('.sub-menu');
          if (otherSubMenu) {
            item.classList.remove('sub-menu-toggle');
            this.renderer.setStyle(otherSubMenu, 'height', '0');
            this.renderer.setStyle(otherSubMenu, 'padding', '0');
          }
        }
      });
    });
  });
  }
  
  checkWindowSize() {
    if (window.innerWidth <= 700 || window.innerHeight <= 683) {
      // QUitar sidebar si esta presente
      this.sidebar.nativeElement.classList.remove('minimize-sidebar');
      
      // No sidebbar-hidden = modo oculto
      if (!document.body.classList.contains('sidebar-hidden')) {
        //nada aqui
      }
    } else {
      // SIdebar siempre visible
      if (document.body.classList.contains('sidebar-hidden')) {
        document.body.classList.remove('sidebar-hidden');
      }
    }
    
    // Evento de cambio de estado
    this.dispatchSidebarStateEvent();
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.isAdmin = false;
    // Redirige al login o a la pagina principal
    window.location.href = '/login';
  }

  onSearch(event: Event): void {
    event.preventDefault();
    const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
    const value = searchInput.value.toString();    
    
    this.router.navigate([`/products/search/${value}`]);
  }
}