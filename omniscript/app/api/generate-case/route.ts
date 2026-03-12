import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Manca la chiave OPENAI_API_KEY nel file .env.local!");
    }

    const partialInput = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Sei un creatore di scenari clinici avanzati. Riceverai un input parziale. Devi generare un caso clinico completo, realistico e molto complesso, pensato per simulazioni mediche lunghe, approfondite e stratificate. Non fare casi banali. L\'età del paziente (patientAge) DEVE essere un numero intero realistico per un adulto (es. tra 18 e 95 anni), ASSOLUTAMENTE NON 0 o null. Crea un caso clinico estremamente complesso e stratificato, strutturato appositamente per richiedere una simulazione molto lunga e un\'anamnesi profonda che superi le 20-30 interazioni: il paziente virtuale non deve fornire la soluzione o tutti i sintomi in poche battute, ma deve costringere il medico a indagare a lungo. Restituisci SOLO un JSON compatibile con questa struttura: { patientName, patientAge, initialMessage, patientProfile (deve essere molto dettagliato e istruire il paziente virtuale a non rivelare tutto subito per favorire un\'anamnesi estesa), truth: { correctDiagnosis, mandatoryQuestions, requiredExams, unnecessaryExams, physicalExam, legalReference } }.',
        },
        {
          role: "user",
          content: `Input parziale fornito dall'utente (in JSON): ${JSON.stringify(
            partialInput,
          )}`,
        },
      ],
      temperature: 0.9,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Risposta vuota da OpenAI durante la generazione del caso.");
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      throw new Error("Impossibile interpretare la risposta di OpenAI come JSON valido.");
    }

    return NextResponse.json({ case: parsed });
  } catch (error: any) {
    console.error("ERRORE GENERATE-CASE:", error);
    return NextResponse.json(
      { error: error.message || "Errore di connessione con OpenAI" },
      { status: 500 },
    );
  }
}

