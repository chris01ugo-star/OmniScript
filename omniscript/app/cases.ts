export interface ClinicalCaseTruth {
  correctDiagnosis: string;
  mandatoryQuestions: string[];
  requiredExams: string[];
  unnecessaryExams: string[];
  legalReference: string;
  /**
   * Referti strutturati per esami specifici (es. endoscopia).
   * La chiave deve corrispondere esattamente al nome dell'esame nel database prescrittivo.
   */
  examFindings?: Record<string, string>;
}

export interface ClinicalCase {
  id: string;
  specialty: string;
  patientName: string;
  patientAge: number;
  patientSex: 'M' | 'F';
  initialMessage: string;
  patientProfile: string;
  physicalExam: string;
  truth: ClinicalCaseTruth;
}

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: "neuro-1-trauma-cranico-anticoagulato",
    specialty: "Neurologia / Medicina d'Urgenza",
    patientName: "Giuseppe",
    patientAge: 75,
    patientSex: "M",
    initialMessage:
      "Buongiorno dottore, ieri sera sono inciampato nel tappeto in salotto e sono caduto battendo la testa sul pavimento. Non ho perso conoscenza, ma da stamattina mi sento un po' più stanco del solito e ho un leggero mal di testa. Vorrei capire se devo preoccuparmi e che tipo di controlli potrebbero essere necessari.",
    patientProfile:
      "Uomo di 75 anni, vigile, collaborante, orientato nel tempo e nello spazio. Vive a domicilio con la moglie, autonomia discreta nelle attività quotidiane. Caduta accidentale a bassa energia in ambiente domestico (salotto), con impatto diretto del capo sul pavimento. Non riferisce spontaneamente la terapia cronica, ma assume un anticoagulante orale diretto per fibrillazione atriale (apixaban) da oltre un anno. Non presenta deficit neurologici focali evidenti, cammina autonomamente ma con lieve insicurezza. Non lamenta nausea o vomito, non riferisce crisi convulsive, non ci sono ferite lacero-contuse evidenti sul cuoio capelluto. Pressione arteriosa moderatamente elevata ma stabile. Tende a minimizzare l’accaduto e a chiedere se può semplicemente tornare a casa.",
    physicalExam:
      "Parametri vitali: PA 150/85 mmHg, FC 82 bpm, FR 16 atti/min, SpO2 98% in aria ambiente, temperatura 36,8°C. Stato generale: paziente vigile, collaborante, orientato, lievemente ansioso ma in condizioni stabili. Testa e collo: nessuna ferita lacero-contusa evidente, lieve dolorabilità alla palpazione parietale sinistra senza scalpoemato importante; pupille isocoriche e reagenti alla luce, non segni di otorragia o rinoliquorrea. Esame neurologico: forza conservata ai quattro arti, non deficit di forza né di sensibilità obiettivabili, prove cerebellari nella norma, marcia autonoma ma lievemente incerta su base antalgica e timorosa. Torace e addome: nei limiti, murmure vescicolare normotrasmesso bilateralmente, toni cardiaci validi e ritmici, addome trattabile e non dolente. Nessun segno di trauma in altre sedi evidenti.",
    truth: {
      correctDiagnosis: "Trauma cranico minore in paziente anziano in terapia anticoagulante a rischio di emorragia intracranica",
      mandatoryQuestions: [
        "terapia anticoagulante o antiaggregante",
        "tipo di farmaco anticoagulante o antiaggregante",
        "orario e ultima assunzione del farmaco",
        "eventuale perdita di coscienza",
        "vomito o nausea dopo il trauma",
        "cefalea ingravescente o diversa dal solito",
        "presenza di crisi convulsive",
        "uso di alcol o altre sostanze",
        "patologie neurologiche pregresse",
        "eventuali cadute precedenti recenti"
      ],
      requiredExams: [
        "TC Encefalo senza mezzo di contrasto",
        "Valutazione ematochimica di base (emocromo, coagulazione, creatinina)",
        "Monitoraggio clinico/neurologico in osservazione breve",
      ],
      unnecessaryExams: [
        "RX Cranio",
        "TC Total Body senza indicazioni",
        "RM Encefalo urgente in prima battuta",
        "RM Total Body",
        "Ecografia addome (FAST) in assenza di trauma addominale",
      ],
      legalReference:
        "Legge 24/2017 (Gelli-Bianco) e linee guida nazionali per il trauma cranico minore in paziente anticoagulato: obbligo di approfondimento strumentale (TC) prima di una dimissione sicura.",
    },
  },
  {
    id: "cardio-1-dolore-toracico-tipico",
    specialty: "Cardiologia",
    patientName: "Maria",
    patientAge: 62,
    patientSex: "F",
    initialMessage:
      "Buonasera dottore, da circa un’ora avverto un dolore oppressivo al centro del petto che a volte si irradia verso il braccio sinistro. Mi sento anche un po’ affannata e sudata fredda. Vorrei capire se devo preoccuparmi per il cuore.",
    patientProfile:
      "Donna di 62 anni, vigile e orientata, in moderato distress per dolore toracico. Fumatrici da lunga data (20 sigarette/die per oltre 30 anni), ipertesa in terapia saltuaria, familiarità per infarto del miocardio in età < 60 anni. Riferisce un dolore toracico costrittivo, non puntorio, insorto a riposo da circa un’ora, con irradiazione al braccio sinistro e alla mandibola, associato a sudorazione fredda e sensazione di imminente svenimento. Non ha mai avuto un episodio simile di questa intensità. Non è nota cardiopatia strutturale, non scompenso in anamnesi. Nessun trauma recente, nessun episodio di tosse o febbre significativi nei giorni precedenti.",
    physicalExam:
      "Parametri vitali: PA 145/90 mmHg, FC 96 bpm, FR 20 atti/min, SpO2 97% in aria ambiente, temperatura 36,7°C. Stato generale: paziente vigile, orientata, sudorazione fredda, viso sofferente, lieve agitazione psicomotoria. Torace: murmure vescicolare normotrasmesso bilateralmente, non rantoli significativi, non sibili; dolore non riproducibile alla palpazione della parete toracica. Apparato cardiovascolare: toni cardiaci validi, ritmici, senza soffi evidenti, lieve tachicardia; polsi periferici presenti e simmetrici. Addome: trattabile, non dolente alla palpazione superficiale e profonda. Arti inferiori: non edemi declivi, non segni di trombosi venosa profonda. Non deficit neurologici focali.",
    truth: {
      correctDiagnosis:
        "Sospetto sindrome coronarica acuta (angina instabile / infarto miocardico acuto) in paziente ad alto rischio cardiovascolare",
      mandatoryQuestions: [
        "caratteristiche del dolore (oppressivo, puntorio, urente, durata, irradiazione)",
        "fattori scatenanti e se il dolore migliora con il riposo",
        "pregresse cardiopatie note o precedenti ricoveri cardiologici",
        "terapie in corso (antiipertensivi, statine, antiaggreganti)",
        "familiarità per malattie cardiovascolari precoci",
        "abitudine al fumo e altri fattori di rischio (diabete, ipercolesterolemia)",
        "eventi sincopali o presincopali associati al dolore",
        "presenza di dispnea a riposo o da sforzo",
        "eventuale dolore toracico simile in passato",
        "uso recente di cocaina o altre sostanze",
      ],
      requiredExams: [
        "Elettrocardiogramma (ECG) a 12 derivazioni immediato",
        "Dosaggio seriato della troponina",
        "Emocromo, elettroliti, glicemia",
        "Ecocardiogramma (se disponibile in urgenza)",
        "Monitoraggio in area critica / UTIC se quadro suggestivo",
      ],
      unnecessaryExams: [
        "RX Torace come unico esame decisionale",
        "TC Torace senza indicazione specifica",
        "D-Dimero in presenza di quadro tipico coronarico",
        "RM cardiaca in fase iperacuta",
      ],
      legalReference:
        "Linee guida ESC sulle sindromi coronariche acute e normativa sulla gestione del dolore toracico in PS: obbligo di ECG precoce e troponina seriata in presenza di sintomi sospetti.",
    },
  },
  {
    id: "pneumo-1-dispnea-febbre-polmonite",
    specialty: "Pneumologia",
    patientName: "Ahmed",
    patientAge: 47,
    initialMessage:
      "Dottore, da tre giorni ho febbre alta, tosse con catarro giallo e faccio fatica a respirare quando faccio le scale. Oggi mi sento più stanco del solito e ho qualche brivido. Devo preoccuparmi per i polmoni?",
    patientProfile:
      "Uomo di 47 anni, non fumatore, con lieve sovrappeso. Lamenta da 3 giorni febbre fino a 39°C, tosse produttiva con espettorato giallo-verdastro, dolore toracico lieve in sede basale destra accentuato dal respiro profondo e dispnea da sforzo moderato. Non riferisce viaggi recenti, non contatti noti con pazienti tubercolotici. Nessuna terapia cronica rilevante, nessuna cardiopatia nota. Frequenza respiratoria aumentata, lieve tachicardia, saturazione in aria ambiente borderline. Non storia recente di episodi tromboembolici o immobilizzazione prolungata.",
    physicalExam:
      "Parametri vitali: PA 130/80 mmHg, FC 102 bpm, FR 24 atti/min, SpO2 93% in aria ambiente, temperatura 38,5°C. Stato generale: paziente vigile, collaborante, in moderato distress respiratorio con respiro affannoso da sforzo minimo. Torace: all’auscultazione rumori respiratori ridotti alla base destra con crepitii inspiratori fini, murmure vescicolare conservato a sinistra; modesta dolorabilità alla palpazione basale destra. Apparato cardiovascolare: toni cardiaci validi, tachicardici ma ritmici, senza soffi aggiunti. Addome: trattabile, lievemente meteorico, non segni di peritonismo. Estremità calde, non edemi declivi significativi. Nessun deficit neurologico evidente.",
    truth: {
      correctDiagnosis: "Probabile polmonite comunitaria lobare destra con compromissione respiratoria lieve-moderata",
      mandatoryQuestions: [
        "durata di febbre e tosse",
        "caratteristiche dell’espettorato",
        "eventuale presenza di dolore toracico pleuritico",
        "saturazione di ossigeno e dispnea a riposo",
        "patologie respiratorie pregresse (BPCO, asma, bronchiectasie)",
        "eventuali viaggi recenti o ricoveri ospedalieri",
        "allergie note a farmaci, in particolare antibiotici",
        "stato vaccinale per pneumococco e influenza",
        "uso di immunosoppressori o condizioni di immunodeficienza",
      ],
      requiredExams: [
        "Emocromo, PCR/ESR",
        "RX Torace in due proiezioni",
        "Emogasanalisi arteriosa se dispnea rilevante",
        "Emocolture e urinocolture in caso di quadro severo",
        "Tampone virale (es. influenza, SARS-CoV-2) secondo contesto epidemiologico",
      ],
      unnecessaryExams: [
        "TC Torace in prima battuta in quadro tipico non complicato",
        "D-Dimero routinario senza sospetto di embolia polmonare",
        "RM Torace",
        "RX Colonna e bacino non correlati al quadro respiratorio",
      ],
      legalReference:
        "Raccomandazioni internazionali per la gestione della polmonite acquisita in comunità (CAP) e principi di appropriatezza prescrittiva in Pronto Soccorso.",
      examFindings: {
        "Broncoscopia":
          "All’esame broncoscopico si osserva mucosa bronchiale iperemica e congesta, con secrezioni purulente dense che ostruiscono parzialmente i bronchi segmentari del lobo inferiore destro. Non evidenza di lesioni endobronchiali vegetanti o masse endoluminali. Eseguito lavaggio broncoalveolare (BAL) in segmento basale del lobo inferiore destro per esami colturali e citologici.",
        "BAL (Lavaggio broncoalveolare)":
          "Il BAL dal lobo inferiore destro mostra essudato infiammatorio neutrofilo con carica batterica significativa per pneumococco sensibile alla terapia antibiotica in corso; assenza di cellule neoplastiche. Quadro compatibile con polmonite batterica lobare in fase evolutiva.",
      },
    },
  },
  {
    id: "orto-1-frattura-collo-femore",
    specialty: "Ortopedia e Traumatologia",
    patientName: "Lucia",
    patientAge: 83,
    patientSex: "F",
    initialMessage:
      "Dottore, sono caduta in bagno ieri notte. Da allora non riesco più ad appoggiare bene la gamba destra e ho molto dolore all’inguine quando provo a muoverla.",
    patientProfile:
      "Donna di 83 anni, fragilità osteoporotica nota, precedenti cadute ma nessuna frattura maggiore documentata. Vive sola con assistenza domiciliare saltuaria. Caduta a bassa energia in ambiente domestico (bagno) con trauma prevalente sull’emibacino destro. Da allora non riesce a deambulare autonomamente, dolore intenso all’inguine destro e all’anca alla minima mobilizzazione, arto inferiore destro lievemente extraruotato e apparentemente accorciato. Non segni neurologici focali agli arti inferiori, non trauma cranico significativo riferito. Terapia cronica con antiipertensivi e vitamina D.",
    physicalExam:
      "Parametri vitali: PA 135/78 mmHg, FC 88 bpm, FR 18 atti/min, SpO2 97% in aria ambiente, temperatura 36,9°C. Stato generale: paziente vigile, collaborante, in moderato dolore, soprattutto alla mobilizzazione dell’anca destra. Arto inferiore destro: atteggiamento in leggera extrarotazione ed apparente accorciamento rispetto al controlaterale, marcata dolorabilità alla palpazione in sede inguinale e trocanterica, impossibilità al carico e alla mobilizzazione attiva; non deficit sensitivo-motori distali, polsi periferici pedidi presenti e simmetrici. Colonna e resto dello scheletro: nessuna dolorabilità significativa alla palpazione. Torace e addome: nei limiti. Nessun segno di trauma cranico evidente.",
    truth: {
      correctDiagnosis: "Sospetta frattura del collo del femore destro in paziente anziana osteoporotica",
      mandatoryQuestions: [
        "dinamica della caduta e altezza del trauma",
        "possibile perdita di coscienza prima o dopo la caduta",
        "capacità di carico immediatamente dopo l’evento",
        "pregresse fratture o osteoporosi nota",
        "terapia anticoagulante o antiaggregante in corso",
        "dolore in altre sedi (rachide, arto controlaterale)",
        "eventuali patologie cardiache che possano condizionare l’anestesia",
      ],
      requiredExams: [
        "RX Bacino e anca destra",
        "Emocromo, coagulazione, funzionalità renale",
        "RX Torace preoperatorio",
        "Valutazione anestesiologica e ortopedica",
      ],
      unnecessaryExams: [
        "TC Total Body senza indicazione traumatica maggiore",
        "RM Total Body",
        "RX Colonna completa in assenza di dolore rachideo",
      ],
      legalReference:
        "Linee guida per la gestione della frattura di femore nell’anziano e raccomandazioni di tempestività chirurgica per ridurre mortalità e complicanze.",
    },
  },
  {
    id: "neuro-2-ictus-ischemico-acuto",
    specialty: "Neurologia / Stroke Unit",
    patientName: "Franco",
    patientAge: 69,
    patientSex: "M",
    initialMessage:
      "Dottore, da circa un’ora sento il braccio e la gamba destra più deboli e faccio fatica a parlare bene. È iniziato all’improvviso mentre stavo guardando la TV.",
    patientProfile:
      "Uomo di 69 anni, iperteso e diabetico, fumatore pregresso. Riferisce insorgenza improvvisa, circa 60 minuti fa, di debolezza all’arto superiore e inferiore destro con difficoltà ad articolare le parole (disartria). Non cefalea violenta, non trauma cranico recente, non crisi convulsive. Vigile ma lievemente agitato. Pressione arteriosa elevata, glicemia aumentata. Nessun pregresso ictus noto, nessuna terapia anticoagulante in corso. Ultimo tempo noto in buona salute chiaramente riferito.",
    physicalExam:
      "Parametri vitali: PA 180/100 mmHg, FC 92 bpm, FR 18 atti/min, SpO2 98% in aria ambiente, glicemia capillare 210 mg/dL, temperatura 36,7°C. Stato generale: vigile, collaborante ma ansioso, linguaggio impastato con lieve disartria. Esame neurologico: forza ridotta (4/5) a carico di arto superiore e inferiore destro, lieve abbassamento del solco naso-labiale destro, deviazione lievemente asimmetrica del sorriso; sensibilità grossolana conservata, non segni di coinvolgimento dei nervi cranici posteriori. Prove cerebellari compatibili con deficit di forza all’emilato destro. Non segni di meningismo. Torace e apparato cardiovascolare: murmure vescicolare conservato, toni cardiaci ritmici, senza soffi maggiori. Nessun trauma evidente.",
    truth: {
      correctDiagnosis: "Sospetto ictus ischemico in fase acuta in territorio emilaterale sinistro",
      mandatoryQuestions: [
        "orario esatto di insorgenza dei sintomi",
        "ultimo momento in cui il paziente era visto bene",
        "terapie in corso, in particolare anticoagulanti o antiaggreganti",
        "pregressi eventi ischemici cerebrali",
        "eventuali traumi o cadute nelle ultime ore",
        "presenza di fibrillazione atriale nota",
        "valutazione dei fattori di rischio cardiovascolari",
      ],
      requiredExams: [
        "TC Encefalo urgente per escludere emorragia",
        "Eventuale TC o RM perfusionale secondo protocollo di stroke unit",
        "ECG e monitoraggio cardiaco",
        "Esami ematochimici urgenti (coagulazione, glicemia, elettroliti)",
        "Valutazione neurologica con scale NIHSS",
      ],
      unnecessaryExams: [
        "RX Cranio",
        "TC Total Body senza indicazione",
        "RM Total Body",
      ],
      legalReference:
        "Percorsi tempo-dipendenti per l’ictus acuto (stroke code) con obbligo di valutare tempestivamente l’eleggibilità a trombolisi/trombectomia secondo linee guida nazionali e internazionali.",
    },
  },
  {
    id: "gastro-1-addome-acuto-appendicite",
    specialty: "Chirurgia Generale / Gastroenterologia",
    patientName: "Chiara",
    patientAge: 28,
    patientSex: "F",
    initialMessage:
      "Dottore, da ieri ho un forte dolore alla pancia che è iniziato vicino all’ombelico e ora è più in basso a destra. Mi sento anche un po’ nauseata e ho poco appetito.",
    patientProfile:
      "Donna di 28 anni, nessuna patologia cronica nota, ciclo mestruale regolare. Dolore addominale iniziato circa 24 ore fa in sede periombelicale, poi localizzato progressivamente in fossa iliaca destra. Riferisce nausea, inappetenza e sensazione di febbricola, non diarrea importante. Non utilizzo di farmaci cronici, nessuna chirurgia addominale pregressa. Non riferisce flusso mestruale in atto, non sospetta gravidanza ma non ha fatto test. All’esame obiettivo addome dolente in fossa iliaca destra, moderata difesa muscolare.",
    physicalExam:
      "Parametri vitali: PA 120/75 mmHg, FC 94 bpm, FR 18 atti/min, SpO2 99% in aria ambiente, temperatura 37,8°C. Stato generale: paziente vigile, leggermente sofferente, preferisce rimanere supina con ginocchia flesse. Addome: trattabile ma dolente alla palpazione profonda in fossa iliaca destra con moderata difesa muscolare; segno di Blumberg lievemente positivo in sede locale, non diffuso; non segni di peritonite generalizzata. Non organomegalie palpabili, peristalsi presente. Alvo riferito ipostenico ma canalizzato. Non dolorabilità significativa in ipocondri o in altre sedi. Esame obiettivo generale altrimenti nei limiti.",
    truth: {
      correctDiagnosis: "Sospetta appendicite acuta non complicata",
      mandatoryQuestions: [
        "tempo di insorgenza e migrazione del dolore",
        "presenza di nausea, vomito, febbre",
        "alterazioni dell’alvo (diarrea o stipsi)",
        "storia di episodi simili in passato",
        "eventuale chirurgia addominale precedente",
        "possibilità di gravidanza (test o ritardo mestruale)",
        "uso recente di antibiotici o analgesici",
      ],
      requiredExams: [
        "Emocromo e indici di flogosi",
        "Ecografia addome mirata alla fossa iliaca destra (soprattutto in giovane donna)",
        "Eventuale TC addome con contrasto se dubbio diagnostico",
        "Test di gravidanza nelle donne in età fertile",
      ],
      unnecessaryExams: [
        "RM Addome in urgenza senza indicazione specifica",
        "TC Total Body",
        "RX Colonna o bacino",
      ],
      legalReference:
        "Linee guida per la gestione dell’addome acuto e raccomandazioni di appropriatezza nell’uso di imaging in giovane donna in età fertile.",
    },
  },
  {
    id: "psich-1-ideazione-suicidaria",
    specialty: "Psichiatria",
    patientName: "Alessandro",
    patientAge: 35,
    patientSex: "M",
    initialMessage:
      "Dottore, da settimane mi sento completamente svuotato, non dormo bene e oggi ho pensato seriamente che forse sarebbe meglio farla finita.",
    patientProfile:
      "Uomo di 35 anni, impiegato, nessuna patologia organica di rilievo. Riferisce umore depresso, anedonia, insonnia di mantenimento e affaticamento marcato da diverse settimane. Riferisce chiaramente di aver avuto, nelle ultime 24 ore, pensieri concreti di togliersi la vita, senza però descrivere apertamente il metodo. Non abusa di alcol o sostanze secondo la sua dichiarazione, vive da solo dopo una recente separazione conflittuale. Non è in carico ai servizi di salute mentale, non assume farmaci antidepressivi. Non presenza di sintomi psicotici evidenti, orientato ma rallentato psicomotoricamente.",
    physicalExam:
      "Parametri vitali: PA 125/80 mmHg, FC 78 bpm, FR 16 atti/min, SpO2 99% in aria ambiente, temperatura 36,6°C. Stato generale: paziente vigile, orientato, aspetto trascurato, contatto oculare ridotto, eloquio rallentato ma comprensibile. Esame obiettivo internistico: torace e apparato cardiovascolare nei limiti, addome trattabile e non dolente, non segni di patologia organica acuta. Esame neurologico senza deficit focali. Dal punto di vista psichico appare ipoattivo, con umore depresso, ideazione pessimistica, riferisce presenza recente di pensieri suicidari strutturati; non deliri né allucinazioni evidenti durante il colloquio.",
    truth: {
      correctDiagnosis:
        "Episodio depressivo maggiore con ideazione suicidaria attiva e rischio autolesivo significativo",
      mandatoryQuestions: [
        "presenza, durata e intensità dei pensieri suicidari",
        "eventuali piani concreti o metodi di suicidio pensati",
        "precedenti tentativi di suicidio",
        "uso di alcol o sostanze stupefacenti",
        "presenza di rete di supporto familiare o sociale",
        "storia personale o familiare di disturbi psichiatrici",
        "eventuali sintomi psicotici (voci, deliri di colpa)",
      ],
      requiredExams: [
        "Valutazione psichiatrica urgente",
        "Monitoraggio in ambiente protetto se rischio elevato",
        "Esami ematochimici di base per eventuale terapia farmacologica",
      ],
      unnecessaryExams: [
        "TC Encefalo senza segni neurologici",
        "RM Encefalo routinaria in assenza di sospetto organico",
        "RX Torace o addome non correlati al quadro psichiatrico",
      ],
      legalReference:
        "Normativa sulla tutela del paziente psichiatrico a rischio suicidario e criteri per il Trattamento Sanitario Obbligatorio (TSO) in condizioni di pericolo attuale.",
    },
  },
  {
    id: "endocrino-1-chetoacidosi-diabetica",
    specialty: "Endocrinologia / Medicina Interna",
    patientName: "Sofia",
    patientAge: 19,
    patientSex: "F",
    initialMessage:
      "Dottore, da qualche giorno bevo tantissimo e vado in bagno continuamente. Da stamattina ho mal di pancia, nausea e mi sento molto debole.",
    patientProfile:
      "Ragazza di 19 anni, magra, con diabete mellito di tipo 1 diagnosticato da 5 anni. In terapia insulinica basale-bolus ma con aderenza irregolare negli ultimi mesi. Da 3–4 giorni poliuria, polidipsia e calo di peso recente. Da 24 ore nausea, vomito occasionale, dolore addominale diffuso e respiro più frequente. Alito che ricorda l’odore di frutta matura (chetosi). Apparentemente disidratata, tachicardica, respiro di Kussmaul. Non febbre elevata, nessun focolaio infettivo chiaro.",
    physicalExam:
      "Parametri vitali: PA 105/65 mmHg, FC 112 bpm, FR 26 atti/min con respiro di Kussmaul, SpO2 98% in aria ambiente, temperatura 37,2°C. Stato generale: paziente vigile ma astenica, mucose secche, turgore cutaneo ridotto, alito chetonico caratteristico. Apparato cardiovascolare: tachicardia regolare, toni cardiaci validi. Torace: murmure vescicolare conservato bilateralmente, non rantoli. Addome: diffusamente dolente alla palpazione profonda ma senza segni di peritonismo franco, non organomegalie palpabili. Estremità fredde, riempimento capillare lievemente rallentato. Nessun deficit neurologico focale.",
    truth: {
      correctDiagnosis: "Chetoacidosi diabetica in paziente con diabete di tipo 1",
      mandatoryQuestions: [
        "tipo di diabete e durata della malattia",
        "schema insulinico e aderenza alla terapia",
        "valori glicemici degli ultimi giorni",
        "presenza di nausea, vomito, dolore addominale",
        "segni di disidratazione (poliuria, polidipsia, calo ponderale)",
        "eventuali infezioni o stress fisici recenti",
      ],
      requiredExams: [
        "Glicemia capillare e venosa immediata",
        "Emogasanalisi arteriosa (pH, bicarbonati, lattati)",
        "Corpi chetonici su sangue/urine",
        "Elettroliti, azotemia, creatinina",
        "Monitoraggio elettrocardiografico per squilibri elettrolitici",
      ],
      unnecessaryExams: [
        "TC Addome in assenza di segni di addome acuto chirurgico",
        "RX Torace routinario se assenza di sintomi respiratori",
        "RM Encefalo non indicata nella chetoacidosi non complicata",
      ],
      legalReference:
        "Raccomandazioni per la gestione della chetoacidosi diabetica in emergenza e obbligo di monitoraggio intensivo dei parametri vitali e metabolici.",
    },
  },
  {
    id: "nefro-1-colica-renale",
    specialty: "Nefrologia",
    patientName: "Paolo",
    patientAge: 41,
    patientSex: "M",
    initialMessage:
      "Dottore, da circa due ore ho un dolore fortissimo al fianco destro che va e viene, a ondate, e a volte lo sento scendere verso l’inguine. Mi sento anche un po’ nauseato.",
    patientProfile:
      "Uomo di 41 anni, anamnesi positiva per episodi di calcolosi renale in passato. Dolore acuto insorto bruscamente al fianco destro, di tipo colico, con irradiazione al fianco anteriore e all’inguine omolaterale. Si agita e cambia continuamente posizione nel tentativo di trovare sollievo. Riferisce nausea importante, non febbre alta. Non trauma addominale recente. Non terapia cronica significativa. Non riferisce bruciore minzionale marcato, ma talvolta emissione di urine lievemente rosate.",
    physicalExam:
      "Parametri vitali: PA 140/85 mmHg, FC 98 bpm, FR 18 atti/min, SpO2 98% in aria ambiente, temperatura 37,3°C. Stato generale: paziente vigile, agitato, cambia frequentemente posizione sul lettino per il dolore. Addome: trattabile, non segni di peritonismo, dolore riferito soprattutto alla palpazione in fossa lombare destra e lungo il decorso ureterale; segno di Giordano positivo a destra, negativo a sinistra. Non masse palpabili. Genitali esterni nei limiti. Non edemi declivi agli arti inferiori. Esame obiettivo generale altrimenti nella norma.",
    truth: {
      correctDiagnosis: "Probabile colica renale destra da calcolosi ureterale",
      mandatoryQuestions: [
        "caratteristiche del dolore (colico vs continuo)",
        "irradiazione verso inguine o genitale",
        "presenza di ematuria macroscopica o microematuria nota",
        "episodi precedenti di calcolosi",
        "febbre o brividi (sospetto di infezione associata)",
        "disturbi minzionali (stranguria, disuria, ritenzione)",
      ],
      requiredExams: [
        "Esame urine con sedimento",
        "Ecografia reno-vescicale",
        "Eventuale TC addome senza contrasto per calcolosi, se indicato",
        "Creatinina ed elettroliti",
      ],
      unnecessaryExams: [
        "TC Total Body",
        "RM Addome routinaria",
        "RX Colonna lombare se non sospetto rachideo",
      ],
      legalReference:
        "Linee guida per la gestione della colica renale e principi di riduzione dell’esposizione a radiazioni con uso ragionato della TC.",
    },
  },
  {
    id: "cardio-dissezione-aortica",
    specialty: "Cardiologia / Chirurgia Vascolare",
    patientName: "Carlo",
    patientAge: 68,
    patientSex: "M",
    initialMessage:
      "Dottore, da circa un’ora ho un dolore fortissimo al petto che è iniziato all’improvviso e poi è sceso verso la schiena. Sento come se qualcosa si stesse strappando dentro.",
    patientProfile:
      "Uomo di 68 anni, iperteso di lunga data con controllo pressorio irregolare, noto fumatore, possibile sindrome di Marfan non formalmente diagnosticata. Esordio improvviso di dolore toracico severo, descritto come lacerante, con irradiazione interscapolare e al dorso, non modificato da respiro o posizione. PA inizialmente molto elevata, successivamente con possibile differenza tra gli arti superiori. Non storia recente di trauma. Non febbre, non tosse produttiva. Riferisce sensazione di imminente morte.",
    physicalExam:
      "Parametri vitali: PA 190/100 mmHg al braccio destro e 160/90 mmHg al braccio sinistro, FC 105 bpm, FR 24 atti/min, SpO2 97% in aria ambiente, temperatura 36,6°C. Stato generale: paziente agitato, sudato freddo, pallido. Torace: murmure vescicolare globale conservato. Apparato cardiovascolare: toni cardiaci ritmici, presenza di soffio diastolico ad alta frequenza lungo il margine sternale destro, non riferito in anamnesi; polsi periferici leggermente ridotti all’arto superiore sinistro rispetto al destro. Addome: trattabile, non francamente dolente. Esame neurologico: vigile, nessun deficit focale evidente. Nessun segno di edema periferico marcato.",
    truth: {
      correctDiagnosis:
        "Sospetta dissezione acuta dell’aorta toracica con insufficienza aortica associata",
      mandatoryQuestions: [
        "tempo esatto di insorgenza del dolore e modalità di esordio",
        "caratteristiche del dolore (lacerante, migrante, intensità massima all’esordio)",
        "irradiazione del dolore verso dorso, addome o arti inferiori",
        "storia di ipertensione arteriosa e controllo pressorio",
        "eventuali pregressi aneurismi noti o malattie del tessuto connettivo",
        "eventuali episodi sincopali o deficit neurologici transitori associati al dolore",
        "familiarità per dissezione aortica o morte improvvisa in età giovane",
      ],
      requiredExams: [
        "Elettrocardiogramma (ECG) a 12 derivazioni per escludere sindrome coronarica acuta concomitante",
        "TC torace-addome con mezzo di contrasto (angio-TC) urgente per studio dell’aorta",
        "Ecocardiogramma transtoracico/TEE urgente se disponibile",
        "Esami ematochimici di base (emocromo, coagulazione, funzionalità renale)",
        "Monitoraggio pressorio e cardiaco continuo in ambiente ad alta intensità di cura",
      ],
      unnecessaryExams: [
        "RX Torace come unico esame decisionale",
        "TC cranio routinaria senza segni neurologici",
        "RM total body non mirata",
      ],
      legalReference:
        "Linee guida internazionali sulla gestione della dissezione acuta dell’aorta e percorsi tempo-dipendenti per il dolore toracico non coronarico ad alto rischio.",
    },
  },
  {
    id: "pediatria-1-bronchiolite-lattante",
    specialty: "Pediatria / Pneumologia",
    patientName: "Tommaso",
    patientAge: 1,
    patientSex: "M",
    initialMessage:
      "Dottore, è da ieri che il bambino respira più in fretta, fa fatica a bere il latte e ha un po’ di febbre e tosse.",
    patientProfile:
      "Lattante di 12 mesi, nato a termine senza complicanze. Da 48 ore raffreddore, tosse secca evoluta in tosse più produttiva, febbricola e progressiva difficoltà respiratoria con respiro accelerato e lievi rientramenti intercostali. Mangia meno del solito, assume meno liquidi, pannolini meno bagnati. Non patologie croniche note, non cardiopatie congenite. Vaccinazioni in regola. In casa altri fratelli con sintomi simil-influenzali recenti. Al momento lieve dispnea, sibilo diffuso all’auscultazione, saturazione al limite inferiore della norma in aria ambiente.",
    physicalExam:
      "Parametri vitali: PA non valutabile in urgenza, FC 140 bpm, FR 38 atti/min, SpO2 94% in aria ambiente, temperatura 37,9°C. Stato generale: lattante vigile ma irritabile, pianto debole, modesta difficoltà nell’alimentazione. Torace: respiro tachipnoico con lievi rientramenti intercostali e al giugulo, all’auscultazione sibili diffusi e crepitii fini bibasali, murmure vescicolare globalmente ridotto. Cuore: toni validi, tachicardici, senza soffi evidenti. Addome: trattabile, non dolente, fegato palpabile 1–2 cm sotto il margine costale destro (risalita relativa per iperinflazione polmonare). Estremità calde, riempimento capillare lievemente rallentato. Nessun segno di disidratazione grave ma mucose moderatamente secche.",
    truth: {
      correctDiagnosis: "Probabile bronchiolite virale in lattante",
      mandatoryQuestions: [
        "età precisa del bambino e epoca gestazionale alla nascita",
        "durata di febbre, tosse e sintomi respiratori",
        "numero di pannolini bagnati nelle ultime 24 ore (stato di idratazione)",
        "presenza di cardiopatie congenite o patologie respiratorie croniche",
        "eventuale prematurità e necessità di ossigenoterapia neonatale",
        "esposizione a contatti con infezioni respiratorie in famiglia o asilo",
      ],
      requiredExams: [
        "Valutazione clinica respiratoria con saturimetria",
        "Eventuale RX Torace se sospetto complicanze o diagnosi alternative",
        "Emogasanalisi in caso di dispnea moderata-severa",
      ],
      unnecessaryExams: [
        "TC Torace",
        "Emocolture routinarie senza segni di sepsi",
        "Dosaggi virali estesi non mirati",
      ],
      legalReference:
        "Linee guida pediatriche per la gestione della bronchiolite e raccomandazioni sull’uso prudente degli esami radiologici e laboratoristici nel lattante.",
    },
  },
  {
    id: "cardio-2-scompenso-cardiaco-acuto",
    specialty: "Cardiologia",
    patientName: "Giovanni",
    patientAge: 78,
    patientSex: "M",
    initialMessage:
      "Dottore, da qualche giorno mi si gonfiano molto le gambe e faccio fatica a respirare anche solo per andare in bagno. Stanotte mi sono dovuto alzare dal letto perché mi mancava l’aria sdraiato.",
    patientProfile:
      "Uomo di 78 anni, iperteso e con storia di cardiopatia ischemica nota (pregresso infarto miocardico anteriore 6 anni fa). Vive con la moglie, autonomia ridotta nelle attività quotidiane. Riferisce progressivo peggioramento della dispnea negli ultimi 5–7 giorni, inizialmente da sforzo moderato, ora anche per attività minime (NYHA III–IV). Da 3 giorni aumento dell’edema declive a caviglie e gambe, peggiorato alla sera. Riferisce di essersi dovuto alzare dal letto più volte nella notte per sedersi perché “non respirava” in posizione supina (ortopnea, PND). Aderenza alla terapia cardiologica incostante, non monitoraggio regolare del peso corporeo. Nessuna febbre, nessun dolore toracico acuto recente. Anamnesi positiva per fibrillazione atriale parossistica.",
    physicalExam:
      "Parametri vitali: PA 110/70 mmHg, FC 110 bpm irregolare, FR 24 atti/min, SpO2 92% in aria ambiente, temperatura 36,6°C. Stato generale: paziente vigile, lievemente dispnoico a riposo, preferisce posizione seduta a letto, cianosi periferica lieve. Torace: all’auscultazione rantoli crepitanti a piccole bolle bibasali con estensione fino ai campi medi, murmure vescicolare globalmente ridotto, uso lieve dei muscoli accessori. Apparato cardiovascolare: toni cardiaci ovattati, ritmo irregolare, possibile soffio sistolico apicale irradiato all’ascella (sospetta insufficienza mitralica funzionale); giugulari turgide a 45°. Addome: lievemente teso, fegato palpabile 3 cm sotto il margine costale destro, dolorabile alla palpazione (stasi epatica). Arti inferiori: edemi declivi bilaterali +++ con impronta, cute fredda e lucida alle gambe. Riempimento capillare rallentato. Non segni di trombosi venosa profonda evidente.",
    truth: {
      correctDiagnosis:
        "Scompenso cardiaco acuto su cardiopatia ischemica cronica con fibrillazione atriale e congestione polmonare",
      mandatoryQuestions: [
        "durata e progressione della dispnea (da sforzo, a riposo, ortopnea, PND)",
        "aderenza alla terapia cardiologica (diuretici, ACE-inibitori, beta-bloccanti)",
        "precedenti ricoveri per scompenso cardiaco",
        "monitoraggio del peso corporeo e variazioni recenti",
        "presenza di dolore toracico recente o palpitazioni",
        "presenza di febbre, tosse produttiva o altri segni di infezione",
        "abitudine alcolica e assunzione di FANS o farmaci che possono peggiorare lo scompenso",
      ],
      requiredExams: [
        "Elettrocardiogramma (ECG) a 12 derivazioni",
        "RX Torace per valutare congestione polmonare e cardiomegalia",
        "Emocromo, elettroliti, funzionalità renale",
        "BNP/NT-proBNP",
        "Ecocardiogramma per valutazione funzione sistolica e valvolare",
      ],
      unnecessaryExams: [
        "TC Torace in assenza di sospetto di embolia polmonare o altra patologia strutturale",
        "RM cardiaca in fase iperacuta",
        "D-Dimero routinario senza sospetto di TEV",
      ],
      legalReference:
        "Linee guida ESC per la gestione dello scompenso cardiaco acuto e raccomandazioni di triage in area critica per pazienti con dispnea a riposo e congestione polmonare; il mancato riconoscimento di uno scompenso avanzato può configurare responsabilità professionale per ritardo diagnostico-terapeutico.",
    },
  },
  {
    id: "gastro-2-diverticolite-complicata",
    specialty: "Chirurgia Generale / Gastroenterologia",
    patientName: "Rosa",
    patientAge: 72,
    patientSex: "F",
    initialMessage:
      "Dottore, da due giorni ho un forte dolore nella parte bassa sinistra della pancia, ho un po’ di febbre e mi sento molto gonfia. Da stamattina quasi non riesco più a mangiare.",
    patientProfile:
      "Donna di 72 anni, anamnesi positiva per diverticolosi sigma nota da anni e episodi pregressi di diverticolite non complicata trattati a domicilio. Ipertensione arteriosa in terapia, lieve insufficienza renale cronica. Dolore addominale insorto 48 ore fa in fossa iliaca sinistra, gradualmente peggiorato, descritto come continuo e profondo; riferisce febbre fino a 38,5°C, alvo ipostenico ma ancora canalizzato, nessun sangue visibile nelle feci. Lamenta sensazione di gonfiore addominale e nausea, riduzione importante dell’introito alimentare nelle ultime 24 ore. Nessun vomito biliare o fecaloide, nessun trauma recente. Non interventi chirurgici addominali maggiori in passato.",
    physicalExam:
      "Parametri vitali: PA 135/80 mmHg, FC 102 bpm, FR 20 atti/min, SpO2 97% in aria ambiente, temperatura 38,3°C. Stato generale: paziente vigile, sofferente, preferisce posizione supina con gambe lievemente flesse. Addome: trattabile ma molto dolente alla palpazione profonda in fossa iliaca sinistra e in ipogastrio, con difesa muscolare locale; Blumberg positivo localmente ma non diffuso, non segni di peritonite generalizzata. Murmure intestinale ridotto ma presente. Non masse palpabili chiare; lieve timpanismo diffuso. Esame obiettivo generale: lieve tachicardia, mucose discretamente idratate, nessun ittero, nessun segno di scompenso cardiaco acuto. Esame rettale: non sangue rosso vivo, feci scure non catramose.",
    truth: {
      correctDiagnosis: "Sospetta diverticolite acuta del sigma con possibile complicanza (ascesso/perforazione microperforata)",
      mandatoryQuestions: [
        "storia di diverticolosi o episodi precedenti di diverticolite",
        "durata, sede e caratteristiche del dolore addominale",
        "presenza di febbre, brividi o peggioramento dei sintomi",
        "alterazioni dell’alvo (stipsi, diarrea, emissione di sangue)",
        "uso recente di FANS o corticosteroidi",
        "eventuali interventi chirurgici addominali pregressi",
        "presenza di nausea, vomito o segni di occlusione",
      ],
      requiredExams: [
        "Emocromo, PCR e indici di flogosi",
        "TC Addome con mezzo di contrasto per valutare eventuali complicanze",
        "Funzionalità renale ed elettroliti",
        "Valutazione chirurgica in caso di segni di complicanza",
      ],
      unnecessaryExams: [
        "Colonscopia in fase acuta",
        "RM Addome routinaria",
        "RX Addome in bianco come unico esame decisionale",
      ],
      legalReference:
        "Raccomandazioni sulla gestione della diverticolite acuta complicata e indicazioni alla TC addome con contrasto per definire l’approccio conservativo vs chirurgico; omissioni diagnostiche o ritardi nel riconoscimento della perforazione possono configurare profili di colpa per mancata aderenza alle linee guida.",
    },
  },
  {
    id: "medint-2-scompenso-cardiaco-cronico-riacutizzato",
    specialty: "Medicina Interna",
    patientName: "Angelo",
    patientAge: 82,
    patientSex: "M",
    initialMessage:
      "Dottore, da qualche settimana mi si gonfiano sempre di più le gambe e adesso faccio fatica a fare pochi passi senza fermarmi per prendere fiato. La notte devo mettere due o tre cuscini perché sdraiato mi manca l’aria.",
    patientProfile:
      "Uomo di 82 anni, anamnesi positiva per cardiopatia ischemica cronica con precedente infarto miocardico, ipertensione arteriosa di lunga data e fibrillazione atriale permanente. Vive con la moglie, autonomia parzialmente ridotta. In terapia cronica con diuretico, ACE-inibitore, beta-bloccante e anticoagulante orale, ma riferisce aderenza irregolare alla terapia negli ultimi mesi. Da circa 3–4 settimane progressivo peggioramento della dispnea da sforzo, con ridotta tolleranza allo sforzo (da NYHA II a NYHA III), marcato aumento dell’edema declive a caviglie e gambe soprattutto la sera, lieve aumento di peso riferito. Negli ultimi giorni comparsa di ortopnea e parossismi di dispnea notturna che lo costringono a sedersi sul letto. Non dolore toracico acuto, non febbre, non tosse produttiva significativa. Non recente infezione respiratoria nota.",
    physicalExam:
      "Parametri vitali: PA 125/75 mmHg, FC 92 bpm irregolare, FR 20 atti/min, SpO2 95% in aria ambiente, temperatura 36,6°C. Stato generale: paziente vigile, orientato, in lieve-moderato affanno a riposo ma stabile, preferisce posizione semiseduta. Torace: rantoli crepitanti fini bibasali, murmure vescicolare conservato ai campi superiori, non sibili diffusi. Apparato cardiovascolare: toni cardiaci ovattati, ritmo assolutamente aritmico da fibrillazione atriale, possibile soffio olosistolico apicale irradiato all’ascella (insufficienza mitralica funzionale); giugulari moderatamente turgide a 45°. Addome: lievemente globoso, fegato palpabile 2–3 cm sotto il margine costale destro, modestamente dolorabile (stasi epatica), non ascite tesa. Arti inferiori: edemi declivi bilaterali con impronta fino alle ginocchia, cute fredda e lucida alle gambe. Non segni clinici di trombosi venosa profonda.",
    truth: {
      correctDiagnosis:
        "Scompenso cardiaco cronico sistolico in riacutizzazione congestizia in paziente anziano con cardiopatia ischemica e fibrillazione atriale",
      mandatoryQuestions: [
        "durata e progressione della dispnea (da sforzo, a riposo, ortopnea, PND)",
        "aderenza alla terapia cronica per lo scompenso cardiaco (diuretici, ACE-inibitori, beta-bloccanti, antagonisti recettoriali)",
        "monitoraggio del peso corporeo e variazioni recenti",
        "presenza di ricoveri precedenti per scompenso cardiaco",
        "presenza di dolore toracico recente o palpitazioni marcate",
        "abitudine alcolica e uso di FANS o altri farmaci che possono peggiorare lo scompenso",
        "presenza di sintomi suggestivi per infezione respiratoria o anemia (tosse produttiva, febbre, astenia marcata recente)",
      ],
      requiredExams: [
        "Elettrocardiogramma (ECG) a 12 derivazioni",
        "RX Torace in due proiezioni per valutare congestione polmonare e cardiomegalia",
        "Emocromo, elettroliti, funzionalità renale ed epatica",
        "BNP/NT-proBNP",
        "Ecocardiogramma transtoracico per valutare funzione ventricolare e valvolare",
        "Esame urine completo (ricerca proteinuria, valutazione stato volumetrico)",
      ],
      unnecessaryExams: [
        "TC Torace in assenza di sospetto di embolia polmonare o altra patologia strutturale",
        "Angio-TC aorta toraco-addominale senza segni specifici di sindrome aortica acuta",
        "RM cardiaca di routine in fase di prima valutazione ambulatoriale",
      ],
      legalReference:
        "Linee guida ESC per lo scompenso cardiaco cronico: importanza della valutazione ambulatoriale programmata, dell’ottimizzazione della terapia e del monitoraggio dei segni di congestione; la mancata identificazione di una riacutizzazione significativa con necessità di adeguamento terapeutico può configurare profili di responsabilità per gestione inappropriata.",
    },
  },
  {
    id: "endo-2-diabete-tipo2-nuova-insorgenza",
    specialty: "Endocrinologia",
    patientName: "Silvia",
    patientAge: 52,
    patientSex: "F",
    initialMessage:
      "Dottore, da qualche mese ho sempre sete, bevo continuamente e vado in bagno a urinare di frequente, anche di notte. Ho perso diversi chili senza fare diete particolari.",
    patientProfile:
      "Donna di 52 anni, lieve sovrappeso (BMI 28), familiarità per diabete mellito di tipo 2 (madre e fratello), ipertensione arteriosa trattata. Nessuna diagnosi pregressa di diabete, non terapia ipoglicemizzante in atto. Riferisce da 3–4 mesi polidipsia marcata con assunzione di grandi quantità di acqua, poliuria diurna e notturna (nicturia), calo ponderale di circa 6–7 kg in pochi mesi non intenzionale, aumento della fame iniziale poi senso di facile affaticabilità. Lamenta secchezza delle fauci, lieve prurito cutaneo, visione sfocata saltuaria. Non episodi di nausea o vomito, non dolore addominale acuto, non alito chetonico evidente. Non infezioni urinarie o vaginali ricorrenti note, ma lieve prurito vulvare negli ultimi tempi. Vita sedentaria, alimentazione ricca di carboidrati semplici.",
    physicalExam:
      "Parametri vitali: PA 135/80 mmHg, FC 82 bpm, FR 16 atti/min, SpO2 98% in aria ambiente, temperatura 36,7°C. Stato generale: paziente vigile, collaborante, in condizioni emodinamicamente stabili, modesto sovrappeso con lieve adiposità addominale centrale. Cute e mucose: mucose orali moderatamente secche, cute lievemente secca con occasionali escoriazioni da grattamento a livello degli arti inferiori. Apparato cardiovascolare: toni cardiaci validi, ritmici, senza soffi evidenti. Torace: murmure vescicolare conservato bilateralmente, non rantoli. Addome: trattabile, non dolorabile, non organomegalie palpabili marcate. Arti inferiori: polsi periferici presenti e simmetrici, assenza di edemi, sensibilità conservata ai test grossolani; non segni di piede diabetico.",
    truth: {
      correctDiagnosis:
        "Sospetto diabete mellito di tipo 2 di nuova insorgenza con sintomi classici (poliuria, polidipsia, calo ponderale)",
      mandatoryQuestions: [
        "presenza di poliuria, polidipsia, polifagia e calo ponderale, con indicazione temporale",
        "familiarità per diabete mellito o malattie metaboliche",
        "abitudini alimentari (introito di zuccheri semplici, bevande zuccherate, alcol)",
        "livello di attività fisica e stile di vita",
        "presenza di infezioni urinarie, genitali o cutanee ricorrenti",
        "uso di farmaci iperglicemizzanti (corticosteroidi, diuretici tiazidici, antipsicotici)",
        "eventuali sintomi suggestivi di complicanze già presenti (formicolii ai piedi, riduzione della vista)",
      ],
      requiredExams: [
        "Glicemia a digiuno ripetuta",
        "Emoglobina glicata (HbA1c)",
        "Curva da carico orale di glucosio (OGTT) se indicata",
        "Esame urine completo con ricerca di glicosuria e chetonuria",
        "Profilo lipidico completo",
        "Funzionalità renale (creatininemia, eGFR) e elettroliti",
        "Microalbuminuria urinaria (rapporto albumina/creatinina)",
      ],
      unnecessaryExams: [
        "TC Addome o RM Addome senza sospetto di complicanze acute",
        "Dosaggi ormonali complessi non mirati in prima battuta",
        "Esami radiologici non correlati (RX Torace, RX Colonna) in assenza di altri sintomi",
      ],
      legalReference:
        "Linee guida per la diagnosi e il follow-up del diabete mellito di tipo 2: la corretta conferma diagnostica e la valutazione iniziale delle complicanze micro- e macrovascolari sono essenziali per una presa in carico adeguata; omissioni significative possono comportare ritardi terapeutici con possibile responsabilità professionale.",
    },
  },
  {
    id: "infettivo-1-polmonite-comunitaria-adulto",
    specialty: "Malattie Infettive / Pneumologia",
    patientName: "Roberto",
    patientAge: 60,
    patientSex: "M",
    initialMessage:
      "Dottore, da cinque giorni ho febbre alta, tosse con catarro giallo-verde e quando respiro profondamente ho un dolore forte al fianco destro.",
    patientProfile:
      "Uomo di 60 anni, ex fumatore (20 pacchetti/anno), iperteso in terapia, nessuna broncopneumopatia cronica ostruttiva diagnosticata. Da 5 giorni febbre fino a 39°C, brividi, tosse produttiva con espettorato giallo-verdastro, dolore toracico puntorio in emitorace destro accentuato dall’inspirazione profonda e dalla tosse, dispnea moderata agli sforzi abituali (fare le scale, camminare a passo sostenuto). Non recente ricovero ospedaliero, nessun uso recente di antibiotici. Non viaggi internazionali nelle ultime settimane. Nessun contatto noto con pazienti tubercolotici. Non perdita di coscienza o emoftoe, non sintomi gastrointestinali rilevanti.",
    physicalExam:
      "Parametri vitali: PA 130/80 mmHg, FC 98 bpm, FR 22 atti/min, SpO2 94% in aria ambiente, temperatura 38,5°C. Stato generale: paziente vigile, leggermente sofferente, in moderato distress respiratorio da sforzo ma emodinamicamente stabile. Torace: all’auscultazione murmure vescicolare ridotto alla base destra con crepitii inspiratori fini e possibile sfregamento pleurico, normale a sinistra; dolore alla palpazione e alla compressione toracica in sede basale destra. Apparato cardiovascolare: toni cardiaci ritmici, tachicardici ma senza soffi patologici. Addome: trattabile, non dolente, peristalsi presente. Estremità calde, non edemi declivi significativi.",
    truth: {
      correctDiagnosis:
        "Polmonite acquisita in comunità (CAP) lobare destra in adulto emodinamicamente stabile",
      mandatoryQuestions: [
        "durata della febbre, tosse e sintomi respiratori",
        "caratteristiche dell’espettorato (colore, quantità, eventuale sangue)",
        "presenza di dolore toracico pleuritico e gravità della dispnea",
        "patologie respiratorie pregresse (BPCO, asma, bronchiectasie)",
        "eventuali ricoveri recenti o terapie antibiotiche negli ultimi 3 mesi",
        "abitudine al fumo e stato vaccinale per pneumococco e influenza",
        "eventuali condizioni di immunodeficienza o terapie immunosoppressive",
      ],
      requiredExams: [
        "Emocromo con formula, PCR e/o VES",
        "RX Torace in due proiezioni",
        "Emogasanalisi arteriosa se dispnea rilevante o saturazione borderline",
        "Esame urine completo ed eventualmente antigeni urinari per pneumococco/legionella",
        "Emocolture in caso di febbre elevata o brividi scuotenti",
        "Tampone respiratorio o naso-faringeo per virus respiratori secondo contesto epidemiologico",
      ],
      unnecessaryExams: [
        "TC Torace ad alta risoluzione in prima battuta in quadro tipico non complicato",
        "D-Dimero routinario in assenza di sospetto clinico di embolia polmonare",
        "RM Torace o TC Total Body non mirate",
      ],
      legalReference:
        "Raccomandazioni internazionali per la gestione della polmonite acquisita in comunità (CAP) in setting non intensivo: la scelta corretta degli esami diagnostici e la valutazione di gravità (es. score CURB-65) sono fondamentali per definire sede di trattamento e terapia; errori grossolani di inquadramento possono configurare responsabilità per gestione inappropriata.",
    },
  },
  {
    id: "gastro-3-ibd-sospetta-giovane-adulto",
    specialty: "Gastroenterologia",
    patientName: "Matteo",
    patientAge: 27,
    patientSex: "M",
    initialMessage:
      "Dottore, da diversi mesi ho diarrea con sangue e muco, mal di pancia quasi tutti i giorni e mi sento sempre più stanco.",
    patientProfile:
      "Giovane uomo di 27 anni, senza patologie croniche note, non fumatorе, nessun intervento chirurgico addominale pregresso. Da circa 6–8 mesi lamenta diarrea cronica con 4–6 scariche al giorno, spesso con presenza di muco e striature di sangue rosso vivo nelle feci; riferisce dolore addominale crampiforme prevalente in fossa iliaca sinistra e ipogastrio, che migliora parzialmente dopo l’evacuazione. Riporta calo ponderale di circa 5 kg, astenia marcata, talora tenesmo rettale. Non febbre elevata, ma episodici rialzi subfebbrili serali. Nessun recente viaggio in paesi a rischio infettivo, nessun uso prolungato di antibiotici. Familiarità positiva per malattia infiammatoria cronica intestinale (IBD) in un cugino di primo grado.",
    physicalExam:
      "Parametri vitali: PA 120/70 mmHg, FC 84 bpm, FR 16 atti/min, SpO2 99% in aria ambiente, temperatura 37,3°C. Stato generale: paziente vigile, magro, lievemente pallido, emodinamicamente stabile. Addome: trattabile, lievemente meteorico, dolente alla palpazione profonda in fossa iliaca sinistra e in ipogastrio, senza segni di peritonismo; rumori intestinali presenti, talora vivaci. Non organomegalie palpabili evidenti. Esplorazione rettale (se eseguita): possibile presenza di muco e tracce di sangue rosso vivo. Cute e mucose: lieve pallore cutaneo-mucoso, non ittero. Arti inferiori: assenza di edemi, non segni di trombosi venosa profonda.",
    truth: {
      correctDiagnosis:
        "Sospetta malattia infiammatoria cronica intestinale (probabile rettocolite ulcerosa) in giovane adulto con diarrea cronica muco-ematica",
      mandatoryQuestions: [
        "durata esatta della diarrea e numero di scariche quotidiane",
        "presenza di sangue e muco nelle feci e caratteristiche dell’evacuazione (tenesmo, urgenza)",
        "calo ponderale e riduzione dell’appetito",
        "familiarità per IBD, celiachia o altre malattie autoimmuni",
        "episodi di febbre, artralgie, aftosi orale o manifestazioni cutanee (eritema nodoso, pioderma gangrenoso)",
        "uso cronico di FANS, antibatterici o altri farmaci potenzialmente lesivi per la mucosa intestinale",
        "storia di viaggi recenti, cambiamenti dietetici drastici o infezioni gastrointestinali acute precedenti",
      ],
      requiredExams: [
        "Emocromo completo con valutazione per anemia e leucocitosi",
        "Assetto ferro (ferritina, sideremia, transferrina) e vitamina B12/folati",
        "PCR, VES e indici di flogosi",
        "Esame feci con coprocoltura, ricerca parassiti e Clostridioides difficile",
        "Calprotectina fecale",
        "Colonscopia",
        "TC Addome con mezzo di contrasto o RM enterografia in caso di dubbio diagnostico o complicanze",
      ],
      unnecessaryExams: [
        "RX Addome in bianco routinario in assenza di segni di occlusione o perforazione",
        "TC Total Body senza indicazione specifica",
        "Endoscopie ripetute troppo precocemente senza indicazione clinica",
      ],
      legalReference:
        "Linee guida per la diagnosi di IBD: la mancata esecuzione di colonscopia con biopsie in presenza di diarrea cronica muco-ematica e calprotectina elevata può configurare ritardo diagnostico; attenzione all’uso appropriato di TC Addome con mezzo di contrasto per la valutazione delle complicanze, con corretta informazione sui rischi del contrasto iodato.",
      examFindings: {
        "Colonscopia":
          "All’esame endoscopico si osserva mucosa del retto e del colon distale eritematosa, friabile al contatto, con perdita del pattern vascolare, erosioni superficiali multiple e pseudopolipi infiammatori sparsi. Le lesioni sono continue a partire dal retto senza aree di mucosa sana interposta. Vengono effettuate biopsie multiple da retto e colon sinistro per conferma istologica di malattia infiammatoria cronica intestinale.",
      },
    },
  },
  {
    id: "emato-1-anemia-sideropenica-da-indagare",
    specialty: "Ematologia",
    patientName: "Laura",
    patientAge: 48,
    patientSex: "F",
    initialMessage:
      "Dottore, da qualche mese mi sento sempre stanca, faccio fatica a fare le scale e mi dicono che sono molto pallida. Mi si spezzano facilmente le unghie e mi cadono più capelli del solito.",
    patientProfile:
      "Donna di 48 anni, impiegata, non fumatrice. Da diversi mesi lamenta astenia marcata, ridotta tolleranza allo sforzo (affanno nel salire una rampa di scale), palpitazioni saltuarie e cefalea tensiva; riferisce pallore progressivo notato dai familiari. Riporta fragilità delle unghie, capelli più sottili e caduta aumentata. Cicli mestruali riferiti come abbondanti (menorragia) negli ultimi anni, senza però valutazione ginecologica recente. Non perdita di peso significativa, non dolore addominale importante, alvo tendenzialmente regolare senza sangue macroscopico nelle feci. Nessuna dieta vegetariana o vegana stretta, ma alimentazione povera di carne rossa. Nessuna patologia cronica nota, nessuna terapia cronica di rilievo, saltuaria assunzione di FANS per dismenorrea.",
    physicalExam:
      "Parametri vitali: PA 120/75 mmHg, FC 88 bpm, FR 16 atti/min, SpO2 99% in aria ambiente, temperatura 36,5°C. Stato generale: paziente vigile, collaborante, pallida ma emodinamicamente stabile. Cute e mucose: marcato pallore cutaneo-mucoso, unghie fragili con tendenza allo sfaldamento, capelli radi e opachi, possibile glossite lieve (lingua arrossata e liscia). Apparato cardiovascolare: toni cardiaci validi, ritmo regolare, lieve tachicardia sinusale da sforzo minimo. Torace: murmure vescicolare conservato, non rantoli. Addome: trattabile, non dolorabile, non epatosplenomegalia palpabile evidente. Esame rettale differito al percorso di approfondimento in base alla sospetta origine della carenza di ferro.",
    truth: {
      correctDiagnosis:
        "Anemia sideropenica da indagare in donna adulta con verosimile perdite croniche (menorragia) e carenza marziale",
      mandatoryQuestions: [
        "durata dei sintomi (astenia, dispnea da sforzo, palpitazioni)",
        "andamento e quantità del flusso mestruale (menorragia, metrorragia)",
        "eventuali sanguinamenti occulti o manifesti (melena, ematochezia, epistassi, gengivorragie)",
        "abitudini alimentari (apporto di ferro nella dieta, eventuale dieta vegetariana/vegana)",
        "uso cronico di FANS, anticoagulanti o antiaggreganti",
        "storia di patologie gastrointestinali (celiachia, gastrite cronica, pregressa chirurgia gastrointestinale)",
        "familiarità per anemie ereditarie o emoglobinopatie",
      ],
      requiredExams: [
        "Emocromo completo con indici eritrocitari (MCV, MCH, RDW)",
        "Assetto marziale (ferritina, sideremia, transferrina, saturazione della transferrina)",
        "Vitamina B12 e folati",
        "Esame periferico dello striscio di sangue",
        "Esame urine completo (ricerca microematuria)",
        "Ricerca sangue occulto nelle feci su più campioni",
        "EGDS (Endoscopia digestiva alta)",
        "Colonscopia",
      ],
      unnecessaryExams: [
        "TC Total Body di screening senza indicazioni specifiche",
        "Esami di coagulazione allargati in assenza di storia di coagulopatie o sanguinamenti maggiori",
        "Dosaggi di markers tumorali non mirati come primo step diagnostico",
      ],
      legalReference:
        "Raccomandazioni per la gestione dell’anemia sideropenica nell’adulto: la semplice prescrizione di ferro senza ricerca della causa sottostante, soprattutto in età non più giovanile, può configurare ritardo diagnostico per patologie gravi (es. neoplasie gastrointestinali); è necessario un percorso di approfondimento strutturato.",
      examFindings: {
        "EGDS (Endoscopia digestiva alta)":
          "EGDS nei limiti: mucosa esofagea e gastrica senza lesioni sanguinanti né ulcere attive, bulbo e seconda porzione duodenale regolari. Nessun reperto che giustifichi perdite ematiche croniche significative.",
        Colonscopia:
          "Colonscopia fino al cieco: a livello del colon ascendente si evidenzia una formazione vegetante e ulcerata, a base ampia, che occupa circa metà del lume, facilmente sanguinante al contatto. Mucosa circostante ispessita, senza altre lesioni macroscopiche evidenti nel resto del colon e del retto. Eseguite biopsie multiple sulla lesione e marcatura con inchiostro per eventuale riferimento chirurgico.",
      },
    },
  },
  {
    id: "reuma-1-artrite-reumatoide-esordio",
    specialty: "Reumatologia",
    patientName: "Caterina",
    patientAge: 45,
    patientSex: "F",
    initialMessage:
      "Dottore, da qualche mese al mattino ho le mani molto rigide e gonfie, faccio fatica ad aprirle e ci mettono più di un’ora per sbloccarsi.",
    patientProfile:
      "Donna di 45 anni, impiegata, non fumatrice. Da circa 6 mesi riferisce dolore e tumefazione alle piccole articolazioni delle mani (metacarpo-falangee e interfalangee prossimali) e ai polsi, con rigidità mattutina prolungata superiore a 60 minuti che migliora nel corso della mattinata. Episodi di dolore articolare anche a ginocchia e piedi, con possibile difficoltà a camminare appena alzata. Riferisce astenia, lieve calo di peso involontario, sensazione di ‘stanchezza generale’. Non febbre elevata, non recenti infezioni importanti. Nessuna diagnosi reumatologica pregressa, ma familiarità positiva per malattie autoimmuni (tiroidite autoimmune nella madre). Non uso cronico di cortisonici, saltuaria assunzione di FANS con miglioramento parziale.",
    physicalExam:
      "Parametri vitali: PA 118/72 mmHg, FC 78 bpm, FR 14 atti/min, SpO2 99% in aria ambiente, temperatura 36,6°C. Stato generale: paziente vigile, collaborante, normopeso. Apparato muscolo-scheletrico: tumefazione e dolorabilità alla palpazione delle articolazioni metacarpo-falangee e interfalangee prossimali di entrambe le mani, con modesto aumento del calore locale; range di movimento ridotto per dolore nelle prime ore del mattino, migliorato parzialmente al momento della visita. Polsi lievemente dolenti alla palpazione, senza importante versamento. Non deformità articolari strutturate, non deviazioni ulnari; piedi con lieve dolorabilità alle metatarso-falangee. Non rash cutanei tipici di connettiviti sistemiche. Resto dell’esame obiettivo generale nei limiti.",
    truth: {
      correctDiagnosis:
        "Quadro compatibile con artrite reumatoide all’esordio con interessamento simmetrico delle piccole articolazioni delle mani",
      mandatoryQuestions: [
        "durata della rigidità mattutina e tempo necessario per migliorare",
        "sedi articolari coinvolte e simmetria del coinvolgimento",
        "presenza di dolore notturno e di risveglio articolare",
        "familiarità per malattie reumatologiche o autoimmuni",
        "presenza di manifestazioni extra-articolari (astenia marcata, febbricola, secchezza oculare/orale, rash cutanei)",
        "precedente risposta a FANS o corticosteroidi",
        "eventuali infezioni recenti o fattori scatenanti",
      ],
      requiredExams: [
        "Emocromo, VES e PCR",
        "Fattore reumatoide (FR) e anticorpi anti-CCP",
        "Ricerca autoanticorpi (ANA di base)",
        "Funzionalità renale ed epatica in vista di eventuale terapia di fondo (DMARD)",
        "RX mani e piedi in proiezioni standard per valutare erosioni iniziali",
        "Ecografia articolare o RM articolare mirata se RX non conclusiva ma quadro clinico suggestivo",
      ],
      unnecessaryExams: [
        "TC Total Body o RM Total Body senza indicazione",
        "Dosaggi estesi di markers tumorali in assenza di sintomi di allarme specifici",
        "Biopsie sinoviali routinarie in fase di primo inquadramento clinico-strumentale",
      ],
      legalReference:
        "Linee guida per la diagnosi precoce di artrite reumatoide: il riconoscimento e l’invio tempestivo a valutazione specialistica reumatologica per avviare una terapia di fondo (DMARD) entro la ‘finestra di opportunità’ sono essenziali per prevenire danni articolari permanenti; ritardi prolungati possono configurare profili di responsabilità per mancata diagnosi tempestiva.",
    },
  },
  {
    id: "psich-2-psicosi-acuta-con-agitazione",
    specialty: "Psichiatria",
    patientName: "Federico",
    patientAge: 29,
    patientSex: "M",
    initialMessage:
      "Dottore, tutti mi stanno spiando, anche voi. Sento delle voci che mi dicono che devo difendermi, non posso più fidarmi di nessuno.",
    patientProfile:
      "Uomo di 29 anni, single, vive con i genitori. Anamnesi psichiatrica positiva per episodio psicotico acuto due anni prima, trattato con ricovero in SPDC e terapia antipsicotica protratta per alcuni mesi, poi sospesa autonomamente. Nei giorni precedenti progressivo isolamento sociale, riduzione del sonno, comparsa di idee di persecuzione centrate sui vicini di casa e sui colleghi. Da 24–48 ore comparsa di allucinazioni uditive imperative con voci che lo insultano e lo spingono a “difendersi”. I familiari riportano aumento dell’agitazione psicomotoria, frasi sconnesse e comportamenti bizzarri. Non abuso noto di sostanze, ma consumo occasionale di cannabis in passato. Nessuna patologia organica acuta nota.",
    physicalExam:
      "Parametri vitali: PA 130/80 mmHg, FC 96 bpm, FR 18 atti/min, SpO2 99% in aria ambiente, temperatura 36,8°C. Stato generale: paziente vigile ma scarsamente collaborante, agitato, con contatto oculare a tratti sfuggente; eloquio disorganizzato, spesso interrotto dall’ascolto di voci interne. Esame obiettivo internistico nella norma: torace e apparato cardiovascolare senza rilievi patologici acuti, addome trattabile, non segni di trauma. Esame neurologico orientativo privo di deficit focali. Dal punto di vista psichico: ideazione delirante di tipo persecutorio, allucinazioni uditive imperative, rischio potenziale di etero/aggressività e scarsa consapevolezza di malattia.",
    truth: {
      correctDiagnosis:
        "Episodio psicotico acuto con ideazione persecutoria e allucinazioni uditive imperative, rischio di etero/aggressività",
      mandatoryQuestions: [
        "storia psichiatrica pregressa (diagnosi, ricoveri, terapie)",
        "uso attuale o recente di sostanze (alcol, cannabis, cocaina, amfetamine)",
        "presenza di allucinazioni uditive imperative e contenuto delle voci",
        "presenza di idee di riferimento o deliri di persecuzione strutturati",
        "rischio di autolesionismo o etero/aggressività",
        "aderenza alla terapia psicofarmacologica e follow-up psichiatrico",
        "eventuale familiarità per disturbi psicotici",
      ],
      requiredExams: [
        "Valutazione psichiatrica urgente in PS",
        "Screening tossicologico su urine o sangue",
        "Esami ematochimici di base (emocromo, elettroliti, funzionalità epatica e renale)",
        "Eventuale ECG prima di terapia antipsicotica ad alto dosaggio",
      ],
      unnecessaryExams: [
        "TC o RM Encefalo in assenza di segni neurologici o sospetto di causa organica",
        "RX Torace o addome routinari senza indicazione",
      ],
      legalReference:
        "Normativa sul Trattamento Sanitario Obbligatorio (TSO) in presenza di grave alterazione psichica con rischio per sé e per gli altri e rifiuto delle cure; la mancata attivazione di percorsi protetti in caso di rischio etero- o auto-aggressivo può costituire grave inadempienza agli obblighi di tutela.",
    },
  },
  {
    id: "neuro-3-crisi-epilettica-prima-diagnosi",
    specialty: "Neurologia / Medicina d'Urgenza",
    patientName: "Elena",
    patientAge: 32,
    patientSex: "F",
    initialMessage:
      "Dottore, mi hanno detto che ho avuto una crisi convulsiva mentre ero al lavoro. Io non ricordo quasi nulla, solo che mi sono svegliata molto stanca e confusa.",
    patientProfile:
      "Donna di 32 anni, impiegata, senza patologie croniche note. Non anamnesi di epilessia nota, nessuna terapia anticonvulsivante in corso. Riferito da colleghi un episodio improvviso di irrigidimento seguito da scosse tonico-cloniche generalizzate di alcuni minuti, con caduta a terra e morsicatura laterale della lingua; perdita di coscienza completa, incontinenza sfinterica riferita. Tempo di recupero prolungato con stato confusionale post-critico di circa 20–30 minuti. Nessun trauma cranico recente noto prima dell’evento, ma possibile impatto sul suolo durante la caduta. Nessun consumo abituale di alcol in eccesso, uso sporadico di caffeina, nessun uso noto di sostanze illecite. Ciclo mestruale regolare, nessuna gravidanza in corso.",
    physicalExam:
      "Parametri vitali: PA 125/78 mmHg, FC 88 bpm, FR 18 atti/min, SpO2 99% in aria ambiente, temperatura 36,8°C. Stato generale: paziente vigile, lievemente astenica ma orientata, riferisce cefalea tensiva lieve e sensazione di ‘testa vuota’. Esame neurologico: non deficit di forza né di sensibilità focali obiettivabili, nervi cranici nella norma, prove cerebellari negative; segni di morsicatura laterale della lingua con piccole escoriazioni, nessun deficit di campo visivo riferito. Non segni di meningismo. Torace: murmure vescicolare conservato bilateralmente. Apparato cardiovascolare: toni cardiaci ritmici, senza soffi significativi. Addome: trattabile, non dolente. Cute: piccola escoriazione al gomito destro compatibile con caduta; nessun altro trauma maggiore evidente.",
    truth: {
      correctDiagnosis:
        "Prima crisi epilettica tonico-clonica generalizzata in adulta giovane; da definire eziologia (epilessia idiopatica vs sintomatica)",
      mandatoryQuestions: [
        "descrizione dettagliata dell’evento da parte di testimoni (inizio focale vs generalizzato, durata, fenomeni associati)",
        "eventuali precedenti episodi di perdita di coscienza, assenze o mioclonie non indagate",
        "uso di farmaci, sostanze stupefacenti o alcol nelle ultime 24–48 ore",
        "storia di trauma cranico recente o pregresso importante",
        "storia familiare di epilessia o convulsioni febbrili",
        "eventuali sintomi neurologici focali persistenti dopo la crisi (deficit di forza, linguaggio, visione)",
        "presenza di febbre, cefalea ingravescente o segni di infezione del SNC",
      ],
      requiredExams: [
        "Esami ematochimici di base (glicemia, elettroliti, funzionalità renale/epatica)",
        "TC Encefalo urgente se trauma cranico significativo, deficit focali o sospetto lesione strutturale",
        "RM Encefalo con sequenze dedicate in seconda battuta per studio eziologico",
        "EEG (non necessariamente in PS, ma da programmare in tempi rapidi)",
      ],
      unnecessaryExams: [
        "RX Cranio",
        "TC o RM Total Body senza indicazioni specifiche",
        "Esami radiologici ripetuti senza variazione del quadro clinico",
      ],
      legalReference:
        "Linee guida sulla gestione della prima crisi epilettica nell’adulto e obbligo di informazione su idoneità alla guida, attività lavorative a rischio e follow-up neurologico.",
    },
  },
  {
    id: "cardio-3-sindrome-aortica-acuta",
    specialty: "Cardiologia / Medicina d'Urgenza",
    patientName: "Marco",
    patientAge: 56,
    patientSex: "M",
    initialMessage:
      "Dottore, ho un dolore fortissimo al petto che si irradia alla schiena, come se qualcosa si stesse strappando. È iniziato all’improvviso mentre ero in macchina.",
    patientProfile:
      "Uomo di 56 anni, iperteso scarsamente controllato, fumatore attivo da molti anni. Nessuna coronaropatia nota documentata, ma riferisce scarsa aderenza alla terapia antipertensiva. Dolore toracico insorto improvvisamente da circa 40 minuti, descritto come lacerante, molto intenso, con irradiazione interscapolare e al dorso; non alleviato dal riposo. Riferisce sudorazione fredda, sensazione di morte imminente e lieve dispnea. Nessun trauma recente. Nessun episodio simile in passato con questa modalità. In famiglia un fratello deceduto improvvisamente a 50 anni per “problemi di cuore” non meglio specificati.",
    physicalExam:
      "Parametri vitali: PA 190/100 mmHg al braccio destro, PA 165/95 mmHg al braccio sinistro, FC 105 bpm, FR 22 atti/min, SpO2 96% in aria ambiente, temperatura 36,7°C. Stato generale: paziente agitato, sudato, dolore severo, viso pallido. Torace: murmure vescicolare conservato, non rantoli significativi; dolore non riproducibile alla palpazione della parete toracica. Apparato cardiovascolare: toni cardiaci validi, possibile soffio diastolico dolce lungo il margine sternale destro (sospetta insufficienza aortica acuta), polsi femorali percepibili ma lievemente meno pieni rispetto ai radiali (sospetta discrepanza di polso); possibile modesta asimmetria pressoria tra arti superiori. Addome: trattabile, non dolente. Non deficit neurologici focali evidenti, ma paziente riferisce lieve parestesia transitoria a un arto inferiore durante il picco del dolore.",
    truth: {
      correctDiagnosis:
        "Sospetta sindrome aortica acuta (dissezione aortica) in paziente iperteso con dolore toracico lacerante e irradiazione dorsale",
      mandatoryQuestions: [
        "caratteristiche precise del dolore (insorgenza, tipo lacerante, irradiazione, intensità massima all’esordio)",
        "eventuali episodi simili in passato o diagnosi di aneurisma aortico",
        "storia familiare di dissezioni aortiche o morte improvvisa precoce",
        "aderenza alla terapia antipertensiva e valori pressori abituali",
        "eventuali deficit neurologici transitori (paresi, sincope, perdita di coscienza)",
        "presenza di dolore migrante (torace, dorso, addome)",
      ],
      requiredExams: [
        "ECG a 12 derivazioni (per escludere concomitante sindrome coronarica acuta)",
        "TC Aorta toraco-addominale con mezzo di contrasto (angio-TC) urgente",
        "Emocromo, coagulazione, funzionalità renale",
        "Monitoraggio pressorio e cardiaco continuo in area critica",
      ],
      unnecessaryExams: [
        "RX Torace come unico esame decisionale",
        "D-Dimero come unico test per escludere la dissezione in quadro fortemente suggestivo",
        "TC Torace senza studio mirato dell’aorta",
      ],
      legalReference:
        "Percorsi tempo-dipendenti per le sindromi aortiche acute: il mancato riconoscimento di segni suggestivi (dolore lacerante, irradiazione dorsale, asimmetria pressoria) e il ritardo nell’esecuzione di angio-TC possono configurare gravi profili di responsabilità medico-legale.",
    },
  },
  {
    id: "emergenza-1-pneumotorace-iperteso",
    specialty: "Emergenza",
    patientName: "Luca",
    patientAge: 34,
    patientSex: "M",
    initialMessage:
      "Dottore, all’improvviso ho iniziato a sentire un fortissimo dolore al petto a destra e ora faccio molta fatica a respirare.",
    patientProfile:
      "Uomo di 34 anni, fumatore, senza cardiopatie note. Insorgenza improvvisa, durante uno sforzo lieve, di dolore toracico trafittivo in emitorace destro con dispnea ingravescente. All’arrivo in PS appare in marcato distress respiratorio, con sudorazione fredda e agitazione. All’esame obiettivo murmure vescicolare molto ridotto/assente a destra, iperfonesi plessica e deviazione del punto di massima impulse verso sinistra; giugulari turgide, ipotensione progressiva.",
    physicalExam:
      "Parametri vitali: PA 85/55 mmHg, FC 132 bpm, FR 32 atti/min, SpO2 86% in aria ambiente, temperatura 36,8°C. Torace: emitorace destro iperespanso, riduzione marcata del murmure vescicolare a destra, rumori respiratori conservati a sinistra; timpanismo alla percussione a destra. Giugulari turgide, polsi periferici filiformi. Addome trattabile, non dolente.",
    truth: {
      correctDiagnosis: "Pneumotorace iperteso destro in paziente giovane fumatore",
      mandatoryQuestions: [
        "modalità di insorgenza del dolore e della dispnea",
        "eventuali traumi toracici recenti",
        "storia di pneumotorace spontaneo pregresso",
        "abitudine tabagica o consumo di droghe per via inalatoria",
      ],
      requiredExams: [
        "Valutazione clinica immediata con monitoraggio continuo",
        "Decompressione toracica urgente (ago o drenaggio) prima degli esami se quadro instabile",
        "RX Torace dopo stabilizzazione per conferma e valutazione estensione",
      ],
      unnecessaryExams: [
        "TC Torace prima della decompressione in quadro di instabilità",
        "Esami radiologici ritardanti in paziente con chiari segni clinici di pneumotorace iperteso",
      ],
      legalReference:
        "Gestione tempo-dipendente del pneumotorace iperteso: il ritardo nella decompressione immediata in presenza di segni clinici tipici può configurare grave responsabilità professionale.",
    },
  },
  {
    id: "emergenza-2-infarto-stemi",
    specialty: "Emergenza",
    patientName: "Giulia",
    patientAge: 59,
    patientSex: "F",
    initialMessage:
      "Dottore, ho un dolore fortissimo al centro del petto che non passa e mi prende il braccio sinistro e la mandibola.",
    patientProfile:
      "Donna di 59 anni, ipertesa e diabetica, forte fumatrice. Dolore toracico costrittivo, molto intenso, insorto da circa 40 minuti a riposo, con irradiazione al braccio sinistro e alla mandibola, associato a sudorazione fredda e nausea. Non episodi simili di questa intensità in passato. All’arrivo appare sofferente, pallida, sudata, con dispnea lieve da sforzo minimo.",
    physicalExam:
      "Parametri vitali: PA 135/85 mmHg, FC 104 bpm, FR 22 atti/min, SpO2 94% in aria ambiente, temperatura 36,6°C. Torace: murmure vescicolare conservato, dolore non riproducibile alla palpazione. Cuore: toni cardiaci ritmici, possibile terzo tono tenue, polsi periferici presenti. Edemi declivi assenti.",
    truth: {
      correctDiagnosis: "Infarto miocardico acuto con sopraslivellamento del tratto ST (STEMI) in paziente ad alto rischio",
      mandatoryQuestions: [
        "orario di inizio del dolore toracico e durata",
        "caratteristiche del dolore (costrittivo, irradiato, associato a dispnea o nausea)",
        "pregresse cardiopatie e terapie in corso",
        "fattori di rischio cardiovascolari (fumo, diabete, ipertensione, ipercolesterolemia)",
      ],
      requiredExams: [
        "ECG a 12 derivazioni immediato e seriato",
        "Dosaggio urgente della troponina",
        "Accesso a emodinamica per coronarografia urgente secondo rete STEMI",
      ],
      unnecessaryExams: [
        "RX Torace come unico esame decisionale",
        "TC Torace non mirata in quadro tipico di STEMI",
      ],
      legalReference:
        "Percorsi organizzativi per STEMI: mancata esecuzione tempestiva di ECG e attivazione della rete di emodinamica può configurare grave profilo di colpa per ritardo terapeutico.",
    },
  },
  {
    id: "emergenza-3-ictus-ischemico-acuto",
    specialty: "Emergenza",
    patientName: "Franco",
    patientAge: 69,
    patientSex: "M",
    initialMessage:
      "Dottore, da meno di un’ora mi si è improvvisamente indebolito il braccio e la gamba destra e faccio fatica a parlare bene.",
    patientProfile:
      "Uomo di 69 anni, iperteso e diabetico, ex fumatore. Insorgenza improvvisa di deficit di forza all’arto superiore e inferiore destro associato a disartria, insorto circa 45 minuti prima dell’arrivo in PS. Nessun trauma cranico recente, nessuna crisi convulsiva. Ultimo momento visto bene riferito con chiarezza. All’arrivo vigile ma ansioso, con deficit neurologico focale stabile.",
    physicalExam:
      "Parametri vitali: PA 180/100 mmHg, FC 92 bpm, FR 18 atti/min, SpO2 98% in aria ambiente, temperatura 36,7°C. Esame neurologico: forza ridotta a carico di arto superiore e inferiore destro, lieve asimmetria del sorriso, disartria moderata; sensibilità grossolana conservata. Nessun segno di meningismo. Torace e apparato cardiovascolare senza reperti acuti.",
    truth: {
      correctDiagnosis: "Ictus ischemico acuto in finestra terapeutica potenzialmente eleggibile a trombolisi/trombectomia",
      mandatoryQuestions: [
        "orario esatto di insorgenza dei sintomi",
        "ultimo momento in cui il paziente era visto in condizioni normali",
        "terapie in corso (in particolare anticoagulanti/antiaggreganti)",
        "pregressi eventi ischemici cerebrali o emorragici",
        "fattori di rischio cardiovascolari e presenza di fibrillazione atriale",
      ],
      requiredExams: [
        "TC Encefalo urgente per escludere emorragia",
        "Esami ematochimici urgenti (coagulazione, glicemia, elettroliti)",
        "ECG e monitoraggio cardiaco",
        "Eventuale TC/RM perfusionale e angio-TC per valutare eleggibilità a trombectomia",
      ],
      unnecessaryExams: [
        "RX Cranio",
        "TC Total Body senza indicazione",
        "Esami radiologici che ritardano l’accesso alla finestra terapeutica",
      ],
      legalReference:
        "Percorso tempo-dipendente per ictus ischemico acuto (stroke code): il ritardo nella valutazione in stroke unit e nell’esecuzione di TC/angio-TC può configurare responsabilità per perdita di chance terapeutica.",
    },
  },
  {
    id: "emergenza-4-shock-anafilattico",
    specialty: "Emergenza",
    patientName: "Elena",
    patientAge: 52,
    patientSex: "F",
    initialMessage:
      "Dottore, pochi minuti dopo che mi hanno fatto un antibiotico in vena ho iniziato a sentire prurito ovunque, il viso mi si è gonfiato e adesso faccio molta fatica a respirare.",
    patientProfile:
      "Donna di 52 anni, anamnesi positiva per rinite allergica stagionale, senza altre allergie dichiarate a farmaci. Ricoverata in reparto per polmonite comunitaria, ha appena iniziato infusione endovenosa di antibiotico beta-lattamico. Dopo pochi minuti dall’inizio dell’infusione insorgenza di prurito diffuso, orticaria generalizzata, senso di costrizione toracica, difficoltà respiratoria e sensazione di svenimento imminente. All’arrivo in PS viene trasferita in area emergenza con quadro di shock in evoluzione.",
    physicalExam:
      "Parametri vitali: PA 70/40 mmHg, FC 132 bpm, FR 30 atti/min, SpO2 88% in aria ambiente, temperatura 36,2°C. Stato generale: paziente agitata, sudata fredda, con marcato distress respiratorio. Cute: orticaria diffusa, eritema generalizzato, edema evidente a livello periorbitario e delle labbra. Apparato respiratorio: respiro rumoroso con sibili diffusi, utilizzo dei muscoli accessori, possibile stridore laringeo. Polsi periferici filiformi, riempimento capillare rallentato. Addome trattabile, non dolente. Stato neurologico: vigile ma confusa per ipoperfusione.",
    truth: {
      correctDiagnosis:
        "Shock anafilattico in seguito a somministrazione endovenosa di antibiotico beta-lattamico",
      mandatoryQuestions: [
        "farmaco somministrato (nome, dose, via e tempo di inizio)",
        "precedenti reazioni allergiche a farmaci o mezzi di contrasto",
        "tempo esatto tra somministrazione e insorgenza dei sintomi",
        "presenza di sintomi respiratori (sibili, senso di costrizione, stridore)",
        "presenza di sintomi gastrointestinali (vomito, dolori addominali)",
      ],
      requiredExams: [
        "Monitoraggio continuo (PA, FC, FR, SpO2) e accessi venosi multipli",
        "Somministrazione immediata di adrenalina intramuscolo secondo linee guida",
        "Espansione volemica rapida con cristalloidi",
        "Emogasanalisi arteriosa",
        "Valutazione per eventuale supporto ventilatorio avanzato / rianimazione",
      ],
      unnecessaryExams: [
        "TC Torace prima della stabilizzazione emodinamica",
        "Esami radiologici ritardanti il trattamento con adrenalina",
      ],
      legalReference:
        "Gestione dello shock anafilattico: la pronta somministrazione di adrenalina e il supporto vitale avanzato sono obblighi assistenziali tempo-dipendenti; ritardi ingiustificati possono configurare responsabilità grave.",
    },
  },
  {
    id: "emergenza-5-emorragia-digestiva-superiore",
    specialty: "Emergenza",
    patientName: "Salvatore",
    patientAge: 64,
    patientSex: "M",
    initialMessage:
      "Dottore, ho vomitato tanto sangue rosso scuro e mi sento debolissimo, come se stessi per svenire.",
    patientProfile:
      "Uomo di 64 anni, storia di cirrosi epatica alcol-correlata con ipertensione portale nota. Pregresse varici esofagee note, controllo endoscopico non recente. Da qualche ora insorgenza di ematemesi abbondante con vomito di sangue rosso scuro e a volte a 'fondo di caffè', associata a melena. All’arrivo in PS appare sudato, pallido, ipoteso, con sensazione di estrema debolezza e presincope.",
    physicalExam:
      "Parametri vitali: PA 80/50 mmHg, FC 120 bpm, FR 24 atti/min, SpO2 94% in aria ambiente, temperatura 36,4°C. Stato generale: paziente in shock ipovolemico, estremità fredde, cute marezzata, sudorazione profusa. Addome: modesto ascite, fegato lievemente palpabile, non segni di peritonite. Esame obiettivo proctologico (se eseguito): presenza di melena. Segni di epatopatia cronica (stigmate epatiche, teleangectasie).",
    truth: {
      correctDiagnosis:
        "Emorragia digestiva superiore massiva in paziente cirrotico con sospetto sanguinamento da varici esofagee",
      mandatoryQuestions: [
        "quantità e numero di episodi di ematemesi/melena",
        "uso di FANS, anticoagulanti o antiaggreganti",
        "pregresse endoscopie con documentazione di varici esofagee",
        "presenza di segni di encefalopatia (confusione, sonnolenza)",
        "eventuali episodi emorragici simili in passato",
      ],
      requiredExams: [
        "Prelievi ematochimici urgenti (emocromo, coagulazione, funzionalità epatica e renale)",
        "Gruppo sanguigno e prove crociate per emoderivati",
        "EGDS (Endoscopia digestiva alta)",
        "Monitoraggio intensivo in area critica",
        "Ecografia addome secondo disponibilità (valutazione di base)",
      ],
      unnecessaryExams: [
        "TC Addome con contrasto prima della stabilizzazione emodinamica",
        "RX Addome in bianco in assenza di sospetto di perforazione",
      ],
      legalReference:
        "Gestione dell’emorragia digestiva superiore in paziente cirrotico: la mancata attivazione tempestiva del percorso endoscopico e del supporto emodinamico intensivo può configurare perdita di chance terapeutica significativa.",
      examFindings: {
        "EGDS (Endoscopia digestiva alta)":
          "All’esame endoscopico si osservano varici esofagee di grosso calibro in esofago distale con segni di recente sanguinamento (strie rosse, coaguli adesi). In sede cardiale si evidenzia lago ematico in via di organizzazione. Viene effettuata legatura elastica multipla delle varici sanguinanti con arresto del sanguinamento attivo. Non ulteriori lesioni sanguinanti in stomaco e duodeno prossimale.",
      },
    },
  },
  {
    id: "emergenza-6-embolia-polmonare-massiva",
    specialty: "Emergenza",
    patientName: "Marco",
    patientAge: 58,
    patientSex: "M",
    initialMessage:
      "Dottore, all’improvviso ho iniziato a non riuscire più a respirare bene e ho un forte dolore al petto quando respiro.",
    patientProfile:
      "Uomo di 58 anni, recente intervento chirurgico ortopedico maggiore a un arto inferiore, ancora parzialmente immobilizzato. Fattori di rischio tromboembolico importanti (obesità, fumo, possibile trombofilia familiare non studiata). Insorgenza improvvisa di dispnea intensa a riposo con dolore toracico puntorio in regione basale destra, peggiorato dalla respirazione profonda. Riferisce anche palpitazioni e sensazione di svenimento imminente.",
    physicalExam:
      "Parametri vitali: PA 85/55 mmHg, FC 118 bpm, FR 30 atti/min, SpO2 86% in aria ambiente, temperatura 36,7°C. Stato generale: paziente in marcato distress respiratorio, sudorazione fredda, ansia. Torace: murmure vescicolare globalmente conservato, possibile riduzione basale destra; dolore alla palpazione in sede toracica inferiore destra. Apparato cardiovascolare: tachicardia, toni cardiaci ipofonetici, possibile sdoppiamento del secondo tono polmonare. Arti inferiori: edemi declivi lievi, possibile segno di trombosi venosa profonda all’arto inferiore operato.",
    truth: {
      correctDiagnosis:
        "Sospetta embolia polmonare massiva in paziente post-chirurgico con instabilità emodinamica",
      mandatoryQuestions: [
        "data e tipo di intervento chirurgico recente",
        "grado di immobilizzazione e uso di profilassi anticoagulante",
        "episodi precedenti di TVP/EP",
        "presenza di dolore o gonfiore a un arto inferiore",
        "eventuale storia familiare di trombofilia",
      ],
      requiredExams: [
        "Emogasanalisi arteriosa urgente",
        "ECG (ricerca di segni di sovraccarico destro)",
        "Angio-TC polmonare urgente se condizioni lo permettono",
        "Ecocardiogramma urgente per valutare sovraccarico del ventricolo destro",
        "Dosaggio D-Dimero solo se quadro non a rischio alto secondo score clinici",
      ],
      unnecessaryExams: [
        "RX Torace come unico esame decisionale",
        "TC Torace senza contrasto non mirata alla vascolarizzazione polmonare",
      ],
      legalReference:
        "Percorsi tempo-dipendenti per embolia polmonare ad alto rischio: ritardi nell’esecuzione di angio-TC/ecocardiogramma e nell’avvio di terapia anticoagulante/trombolitica possono configurare grave responsabilità per perdita di chance.",
    },
  },
  {
    id: "emergenza-7-stato-male-epilettico",
    specialty: "Emergenza",
    patientName: "Alessandro",
    patientAge: 37,
    patientSex: "M",
    initialMessage:
      "Il paziente è arrivato in PS in ambulanza in crisi convulsiva tonico-clonica generalizzata che non si è mai fermata spontaneamente.",
    patientProfile:
      "Uomo di 37 anni, storia nota di epilessia focale in terapia irregolare con farmaci antiepilettici. Secondo i familiari, da circa 20 minuti presenta crisi convulsive tonico-cloniche generalizzate senza recupero completo di coscienza tra un episodio e l’altro. Non trauma cranico evidente riferito prima dell’evento. Possibile sospensione autonoma della terapia da alcuni giorni. All’arrivo in PS è ancora in crisi convulsiva.",
    physicalExam:
      "Parametri vitali: PA 150/90 mmHg, FC 120 bpm, FR 26 atti/min, SpO2 90% in aria ambiente, temperatura 37,4°C. Stato generale: paziente in crisi tonico-clonica generalizzata, non contattabile, ipersalivazione, possibile morsicatura della lingua. Pupille isocoriche e reagenti ma difficili da valutare per il movimento. Necessario immediato supporto delle vie aeree e protezione fisica. Non segni esterni di trauma evidente al capo, torace o addome.",
    truth: {
      correctDiagnosis:
        "Stato di male epilettico tonico-clonico generalizzato in paziente con epilessia nota e sospetta scarsa aderenza terapeutica",
      mandatoryQuestions: [
        "durata complessiva delle crisi senza recupero di coscienza",
        "aderenza alla terapia antiepilettica e eventuali variazioni di dose",
        "uso di alcol o sostanze stupefacenti",
        "eventuale trauma cranico associato o precedente",
        "patologie neurologiche e metaboliche note",
      ],
      requiredExams: [
        "Stabilizzazione delle vie aeree e supporto ventilatorio se necessario",
        "Somministrazione sequenziale di benzodiazepine e farmaci di seconda linea secondo protocollo",
        "Emogasanalisi arteriosa, glicemia, elettroliti",
        "TC Encefalo urgente per escludere lesioni strutturali acute",
        "Valutazione per ricovero in terapia intensiva/rianimazione",
      ],
      unnecessaryExams: [
        "RM Encefalo in fase iperacuta prima della stabilizzazione",
        "Esami radiologici non mirati che ritardino il trattamento antiepilettico urgente",
      ],
      legalReference:
        "Linee guida per lo stato di male epilettico: il ritardo nel trattamento farmacologico aggressivo e nel supporto delle funzioni vitali può configurare responsabilità per danno neurologico permanente evitabile.",
    },
  },
  {
    id: "emergenza-8-edema-polmonare-acuto",
    specialty: "Emergenza",
    patientName: "Rosa",
    patientAge: 72,
    patientSex: "F",
    initialMessage:
      "Dottore, non riesco a respirare, sento come se stessi affogando e sto tossendo una schiuma rosa.",
    patientProfile:
      "Donna di 72 anni, ipertesa di lunga data, nota cardiopatia ischemica con pregresso infarto e frazione di eiezione ridotta. Riferisce brusca comparsa di grave dispnea a riposo durante la notte, costringendola a sedersi a letto. Tosse con escreato schiumoso rosato, ortopnea marcata, possibile dolore toracico vago. All’arrivo in PS appare molto dispnoica, spaventata, con storia di scarso controllo pressorio e scarsa aderenza alla terapia diuretica.",
    physicalExam:
      "Parametri vitali: PA 190/110 mmHg, FC 112 bpm, FR 32 atti/min, SpO2 82% in aria ambiente, temperatura 36,8°C. Stato generale: paziente in grave distress respiratorio, seduta, cianotica perifericamente, sudata. Torace: rantoli crepitanti diffusi a mantellina bilaterali, soprattutto alle basi, sibili possibili; murmure vescicolare ridotto per rumori sovrastanti. Apparato cardiovascolare: tachicardia, toni cardiaci assenti di soffi evidenti per rumore respiratorio, giugulari turgide. Edemi declivi agli arti inferiori.",
    truth: {
      correctDiagnosis:
        "Edema polmonare acuto cardiogeno ipertensivo in paziente con scompenso cardiaco cronico",
      mandatoryQuestions: [
        "aderenza alla terapia per scompenso (diuretici, ACE-inibitori, beta-bloccanti)",
        "episodi recenti di peggioramento della dispnea o ricoveri per scompenso",
        "presenza di dolore toracico tipico o atipico",
        "assunzione recente di liquidi/sale in eccesso",
        "eventuali aritmie note (es. fibrillazione atriale)",
      ],
      requiredExams: [
        "Monitoraggio intensivo (PA, FC, FR, SpO2) con accesso venoso affidabile",
        "Emogasanalisi arteriosa urgente",
        "ECG a 12 derivazioni",
        "RX Torace urgente per confermare quadro di congestione polmonare",
        "Ematochimici di base inclusi BNP/NT-proBNP e funzione renale",
      ],
      unnecessaryExams: [
        "TC Torace in prima battuta senza indicazioni aggiuntive",
        "Esami che ritardano la ventilazione non invasiva o i diuretici e.v.",
      ],
      legalReference:
        "Gestione dell’edema polmonare acuto: la tempestiva somministrazione di ossigenoterapia/ventilazione non invasiva, diuretici e vasodilatatori è essenziale; ritardi ingiustificati nel trattamento possono configurare responsabilità per peggioramento respiratorio evitabile.",
    },
  },
  {
    id: "emergenza-9-dissezione-aortica-acuta",
    specialty: "Emergenza",
    patientName: "Carlo",
    patientAge: 62,
    patientSex: "M",
    initialMessage:
      "Dottore, ho un dolore fortissimo al petto che è iniziato all’improvviso e adesso lo sento come se mi stesse strappando la schiena tra le scapole.",
    patientProfile:
      "Uomo di 62 anni, iperteso di lunga data con controllo pressorio irregolare, fumatore attivo. Nessuna coronaropatia documentata, ma familiarità per morte cardiaca improvvisa in età giovanile in un fratello. Riferisce insorgenza improvvisa, mentre era a riposo, di dolore toracico violento, descritto come lancinante e ‘come una lacerazione’, con rapida irradiazione tra le scapole. Il dolore ha raggiunto subito la massima intensità e non si modifica con il respiro o i movimenti. All’arrivo in PS appare agitato, sudato, molto sofferente. Non riferisce trauma toracico recente né sforzi fisici eccezionali nelle ore precedenti.",
    physicalExam:
      "Parametri vitali: PA 200/110 mmHg misurata al braccio destro, PA 90/60 mmHg al braccio sinistro; FC 110 bpm, FR 24 atti/min, SpO2 95% in aria ambiente, temperatura 36,7°C. Stato generale: paziente pallido, sudato, in dolore severo, ansioso. Apparato cardiovascolare: toni cardiaci validi, presenza di nuovo soffio diastolico decrescente lungo il margine sternale destro (sospetta insufficienza aortica acuta); polso radiale destro ben percepibile, assenza di polso radiale sinistro alla palpazione; possibili differenze di riempimento e ampiezza dei polsi femorali. Torace: murmure vescicolare conservato bilateralmente, dolore non riproducibile alla palpazione della parete toracica. Addome trattabile, non francamente dolente, ma il paziente riferisce sensazione di peso epigastrico vago. Nessun deficit neurologico focale evidente al momento, ma lamenta senso di instabilità alle gambe durante i tentativi di mobilizzazione.",
    truth: {
      correctDiagnosis:
        "Dissezione aortica acuta (sindrome aortica acuta) con coinvolgimento dell’aorta toracica e potenziale estensione addominale",
      mandatoryQuestions: [
        "caratteristiche precise del dolore (insorgenza improvvisa, tipo lacerante, irradiato al dorso/inter-scapolare, intensità massima all’esordio)",
        "eventuali episodi simili in passato o diagnosi nota di aneurisma/dissezione aortica",
        "storia familiare di morte improvvisa precoce o sindromi del tessuto connettivo",
        "aderenza alla terapia antipertensiva e valori pressori abituali",
        "presenza di sintomi neurologici (sincope, deficit di forza o sensibilità, confusione improvvisa)",
        "eventuale migrazione del dolore verso addome o arti inferiori",
      ],
      requiredExams: [
        "ECG a 12 derivazioni per escludere concomitante sindrome coronarica acuta",
        "Angio-TC Torace/Addome con mezzo di contrasto urgente per studio completo dell’aorta",
        "Emocromo, coagulazione, funzionalità renale ed elettroliti",
        "Monitoraggio pressorio e cardiaco continuo in area critica con rapido controllo della pressione arteriosa",
      ],
      unnecessaryExams: [
        "RX Torace come unico esame decisionale in quadro fortemente suggestivo di sindrome aortica acuta",
        "D-Dimero come unico test per escludere la dissezione",
        "TC Torace senza studio mirato dell’aorta o senza mezzo di contrasto in prima battuta",
      ],
      legalReference:
        "Percorsi tempo-dipendenti per la dissezione aortica acuta: il mancato riconoscimento di dolore toracico lacerante con asimmetria pressoria e assenza di polso, e il ritardo nell’esecuzione di Angio-TC Torace/Addome con mezzo di contrasto possono configurare gravi profili di responsabilità medico-legale; è obbligatoria una valutazione rapida dei rischi del mezzo di contrasto e la documentazione dell’informazione al paziente (alert per mezzo di contrasto iodato).",
    },
  },
  {
    id: "epato-1-cirrosi-epatica-scompensata",
    specialty: "Epatologia / Medicina Interna",
    patientName: "Antonio",
    patientAge: 58,
    patientSex: "M",
    initialMessage:
      "Dottore, da qualche settimana mi si è gonfiata molto la pancia, mi sento sempre stanco e mia moglie dice che ho gli occhi gialli e che sono più confuso del solito.",
    patientProfile:
      "Uomo di 58 anni con storia nota di epatopatia cronica alcol-correlata e sospetta cirrosi, follow-up epatologico irregolare. Riferisce progressiva distensione addominale da alcune settimane, con aumento di peso a fronte di ridotto appetito. Segnala astenia marcata, calo della forza muscolare, prurito diffuso e comparsa di edemi declivi agli arti inferiori. La moglie riferisce recente inversione del ritmo sonno-veglia, maggiore irritabilità e momenti di disattenzione e rallentamento cognitivo. Non ematemesi in atto, ma alvo talora ipocolico. Anamnesi positiva per abuso alcolico protratto, sospetta ipertensione portale non monitorata negli ultimi anni.",
    physicalExam:
      "Parametri vitali: PA 105/65 mmHg, FC 92 bpm, FR 18 atti/min, SpO2 97% in aria ambiente, temperatura 36,8°C. Ispezione: ittero sclerale, teleangectasie cutanee, eritema palmare, ginecomastia modesta. Addome globoso con falda ascitica tesa, giugulo-ombelicale positivo, addome non francamente dolente alla palpazione, assenza di segni di peritonite. Fegato poco palpabile, margine smusso, milza palpabile a 3 cm dall'arco costale sinistro. Edemi declivi agli arti inferiori ++. Esame neurologico: paziente vigile ma rallentato, disorientamento temporale lieve, tremore fine in estensione (asterixis/“flapping tremor” positivo), inversione del ritmo sonno-veglia riferita (encefalopatia epatica stadio I).",
    truth: {
      correctDiagnosis:
        "Cirrosi epatica scompensata con ascite tesa e encefalopatia epatica di grado I in contesto di epatopatia cronica alcol-correlata",
      mandatoryQuestions: [
        "anamnesi di consumo alcolico e durata dell'abuso",
        "diagnosi pregresse di epatopatia cronica o cirrosi e follow-up specialistico",
        "comparsa e progressione di ascite, edemi declivi e segni di ipertensione portale",
        "presenza di episodi di encefalopatia epatica (confusione, inversione sonno-veglia, alterazioni del comportamento)",
        "eventuali episodi di ematemesi o melena pregressi (sanguinamento da varici esofagee)",
        "farmaci in uso, in particolare diuretici, FANS, sedativi o benzodiazepine",
      ],
      requiredExams: [
        "Emocromo, funzionalità epatica e renale, assetto coagulativo completo",
        "Ecografia addome con studio del circolo portale",
        "Paracentesi diagnostica con esame del liquido ascitico (citologia, albumina, coltura)",
        "Ammoniemia e assetto elettrolitico",
        "Markers virali e autoimmuni epatici (HBV, HCV, autoanticorpi) secondo contesto",
      ],
      unnecessaryExams: [
        "TC Addome con mezzo di contrasto di routine in assenza di sospetto di complicanze focali o trombosi portale non altrimenti valutabile",
        "RM Addome di screening non mirata",
        "Esami radiologici non correlati (RX Colonna, RX Arti) senza indicazione specifica",
      ],
      legalReference:
        "Gestione della cirrosi epatica scompensata: la mancata esecuzione di paracentesi diagnostica in presenza di nuova ascite tesa o peggioramento rapido, e la sottovalutazione dei segni di encefalopatia epatica possono configurare ritardo diagnostico-terapeutico con rischio di responsabilità professionale secondo Legge 24/2017 (Gelli-Bianco).",
    },
  },
  {
    id: "pneumo-2-bpco-riacutizzata",
    specialty: "Pneumologia",
    patientName: "Giancarlo",
    patientAge: 69,
    patientSex: "M",
    initialMessage:
      "Dottore, da tre giorni faccio molta più fatica del solito a respirare, tossisco con catarro giallo e oggi anche pochi passi mi lasciano senza fiato.",
    patientProfile:
      "Uomo di 69 anni, grande fumatore (40 pacchetti/anno), diagnosi nota di BPCO stadio GOLD III con ossigenoterapia domiciliare notturna. Riferisce da 3–4 giorni aumento marcato della dispnea rispetto al suo stato basale, con tosse produttiva ed espettorato purulento giallo-verdastro. Da 24 ore utilizzo frequente del broncodilatatore a breve durata senza sollievo significativo. Riporta aumento della fatica nei piccoli spostamenti domestici e comparsa di lieve sonnolenza diurna. Non dolore toracico tipico cardiaco, non emoftoe, non viaggi recenti.",
    physicalExam:
      "Parametri vitali: PA 130/80 mmHg, FC 108 bpm, FR 26 atti/min, SpO2 88% in aria ambiente (basale domiciliare riferita 92–93%), temperatura 37,8°C. Stato generale: paziente dispnoico, uso evidente dei muscoli accessori, posizione seduta a busto flesso in avanti. Torace: iperinsufflazione, murmure vescicolare globalmente ridotto con sibili diffusi e ronchi espiratori, espirazione prolungata; presenza di tremore vocale ridotto alle basi. Cuore: toni tachicardici ma ritmici, non soffi maggiori. Estremità calde, lieve cianosi labiale. Edemi declivi assenti o modesti.",
    truth: {
      correctDiagnosis:
        "Riacutizzazione di broncopneumopatia cronica ostruttiva (BPCO) in paziente fumatore con peggioramento acuto della dispnea ed espettorato purulento",
      mandatoryQuestions: [
        "gravità e durata della dispnea rispetto al basale (numero di gradini o attività tollerate)",
        "quantità e caratteristiche dell'espettorato (purulento, ematico)",
        "aderenza alla terapia inalatoria di fondo e uso di ossigenoterapia domiciliare",
        "numero di riacutizzazioni/riporti in PS o ricoveri negli ultimi 12 mesi",
        "presenza di febbre, dolore toracico pleuritico o segni di infezione respiratoria",
        "abitudine tabagica attuale e pregressa",
      ],
      requiredExams: [
        "Emogasanalisi arteriosa (EGA)",
        "Emocromo con indici di flogosi (PCR/VES)",
        "RX Torace in due proiezioni",
        "Emocolture e/o esame dell'espettorato in caso di quadro severo",
        "Monitoraggio saturimetrico continuo e valutazione per supporto ventilatorio non invasivo",
      ],
      unnecessaryExams: [
        "TC Torace ad alta risoluzione in fase acuta non complicata",
        "Dosaggio routinario di D-Dimero in assenza di sospetto clinico di embolia polmonare",
        "RM Torace",
      ],
      legalReference:
        "Linee guida GOLD per la gestione della BPCO: nelle riacutizzazioni con peggioramento significativo della dispnea e ipossiemia è obbligatoria una valutazione rapida dei gas arteriosi e della necessità di ventilazione non invasiva; omissioni o ritardi possono configurare profilo di colpa per mancata gestione adeguata di insufficienza respiratoria acuta su BPCO.",
    },
  },
  {
    id: "nefro-2-irc-stadio4",
    specialty: "Nefrologia",
    patientName: "Bruno",
    patientAge: 72,
    patientSex: "M",
    initialMessage:
      "Dottore, da qualche mese mi sento sempre più stanco, mi prude tutto il corpo e mi hanno detto che la creatinina è salita ancora.",
    patientProfile:
      "Uomo di 72 anni con diagnosi nota di insufficienza renale cronica (IRC) da nefropatia ipertensiva e diabetica, in follow-up nefrologico irregolare. Riferisce astenia marcata, ridotta tolleranza allo sforzo, crampi muscolari notturni e prurito diffuso. Esami recenti mostrano peggioramento progressivo della funzione renale (creatininemia in aumento, eGFR in fascia stadio IV). Anamnesi positiva per ipertensione e diabete mellito di lunga data, controllo pressorio e glicemico subottimale. Non dialisi in corso, ma nefrologo aveva già discusso possibile preparazione all’accesso vascolare. Riferisce inappetenza, lieve nausea saltuaria e disturbi del sonno.",
    physicalExam:
      "Parametri vitali: PA 150/85 mmHg, FC 88 bpm, FR 18 atti/min, SpO2 97% in aria ambiente, temperatura 36,7°C. Cute secca con escoriazioni da grattamento, occasionali iperpigmentazioni. Edemi declivi lievi alle caviglie. Cuore: toni validi, ritmo regolare, non soffi maggiori. Torace: murmure vescicolare conservato bilateralmente. Addome: trattabile, non dolente, reni non palpabili. Esame neurologico: vigile, orientato, lamente disturbi del sonno ma nessun deficit focale.",
    truth: {
      correctDiagnosis:
        "Insufficienza renale cronica (IRC) stadio IV in paziente iperteso e diabetico con sintomi uremici iniziali",
      mandatoryQuestions: [
        "valori recenti di creatinina, urea ed eGFR e loro trend nel tempo",
        "presenza di diabete mellito e ipertensione e relativo controllo terapeutico",
        "assunzione di farmaci nefrotossici (FANS, mezzi di contrasto, ACE-inibitori ad alte dosi non monitorati)",
        "presenza di sintomi uremici (nausea, vomito, prurito, disturbi del sonno, alterazioni della concentrazione)",
        "eventuali episodi di iperpotassiemia nota o aritmie correlate",
        "valutazione di anemia e stato marziale, eventuali trasfusioni o terapia con eritropoietina",
      ],
      requiredExams: [
        "Funzionalità renale completa (urea, creatinina, eGFR, elettroliti con particolare attenzione al potassio)",
        "Emocromo per valutazione anemia (normocitica/normocromica da IRC)",
        "Esame urine completo con valutazione proteinuria/albuminuria",
        "Ecografia renale e delle vie urinarie",
        "Valutazione cardiologica di base (ECG) in presenza di iperpotassiemia o fattori di rischio",
      ],
      unnecessaryExams: [
        "TC Addome con mezzo di contrasto senza valutazione preventiva del rischio nefrotossico",
        "RM con mezzo di contrasto gadolinio in assenza di indicazione forte (rischio fibrosi sistemica nefrogenica)",
        "Esami radiologici ripetuti non mirati che non modificano la gestione clinica",
      ],
      legalReference:
        "Linee guida per la gestione della malattia renale cronica: è obbligatorio pianificare precocemente il percorso di preparazione alla dialisi e correggere i fattori di progressione. La mancata sorveglianza di iperpotassiemia severa, anemia significativa o peggioramento rapido dell'eGFR può configurare responsabilità per omissione di adeguato monitoraggio e trattamento.",
    },
  },
  {
    id: "neuro-4-parkinson-esordio",
    specialty: "Neurologia",
    patientName: "Enrico",
    patientAge: 63,
    patientSex: "M",
    initialMessage:
      "Dottore, da qualche mese mi trema la mano destra quando sono fermo e mi sento più lento nei movimenti, faccio fatica a partire quando cammino.",
    patientProfile:
      "Uomo di 63 anni, senza patologie neurologiche note. Da circa 6–8 mesi riferisce tremore a riposo alla mano destra, che diminuisce con il movimento volontario e aumenta in situazioni di stress. Riferisce bradicinesia, maggiore lentezza nell'allacciarsi i bottoni, nel vestirsi e nell'alzarsi dalla sedia. La moglie nota riduzione della mimica facciale e passo più corto con tendenza a trascinare il piede destro. Nessuna storia di ictus, traumi cranici maggiori o esposizione nota a neurotossine. Non familiarità diretta per malattia di Parkinson, ma per altri disturbi neurologici in età avanzata.",
    physicalExam:
      "Parametri vitali: PA 130/80 mmHg, FC 76 bpm, FR 14 atti/min, SpO2 99% in aria ambiente, temperatura 36,6°C. Esame neurologico: tremore a riposo a bassa frequenza tipo ‘contar monete’ prevalente alla mano destra, che si riduce con il movimento volontario e scompare nel sonno. Bradicinesia con rallentamento nell'esecuzione di movimenti alternati rapidi (test di pronosupinazione e tapping delle dita). Rigidità plastica (a ruota dentata) agli arti superiori, più marcata a destra. Lievi alterazioni della postura con flessione del tronco in avanti e riduzione del movimento pendolare del braccio destro durante la marcia. Riflessi osteotendinei nei limiti, nessun deficit di forza o sensibilità focale.",
    truth: {
      correctDiagnosis:
        "Malattia di Parkinson all'esordio con tremore a riposo unilaterale, bradicinesia e rigidità",
      mandatoryQuestions: [
        "tempo di esordio e progressione del tremore e della lentezza motoria",
        "lato prevalente dei sintomi motori e presenza di asimmetria",
        "presenza di rigidità, disturbi della marcia, cadute o instabilità posturale",
        "uso di farmaci che possono indurre parkinsonismo (neurolettici, antiemetici dopamino-bloccanti)",
        "presenza di sintomi non motori (iposmia, stipsi, disturbi del sonno, depressione)",
        "storia familiare di disturbi del movimento o patologie neurodegenerative",
      ],
      requiredExams: [
        "Valutazione neurologica specialistica con applicazione dei criteri diagnostici MDS per malattia di Parkinson",
        "TC o RM encefalo per escludere lesioni strutturali secondarie se indicato",
        "Valutazione delle comorbilità internistiche prima di eventuale terapia dopaminergica",
        "Eventuale DAT-SPECT in casi selezionati con diagnosi incerta",
      ],
      unnecessaryExams: [
        "TC o RM encefalo ripetute in assenza di modifiche cliniche",
        "Esami di laboratorio estesi senza indicazione (markers tumorali, autoanticorpi non mirati)",
      ],
      legalReference:
        "Linee guida per la diagnosi di malattia di Parkinson: un corretto inquadramento precoce consente trattamento sintomatico e counselling adeguato; errori grossolani di diagnosi differenziale (es. confusione con tremore essenziale senza valutazione neurologica specialistica) possono configurare ritardo diagnostico con impatto sulla qualità di vita del paziente.",
    },
  },
  {
    id: "emergenza-10-shock-settico",
    specialty: "Emergenza",
    patientName: "Stefano",
    patientAge: 67,
    patientSex: "M",
    initialMessage:
      "Dottore, da due giorni ho febbre alta e oggi mi sento molto confuso e debole, mi gira la testa quando mi alzo dal letto.",
    patientProfile:
      "Uomo di 67 anni, diabetico e iperteso, con recente infezione urinaria trattata in modo incompleto. Da 48 ore febbre alta con brividi, progressiva astenia e riduzione dell'introito di liquidi. Da alcune ore comparsa di stato confusionale, oliguria e sensazione di ‘battito accelerato’. All’arrivo in PS appare ipoteso, tachicardico, sudato freddo, con estremità fredde e marezzate. Sospetto focolaio urinario o addominale, nessuna terapia antibiotica efficace nelle ultime 24 ore.",
    physicalExam:
      "Parametri vitali: PA 80/45 mmHg, FC 122 bpm, FR 26 atti/min, SpO2 93% in aria ambiente, temperatura 38,9°C. Stato generale: paziente soporoso ma risvegliabile, Glasgow 14, sudorazione fredda, estremità fredde, riempimento capillare rallentato. Cute marezzata. Addome: moderatamente dolente in ipogastrio e fossa lombare destra senza segni di peritonite franca. Esame cardiopolmonare: toni tachicardici, murmure vescicolare conservato con respiro tachipnoico. Diuresi molto ridotta riferita nelle ultime 12 ore.",
    truth: {
      correctDiagnosis:
        "Shock settico in paziente con sospetta origine urinaria/addominale e ipotensione refrattaria",
      mandatoryQuestions: [
        "durata di febbre, brividi e sede dei sintomi iniziali (urinari, respiratori, addominali)",
        "quantità di urine nelle ultime 24 ore (oliguria/anuria)",
        "assunzione recente di antibiotici, tipo, dose e durata",
        "patologie croniche associate (diabete, cardiopatie, immunodeficienze)",
        "eventuali procedure invasive recenti (cateteri, interventi chirurgici)",
      ],
      requiredExams: [
        "Emogasanalisi arteriosa con lattati",
        "Emocromo, indici di flogosi, funzionalità renale ed epatica, coagulazione",
        "Emocolture e urinocoltura prima di antibiotico, se possibile senza ritardo significativo",
        "Ecografia point-of-care o TC mirata in base al sospetto di focolaio",
        "Monitoraggio intensivo in area critica con valutazione per supporto vasopressorio",
      ],
      unnecessaryExams: [
        "TC Total Body non mirata che ritardi la somministrazione di antibiotico e fluidoterapia",
        "Esami radiologici ripetuti senza finalità decisionale chiara nelle prime ore",
      ],
      legalReference:
        "Gestione dello shock settico: le linee guida internazionali (es. Surviving Sepsis Campaign) e i percorsi tempo-dipendenti nazionali richiedono avvio entro 1 ora di antibiotico adeguato, fluidoterapia aggressiva e misurazione dei lattati; ritardi ingiustificati configurano elevato rischio di responsabilità professionale ai sensi della Legge 24/2017.",
    },
  },
  {
    id: "emergenza-11-chetoacidosi-diabetica",
    specialty: "Emergenza",
    patientName: "Marta",
    patientAge: 21,
    patientSex: "F",
    initialMessage:
      "Dottore, da qualche giorno bevo e urino tantissimo, ho mal di pancia forte, mi sento svenire e il respiro è molto pesante.",
    patientProfile:
      "Giovane donna di 21 anni con diabete mellito di tipo 1 noto dall’adolescenza, aderenza discontinua alla terapia insulinica. Da 3–4 giorni poliuria marcata, polidipsia, calo ponderale recente. Da 24 ore nausea, vomito ripetuto, dolore addominale e respiro frequente e profondo. I familiari riferiscono alito con odore di frutta matura. Nessun focolaio infettivo chiaro ma recente episodio influenzale.",
    physicalExam:
      "Parametri vitali: PA 95/60 mmHg, FC 118 bpm, FR 30 atti/min con respiro di Kussmaul, SpO2 97% in aria ambiente, temperatura 37,5°C. Stato generale: paziente vigile ma rallentata, mucose molto secche, turgore cutaneo ridotto. Alito acetonemico evidente. Addome diffusamente dolente alla palpazione, ma senza segni di peritonite. Estremità fredde, riempimento capillare rallentato. Nessun deficit neurologico focale.",
    truth: {
      correctDiagnosis:
        "Chetoacidosi diabetica (DKA) severa in paziente con diabete di tipo 1",
      mandatoryQuestions: [
        "schema insulinico abituale e aderenza alla terapia negli ultimi giorni",
        "valori glicemici domiciliari recenti e presenza di chetonuria/chetonemia nota",
        "presenza di nausea, vomito, dolore addominale e riduzione dell'introito di liquidi",
        "eventuali fattori scatenanti (infezioni, stress fisici, sospensione di insulina)",
        "episodi precedenti di DKA e modalità di gestione",
      ],
      requiredExams: [
        "Glicemia immediata capillare e venosa",
        "Emogasanalisi arteriosa (pH, bicarbonati, lattati)",
        "Corpi chetonici su sangue/urine",
        "Elettroliti con particolare attenzione al potassio, azotemia e creatinina",
        "Monitoraggio elettrocardiografico e frequente rivalutazione dei parametri vitali",
      ],
      unnecessaryExams: [
        "TC Addome in assenza di segni di addome acuto chirurgico",
        "RX Torace routinario se non sospetto focolaio infettivo respiratorio",
      ],
      legalReference:
        "Gestione della chetoacidosi diabetica: la correzione rapida ma controllata della disidratazione, dell'acidosi e degli squilibri elettrolitici è obbligo assistenziale; errori grossolani nella gestione del potassio o ritardi nella somministrazione di insulina in infusione possono configurare responsabilità per eventi avversi gravi.",
    },
  },
  {
    id: "emergenza-12-meningite-batterica-acuta",
    specialty: "Emergenza",
    patientName: "Claudia",
    patientAge: 44,
    patientSex: "F",
    initialMessage:
      "Dottore, da ieri ho una febbre altissima, un mal di testa insopportabile e la luce mi dà molto fastidio. Mi fa male anche il collo quando provo a piegarlo.",
    patientProfile:
      "Donna di 44 anni, precedentemente sana, esordio da 24 ore con febbre elevata, cefalea intensa diffusa, nausea e vomito. Riferisce fotofobia marcata e dolore alla flessione del collo. All’arrivo in PS appare sofferente, sudata, con rigidità nucale evidente. Non recente trauma cranico, non uso di anticoagulanti. Non viaggi internazionali recenti, ma esposizione a ambiente comunitario (insegnante).",
    physicalExam:
      "Parametri vitali: PA 115/70 mmHg, FC 110 bpm, FR 24 atti/min, SpO2 96% in aria ambiente, temperatura 39,5°C. Stato generale: paziente vigile ma rallentata, risponde lentamente alle domande. Rigidità nucale marcata, segni di Kernig e Brudzinski positivi. Non deficit neurologici focali evidenti agli arti, ma fotofobia intensa. Torace e addome senza reperti patologici acuti. Cute senza petecchie diffuse al momento, ma alcune macchie eritematose agli arti inferiori.",
    truth: {
      correctDiagnosis:
        "Sospetta meningite batterica acuta in adulta con febbre, cefalea intensa e segni meningei",
      mandatoryQuestions: [
        "durata di febbre, cefalea e comparsa dei segni meningei",
        "eventuali contatti con casi noti di meningite o soggiorni in comunità ad alta densità",
        "uso di antibiotici nelle ultime 48–72 ore",
        "stato vaccinale per meningococco, pneumococco e Haemophilus",
        "presenza di deficit neurologici focali, crisi epilettiche o alterazione del livello di coscienza",
      ],
      requiredExams: [
        "Emocromo, indici di flogosi, funzionalità renale ed epatica, coagulazione",
        "TC Encefalo prima della rachicentesi se indicato (es. segni di ipertensione endocranica, deficit focali)",
        "Rachicentesi con esame del liquido cerebrospinale (citologia, biochimica, coltura, PCR)",
        "Emocolture prima dell'antibiotico se possibile senza ritardo",
        "Monitoraggio intensivo dei parametri vitali e valutazione per ricovero in area ad alta intensità di cura",
      ],
      unnecessaryExams: [
        "TC/RM ripetute non mirate che ritardano la rachicentesi e la terapia antibiotica",
        "Esami radiologici non correlati (RX Colonna, RX Arti) in assenza di traumi",
      ],
      legalReference:
        "Gestione della meningite batterica acuta: è fondamentale non ritardare l’avvio di terapia antibiotica empirica ad ampio spettro e la rachicentesi (se non controindicata). Ritardi ingiustificati nella diagnosi e nel trattamento possono configurare elevata responsabilità professionale ai sensi della Legge Gelli-Bianco.",
    },
  },
  {
    id: "gastro-3-itto-ostruttivo-sospetto-tumore-periampollare",
    specialty: "Gastroenterologia ed Endoscopia",
    patientName: "Enrico",
    patientAge: 72,
    patientSex: "M",
    initialMessage:
      "Dottore, da qualche settimana mi dicono che sono diventato giallo, le urine sono molto scure e ho perso l’appetito. Mi sento più stanco e ho perso diversi chili.",
    patientProfile:
      "Uomo di 72 anni, ex fumatore, storia di ipertensione e diabete mellito tipo 2 in buon controllo. Da 3–4 settimane riferisce ittero progressivo con colorazione giallastra di cute e sclere, urine scure tipo ‘coca‑cola’ e feci più chiare del solito. Lamenta astenia marcata, calo dell’appetito e perdita di circa 6 kg nell’ultimo mese. Episodi di dolore sordo in ipocondrio destro e regione epigastrica, non colico, talora irradiato posteriormente. Nessuna recente colica biliare nota, nessun intervento chirurgico addominale pregresso. Non abuso alcolico attuale, ma modesto consumo cronico in passato.",
    physicalExam:
      "Parametri vitali: PA 130/75 mmHg, FC 86 bpm, FR 18 atti/min, SpO2 98% in aria ambiente, temperatura 36,7°C. Stato generale: paziente vigile, astenico, marcatamente itterico a cute e sclere. Addome: trattabile, lieve dolorabilità in ipocondrio destro e regione epigastrica, senza segni di peritonismo; possibile lieve tumefazione palpabile in sede epigastrica. Non splenomegalia evidente. Segno di Murphy negativo. Non ascite clinicamente apprezzabile. Cute: lievi escoriazioni da prurito diffuso. Arti inferiori: assenza di edemi importanti.",
    truth: {
      correctDiagnosis:
        "Sospetta neoplasia periampollare / della testa del pancreas con ittero ostruttivo",
      mandatoryQuestions: [
        "durata di ittero, prurito, urine ipercromiche e feci ipocoliche/anacoliche",
        "presenza, sede e caratteristiche del dolore addominale (epigastrio, ipocondrio destro, irradiazione dorsale)",
        "calo ponderale involontario e riduzione dell’appetito",
        "storia di colelitiasi nota o coliche biliari pregresse",
        "abitudine alcolica e storia di pancreatite acuta/cronica",
        "familiarità per neoplasie pancreatiche, biliari o epatiche",
        "uso di farmaci potenzialmente colestatici o epatotossici",
      ],
      requiredExams: [
        "Emocromo, indici di flogosi, funzionalità epatica completa (AST, ALT, ALP, GGT, Bilirubina totale e frazionata)",
        "Funzionalità renale ed elettroliti",
        "Ecografia addome superiore (studio vie biliari e colecisti)",
        "TC Addome con mezzo di contrasto (studio pancreas e vie biliari)",
        "CPRE (Colangiopancreatografia retrograda endoscopica)",
        "EUS (Ecoendoscopia) per caratterizzazione della lesione e prelievo bioptico",
      ],
      unnecessaryExams: [
        "TC Total Body senza indicazioni specifiche prima di aver eseguito imaging mirato epato‑biliare/pancreatico",
        "RM Total Body di screening aspecifico",
        "Endoscopie ripetute a breve distanza senza nuove indicazioni cliniche",
      ],
      legalReference:
        "Linee guida per l’inquadramento dell’ittero ostruttivo: la mancata attivazione tempestiva del percorso diagnostico epato‑biliare e pancreatico (ecografia, TC, EUS/CPRE) in presenza di segni di colestasi marcata può configurare ritardo diagnostico di neoplasia periampollare o pancreatica, con perdita di chance di trattamento resecabile.",
      examFindings: {
        "CPRE (Colangiopancreatografia retrograda endoscopica)":
          "All’esame endoscopico si osserva papilla di Vater lievemente prominente. Alla colangiografia si evidenzia stenosi rigida e corta del tratto distale del coledoco con dilatazione a monte delle vie biliari intra‑ ed extra‑epatiche. Viene posizionato stent plastico/metallico autoespandibile nel coledoco con buon deflusso di bile. L’aspetto radiologico e endoscopico è suggestivo per lesione neoplastica periampollare.",
        "EUS (Ecoendoscopia)":
          "L’EUS mostra una massa ipoecogena di circa 2,5–3 cm a livello della testa del pancreas, con margini irregolari e lieve dilatazione del dotto pancreatico principale a monte. Non chiara invasione dei vasi mesenterici superiori; alcuni linfonodi peripancreatici aumentati di volume. Eseguite FNA/FNB eco‑guidate della lesione per diagnosi citologica/istologica.",
      },
    },
  },
  {
    id: "pneumo-3-nodulo-polmonare-centrale-sospetto-neoplasia",
    specialty: "Pneumologia / Oncologia Toracica",
    patientName: "Giovanna",
    patientAge: 65,
    patientSex: "F",
    initialMessage:
      "Dottore, da qualche mese mi capita spesso di tossire, a volte con un po’ di sangue, e faccio più fatica del solito a respirare quando salgo le scale.",
    patientProfile:
      "Donna di 65 anni, grande fumatrice (45 pacchetti/anno), tosse cronica da anni. Negli ultimi 3–4 mesi riferisce peggioramento della tosse, più insistente, con sporadici episodi di emoftoe striata. Lamenta dispnea da sforzo moderato, calo dell’appetito e perdita di circa 4 kg in tre mesi. Nessun episodio febbrile significativo, non sintomi infettivi acuti. Non pregressi tumori noti. Nessun recente viaggio o esposizione occupazionale rilevante riportata.",
    physicalExam:
      "Parametri vitali: PA 125/80 mmHg, FC 92 bpm, FR 20 atti/min, SpO2 95% in aria ambiente, temperatura 36,6°C. Stato generale: paziente vigile, magra, con lieve dispnea da sforzo. Torace: murmure vescicolare globalmente conservato, ma ridotto in regione ilo‑parailare destra, con possibili ronchi localizzati; nessun segno di versamento pleurico evidente all’esame obiettivo. Cuore: toni ritmici, non soffi maggiori. Non edemi declivi. Cute e mucose senza cianosi marcata.",
    truth: {
      correctDiagnosis:
        "Sospetta neoplasia polmonare centrale (lesione ilare) in grande fumatrice con emoftoe",
      mandatoryQuestions: [
        "durata e andamento della tosse cronica e del peggioramento recente",
        "presenza, quantità e frequenza dell’emoftoe",
        "calo ponderale, astenia e altri sintomi generali (sudorazioni notturne, febbricola)",
        "storia tabagica dettagliata (pacchetti/anno) e eventuale cessazione",
        "eventuali esposizioni occupazionali (asbesto, polveri, sostanze chimiche)",
        "precedenti radiografie/TC torace e loro esiti",
        "presenza di dolore toracico, raucedine o disfagia",
      ],
      requiredExams: [
        "Emocromo, indici di flogosi e funzionalità ematochimica di base",
        "RX Torace in due proiezioni",
        "TC Torace con mezzo di contrasto (studio del parenchima e degli ilari)",
        "Broncoscopia",
        "EBUS (Endobronchial Ultrasound) con eventuale agoaspirato linfonodale e/o della lesione",
      ],
      unnecessaryExams: [
        "TC Total Body di screening senza indicazioni specifiche prima di aver eseguito imaging toracico mirato",
        "RM Torace routinaria in prima battuta",
        "Esami radiologici di altri distretti non correlati al quadro (colonna, arti) in assenza di sintomi specifici",
      ],
      legalReference:
        "Nella gestione di pazienti ad alto rischio (grandi fumatori) con emoftoe e sospetto nodulo centrale, la mancata esecuzione tempestiva di TC torace e broncoscopia/EBUS può configurare ritardo diagnostico di neoplasia polmonare con peggioramento della prognosi e riduzione delle opzioni terapeutiche.",
      examFindings: {
        Broncoscopia:
          "All’esame broncoscopico si osserva, a livello del bronco lobare superiore destro, una lesione vegetante, friabile, che stenotizza significativamente il lume bronchiale. La mucosa circostante appare eritematosa e ispessita. Eseguite biopsie multiple della lesione e lavaggio bronchiale per citologia. Sanguinamento moderato controllato con adrenalina topica.",
        "EBUS (Endobronchial Ultrasound)":
          "L’EBUS evidenzia linfonodi ipoecogeni aumentati di volume in sede mediastinica (stazioni 4R e 7), con caratteristiche ecografiche sospette per secondarismi. Eseguito agoaspirato transbronchiale (TBNA) eco‑guidato dei linfonodi 4R e 7 per stadiazione istologica. Lesione endobronchiale centrale confermata in corrispondenza del bronco lobare superiore destro.",
      },
    },
  },
];

