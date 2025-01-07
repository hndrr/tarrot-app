"use client";

import { useRouter } from "next/navigation";
import { tarotCards } from "@/data/tarotCards";

export default function DrawCardButton() {
  const router = useRouter();

  const drawCard = async () => {
    try {
      const randomIndex = Math.floor(Math.random() * tarotCards.length);
      const selectedCard = tarotCards[randomIndex];

      // const response = await fetch("/api/tarot", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name: selectedCard.name,
      //     meaning: selectedCard.meaning,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error("API request failed");
      // }

      router.push(`/reading/${selectedCard.id}`);
    } catch (error) {
      console.error("Error drawing card:", error);
    }
  };

  return (
    <button
      onClick={drawCard}
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full mb-8 transition duration-300 text-lg"
    >
      カードを引く
    </button>
  );
}
