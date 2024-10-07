import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  footerVisible = false;

  onFooterVisibilityChange(visible: boolean) {
    this.footerVisible = visible;
  }
}
