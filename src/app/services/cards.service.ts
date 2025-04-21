import { Injectable } from '@angular/core';
import { CARDS_DB, CARD_TYPES, STARS } from '../data/index';
import { Card, Star, CardType } from '../model';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  constructor() {}
  cards: Card[] = [];
  cardTypes: CardType[] = [];
  cardStars: Star[] = [];

  getAllCards(): Card[] {
    if (this.cards.length == 0) {
      this.cards = CARDS_DB;
    }

    return this.cards;
  }

  getCardsNames(): string[] {
    return this.cards!.map((card) => card.name!);
  }

  getCardTypes(): CardType[] {
    if (this.cardStars.length == 0) {
      this.cardTypes = CARD_TYPES;
    }

    return this.cardTypes;
  }

  getCardStars(): Star[] {
    if (this.cardStars.length == 0) {
      this.cardStars = STARS;
    }

    return this.cardStars;
  }
}
