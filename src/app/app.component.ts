import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/layout/navbar/navbar.component";
import { ThemeService } from "./services/theme.service";

@Component({
  selector: "app-root",
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  /**
   *
   */
  constructor(protected themeService: ThemeService) {
    this.themeService.init();
  }
}
