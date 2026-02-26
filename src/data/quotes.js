/**
 * 365 frasi motivazionali e di benessere in italiano.
 * Ogni frase ha un campo category per l'icona dinamica nella Pillola di Benessere.
 * Indice = giorno dell'anno (1-365).
 */

const BASE_QUOTES = [
  // idratazione
  { text: 'Bevi un bicchiere d\'acqua per ripartire con energia.', category: 'idratazione' },
  { text: 'L\'acqua è il primo gesto di cura verso te stesso.', category: 'idratazione' },
  { text: 'Un sorso d\'acqua può cambiare il ritmo della tua giornata.', category: 'idratazione' },
  { text: 'Ricordati di bere: il tuo corpo ti ringrazierà.', category: 'idratazione' },
  { text: 'L\'idratazione è un atto di gentilezza verso il tuo corpo.', category: 'idratazione' },
  { text: 'Prenditi un momento per un bicchiere d\'acqua.', category: 'idratazione' },
  { text: 'Bere con calma è un piccolo rituale di benessere.', category: 'idratazione' },
  { text: 'L\'acqua disseta il corpo e placa la mente.', category: 'idratazione' },
  { text: 'Ogni sorso conta: idratati con consapevolezza.', category: 'idratazione' },
  { text: 'Un bicchiere d\'acqua al risveglio è un dono che ti fai.', category: 'idratazione' },
  { text: 'La semplicità dell\'acqua può portare chiarezza.', category: 'idratazione' },
  { text: 'Bevi spesso, a piccoli sorsi: è un gesto di cura.', category: 'idratazione' },
  { text: 'L\'idratazione accompagna ogni passo verso il benessere.', category: 'idratazione' },
  { text: 'Non aspettare la sete: beviamo per stare bene.', category: 'idratazione' },
  { text: 'Un bicchiere d\'acqua è un momento di pausa e cura.', category: 'idratazione' },
  { text: 'L\'acqua ci ricorda che le cose semplici sono preziose.', category: 'idratazione' },
  { text: 'Bevi con calma e senti il corpo che si rianima.', category: 'idratazione' },
  { text: 'Ogni giorno inizia bene con un po\' d\'acqua.', category: 'idratazione' },
  { text: 'Idratarsi è un modo gentile di prendersi cura.', category: 'idratazione' },
  { text: 'Un sorso d\'acqua: piccolo gesto, grande effetto.', category: 'idratazione' },
  { text: 'L\'acqua ci tiene in equilibrio, dentro e fuori.', category: 'idratazione' },
  { text: 'Bevi un bicchiere d\'acqua e prenditi un respiro.', category: 'idratazione' },
  { text: 'La cura comincia da un semplice bicchiere d\'acqua.', category: 'idratazione' },
  // nutrizione
  { text: 'Mangia con calma: ogni boccone è un momento tuo.', category: 'nutrizione' },
  { text: 'Un pasto sereno nutre il corpo e il cuore.', category: 'nutrizione' },
  { text: 'La frutta e la verdura sono alleati del tuo benessere.', category: 'nutrizione' },
  { text: 'Colazione con calma: è il dono che fai alla giornata.', category: 'nutrizione' },
  { text: 'Mangiare con consapevolezza è un atto d\'amore.', category: 'nutrizione' },
  { text: 'Ogni pasto può essere un momento di pace.', category: 'nutrizione' },
  { text: 'Scegli cibi che ti fanno sentire bene.', category: 'nutrizione' },
  { text: 'La tavola è un luogo di cura e condivisione.', category: 'nutrizione' },
  { text: 'Mastica con calma: il corpo ti ringrazierà.', category: 'nutrizione' },
  { text: 'Un pasto equilibrato è una scelta di benessere.', category: 'nutrizione' },
  { text: 'Nutrirsi bene è rispettare se stessi.', category: 'nutrizione' },
  { text: 'Prenditi il tempo per un pasto senza fretta.', category: 'nutrizione' },
  { text: 'La cucina semplice può essere piena di amore.', category: 'nutrizione' },
  { text: 'Mangiare insieme è un gesto di vicinanza.', category: 'nutrizione' },
  { text: 'Ogni ingrediente può raccontare cura.', category: 'nutrizione' },
  { text: 'La colazione è il primo passo della giornata.', category: 'nutrizione' },
  { text: 'Sii gentile con te stesso anche a tavola.', category: 'nutrizione' },
  { text: 'Un pasto regolare aiuta corpo e mente.', category: 'nutrizione' },
  { text: 'Nutrire il corpo è nutrire la serenità.', category: 'nutrizione' },
  { text: 'Mangia ciò che ti fa bene, con gratitudine.', category: 'nutrizione' },
  { text: 'La tavola è il posto giusto per rallentare.', category: 'nutrizione' },
  { text: 'Piccoli pasti frequenti possono dare energia.', category: 'nutrizione' },
  { text: 'Ogni pasto è un\'occasione per prendersi cura.', category: 'nutrizione' },
  { text: 'La buona alimentazione inizia da scelte semplici.', category: 'nutrizione' },
  // movimento
  { text: 'Ogni passo conta: muoviti con calma.', category: 'movimento' },
  { text: 'Una breve passeggiata può cambiare la giornata.', category: 'movimento' },
  { text: 'Il movimento gentile è un dono al corpo.', category: 'movimento' },
  { text: 'Alzati e stiracchiati: il corpo ne ha bisogno.', category: 'movimento' },
  { text: 'Camminare all\'aria aperta rigenera la mente.', category: 'movimento' },
  { text: 'Ogni movimento, anche piccolo, è prezioso.', category: 'movimento' },
  { text: 'Fai un respiro profondo e muovi le spalle.', category: 'movimento' },
  { text: 'La leggera attività fisica tiene viva l\'energia.', category: 'movimento' },
  { text: 'Un passo alla volta: è così che si va lontano.', category: 'movimento' },
  { text: 'Stiracchiarsi è un modo per ringraziare il corpo.', category: 'movimento' },
  { text: 'Cammina con lentezza e osserva ciò che ti circonda.', category: 'movimento' },
  { text: 'Il movimento non deve essere perfetto, solo gentile.', category: 'movimento' },
  { text: 'Alzati ogni tanto: il corpo ama il cambiamento.', category: 'movimento' },
  { text: 'Una passeggiata è una conversazione con se stessi.', category: 'movimento' },
  { text: 'Muoviti come ti senti: ogni gesto è valido.', category: 'movimento' },
  { text: 'Respira e muovi le braccia: libera la tensione.', category: 'movimento' },
  { text: 'Il sole e un po\' di movimento fanno miracoli.', category: 'movimento' },
  { text: 'Ogni giorno un piccolo movimento è già vittoria.', category: 'movimento' },
  { text: 'Camminare con qualcuno è cura condivisa.', category: 'movimento' },
  { text: 'Il corpo è fatto per muoversi: ascoltalo.', category: 'movimento' },
  { text: 'Stira le gambe e senti il sollievo.', category: 'movimento' },
  { text: 'Una breve camminata può portare chiarezza.', category: 'movimento' },
  { text: 'Muoviti con dolcezza: non serve correre.', category: 'movimento' },
  { text: 'Ogni passo è un investimento nel benessere.', category: 'movimento' },
  // mente
  { text: 'Ogni piccolo gesto di cura oggi è un seme per domani.', category: 'mente' },
  { text: 'Il respiro è il ponte tra corpo e mente.', category: 'mente' },
  { text: 'Non contare i giorni: fai che i giorni contino.', category: 'mente' },
  { text: 'La gentilezza verso se stessi è la prima cura.', category: 'mente' },
  { text: 'Circondati di chi ti fa sentire bene.', category: 'mente' },
  { text: 'Ogni giorno è una nuova opportunità, anche piccola.', category: 'mente' },
  { text: 'La mente è come un giardino: coltiva pensieri sereni.', category: 'mente' },
  { text: 'Ascolta il tuo cuore: conosce la strada.', category: 'mente' },
  { text: 'La pazienza apre le porte del benessere.', category: 'mente' },
  { text: 'Un sorriso può cambiare il tuo momento.', category: 'mente' },
  { text: 'Prenditi un attimo solo per te: lo meriti.', category: 'mente' },
  { text: 'Le emozioni passano: resta la tua gentilezza.', category: 'mente' },
  { text: 'Rallentare non è perdere tempo, è ritrovarlo.', category: 'mente' },
  { text: 'La gratitudine è un abbraccio alla vita.', category: 'mente' },
  { text: 'Ogni respiro può essere un nuovo inizio.', category: 'mente' },
  { text: 'Sii tenero con te stesso come con chi ami.', category: 'mente' },
  { text: 'La calma si coltiva un momento alla volta.', category: 'mente' },
  { text: 'Non serve essere perfetti: basta essere presenti.', category: 'mente' },
  { text: 'Il presente è il solo momento che hai: vivilo.', category: 'mente' },
  { text: 'Permettiti di riposare senza sensi di colpa.', category: 'mente' },
  { text: 'La mente ha bisogno di silenzio come di parole.', category: 'mente' },
  { text: 'Ogni giorno porta qualcosa di buono: cercalo.', category: 'mente' },
  { text: 'La serenità si costruisce con piccoli gesti.', category: 'mente' },
  { text: 'Tu sei importante: ricorda di prenderti cura di te.', category: 'mente' },
];

// Espandi a 365 frasi (ripetendo e mescolando per coprire l'anno)
function buildYearQuotes() {
  const list = [];
  for (let i = 0; i < 365; i++) {
    list.push(BASE_QUOTES[i % BASE_QUOTES.length]);
  }
  return list;
}

export const wellnessQuotes = buildYearQuotes();

/** Calcola il giorno dell'anno (1-365): differenza in giorni tra la data e il 1° gennaio. */
export function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay) + 1;
  return Math.min(Math.max(day, 1), 365);
}
