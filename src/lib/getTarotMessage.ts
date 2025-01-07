import { TarotResponse } from "@/types/session";
// import { getSession } from "./session";

export async function getTarotMessage(
  name: string,
  meaning: string
): Promise<TarotResponse> {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";
  // セッションにデータがない場合はAPIを呼び出す
  const res = await fetch(`${apiHost}/api/tarot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, meaning }),
  });

  // if (!res.ok) {
  //   throw new Error("文言生成に失敗しました。");
  // }

  return res.json();
}
