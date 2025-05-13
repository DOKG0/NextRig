import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrouselComponent } from "../carrousel/carrousel.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content-container',
  standalone: true,
  imports: [CommonModule, CarrouselComponent, FooterComponent, RouterOutlet],
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.css']
})
export class ContentContainerComponent implements OnInit, OnDestroy {
  sidebarState = 'sidebar-hidden';
  private sidebarStateListener: any;

  ngOnInit(): void {
    // estado nicial del sidebar
    this.detectSidebarState();
    
    // Check de estado de sidebar
    this.sidebarStateListener = this.onSidebarStateChanged.bind(this);
    document.addEventListener('sidebarStateChanged', this.sidebarStateListener);
  }

  ngOnDestroy(): void {
    // Limpiar listeners
    if (this.sidebarStateListener) {
      document.removeEventListener('sidebarStateChanged', this.sidebarStateListener);
    }
  }

  onSidebarStateChanged(event: any) {
    if (event.detail && event.detail.state) {
      this.sidebarState = event.detail.state;
    }
  }

  detectSidebarState() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (!sidebar) return;
    
    //detectar el estado del sidebar
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
}