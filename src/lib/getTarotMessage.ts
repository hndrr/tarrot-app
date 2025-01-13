import { SessionData, TarotResponse } from "@/types/session";

interface APIResponse {
  upright: string;
  reversed: string;
  session: SessionData;
}

export async function getTarotMessage(
  name: string,
  meaning: string
): Promise<TarotResponse> {
  try {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";
    const res = await fetch(`${apiHost}/api/tarot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, meaning }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "文言生成に失敗しました。");
    }

    const data: APIResponse = await res.json();
    console.log("タロットメッセージレスポンス:", {
      message: { upright: data.upright, reversed: data.reversed },
      sessionUpdate: data.session,
    });

    // セッションの状態を検証
    if (data.session) {
      console.log("セッション状態:", {
        selectedCardsCount: data.session.selectedCards?.length || 0,
        hasReadings: Object.keys(data.session.cardReadings || {}).length > 0,
        isReadingInProgress: data.session.isReadingInProgress,
      });
    }

    return {
      upright: data.upright,
      reversed: data.reversed,
    };
  } catch (error) {
    console.error("タロットメッセージ取得エラー:", error);
    throw error instanceof Error
      ? error
      : new Error("タロットメッセージの取得に失敗しました。");
  }
}
