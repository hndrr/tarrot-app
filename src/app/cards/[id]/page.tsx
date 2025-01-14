import { tarotCards } from "@/data/tarotCards";
import { getTarotDataFromCookie } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";

type Params = {
  id: string;
};

export default async function CardDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const cardId = parseInt(id);
  const card = tarotCards.find((card) => card.id === cardId);
  let tarotData = null;

  try {
    tarotData = await getTarotDataFromCookie(cardId);
  } catch (error) {
    console.error("エラー:", error);
  }

  const result = tarotData?.message;
  const isReversed = tarotData?.isReversed ?? false;

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
        <Link
          href={`/reading/${id}?back=true`}
          className="inline-block mb-8 text-purple-300 hover:text-purple-100 transition duration-300"
        >
          戻る
        </Link>

        <div className="flex flex-col md:flex-row items-center gap-10">
          <div
            className={`relative aspect-[2/3] w-64 ${
              isReversed && "rotate-180"
            }`}
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              className="rounded-lg object-cover"
              priority
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">
              {card.name}
              <span className="ml-2 text-2xl font-normal">
                {isReversed ? `逆位置` : `正位置`}
              </span>
            </h1>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">カードの意味</h2>
              <p className="text-gray-200">{card.meaning}</p>
              <h2 className="text-xl font-semibold mt-6 mb-2">詳細な解釈</h2>
              <div className="space-y-4">
                <p className="text-gray-200">
                  {isReversed ? result?.reversed : result?.upright}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
