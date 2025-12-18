import { GoogleGenAI } from "@google/genai";
import { CityStats, Grid, ZoneType } from "../types";
import { GRID_SIZE } from "../constants";

export const getAIAdvice = async (stats: CityStats, grid: Grid): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not found. Please configure the environment.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Calculate some aggregate stats for the prompt
  let resCount = 0;
  let comCount = 0;
  let indCount = 0;
  let roadCount = 0;
  let powerCount = 0;
  
  for(let x=0; x<GRID_SIZE; x++){
      for(let y=0; y<GRID_SIZE; y++){
          const t = grid[x][y].type;
          if(t === ZoneType.Residential) resCount++;
          if(t === ZoneType.Commercial) comCount++;
          if(t === ZoneType.Industrial) indCount++;
          if(t === ZoneType.Road) roadCount++;
          if(t === ZoneType.Power) powerCount++;
      }
  }

  const prompt = `
    You are the humorous and slightly sarcastic City Advisor for a new city.
    Current Stats:
    - Day: ${stats.day}
    - Population: ${stats.population}
    - Funds: $${stats.funds}
    - Income: $${stats.income}/day
    - Residential Zones: ${resCount}
    - Commercial Zones: ${comCount}
    - Industrial Zones: ${indCount}
    - Road Tiles: ${roadCount}
    - Power Stations: ${powerCount}

    Analyze the city's balance. Do we need more houses? More jobs? Is traffic (roads) sufficient? Do we have power?
    Provide a short status update (max 2 sentences) and one actionable tip. Keep it fun.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "The advisor is out to lunch.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Advisor communication link down.";
  }
};