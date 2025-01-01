import { NextResponse } from "next/server";

interface TarotResponse {
  upright: string;
  reversed: string;
}

export async function POST(request: Request) {
  const { name, meaning } = await request.json();

  const prompt = `
あなたはタロットカード占い師です。


タロットカード「${name}」に基づいて正位置と逆位置の文言を生成して詳細な解釈してください。
キーワード: ${meaning}
`;

  const geminiApiEndpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent";
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
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text.trim();
    const tarotResponse: TarotResponse = JSON.parse(responseText)?.[0];

    return NextResponse.json(tarotResponse);
  } catch (error) {
    console.error("文言生成エラー:", error);
    return NextResponse.json(
      { error: "文言生成に失敗しました。" },
      { status: 500 }
    );
  }
}
