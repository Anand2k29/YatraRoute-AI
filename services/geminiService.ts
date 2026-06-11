import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SearchResponse, RankedRoute } from "../types";
import { runGraphEngine } from "./graphEngine";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
const hasApiKey = apiKey && apiKey.trim() !== "" && apiKey !== "your_gemini_api_key_here" && !apiKey.startsWith("your_");

const ai = hasApiKey ? new GoogleGenAI({ apiKey }) : null;

// Lightweight schema for LLM enrichment of text fields
const enrichmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    routes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          reason: { type: Type.STRING, description: "A Phineas & Ferb style funny agent description of why this route was invented." },
          layoverTip: { type: Type.STRING, description: "An inventive tips/recommendations block for layovers/pit stops (e.g. food/inventions)." },
          secretTip: { type: Type.STRING, description: "A top secret money saving or hackathon booking tip for the traveler." }
        },
        required: ["id", "reason"]
      }
    }
  },
  required: ["routes"]
};

// Fallback text generator for Phineas & Ferb style local responses
const getLocalEnrichment = (route: RankedRoute): { reason: string, layoverTip?: string, secretTip?: string } => {
  const isSeatSplit = route.id.startsWith("seat-split");
  const isStationSplit = route.id.startsWith("station-split");
  const isDirectWl = route.id.startsWith("direct-wl");
  
  if (isSeatSplit) {
    return {
      reason: "Ah, the Single-Train Seat Switcher! The Jugaad-inator detected that while no single seat was free for the whole trip, you can swap seats at " + route.stations[1] + ". Perry approved!",
      layoverTip: "Change from Coach " + route.legs[0].status.match(/Seat (.*)\)/)?.[1] + " to Coach " + route.legs[1].status.match(/Seat (.*)\)/)?.[1] + " at " + route.stations[1] + ". Quick swap, zero platform jumping!",
      secretTip: "Book both legs in one transaction on RedRail to maximize student cashback!"
    };
  } else if (isStationSplit) {
    const junc = route.stations[1];
    return {
      reason: "Behold, the Safe-inator! We split your journey at " + junc + " Junction. By utilizing two connecting trains, you get 100% confirmed berths. Curated under Major Monogram's guidelines.",
      layoverTip: "Platform " + route.legs[0].status + " ➔ Platform " + route.legs[1].status + ". Pit stop time! Grab hot samosas & chai at " + junc + " Platform 1. Keep an eye out for Agent P!",
      secretTip: "Check the platform layouts in advance to avoid running through the overbridge with heavy backpacks."
    };
  } else if (isDirectWl) {
    return {
      reason: "The Direct-inator. A simple, linear prototype, but Dr. Doofenshmirtz waitlisted the entire coach. Busted! Only use if you've got a jetpack ready.",
      layoverTip: "No pit stop. Just watch out for waitlist cancellations.",
      secretTip: "Waitlist tickets auto-cancel if not confirmed. Set a `/schedule` reminder to check status!"
    };
  }
  
  return {
    reason: "A standard invention. Perfect for a quick summer project.",
    layoverTip: route.layoverTip,
    secretTip: "Keep it simple, Ferb!"
  };
};

export const findRoutes = async (source: string, destination: string, date: string): Promise<SearchResponse> => {
  // 1. Run deterministic graph routing calculations first
  const { routes, logs } = runGraphEngine(source, destination, date);

  if (routes.length === 0) {
    return {
      routes: [],
      logs: [
        ...logs,
        {
          optionLabel: "ERROR",
          status: 'REJECTED',
          reason: "Dr. Doofenshmirtz blocked all paths. No connections found.",
          riskLevel: 'RED'
        }
      ]
    };
  }

  // 2. Enrich text fields using Gemini if API key is available
  if (ai) {
    try {
      const model = "gemini-2.5-flash";
      const prompt = `
        You are **Jugaad-inator**, the backend for a "Phineas & Ferb" style student travel app.
        We have computed these route options for travel from ${source} to ${destination} on ${date}:
        
        ${JSON.stringify(routes.map(r => ({ id: r.id, title: r.title, summary: r.summary, type: r.type, stations: r.stations })))}

        For each route ID, generate:
        1. An inventive Phineas & Ferb style explanation for "reason" (e.g., mention Perry, Doofenshmirtz, Agent P, 104 days of summer, the Inator).
        2. A fun "layoverTip" recommending local snacks or activities at the transition/junction station (especially if it is a split route).
        3. A "secretTip" for saving money or booking hacks.

        Return strict JSON matching the schema.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: enrichmentSchema,
          systemInstruction: "You are the Jugaad-inator. Inject witty Phineas & Ferb cartoon humor and references into the travel explanations.",
          temperature: 0.7,
        },
      });

      const jsonText = response.text;
      if (jsonText) {
        const enrichment = JSON.parse(jsonText) as { routes: { id: string, reason: string, layoverTip?: string, secretTip?: string }[] };
        
        // Merge enriched fields back
        const enrichedRoutes = routes.map(route => {
          const enrichData = enrichment.routes.find(r => r.id === route.id);
          if (enrichData) {
            return {
              ...route,
              reason: enrichData.reason || route.reason,
              layoverTip: enrichData.layoverTip || route.layoverTip,
              fareAnalysis: {
                ...route.fareAnalysis,
                secretTip: enrichData.secretTip || route.fareAnalysis.secretTip
              }
            };
          }
          return route;
        });

        return {
          routes: enrichedRoutes,
          logs: logs
        };
      }
    } catch (err) {
      console.error("Gemini enrichment failed, falling back to local text generators:", err);
    }
  }

  // 3. Fallback: Use high-quality local text enrichment
  const enrichedRoutes = routes.map(route => {
    const local = getLocalEnrichment(route);
    return {
      ...route,
      reason: local.reason,
      layoverTip: local.layoverTip || route.layoverTip,
      fareAnalysis: {
        ...route.fareAnalysis,
        secretTip: local.secretTip || route.fareAnalysis.secretTip
      }
    };
  });

  return {
    routes: enrichedRoutes,
    logs: logs
  };
};