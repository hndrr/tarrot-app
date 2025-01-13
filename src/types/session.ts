import { TarotCard } from "@/data/tarotCards";

export interface TarotResponse {
  upright: string;
  reversed: string;
}

export interface SessionData {
  selectedCards?: TarotCard[];
  cardReadings?: {
    [cardName: string]: TarotResponse;
  };
  isReadingInProgress?: boolean;
}

// iron-sessionの型定義
declare module "iron-session" {
  export type IronSessionData = SessionData;
}
