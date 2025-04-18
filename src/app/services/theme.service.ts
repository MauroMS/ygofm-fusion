import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private darkClass = "my-app-dark";

  toggleTheme() {
    const htmlEl = document.documentElement;
    htmlEl.classList.toggle(this.darkClass);
    localStorage.setItem(
      "theme-mode",
      htmlEl.classList.contains(this.darkClass) ? "dark" : "light"
    );
  }

  init(): void {
    const savedMode = localStorage.getItem("theme-mode");
    if (savedMode === "dark") {
      document.documentElement.classList.add(this.darkClass);
    }
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains(this.darkClass);
  }
}
