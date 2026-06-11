import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SearchResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const legSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    trainName: { type: Type.STRING },
    trainNumber: { type: Type.STRING },
    sourceStation: { type: Type.STRING },
    destinationStation: { type: Type.STRING },
    departureTime: { type: Type.STRING },
    arrivalTime: { type: Type.STRING },
    duration: { type: Type.STRING },
    status: { type: Type.STRING, enum: ["AVAILABLE", "RAC", "WAITLIST", "REGRET"] },
    ticketClass: { type: Type.STRING },
    date: { type: Type.STRING },
    probability: { type: Type.NUMBER, description: "Confirmation probability percentage if WL" },
  },
  required: ["trainName", "trainNumber", "sourceStation", "destinationStation", "departureTime", "arrivalTime", "status", "ticketClass", "date"],
};

const priceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    platformName: { type: Type.STRING },
    finalPrice: { type: Type.NUMBER },
    breakdown: { type: Type.STRING },
    isCheapest: { type: Type.BOOLEAN },
    verdict: { type: Type.STRING, description: "Short verdict like 'Steal' or 'Pricey'" },
  },
  required: ["platformName", "finalPrice", "breakdown", "isCheapest"],
};

const fareSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    baseFare: { type: Type.NUMBER },
    prices: { type: Type.ARRAY, items: priceSchema },
    bestDealLabel: { type: Type.STRING },
    secretTip: { type: Type.STRING, description: "A money saving tip for this route" },
  },
  required: ["baseFare", "prices", "bestDealLabel"],
};

const badgeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    label: { type: Type.STRING },
    type: { type: Type.STRING, enum: ["SAFE", "MODERATE", "RISKY", "CHEAP"] },
  },
  required: ["label", "type"],
};

const rankedRouteSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    rank: { type: Type.INTEGER },
    title: { type: Type.STRING },
    type: { type: Type.STRING, enum: ["split", "direct"] },
    summary: { type: Type.STRING },
    totalDuration: { type: Type.STRING },
    stations: { type: Type.ARRAY, items: { type: Type.STRING } },
    midDuration: { type: Type.STRING },
    layoverTip: { type: Type.STRING, description: "Specific food/activity tip for the junction station e.g., 'Grab hot samosas & chai at Platform 1'" },
    legs: { type: Type.ARRAY, items: legSchema },
    badges: { type: Type.ARRAY, items: badgeSchema },
    reason: { type: Type.STRING },
    fareAnalysis: fareSchema,
  },
  required: ["id", "rank", "title", "type", "summary", "totalDuration", "stations", "legs", "badges", "reason", "fareAnalysis"],
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    routes: { type: Type.ARRAY, items: rankedRouteSchema },
  },
  required: ["routes"],
};

export const findRoutes = async (source: string, destination: string, date: string): Promise<SearchResponse> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are **Jugaad-inator**, the backend for a "Phineas & Ferb" style student travel app.
    User Input: Source: ${source}, Destination: ${destination}, Travel Date: ${date}.

    **BRANDING ("The Summer Invention"):**
    Cartoonish, Energetic, Inventive.
    Routes are "Blueprints" or "Big Ideas". 
    Layovers are "Pit Stops" or "Tinkering Breaks".
    Confirmed Status is "Perry Approved" or "104% Likely". 
    Waitlist is "Busted" or "Risky Prototype".
    Use "-inator" suffixes creatively for titles.

    **MODULE 1: THE RANKING ENGINE (The Big Ideas)**
    Generate 3-4 distinct route blueprints and rank them:
    
    1.  **RANK 1 (The Big Idea):** Best Split Route (A->B->C).
        *   Criteria: >2hr Buffer, Confirmed Seats.
        *   Title: "The Safe-inator (Via [Junction])".
        *   Badge: SAFE.
    2.  **RANK 2 (Standard Prototype):** Direct Train.
        *   Simulate as **Waitlisted (WL)**.
        *   Title: "The Direct-inator".
        *   Badge: RISKY.
    3.  **RANK 3 (Crazy Concept):** Tighter buffer (<2h) or Expensive.
        *   Title: "The Speed-inator 3000".
        *   Badge: MODERATE.

    **MODULE 2: THE FARE CALCULATOR**
    Estimate Base Fare (₹X) and calculate:
    *   **RedRail:** ₹X + 20 - 50 -> "Best Deal"
    *   **IRCTC:** ₹X + 18
    *   **MakeMyTrip:** ₹X + 60

    **MODULE 3: DATA PREP**
    *   Populate \`layoverTip\` with a specific **food recommendation** for the pit stop (e.g., "Grab hot samosas & chai at Platform 1").
    *   \`midDuration\` is the Pit Stop time.
    *   **CRITICAL:** Ensure the first leg starts exactly on **${date}**. Format dates as "Day, DD Mon".

    Output strict JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are the Jugaad-inator. You create brilliant route inventions.",
        temperature: 0.3, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("The -inator failed to fire!");
    
    return JSON.parse(jsonText) as SearchResponse;

  } catch (error) {
    console.error("Jugaad Engine Error:", error);
    throw new Error("Dr. Doofenshmirtz interfered. Try again!");
  }
};