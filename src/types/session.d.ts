import type { TarotCard } from "@/data/tarotCards";

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
