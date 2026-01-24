
export interface TarotCardType {
  name: string;
  imageUrl: string;
}

export enum GameState {
  INITIAL = 'initial',
  DEALING = 'dealing',
  REVEALING = 'revealing',
  READING = 'reading',
  DEEPENING = 'deepening',
  FINAL_READING = 'final_reading',
}
