import { Component } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DarkModeSwitchComponent } from "../dark-mode-switch/dark-mode-switch.component";

@Component({
  selector: "app-navbar",
  imports: [ButtonModule, DarkModeSwitchComponent],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {}
