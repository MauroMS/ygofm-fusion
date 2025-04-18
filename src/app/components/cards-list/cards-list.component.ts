import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { Card } from "../../model";
import { PadIdPipe } from "../../pipes/pad-id.pipe";
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from "primeng/autocomplete";
import { CardsService } from "../../services/cards.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-cards-list",
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    PadIdPipe,
    AutoCompleteModule,
  ],
  templateUrl: "./cards-list.component.html",
  styleUrl: "./cards-list.component.scss",
})
export class CardsListComponent implements OnInit {
  imageUrl = "assets/images/cards/{id}.png";
  cards: Card[] = [];
  cardNames: string[] = [];
  selectedCard?: Card;
  filteredCards: Card[] = [];

  constructor(protected cardsService: CardsService) {}

  ngOnInit(): void {
    this.cards = this.cardsService.getAllCards();
    this.cardNames = this.cardsService.getCardsNames();
  }

  search($event: AutoCompleteCompleteEvent) {
    this.filteredCards = this.cards.filter((card) =>
      card.name!.toLowerCase().includes($event.query.toLowerCase())
    );
  }
}
