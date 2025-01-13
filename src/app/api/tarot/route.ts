import { sessionOptions } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import type { TarotCard } from "@/types/session.d";
import { tarotCards } from "@/data/tarotCards";
import { SessionData, TarotResponse } from "@/types/session";
import { getIronSession } from "iron-session";

export async function GET(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    console.log("session", session);

    if (!session || !session.cardReadings) {
      return NextResponse.json({
        selectedCards: [],
        cardReadings: {},
        isReadingInProgress: false,
      });
    }

    return NextResponse.json({
      selectedCards: session.selectedCards || [],
      cardReadings: session.cardReadings || {},
      isReadingInProgress: session.isReadingInProgress || false,
    });
  } catch (error) {
    console.error("セッション取得エラー:", error);
    return NextResponse.json(
      { error: "セッションの取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, meaning } = await req.json();
    const res = NextResponse.next();
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    if (!name || !meaning) {
      return NextResponse.json(
        { error: "name と meaning は必須です。" },
        { status: 400 }
      );
    }

    const selectedCard: TarotCard | undefined = tarotCards.find(
      (card) => card.name === name && card.meaning === meaning
    );

    if (!selectedCard) {
      return NextResponse.json(
        { error: "指定されたカードが見つかりません。" },
        { status: 404 }
      );
    }

    const prompt = `
  あなたはタロットカード占い師です。

  タロットカード「${name}」に基づいてキーワードを含む正位置と逆位置の解釈文を生成し、アドバイスしてください。
  キーワード: ${meaning}
  `;

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const gatewayId = process.env.CLOUDFLARE_GATEWAY_NAME;
    const geminiApiEndpoint =
      // "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent";
      `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/google-ai-studio/v1beta/models/gemini-1.5-flash-002:generateContent`;

    const schema = {
      description: "タロットカードの正位置と逆位置の文言を生成する",
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          upright: {
            type: "string",
            description: "タロットカードの正位置の文言",
          },
          reversed: {
            type: "string",
            description: "タロットカードの逆位置の文言",
          },
        },
        required: ["upright", "reversed"],
      },
    };

    // const response = await generateTarotMessageGemini(name, meaning);
    // const tarotResponse = response;
    const response = await fetch(geminiApiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: schema,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text.trim();
    const tarotResponse: TarotResponse = JSON.parse(responseText)?.[0];

    if (!tarotResponse || !tarotResponse.upright || !tarotResponse.reversed) {
      throw new Error("Invalid response format from Gemini API");
    }

    try {
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

      // セッションを更新して保存
      // const updatedSession = await saveSession({
      //   cardReadings: {
      //     ...(session.cardReadings || {}),
      //     [name]: {
      //       upright: tarotResponse.upright,
      //       reversed: tarotResponse.reversed,
      //     },
      //   },
      //   selectedCards: [...(session.selectedCards || []), selectedCard],
      //   isReadingInProgress: true,
      // });

      // console.log("セッション更新:", {
      //   selectedCards: updatedSession.selectedCards,
      //   cardReadingsCount: Object.keys(updatedSession.cardReadings || {})
      //     .length,
      //   isReadingInProgress: updatedSession.isReadingInProgress,
      // });

      // レスポンスと一緒にセッションの状態も返す
      return NextResponse.json({
        ...tarotResponse,
        session,
      });
    } catch (error) {
      console.error("セッション更新エラー:", error);
      throw error;
    }
  } catch (error) {
    console.error("エラー発生:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "APIレスポンスの解析に失敗しました。" },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "予期せぬエラーが発生しました。" },
      { status: 500 }
    );
  }
}
