import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export interface Card {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
}

// カードを保存するPOSTエンドポイント
export async function POST(request: Request) {
  const card = await request.json();
  const existingCards = await getCards();
  existingCards.push(card);

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "tarot-cards",
    value: JSON.stringify(existingCards),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}

// カードを取得するGETエンドポイント
export async function GET() {
  const cards = await getCards();
  return NextResponse.json(cards);
}

// ヘルパー関数
async function getCards(): Promise<Card[]> {
  try {
    const cookieStore = cookies();
    const cardsStr = (await cookieStore).get("tarot-cards");
    if (!cardsStr?.value) return [];

    return JSON.parse(cardsStr.value);
  } catch (error) {
    console.error("Error reading cards from cookie:", error);
    return [];
  }
}
