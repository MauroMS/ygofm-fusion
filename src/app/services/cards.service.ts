import { Injectable } from "@angular/core";
import { CARDS_DB } from "../data/cards_db";
import { Card } from "../model";

@Injectable({
  providedIn: "root",
})
export class CardsService {
  constructor() {}
  cards?: Card[];

  getAllCards(): Card[] {
    if (this.cards == null) {
      this.cards = CARDS_DB;
    }

    return this.cards;
  }

  getCardsNames(): string[] {
    return this.cards!.map((card) => card.name!);
  }
}
