/**
 * Helper to discover and invoke supported Gemini models dynamically
 */

export interface DiscoveredModel {
  name: string; // e.g. "models/gemini-2.0-flash"
  id: string;   // e.g. "gemini-2.0-flash"
  displayName: string;
  supportedMethods: string[];
}

/**
 * Queries Google Gemini ModelService.ListModels to find all available models for an API key.
 */
export async function getAvailableGeminiModels(apiKey: string): Promise<{
  success: boolean;
  models: DiscoveredModel[];
  error?: string;
}> {
  try {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      return { success: false, models: [], error: "No API key provided." };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      const msg = errBody?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      return { success: false, models: [], error: msg };
    }

    const data = await res.json();
    const rawList: Array<{
      name: string;
      displayName?: string;
      supportedGenerationMethods?: string[];
    }> = data.models || [];

    // Filter models supporting generateContent
    const validModels: DiscoveredModel[] = rawList
      .filter((m) =>
        Array.isArray(m.supportedGenerationMethods) &&
        m.supportedGenerationMethods.includes("generateContent")
      )
      .map((m) => {
        const id = m.name.replace(/^models\//, "");
        return {
          name: m.name,
          id,
          displayName: m.displayName || id,
          supportedMethods: m.supportedGenerationMethods || [],
        };
      });

    // Priority sorting: prefer modern flash models first and deprioritize deprecated ones
    validModels.sort((a, b) => {
      const getScore = (id: string) => {
        if (id === "gemini-2.5-flash" || id === "gemini-2.5-flash-latest") return 120;
        if (id === "gemini-2.0-flash" || id === "gemini-2.0-flash-latest") return 110;
        if (id === "gemini-1.5-flash" || id === "gemini-1.5-flash-latest") return 100;
        if (id.includes("flash-8b")) return 90;
        if (id.includes("flash")) return 80;
        if (id.includes("pro")) return 20; // Deprecated or higher latency for reading stories
        return 10;
      };
      return getScore(b.id) - getScore(a.id);
    });

    return {
      success: true,
      models: validModels,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to connect to Google Gemini API.";
    return { success: false, models: [], error: msg };
  }
}
