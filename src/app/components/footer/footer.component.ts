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

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])

  
  checkScroll() {
    this.checkVisibility();
  }

  private checkVisibility() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    /*  Muestra el footer cuando estamos cerca del final de la pagina */
    const shouldBeVisible = (windowHeight + scrollTop >= documentHeight - 50);
    
    if (this.isVisible !== shouldBeVisible) {
      this.isVisible = shouldBeVisible;
      this.visibilityChange.emit(this.isVisible);
    }
  }
}
