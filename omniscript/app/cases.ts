export interface ClinicalCaseTruth {
  correctDiagnosis: string;
  mandatoryQuestions: string[];
  requiredExams: string[];
  unnecessaryExams: string[];
  legalReference: string;
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
];

