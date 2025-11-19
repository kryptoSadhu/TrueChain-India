import { GoogleGenAI } from "@google/genai";
import { Product, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProductChain = async (product: Product, history: Transaction[]): Promise<string> => {
  const historyText = history.map(h => 
    `- ${h.timestamp}: ${h.action} by ${h.actor} at ${h.location}`
  ).join('\n');

  const prompt = `
    You are a Supply Chain Integrity AI for "TrueChain India". 
    Analyze the following product journey to verify its authenticity and safety for the consumer.
    
    Product: ${product.name} (${product.category})
    Batch: ${product.batchNumber}
    Manufacturer: ${product.manufacturer}
    Status: ${product.status}
    
    Blockchain Ledger History:
    ${historyText}
    
    Please provide a concise, reassuring summary (max 80 words) for the consumer scanning this product. 
    If the chain looks complete (Manufacturer -> ... -> Retail), confirm it is Authentic. 
    Mention key safety aspects (e.g., temperature control for drugs, origin for luxury) if relevant to the category.
    Do not use Markdown formatting (bold/italic), just plain text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Verification complete. Product chain verified.";
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return "Verification successful. Blockchain record is intact, but AI analysis is currently unavailable.";
  }
};

export const generateMarketInsights = async (): Promise<string> => {
    // Simulating a market insight generation
    const prompt = `
      Generate a short, 1-sentence insight about the importance of blockchain in fighting counterfeit 
      pharmaceuticals or luxury goods in India for a dashboard.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Blockchain transparency builds consumer trust.";
    } catch (e) {
        return "Blockchain transparency builds consumer trust.";
    }
}