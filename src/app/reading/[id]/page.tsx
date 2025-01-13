import { tarotCards } from "@/data/tarotCards";
// import { delay } from "@/lib/delay";
import { getTarotMessage } from "@/lib/getTarotMessage";
import { TarotResponse } from "@/types/session";
import TarotCard from "@components/TarotCard";
import Link from "next/link";

type Params = {
  id: string;
};

export default async function Reading({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  // if (!(resolvedSearchParams?.back === "true")) {
  //   await delay(6000);
  // }

  const { id } = await params;
  const card = tarotCards.find((card) => card.id === parseInt(id));
  const { name, meaning } = card || {};
  const isReversed = resolvedSearchParams?.reversed === "true";

  let result: TarotResponse | null = null;

  if (!(resolvedSearchParams?.back === "true") && name && meaning) {
    try {
      result = await getTarotMessage(name, meaning);
    } catch (error) {
      console.error("エラー:", error);
    }
  }

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">あなたのカード</h1>
          <p className="text-purple-200">
            このカードがあなたに伝えるメッセージ
            {result && (
              <span>{isReversed ? result.reversed : result.upright}</span>
            )}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-2xl w-full">
            <TarotCard card={card} isReversed={isReversed} />
            <div className="mt-8 text-center">
              <Link
                href={`/cards/${card.id}?reversed=${isReversed}`}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 inline-block"
              >
                詳細を見る
              </Link>
            </div>
          </div>

          <div className="flex gap-8 flex-col text-center">
            <Link
              href={`/reading/${
                tarotCards[Math.floor(Math.random() * tarotCards.length)].id
              }?reversed=${Math.random() < 0.5}`}
              className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 inline-block"
            >
              もう一度引く
            </Link>
            <Link
              href="/"
              className="text-purple-300 hover:text-purple-100 transition duration-300"
            >
              トップに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
