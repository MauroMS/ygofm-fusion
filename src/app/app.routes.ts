import { Routes } from "@angular/router";
import { FusionsComponent } from "./components/fusions/fusions.component";
import { CardsListComponent } from "./components/cards-list/cards-list.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "cards",
    pathMatch: "full",
  },
  {
    path: "fusions",
    component: FusionsComponent,
  },
  {
    path: "cards",
    component: CardsListComponent,
  },
];
