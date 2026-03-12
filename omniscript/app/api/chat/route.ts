import OpenAI from "openai";
import { NextResponse } from "next/server";

// 1. Diciamo al computer di usare la tua chiave segreta
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { messages, patientProfile, generateReferto, examName, correctDiagnosis } = await req.json();

    // 2. Controllo di sicurezza: la chiave esiste?
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Manca la chiave OPENAI_API_KEY nel file .env.local!");
    }

    // Modalità nascosta: generazione referto coerente con la diagnosi vera del caso
    if (generateReferto && examName) {
      const systemReferto = `Il medico ha prescritto l'esame: ${examName}. Genera un referto realistico e brevissimo (max 2 righe) coerente con la diagnosi vera del paziente: "${correctDiagnosis || "non specificata"}". Restituisci SOLO il testo del referto, senza virgolette aggiuntive o prefissi.`;
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemReferto },
          { role: "user", content: "Genera il referto." },
        ],
        temperature: 0.3,
      });
      const text = (response.choices[0]?.message?.content || "Referto non disponibile.").trim();
      return NextResponse.json({ text });
    }

    // 3. Chiamata all'Intelligenza Artificiale (chat paziente)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // o gpt-3.5-turbo
      messages: [
        {
          role: "system",
          content: `Sei un paziente. Segui rigorosamente questo profilo: ${patientProfile || "profilo non specificato"}. Sii naturale, conciso e non ripeterti mai.`,
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ text: response.choices[0].message.content });
    
  } catch (error: any) {
    console.error("ERRORE SERVER:", error);
    return NextResponse.json(
      { error: error.message || "Errore di connessione con OpenAI" },
      { status: 500 }
    );
  }
}