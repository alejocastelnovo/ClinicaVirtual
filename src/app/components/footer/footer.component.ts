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
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight;

    // Muestra el footer si el mouse está cerca del final de la página
    const shouldBeVisible = (windowHeight + scrollY >= totalHeight - 50);
    
    if (this.isVisible !== shouldBeVisible) {
      this.isVisible = shouldBeVisible;
      this.visibilityChange.emit(this.isVisible);
    }
  }
}

