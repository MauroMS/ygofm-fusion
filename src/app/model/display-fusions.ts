import { Card } from './card';

export interface DisplayFusions {
  fusions: Array<{ fusedCards: Card[]; results: Card[] }>;
}
