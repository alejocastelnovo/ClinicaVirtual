import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Output() visibilityChange = new EventEmitter<boolean>();
  isVisible = false;

  constructor() { }

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.checkVisibility();
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.checkVisibility();
  }

  private checkVisibility() {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight;

    // Muestra el footer si estamos cerca del final de la página o si el mouse está cerca del final
    const shouldBeVisible = (windowHeight + scrollY >= totalHeight - 80) || (windowHeight + scrollY >= totalHeight - 50);
    
    if (this.isVisible !== shouldBeVisible) {
      this.isVisible = shouldBeVisible;
      this.visibilityChange.emit(this.isVisible);
      
      // Añadir un pequeño retraso para la desaparición
      if (!shouldBeVisible) {
        setTimeout(() => {
          if (!this.isVisible) {
            const footer = document.querySelector('.clinic-footer') as HTMLElement;
            if (footer) {
              footer.style.bottom = '-100px';
            }
          }
        }, 300); // 300ms de retraso, igual que la duración de la transición
      }
    }
  }
}
