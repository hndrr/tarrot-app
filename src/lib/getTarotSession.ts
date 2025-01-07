import { TarotResponse } from "@/types/session";

export async function getTarotSession(): Promise<TarotResponse> {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";
  const session = await fetch(`${apiHost}/api/tarot`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // セッションからデータを取得
  const cardReading = await session.json();
  console.log("cardddd", cardReading);

  // if (cardReading) {
  //   return {
  //     upright: cardReading.upright,
  //     reversed: cardReading.reversed,
  //   };
  // }

  // if (!res.ok) {
  //   throw new Error("文言生成に失敗しました。");
  // }

  return cardReading.json();
}
