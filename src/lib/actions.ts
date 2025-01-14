"use server";

import { tarotCards } from "@/data/tarotCards";
import { cookies } from "next/headers";

type TarotResponse = {
  upright: string;
  reversed: string;
};

export async function getTarotMessage(
  name: string,
  meaning: string
): Promise<TarotResponse> {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";

  const res = await fetch(`${apiHost}/api/tarot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, meaning }),
  });

  if (!res.ok) {
    throw new Error("文言生成に失敗しました。");
  }

  return res.json();
}

type SavedTarotData = {
  message: TarotResponse;
  isReversed: boolean;
};

export async function generateAndSaveTarotMessage(
  cardId: number,
  isReversed: boolean
) {
  const card = tarotCards.find((c) => c.id === cardId);
  if (!card) throw new Error("カードが見つかりません");

  const message = await getTarotMessage(card.name, card.meaning);
  const data: SavedTarotData = {
    message,
    isReversed,
  };

  // タロットデータをcookieに保存
  const cookieStore = await cookies();
  await cookieStore.set(`tarot-data-${cardId}`, JSON.stringify(data), {
    maxAge: 60 * 60 * 24, // 24時間
  });

  return data;
}

export async function getTarotDataFromCookie(
  cardId: number
): Promise<SavedTarotData | null> {
  const cookieStore = await cookies();
  const data = cookieStore.get(`tarot-data-${cardId}`)?.value;

  return data ? JSON.parse(data) : null;
}
