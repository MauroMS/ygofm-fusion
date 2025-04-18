import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { Card } from "../../model";

@Component({
  selector: "app-fusions",
  imports: [CommonModule, CardModule],
  templateUrl: "./fusions.component.html",
  styleUrls: ["./fusions.component.scss"],
})
export class FusionsComponent {
  defaultImage = "assets/images/cards/{id}.png";

  selectedCards: Card[] = Array.from({ length: 5 }, (_, i) => ({
    id: 0,
    imageUrl: this.updateUrl(this.defaultImage, 0),
  }));

  updateCardImage(id: number, newUrl: string) {
    const card = this.selectedCards.find((c) => c.id === id);
    if (card) {
      card.imageUrl = this.updateUrl(newUrl, id);
    }
  }

  updateUrl(url: string, id: number): string {
    const padded = id.toString().padStart(3, "0");
    return url.replace("{id}", padded);
  }
}
