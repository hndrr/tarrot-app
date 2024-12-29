"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { tarotCards } from "../../data/tarotCards";
import TarotCard from "../../components/TarotCard";
import Link from "next/link";

export default function Reading() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardId = searchParams.get("cardId");
  const card = tarotCards.find((card) => card.id === parseInt(cardId || ""));

  const drawNewCard = () => {
    let newCardId;
    do {
      const randomIndex = Math.floor(Math.random() * tarotCards.length);
      newCardId = tarotCards[randomIndex].id;
    } while (newCardId === parseInt(cardId || ""));

    router.push(`/reading?cardId=${newCardId}`);
  };

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center">
        <p>カードが見つかりません</p>
        <Link href="/" className="text-purple-300 hover:text-purple-100 mt-4">
          トップに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">あなたのカード</h1>
          <p className="text-purple-200">
            このカードがあなたに伝えるメッセージ...
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-2xl w-full">
            <TarotCard card={card} />
            <div className="mt-8 text-center">
              <Link
                href={`/cards/${card.id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 inline-block"
              >
                詳細を見る
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/"
              className="text-purple-300 hover:text-purple-100 transition duration-300"
            >
              ← トップに戻る
            </Link>
            <button
              onClick={drawNewCard}
              className="text-purple-300 hover:text-purple-100 transition duration-300"
            >
              もう一度引く
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
