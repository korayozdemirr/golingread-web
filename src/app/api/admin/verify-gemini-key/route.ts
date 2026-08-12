import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/auth-admin";
import { getAvailableGeminiModels } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, userEmail } = body;

    const requestEmail = req.headers.get("x-user-email") || userEmail;
    if (!isAdminEmail(requestEmail)) {
      return NextResponse.json(
        { error: "Forbidden: Administrator authorization required." },
        { status: 403 }
      );
    }

    const effectiveApiKey =
      apiKey?.trim() ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!effectiveApiKey) {
      return NextResponse.json(
        {
          valid: false,
          error: "No API key provided or found in environment variables.",
        },
        { status: 400 }
      );
    }

    // 1. Discover available models via ModelService.ListModels
    const discovery = await getAvailableGeminiModels(effectiveApiKey);
    if (!discovery.success || discovery.models.length === 0) {
      return NextResponse.json({
        valid: false,
        error: discovery.error || "No compatible Gemini models found for this API key.",
      });
    }

    // 2. Test generation on the best available model
    let lastError = "";

    for (const model of discovery.models.slice(0, 3)) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${effectiveApiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Respond with 'OK'." }] }],
            generationConfig: {
              maxOutputTokens: 10,
              temperature: 0.1,
            },
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "OK";
          return NextResponse.json({
            valid: true,
            model: model.id,
            totalModelsFound: discovery.models.length,
            availableModels: discovery.models.map((m) => m.id),
            message: `Successfully connected! Active Model: ${model.id} (${discovery.models.length} models available).`,
            sampleResponse: reply.trim(),
          });
        } else {
          const errorData = await res.json().catch(() => null);
          lastError = errorData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : "Network error";
      }
    }

    return NextResponse.json({
      valid: false,
      error: lastError || "Failed to generate content with available Gemini models.",
      availableModels: discovery.models.map((m) => m.id),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error verifying Gemini API key";
    return NextResponse.json({ valid: false, error: msg }, { status: 500 });
  }
}
