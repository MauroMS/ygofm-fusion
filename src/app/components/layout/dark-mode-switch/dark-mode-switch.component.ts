import { Component } from "@angular/core";
import { ThemeService } from "./../../../services/theme.service";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-dark-mode-switch",
  imports: [ButtonModule, CommonModule],
  templateUrl: "./dark-mode-switch.component.html",
  styleUrl: "./dark-mode-switch.component.scss",
})
export class DarkModeSwitchComponent {
  constructor(protected themeService: ThemeService) {}
}
