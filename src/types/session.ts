import { TarotCard } from "@/types/session.d";

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
