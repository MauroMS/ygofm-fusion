import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { FloatLabel } from "primeng/floatlabel";
import { Card } from "../../model";
import { PadIdPipe } from "../../pipes/pad-id.pipe";
import { CardsService } from "../../services/cards.service";
import {
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  startWith,
} from "rxjs";
@Component({
  selector: "app-cards-list",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    PadIdPipe,
    InputTextModule,
    FloatLabel,
    MultiSelectModule,
  ],
  templateUrl: "./cards-list.component.html",
  styleUrl: "./cards-list.component.scss",
})
export class CardsListComponent implements OnInit {
  imageUrl = "assets/images/cards/{id}.png";
  cards: Card[] = [];

  searchedValue: string = "";
  filteredCards: Card[] = [];

  groupedCities = [
    {
      label: "Germany",
      value: "de",
      items: [
        { label: "Berlin", value: "Berlin" },
        { label: "Frankfurt", value: "Frankfurt" },
        { label: "Hamburg", value: "Hamburg" },
        { label: "Munich", value: "Munich" },
      ],
    },
    {
      label: "USA",
      value: "us",
      items: [
        { label: "Chicago", value: "Chicago" },
        { label: "Los Angeles", value: "Los Angeles" },
        { label: "New York", value: "New York" },
        { label: "San Francisco", value: "San Francisco" },
      ],
    },
    {
      label: "Japan",
      value: "jp",
      items: [
        { label: "Kyoto", value: "Kyoto" },
        { label: "Osaka", value: "Osaka" },
        { label: "Tokyo", value: "Tokyo" },
        { label: "Yokohama", value: "Yokohama" },
      ],
    },
  ];

  filterForm = new FormGroup({
    search: new FormControl(""),
    filters: new FormControl<number | null>(null),
  });

  constructor(protected cardsService: CardsService) {}

  ngOnInit(): void {
    const search$ = this.filterForm
      .get("search")!
      .valueChanges.pipe(
        startWith(this.filterForm.value.search),
        debounceTime(200),
        distinctUntilChanged()
      );
    const type$ = this.filterForm
      .get("filters")!
      .valueChanges.pipe(startWith(this.filterForm.value.filters));

    search$
      .pipe(combineLatestWith(type$))
      .subscribe(([searchTerm, typeFilter]) => {
        const term = (searchTerm || "").trim().toLowerCase();
        this.filteredCards = this.cards.filter((c) => {
          const matchesName = c.name?.toLowerCase().includes(term);
          const matchesType = typeFilter == null || c.type === typeFilter;
          return matchesName && matchesType;
        });
      });

    this.cards = this.cardsService.getAllCards();

    this.filteredCards = this.cards;
  }

  search(value: string) {
    if (!value || value == "") {
      this.filteredCards = this.cards;
    } else {
      this.filteredCards = this.cards.filter((card) =>
        card.name!.toLowerCase().includes(value.toLowerCase())
      );
    }
  }
}
