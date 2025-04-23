import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Card } from '../../model';
import { CardsListPopupComponent } from '../cards-list-popup/cards-list-popup.component';
import { FloatLabel } from 'primeng/floatlabel';
import { CardsService } from '../../services/cards.service';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-fusions',
  imports: [
    CommonModule,
    CardModule,
    CardsListPopupComponent,
    InputTextModule,
    FloatLabel,
    InputNumberModule,
    ReactiveFormsModule,
  ],
  templateUrl: './fusions.component.html',
  styleUrls: ['./fusions.component.scss'],
})
export class FusionsComponent implements OnInit {
  constructor(protected cardService: CardsService) {}

  showPicker = false;
  private currentCards!: Card[];
  private currentIndex = 0;
  cardIdControls = new FormArray<FormControl<number>>([]);

  monsterFieldCards: Card[] = [];
  magicFieldCards: Card[] = [];
  handCards: Card[] = [];
  availableFusions: Card[] = [];

  ngOnInit(): void {
    this.monsterFieldCards = Array.from({ length: 5 }, (_, i) =>
      this.cardService.getCardById(0)
    );

    this.magicFieldCards = Array.from({ length: 5 }, (_, i) =>
      this.cardService.getCardById(0)
    );

    this.handCards = Array.from({ length: 5 }, (_, i) =>
      this.cardService.getCardById(0)
    );

    this.availableFusions = Array.from({ length: 5 }, (_, i) =>
      this.cardService.getCardById(0)
    );

    this.cardIdControls.clear();
    this.handCards.forEach((card, i) => {
      const ctrl = new FormControl<number>(card.id!, {
        nonNullable: true,
        validators: [], // you could add Validators.min(0), Validators.max(722) here
      });
      // when the control changes, swap in the new Card
      ctrl.valueChanges.subscribe((id) => {
        this.handCards[i] = this.cardService.getCardById(id);
      });
      this.cardIdControls.push(ctrl);
    });
  }

  trackByIndex(i: number) {
    return i;
  }

  onCardSelected(cardId: number) {
    console.log('Card selected:', cardId);
    const id = cardId >= 0 && cardId <= 722 ? cardId : 0;
    this.currentCards[this.currentIndex] = this.cardService.getCardById(cardId);
    this.showPicker = false;
  }

  openPicker(cards: Card[], index: number) {
    console.log('openPicker', cards);
    console.log('index', index);

    this.currentCards = cards;
    this.currentIndex = index;
    this.showPicker = true;
  }

  confirmPicker() {
    this.showPicker = false;
  }

  onIdChange(cards: Card[], index: number, value: string) {
    console.log('onIdChange', cards);
    console.log('index', index);
    console.log('value', value);

    const id = Number(value) || 0;
    cards[index] = this.cardService.getCardById(id);
  }
}
