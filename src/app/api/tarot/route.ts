// import { generateTarotMessageGemini } from "@/lib/generateTarotMessageGemini";
import { getSession, saveSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { TarotCard } from "@/data/tarotCards";
import { tarotCards } from "@/data/tarotCards";

type TarotResponse = {
  upright: string;
  reversed: string;
};

export async function GET() {
  const session = await getSession();

  console.log("session", session);

  if (session) {
    return NextResponse.json(session);
  } else {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const { name, meaning } = await request.json();
  const session = await getSession();
  const selectedCard: TarotCard | undefined = tarotCards.find(
    (card) => card.name === name && card.meaning === meaning
  );

  if (selectedCard) {
    session.selectedCards = [...(session.selectedCards || []), selectedCard];
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

  try {
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

    // if (!response.ok) {
    //   throw new Error(`API Error: ${response.statusText}`);
    // }

    const data = await response.json();
    console.log(data);
    const responseText = data.candidates[0].content.parts[0].text.trim();
    const tarotResponse: TarotResponse = JSON.parse(responseText)?.[0];

    // セッションにリーディング結果を保存
    const session = await getSession();

    session.cardReadings = {
      ...session.cardReadings,
      [name]: {
        upright: tarotResponse.upright,
        reversed: tarotResponse.reversed,
      },
    };
    await saveSession(session);

    return NextResponse.json(tarotResponse);
  } catch (error) {
    console.error("文言生成エラー:", error);
    return NextResponse.json(
      { error: "文言生成に失敗しました。" },
      { status: 500 }
    );
  }
}
