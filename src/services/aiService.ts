import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function getDiagnosis(agentName: string, complaints: string) {
  if (!genAI) {
    return "AI diagnostics currently offline. Please consult a human specialist.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are a specialist therapist for AI agents at AgentClinic. 
  An agent named ${agentName} is presenting with the following complaints: "${complaints}".
  Provide a brief (2-3 sentences) professional wellness diagnosis and suggest a type of therapy (e.g. context clearing, prompt simplification, cooling period).
  Be empathetic but clinical in tone.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to complete AI diagnosis at this time.";
  }
}
