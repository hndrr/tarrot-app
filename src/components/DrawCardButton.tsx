"use client";

import { useRouter } from "next/navigation";
import { tarotCards } from "@/data/tarotCards";

export default function DrawCardButton() {
  const router = useRouter();

  const drawCard = () => {
    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    const selectedCard = tarotCards[randomIndex];
    router.push(`/reading/${selectedCard.id}`);
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
