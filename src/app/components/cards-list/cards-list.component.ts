import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import {
  Card,
  CardTypes,
  FilterType,
  groupedFilterOptionsItems,
} from '../../model';
import { PadIdPipe } from '../../pipes/pad-id.pipe';
import { CardsService } from '../../services/cards.service';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs';

@Component({
  selector: 'app-cards-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    PadIdPipe,
    InputTextModule,
    FloatLabel,
    MultiSelectModule,
    ScrollerModule,
    SkeletonModule,
  ],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent implements OnInit {
  constructor(protected cardsService: CardsService) {}

  imageUrl = 'assets/images/cards/{id}.png';
  cards!: Array<Card & { imageLoaded: boolean }>;
  cardName = input<string>('');
  filterTypes = input<FilterType>(FilterType.All);

  @Output() selection = new EventEmitter<number>();

  hiddenSet = new Set(/* IDs to hide */);

  groupedFilterOptions: {
    label: string;
    items: groupedFilterOptionsItems[];
  }[] = [];

  filterForm = new FormGroup({
    search: new FormControl(''),
    types: new FormControl<groupedFilterOptionsItems[] | null>(null),
  });

  ngOnInit(): void {
    const raw = this.cardsService.getAllCards();
    this.cards = raw.map((c) => ({ ...c, imageLoaded: false }));

    this.groupedFilterOptions = [
      {
        label: 'Types',
        items: this.populateCardTypesDdp(),
      },
      {
        label: 'Items',
        items: this.populateItemTypesDdp(),
      },
      {
        label: 'Stars',
        items: this.populateCardStarsDdp(),
      },
    ];

    const search$ = this.searchControl!.valueChanges.pipe(
      startWith(this.filterForm.value.search),
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => term?.toLowerCase())
    );

    const type$ = this.typesControl!.valueChanges.pipe(
      startWith(this.filterForm.value.types)
    );

    combineLatest([search$, type$])
      .pipe(
        // here we do the actual card filtering in one go
        map(([term, typeFilter]) => {
          return this.cards.filter((c) => {
            const name = (c.name ?? '').toLowerCase();
            const matchesName =
              name == '' || name == undefined || name.includes(term!);
            if (typeFilter != null && typeFilter.length > 0) {
              const starIds = typeFilter
                .filter((o) => o.kind === CardTypes.Star)
                .map((o) => o.value);
              const itemsIds = typeFilter
                .filter((o) => o.kind === CardTypes.Item)
                .map((o) => o.value);
              const typesIds = typeFilter
                .filter((o) => o.kind === CardTypes.Type)
                .map((o) => o.value);
              return (
                matchesName &&
                (starIds.includes(c.guardianStarA!) ||
                  starIds.includes(c.guardianStarB!) ||
                  itemsIds.includes(c.type!) ||
                  typesIds.includes(c.type!))
              );
            }
            return matchesName;
          });
        })
      )
      .subscribe((visibleCards) => {
        const visibleIds = new Set(visibleCards.map((c) => c.id!));
        this.hiddenSet = new Set(
          this.cards.filter((c) => !visibleIds.has(c.id!)).map((c) => c.id!)
        );
      });
  }

  get searchControl() {
    return this.filterForm.get('search') as FormControl<string | null>;
  }
  get typesControl() {
    return this.filterForm.get('types') as FormControl<
      groupedFilterOptionsItems[] | null
    >;
  }

  trackByCardId(_idx: number, card: Card) {
    return card.id;
  }

  populateItemTypesDdp() {
    return this.cardsService
      .getCardTypes()
      .filter((type) => type.id >= 20)
      .map((type) => {
        return { label: type.name, kind: CardTypes.Item, value: type.id };
      });
  }

  populateCardTypesDdp() {
    return this.cardsService
      .getCardTypes()
      .filter((type) => type.id <= 19)
      .map((type) => {
        return { label: type.name, kind: CardTypes.Type, value: type.id };
      });
  }

  populateCardStarsDdp(): any[] {
    return this.cardsService
      .getCardStars()
      .filter((star) => star.id > 0)
      .map((star) => {
        return { label: star.name, kind: CardTypes.Star, value: star.id };
      });
  }

  onSelect(cardId: number) {
    this.selection.emit(cardId);
    this.searchControl.setValue('');
    this.typesControl.setValue(null);
  }

  isCardVisible(id: number) {
    return !this.hiddenSet.has(id);
  }
}
