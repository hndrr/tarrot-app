import { z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const apiKey = process.env.GEMINI_API_KEY;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const gatewayId = process.env.CLOUDFLARE_GATEWAY_NAME;
const baseURL = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/google-ai-studio`;
// const baseURL = "https://generativelanguage.googleapis.com/v1beta/openai";

const client = new OpenAI({
  apiKey,
  baseURL,
});

export const generateTarotMessageGemini = async (
  name: string,
  meaning: string
) => {
  const prompt = `
あなたはタロットカード占い師です。

タロットカード「${name}」に基づいてキーワードを含む正位置と逆位置の解釈文を生成し、アドバイスしてください。
キーワード: ${meaning}
`;

  // JSON Schemaの定義
  const jsonSchema = z.object({
    upright: z.string(),
    reversed: z.string(),
  });

  // API呼び出し
  try {
    // const genAI = new GoogleGenerativeAI(api_token);
    // const model = await genAI.getGenerativeModel(
    //   {
    //     model: "gemini-1.5-flash",
    //     generationConfig: {
    //       responseMimeType: "application/json",
    //       responseSchema: schema,
    //     },
    //   },
    //   {
    //     baseUrl: geminiApiEndpoint,
    //   }
    // );
    // const result = await model.generateContent(prompt);
    // console.log(result);
    // const responseText =
    //   result.response.candidates?.[0].content.parts[0].text || "";
    // const tarotResponse: TarotResponse = JSON.parse(responseText)?.[0];
    // console.log(tarotResponse);
    // return tarotResponse;

    const completion = await client.beta.chat.completions.parse({
      model: "gemini-1.5-flash-002",
      messages: [{ role: "system", content: prompt }],
      response_format: zodResponseFormat(jsonSchema, "tarot_response"),
      max_tokens: 300,
      temperature: 1,
    });

    console.log(completion);

    const parsedResponse = completion.choices[0].message.parsed;

    console.log("文言生成成功:", parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error("文言生成エラー:", error);
    throw new Error("文言生成に失敗しました。");
  }
};
