"use client";

import { useEffect } from "react";

interface Card {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
}

interface SaveCardProps {
  card: Card;
}

export default function SaveCard({ card }: SaveCardProps) {
  useEffect(() => {
    const saveCard = async () => {
      try {
        const response = await fetch("/api/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(card),
        });

        if (!response.ok) {
          throw new Error("カードの保存に失敗しました");
        }
      } catch (error) {
        console.error("Failed to save card:", error);
      }
    };

    saveCard();
  }, [card]);

  return null;
}
