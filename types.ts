
export interface TarotCardType {
  name: string;
  imageUrl: string;
  revealed?: boolean;
}

export enum GameState {
  INITIAL = 'initial',
  DEALT = 'dealt',
  READING = 'reading',
  DEEPENING = 'deepening',
  FINAL_READING = 'final_reading',
}
