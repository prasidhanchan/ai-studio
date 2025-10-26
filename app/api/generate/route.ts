import { GoogleGenerativeAI } from "@google/generative-ai";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      apiKey,
      prompt,
      images,
      systemInstruction,
      temperature,
      aspectRatio,
      outputLength,
      topP,
      messages,
    } = await request.json();

    if (!apiKey || !prompt)
      return NextResponse.json(
        { success: false, error: "Missing API key or prompt" },
        { status: 400 }
      );

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash-image",
      systemInstruction,
    });

    const contents: any[] = [];

    // Previous messages
    if (messages && messages.length > 0) {
      for (const msg of messages) {
        const parts: any[] = [];
        if (msg.images && msg.images.length > 0) {
          for (const img of msg.images.slice(0, 5)) {
            const base64 = img.split(",")[1];
            parts.push({ inlineData: { mimeType: "image/png", data: base64 } });
          }
        }
        parts.push({ text: msg.content });
        contents.push({ role: msg.role === "user" ? "user" : "model", parts });
      }
    }

    // Current message
    const currentParts: any[] = [{ text: prompt }];
    if (images && images.length > 0) {
      for (const img of images.slice(0, 5)) {
        const base64 = img.split(",")[1];
        currentParts.unshift({
          inlineData: { mimeType: "image/png", data: base64 },
        });
      }
    }
    contents.push({ role: "user", parts: currentParts });

    const generationConfig: any = {
      temperature: temperature || 1,
      topP: topP || 0.95,
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: aspectRatio !== "Auto" ? { aspectRatio } : undefined,
    };
    if (outputLength) generationConfig.maxOutputTokens = outputLength;

    const result = await model.generateContent({ contents, generationConfig });
    const response = result.response;
    const text = response.text();

    let imageData = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const mimeType = part.inlineData.mimeType || "image/png";
          const base64 = part.inlineData.data;
          imageData = `data:${mimeType};base64,${base64}`;
        }
      }
    }

    return NextResponse.json({
      success: true,
      text,
      images: imageData ? [imageData] : null,
    });
  } catch (error: any) {
    console.error("API Error:", error);

    let errorMessage = "Failed to generate content";
    let retryAfter: number | null = null;

    if (error?.message?.includes("429") || error?.status === 429) {
      errorMessage = "API quota exceeded. Please wait or upgrade your plan.";
      const retryMatch = error?.message?.match(/retry in (\d+)/i);
      if (retryMatch) retryAfter = Number.parseInt(retryMatch[1]);
    } else if (error?.message?.includes("401") || error?.status === 401) {
      errorMessage = "Invalid API key.";
    } else if (error?.message?.includes("400") || error?.status === 400) {
      errorMessage = "Invalid request. Check your input.";
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        retryAfter,
        details: error?.message || "Unknown error",
      },
      { status: error?.status || 500 }
    );
  }
}
