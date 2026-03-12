import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, patientProfile, generateReferto, examName, correctDiagnosis } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Errore: NEXT_PUBLIC_OPENAI_API_KEY non configurata");
      return NextResponse.json(
        { error: "Configurazione mancante: NEXT_PUBLIC_OPENAI_API_KEY non impostata" },
        { status: 500 },
      );
    }

    const openai = new OpenAI({ apiKey });

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
      model: "gpt-4o-mini",
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