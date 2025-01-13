import { SessionData } from "@/types/session";

export async function getTarotSession(): Promise<SessionData> {
  try {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";
    const response = await fetch(`${apiHost}/api/tarot`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // キャッシュを無効化
    });

    if (!response.ok) {
      throw new Error("セッションの取得に失敗しました。");
    }

    const data = await response.json();
    console.log("APIレスポンス:", data);

    // セッションデータを検証
    const session: SessionData = {
      selectedCards: Array.isArray(data.selectedCards)
        ? data.selectedCards
        : [],
      cardReadings:
        typeof data.cardReadings === "object" ? data.cardReadings : {},
      isReadingInProgress: Boolean(data.isReadingInProgress),
    };

    console.log("正規化されたセッション:", session);
    return session;
  } catch (error) {
    console.error("セッション取得エラー:", error);
    // エラー時のデフォルト値
    return {
      selectedCards: [],
      cardReadings: {},
      isReadingInProgress: false,
    };
  }
}
