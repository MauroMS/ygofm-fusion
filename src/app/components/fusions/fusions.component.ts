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
  // private currentCards!: Card[];
  // private currentIndex = 0;
  private activeArray!: FormArray;
  private activeIndex!: number;

  cardIdControls = new FormArray<FormControl<number>>([]);

  monsterFieldCards: Card[] = [];
  magicFieldCards: Card[] = [];
  handCards: Card[] = [];
  availableFusions: Card[] = [];

  fusionForm!: FormGroup;

  constructor(private cardService: CardsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.populateCardsLists();

    this.buildFusionForm();

    this.handIds.valueChanges.subscribe(
      (ids) => console.log('Hand IDs changed:', this.handCards)
      // console.log('Hand IDs changed:', ids)
    );

    this.magicIds.valueChanges.subscribe((ids) =>
      console.log('Magic IDs changed:', ids)
    );

    this.monsterIds.valueChanges.subscribe((ids) =>
      console.log('Monster IDs changed:', ids)
    );

    // this.availableFusions = Array.from({ length: 5 }, (_, i) =>
    //   this.cardService.getCardById(0)
    // );

    // this.cardIdControls.clear();
    // this.handCards.forEach((card, i) => {
    //   const ctrl = new FormControl<number>(card.id!, {
    //     nonNullable: true,
    //     validators: [],
    //   });
    //   ctrl.valueChanges.subscribe((id) => {
    //     this.handCards[i] = this.cardService.getCardById(id);
    //   });
    //   this.cardIdControls.push(ctrl);
    // });
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
    // 2) Build the FormArrays, subscribing per‐control
    const monsterControls = this.monsterFieldCards.map((card, i) => {
      const ctrl = new FormControl(card.id!, {
        nonNullable: true,
        validators: [],
      });
      ctrl.valueChanges.subscribe((newId) => {
        // you know this is monsterFieldCards[i]
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

  // onCardSelected(cardId: number) {
  //   this.currentCards[this.currentIndex] = this.cardService.getCardById(cardId);
  //   this.showPicker = false;
  // }

  onCardSelectedForm(id: number) {
    console.log('onCardSelectedForm', id);

    this.activeArray.at(this.activeIndex).setValue(id);
    this.showPicker = false;
    // also update your UI model so the <img> changes
    // const list = this.getListByArray(this.activeArray);
    // list[this.activeIndex].imageUrl = selection.imageUrl;
  }

  private getListByArray(arr: FormArray) {
    console.log('getListByArray', arr);

    if (arr === this.monsterIds) return this.monsterFieldCards;
    if (arr === this.magicIds) return this.magicFieldCards;
    return this.handCards;
  }

  // onCardSelectedForm(cardId: number) {
  //   this.cardIdControls.at(this.currentIndex)?.setValue(cardId);
  //   this.showPicker = false;
  // }

  // openPicker(cards: Card[], index: number) {
  //   this.currentCards = cards;
  //   this.currentIndex = index;
  //   this.showPicker = true;
  // }

  confirmPicker() {
    this.showPicker = false;
  }

  // onIdChange(cards: Card[], index: number, value: string) {
  //   console.log('onIdChange', cards, index, value);

  //   const id = Number(value) || 0;
  //   cards[index] = this.cardService.getCardById(id);
  // }
}
