import { Component, HostListener, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isVisible = false;
  @Output() visibilityChange = new EventEmitter<boolean>();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    const shouldBeVisible = (windowHeight + scrollTop >= documentHeight - 50);

    if (this.isVisible !== shouldBeVisible) {
      this.isVisible = shouldBeVisible;
      this.visibilityChange.emit(this.isVisible);
    }
  }
}

