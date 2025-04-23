import { Fusion } from './fusion';
import { Ritual } from './ritual';

export interface Card {
  id?: number | null;
  imageUrl?: string;
  name?: string;
  description?: string;
  guardianStarA?: number;
  guardianStarB?: number;
  level?: number;
  type?: number;
  attack?: number;
  defense?: number;
  stars?: number;
  cardCode?: string;
  fusions?: Fusion[];
  ritual?: Ritual[] | null;
  attribute?: string;
}
