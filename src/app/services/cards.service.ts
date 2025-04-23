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
      this.cards = CARDS_DB.map((card) => ({
        ...card,
        imageUrl: this.getCardImageUrl(card.id!),
      }));
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

  getCardById(cardId: number): Card {
    if (cardId <= 0 || cardId > 722) {
      return this.getCardBackground(cardId);
    }

    return this.cards.find((card) => card.id === cardId)!;
  }

  getCardImageUrl(id: number): string {
    const padded = id.toString().padStart(3, '0');
    return `assets/images/cards/${padded}.png`;
  }

  getCardBackground(cardId?: number): Card {
    console.log('getCardBackground', cardId);

    if (cardId && (cardId <= 0 || cardId >= 722)) {
      return { id: cardId, imageUrl: this.getCardImageUrl(0) };
    }
    return { id: 0, imageUrl: this.getCardImageUrl(0) };
  }
}
