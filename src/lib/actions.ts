"use server";

import { cookies } from "next/headers";

export interface Card {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
}

export async function saveCardToSession(card: Card) {
  try {
    const cookieStore = await cookies();
    const existingCookie = cookieStore.get("tarot-cards")?.value;
    const existingCards = existingCookie
      ? (JSON.parse(existingCookie) as Card[])
      : [];

    existingCards.push(card);

    await cookieStore.set("tarot-cards", JSON.stringify(existingCards), {
      httpOnly: false, //
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1週間
    });
  } catch (error) {
    console.error("Failed to save card to session:", error);
    throw new Error("カードの保存に失敗しました");
  }
}

export async function getSessionCards(): Promise<Card[]> {
  try {
    const cookieStore = await cookies();
    const cardsJson = cookieStore.get("tarot-cards")?.value;

    if (!cardsJson) {
      return [];
    }

    const cards = JSON.parse(cardsJson) as Card[];
    return cards;
  } catch (error) {
    console.error("Failed to get cards from session:", error);
    return [];
  }
}
