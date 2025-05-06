import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Card, DisplayFusions } from '../../model';
import { CardsListPopupComponent } from '../cards-list-popup/cards-list-popup.component';
import { FloatLabel } from 'primeng/floatlabel';
import { CardsService } from '../../services/cards.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { orderBy } from 'lodash';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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
  showPicker = false;
  private activeArray!: FormArray;
  private activeIndex!: number;

  cardIdControls = new FormArray<FormControl<number>>([]);
  allCards: Card[] = [];
  monsterFieldCards: Card[] = [];
  magicFieldCards: Card[] = [];
  handCards: Card[] = [];
  availableFusions: DisplayFusions = { fusions: [] };

  fusionForm!: FormGroup;

  constructor(private cardService: CardsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.populateCardsLists();

    this.buildFusionForm();

    this.handCards = this.allCards.filter(
      (c) =>
        // [62, 425, 436, 203, 211].includes(c.id!)
        // [62, 425, 436, 203, 0].includes(c.id!)
        // [62, 425].includes(c.id!)
        [62, 425, 211, 436, 203].includes(c.id!)
      // [589, 612, 4, 0, 0].includes(c.id!)
      // [12, 10, 15, 266, 586].includes(c.id!)
    );
    this.updateAvailableFusions();

    this.handIds.valueChanges.subscribe((ids) => {
      console.log('Hand IDs changed:', this.handCards);
      this.updateAvailableFusions();
    });

    this.magicIds.valueChanges.subscribe((ids) =>
      console.log('Magic IDs changed:', ids)
    );

    this.monsterIds.valueChanges.subscribe((ids) =>
      console.log('Monster IDs changed:', ids)
    );
  }

  get monsterIds() {
    return this.fusionForm.get('monsterIds') as FormArray;
  }
  get magicIds() {
    return this.fusionForm.get('magicIds') as FormArray;
  }
  get handIds() {
    return this.fusionForm.get('handIds') as FormArray;
  }

  public populateCardsLists() {
    this.allCards = this.cardService.getAllCards();
    this.monsterFieldCards = Array.from({ length: 5 }, (_, i) =>
      this.cardService.getCardById(0)
    );

    this.magicFieldCards = Array.from({ length: 5 }, (_, i) =>
      this.cardService.getCardById(0)
    );

    this.handCards = Array.from({ length: 5 }, (_, i) =>
      this.cardService.getCardById(0)
    );
  }

  private buildFusionForm() {
    const monsterControls = this.monsterFieldCards.map((card, i) => {
      const ctrl = new FormControl(card.id!, {
        nonNullable: true,
        validators: [],
      });
      ctrl.valueChanges.subscribe((newId) => {
        this.monsterFieldCards[i] = this.cardService.getCardById(newId);
      });
      return ctrl;
    });

    const magicControls = this.magicFieldCards.map((card, i) => {
      const ctrl = new FormControl(card.id!, {
        nonNullable: true,
        validators: [],
      });
      ctrl.valueChanges.subscribe((newId) => {
        this.magicFieldCards[i] = this.cardService.getCardById(newId);
      });
      return ctrl;
    });

    const handControls = this.handCards.map((card, i) => {
      const ctrl = new FormControl(card.id!, {
        nonNullable: true,
        validators: [],
      });
      ctrl.valueChanges.subscribe((newId: number) => {
        this.handCards[i] = this.cardService.getCardById(newId);
      });
      return ctrl;
    });

    this.fusionForm = this.fb.group({
      monsterIds: this.fb.array(monsterControls),
      magicIds: this.fb.array(magicControls),
      handIds: this.fb.array(handControls),
    });
  }

  openPicker(list: any[], index: number) {
    console.log('openPicker', list);
    console.log('openPicker index', index);

    if (list === this.monsterFieldCards) {
      this.activeArray = this.monsterIds;
    } else if (list === this.magicFieldCards) {
      this.activeArray = this.magicIds;
    } else {
      this.activeArray = this.handIds;
    }
    this.activeIndex = index;
    this.showPicker = true;
  }

  trackByIndex(i: number) {
    return i;
  }

  onCardSelectedForm(id: number) {
    console.log('onCardSelectedForm', id);

    this.activeArray.at(this.activeIndex).setValue(id);
    this.showPicker = false;
    // also update your UI model so the <img> changes
    // const list = this.getListByArray(this.activeArray);
    // list[this.activeIndex].imageUrl = selection.imageUrl;
  }

  getCardImageUrl(cardId: number): string {
    return this.cardService.getCardImageUrl(cardId);
  }

  confirmPicker() {
    this.showPicker = false;
  }

  updateAvailableFusions(): void {
    const currentHandCards = this.handCards.filter(
      (c) => !!c && c.id !== 0
    ) as Card[];
    let displayFusions: DisplayFusions = { fusions: [] };

    // 1) Base fusions from any two distinct cards
    for (
      let card1Index = 0;
      card1Index < currentHandCards.length;
      card1Index++
    ) {
      for (
        let card2Index = card1Index + 1;
        card2Index < currentHandCards.length;
        card2Index++
      ) {
        const card1 = currentHandCards[card1Index];
        const card2 = currentHandCards[card2Index];

        const baseFusion = this.cardService.cardsFusion(card1, card2);
        if (!baseFusion?.result) continue;

        const baseFusionCards = [card1, card2];
        const baseResultsCards = [
          this.cardService.getCardById(baseFusion.result),
        ];
        displayFusions.fusions.push({
          fusedCards: baseFusionCards,
          results: baseResultsCards,
        });

        // 2) Recursively build deeper fusion chains
        const remaining = currentHandCards.filter(
          (_, idx) => idx !== card1Index && idx !== card2Index
        );
        const deeper = this.buildFusionPaths(
          baseFusionCards,
          baseResultsCards,
          remaining
        );
        displayFusions.fusions.push(...deeper);
      }
    }

    this.availableFusions = this.removeDuplicatesAndSort(displayFusions);
    console.log(this.availableFusions.fusions);

    // // 3) Remove duplicates and sort
    // this.possibleFusions = orderBy(
    //   uniqWith(fusions, (x, y) =>
    //     x.materials.map(m => m.CardId).join('-') ===
    //     y.materials.map(m => m.CardId).join('-')
    //   ),
    //   [
    //     f => f.results[f.results.length - 1].Attack,
    //     f => f.materials.length,
    //     f => f.materials.reduce((sum, m) => sum + m.Attack, 0)
    //   ],
    //   ['desc', 'asc', 'asc']
    // );
  }

  buildFusionPaths(
    cards: Card[],
    results: Card[],
    remaining: Card[]
  ): Array<{ fusedCards: Card[]; results: Card[] }> {
    const paths: Array<{ fusedCards: Card[]; results: Card[] }> = [];
    const lastResult = results[results.length - 1];

    for (let cardIndex = 0; cardIndex < remaining.length; cardIndex++) {
      const next = remaining[cardIndex];
      const fus = this.cardService.cardsFusion(lastResult, next);
      if (!fus?.result) continue;

      const cardFus = this.cardService.getCardById(fus.result);
      const newFusedCards = [...cards, next];
      const newResults = [...results, cardFus];
      paths.push({ fusedCards: newFusedCards, results: newResults });

      const nextRemaining = remaining.filter((_, idx) => idx !== cardIndex);
      const deeper = this.buildFusionPaths(
        newFusedCards,
        newResults,
        nextRemaining
      );
      paths.push(...deeper);
    }

    return paths;
  }

  removeDuplicatesAndSort(displayFusions: DisplayFusions): DisplayFusions {
    // 1) Build a Set of “seen” material-ID strings
    const seen = new Set<string>();

    // 2) Walk your raw fusions and only keep the first occurrence of each key
    const uniqueFusions = displayFusions.fusions.filter((f) => {
      const key = f.fusedCards.map((m) => m.id).join('-');
      if (seen.has(key)) {
        return false;
      } else {
        seen.add(key);
        return true;
      }
    });

    // 3) Sort exactly as before
    return {
      fusions: orderBy(
        uniqueFusions,
        [
          (f) => f.results[f.results.length - 1].attack,
          (f) => f.fusedCards.length,
          (f) => f.fusedCards.reduce((sum, m) => sum + (m.attack ?? 0), 0),
        ],
        ['desc', 'asc', 'asc']
      ),
    };
  }
}
