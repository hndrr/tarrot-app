export type TarotCard = {
  id: number;
  name: string;
  image: string;
  meaning: string;
};

export type TarotResponse = {
  upright: string;
  reversed: string;
};

export type SessionData = {
  selectedCards: TarotCard[];
  cardReadings?: {
    [cardName: string]: TarotResponse;
  };
  readingId?: string;
  isReadingInProgress: boolean;
};
