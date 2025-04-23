import { Component, EventEmitter, model, Output } from '@angular/core';
import { CardsListComponent } from '../cards-list/cards-list.component';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-cards-list-popup',
  imports: [CardsListComponent, Dialog],
  templateUrl: './cards-list-popup.component.html',
  styleUrl: './cards-list-popup.component.scss',
})
export class CardsListPopupComponent {
  readonly visible = model(false);
  @Output() selection = new EventEmitter<number>();

  onCardSelected($event: number) {
    this.selection.emit($event);
    this.visible.set(false);
  }
}
