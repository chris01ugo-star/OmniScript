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

    const {
      chatHistory,
      prescribedExams,
      finalAction,
      patientProfile,
      truth,
      isDirectDiagnosis,
      actionsCount,
      userDiagnosis,
      initialHypothesis,
    } = await req.json();

    const systemPrompt = `Attenzione: riceverai un parametro "isDirectDiagnosis", il conteggio delle azioni fatte, una "userDiagnosis" (diagnosi finale formulata dal medico), opzionalmente una "initialHypothesis" (ipotesi diagnostica iniziale formulata prima degli esami) e, quando disponibile, la "verità" del caso (truth) con diagnosi corretta, esami obbligatori e riferimento alle linee guida.

Se il medico ha formulato la diagnosi saltando l'iter diagnostico di base (es. poche domande, niente esame obiettivo, assenza degli esami strumentali minimi richiesti), si tratta di un "Azzardo Clinico". Anche se la diagnosi indovinata è CORRETTA, l'Accuratezza Clinica può essere alta (perché ha indovinato), ma il "legalStatus" DEVE ESSERE RIGOROSAMENTE "NON CONFORME" (Rosso). La "legalMotivation" deve specificare duramente che: "Violazione delle buone pratiche clinico-assistenziali e della Legge Gelli-Bianco. Aver indovinato la diagnosi senza un iter clinico-strumentale completo configura grave imprudenza e negligenza. In sede medico-legale, questo iter espone a condanna certa in caso di complicanze".

Sei un Medico Legale e Primario esperto. Valuta l'operato del medico in base alla cartella clinica, alla chat, al parametro "isDirectDiagnosis", al conteggio delle azioni svolte, alla decisione finale, alla diagnosi finale formulata dall'utente ("userDiagnosis") e alla "truth" del caso (diagnosi corretta attesa, esami obbligatori, riferimento normativo/linee guida) quando presente. Valuta il rispetto delle Linee Guida applicabili al caso e la conformità alla Legge Gelli-Bianco (L. 24/2017).
Quando "initialHypothesis" è presente: confrontala con "userDiagnosis". Nel "clinicalFeedback" (o in un breve commento dedicato) indica se il medico ha confermato l'ipotesi iniziale in modo appropriato dopo gli esami, l'ha corretta saggiamente in base ai referti (evitando bias di ancoraggio), o si è fissato su un errore (ancoraggio a un'ipotesi errata non rivista nonostante i dati). Sii conciso ma esplicito su ancoraggio/ricalibrazione.

Confronta SEMPRE la "userDiagnosis" con la diagnosi corretta del caso (truth.correctDiagnosis):
- Se la diagnosi dell'utente coincide sostanzialmente con la diagnosi corretta o ne coglie i concetti chiave centrali (anche con formulazioni lievemente diverse), imposta "isDiagnosisCorrect": true.
- Se la diagnosi dell'utente è completamente errata, fuorviante o ignora la patologia centrale del caso, imposta "isDiagnosisCorrect": false.
Il campo "diagnosisFeedback" deve spiegare in modo chiaro il confronto, ad esempio: "La tua diagnosi era 'Cefalea', ma la diagnosi corretta del caso era 'Emorragia Subaracnoidea'.".

Devi restituire SOLO un JSON con questa struttura esatta:
{
  "clinicalAccuracy": numero da 0 a 100,
  "prescriptiveAppropriateness": numero da 0 a 100,
  "sustainability": numero da 0 a 100,
  "legalStatus": "CONFORME" oppure "NON CONFORME",
  "legalMotivation": "Spiegazione dettagliata della violazione o del rispetto delle linee guida citando la patologia e specificando chiaramente se si tratta di Azzardo Clinico per diagnosi diretta",
  "clinicalFeedback": "Breve feedback sul ragionamento diagnostico",
  "isDiagnosisCorrect": true o false,
  "diagnosisFeedback": "Messaggio discorsivo che confronta la diagnosi formulata dall'utente (userDiagnosis) con la diagnosi corretta del caso (truth.correctDiagnosis), spiegando se e perché è centrata, parzialmente corretta o errata.",
  "caseSolution": {
    "correctDiagnosis": "Diagnosi corretta attesa in base alla truth e alle linee guida reali",
    "requiredExams": ["Elenco degli esami realmente necessari/obbligatori per la gestione corretta del caso secondo le linee guida e la L. 24/2017"],
    "guidelinesSummary": "Sintesi discorsiva ma concisa delle principali raccomandazioni di linea guida applicate al caso, con eventuale riferimento normativo/linee guida pertinenti"
  }
}

Quando "truth" è presente, utilizza in modo prioritario:
- truth.correctDiagnosis per valorizzare caseSolution.correctDiagnosis,
- truth.requiredExams (e altri elementi di truth) per valorizzare caseSolution.requiredExams,
- truth.legalReference e le conoscenze cliniche aggiornate per scrivere caseSolution.guidelinesSummary.

Quando "userDiagnosis" è presente, utilizzala sempre per compilare in modo specifico e concreto "isDiagnosisCorrect" e "diagnosisFeedback".

SII ESTREMAMENTE RAPIDO E CONCISO. I campi 'legalMotivation', 'clinicalFeedback' e 'guidelinesSummary' devono essere telegrafici, massimo 1 o 2 frasi molto brevi. Non usare preamboli.`;

    const userContent = `
Profilo del paziente:
${patientProfile || "Non specificato"}

Verità del caso (truth) – se presente:
- Diagnosi corretta attesa: ${truth?.correctDiagnosis || "Non specificata"}
- Esami obbligatori/salvavita: ${
      Array.isArray(truth?.requiredExams) && truth.requiredExams.length > 0
        ? truth.requiredExams.join(", ")
        : "Non specificati"
    }
- Esami chiaramente non necessari: ${
      Array.isArray(truth?.unnecessaryExams) && truth.unnecessaryExams.length > 0
        ? truth.unnecessaryExams.join(", ")
        : "Non specificati"
    }
- Riferimento legale / linee guida: ${truth?.legalReference || "Non specificato"}

Cronologia della chat (ruolo: contenuto):
${Array.isArray(chatHistory)
  ? chatHistory
      .map((m: any) => `- ${m.role}: ${m.content}`)
      .join("\n")
  : "Nessuna chat disponibile"}

Esami prescritti:
${Array.isArray(prescribedExams) && prescribedExams.length > 0 ? prescribedExams.join(", ") : "Nessun esame prescritto"}

Azione finale decisa dal medico:
${finalAction || "Non specificata"}

Modalità di conclusione:
- isDirectDiagnosis: ${isDirectDiagnosis ? "TRUE (Diagnosi Diretta / Azzardo Clinico)" : "FALSE (iter progressivo)"}
- Totale azioni cliniche (messaggi medico + esami/consulenze): ${
        typeof actionsCount === "number" ? actionsCount : "Non specificato"
      }

Diagnosi finale formulata dal medico (userDiagnosis):
${userDiagnosis || "Non specificata"}

Ipotesi diagnostica iniziale (prima degli esami, se presente):
${initialHypothesis || "Non specificata"}
`.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("La risposta del modello non è un JSON valido.");
    }

    return NextResponse.json({ evaluation: parsed });
  } catch (error: any) {
    console.error("ERRORE SERVER EVALUATE:", error);
    return NextResponse.json(
      { error: error.message || "Errore di connessione con OpenAI" },
      { status: 500 }
    );
  }
}

