import { NextRequest, NextResponse } from "next/server";

export interface Card {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const card = await request.json();
    const currentCookie = request.cookies.get("tarot-cards");
    const existingCards = currentCookie
      ? (JSON.parse(currentCookie.value) as Card[])
      : [];

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
  } catch (error) {
    console.error("Error saving card:", error);
    return NextResponse.json({ error: "Failed to save card" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentCookie = request.cookies.get("tarot-cards");
    if (!currentCookie) {
      return NextResponse.json([]);
    }

    const cards = JSON.parse(currentCookie.value) as Card[];
    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error getting cards:", error);
    return NextResponse.json({ error: "Failed to get cards" }, { status: 500 });
  }
}
