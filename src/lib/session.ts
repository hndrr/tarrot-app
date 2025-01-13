import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "@/types/session";

// パスワードの検証
const password = process.env.SECRET_COOKIE_PASSWORD;
if (!password || password.length < 32) {
  throw new Error("SECRET_COOKIE_PASSWORD must be at least 32 characters long");
}

const isProduction = process.env.NODE_ENV === "production";

// iron-sessionの設定
export const sessionOptions = {
  password,
  cookieName: "tarot-session",
  cookieOptions: {
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 1週間
  },
};

// 開発環境での設定
if (!isProduction) {
  sessionOptions.cookieOptions.secure = false;
}

// デバッグ用のログ出力
console.log("Session options:", {
  ...sessionOptions,
  password: "[HIDDEN]", // パスワードは隠す
  environment: process.env.NODE_ENV,
});

let cachedSession: SessionData | null = null;

export async function getSession() {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    console.log("セッション:", session);

    // セッションのデフォルト値を設定
    if (!session.selectedCards) {
      session.selectedCards = [];
    }
    if (!session.cardReadings) {
      session.cardReadings = {};
    }
    if (session.isReadingInProgress === undefined) {
      session.isReadingInProgress = false;
    }

    // キャッシュを更新
    cachedSession = {
      selectedCards: [...session.selectedCards],
      cardReadings: { ...session.cardReadings },
      isReadingInProgress: session.isReadingInProgress,
    };

    console.log("セッションを取得:", cachedSession);
    return session;
  } catch (error) {
    console.error("セッション取得エラー:", error);
    throw error;
  }
}

export async function saveSession(data: Partial<SessionData>) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    // 既存のデータを保持しながら、新しいデータを追加
    if (data.selectedCards) {
      session.selectedCards = data.selectedCards;
    }
    if (data.cardReadings) {
      session.cardReadings = {
        ...(session.cardReadings || {}),
        ...data.cardReadings,
      };
    }
    if (data.isReadingInProgress !== undefined) {
      session.isReadingInProgress = data.isReadingInProgress;
    }

    await session.save();

    // キャッシュを更新
    cachedSession = {
      selectedCards: [...session.selectedCards],
      cardReadings: { ...session.cardReadings },
      isReadingInProgress: session.isReadingInProgress,
    };

    console.log("セッションを保存:", cachedSession);
    return session;
  } catch (error) {
    console.error("セッション保存エラー:", error);
    throw error;
  }
}

export async function clearSession() {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    session.selectedCards = [];
    session.cardReadings = {};
    session.isReadingInProgress = false;
    await session.save();

    // キャッシュをクリア
    cachedSession = null;

    console.log("セッションをクリア");
  } catch (error) {
    console.error("セッションクリアエラー:", error);
    throw error;
  }
}
