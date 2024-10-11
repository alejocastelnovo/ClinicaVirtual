import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  footerVisible = false;
  onFooterVisibilityChange(isVisible: boolean) {
    // Aquí puedes manejar el cambio de visibilidad del footer
    console.log('Footer visibility changed:', isVisible);
  }
}
