function genereazaIstoricInterventii() {
  const tipuriInterventii = [
    "Inspectie sezon primavara",
    "Tratament varroa",
    "Inspectie sezon vara",
    "Administrare sirop",
    "Verificare regina",
    "Tratament nosemoza",
    "Inspectie sezon toamna",
    "Pregatire iernare",
    "Control boli",
    "Schimbare faguri",
  ];

  const tipuriDetalii = [
    "Observatie externa",
    "Tratament medicamentos",
    "Aplicare acaricid",
    "Hranire artificiala",
    "Interventie curatenie",
    "Schimbare matca",
    "Dezinfectie stupina",
    "Consolidare colonie",
  ];

  const numarInterventii = Math.floor(Math.random() * 5.9);
  const istoric_interventii = [];

  for (let j = 0; j < numarInterventii; j++) {
    istoric_interventii.push({
      data: new Date(
        Math.floor(Math.random() * 5.9) + 2020,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ),
      descriere:
        tipuriInterventii[Math.floor(Math.random() * tipuriInterventii.length)],
      interventie:
        tipuriDetalii[Math.floor(Math.random() * tipuriDetalii.length)],
    });
  }

  return istoric_interventii;
}

function insertColonii(dbName, colNum) {
  const nivelSanatateOptions = [
    { nivel: "Sanatoase" },
    { nivel: "Posibil nesanatoase", nevoie_control: true },
    { nivel: "Nesanatoase", nevoie_interventie: true },
  ];

  const colonii = [];
  for (let i = 0; i < colNum; i++) {
    const stare = nivelSanatateOptions[Math.floor(Math.random() * 3)];

    colonii.push({
      specie: `Apis mellifera ${["carnica", "ligustica", "scutellata"][i % 3]}`,
      numar_albine: 25000 + Math.floor(Math.random() * 25000),
      nivel_agresivitate: Math.floor(Math.random() * 10) + 1,
      stare_sanatate: stare,
      istoric_interventii: genereazaIstoricInterventii(),
    });
  }

  const dbHandle = db.getSiblingDB(dbName);
  const result = dbHandle.colonii.insertMany(colonii);
  return result;
}

function getHighestZoneCount(dbHandle) {
  const zonePrefixes = ["URB", "RUR", "MTN", "IND"];
  const counters = {};

  for (const prefix of zonePrefixes) {
    const last = dbHandle.stupi
      .find({ _id: { $regex: `^STP_${prefix}_\\d{3}$` } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray()[0];

    if (last) {
      const numPart = parseInt(last._id.split("_")[2], 10);
      counters[prefix] = numPart + 1;
    } else {
      counters[prefix] = 1;
    }
  }

  return counters;
}

function insertStupi(dbName, coloniiIds, stupiNum) {
  const dbHandle = db.getSiblingDB(dbName);

  const zoneList = [
    { cod: "URB", tip: "Urbana" },
    { cod: "RUR", tip: "Rurala" },
    { cod: "MTN", tip: "Montana" },
    { cod: "IND", tip: "Industriala" },
  ];

  const tipStupOptions = ["Vertical", "Orizontal", "Multietajat"];
  const stupi = [];
  const usageCount = {};
  Object.values(coloniiIds).forEach((id) => (usageCount[id] = 0));

  const zoneCounters = getHighestZoneCount(dbHandle);

  let i = 0;
  while (i < stupiNum) {
    const zone = zoneList[Math.floor(Math.random() * zoneList.length)];
    const colonieKeys = Object.values(coloniiIds);
    const randomIndex = Math.floor(Math.random() * colonieKeys.length);
    const idColonie = colonieKeys[randomIndex];

    if (usageCount[idColonie] < 2) {
      const stup = {
        _id: `STP_${zone.cod}_${String(zoneCounters[zone.cod]).padStart(
          3,
          "0"
        )}`,
        zona_ecologica: {
          tip: zone.tip,
          nivel_poluanti: parseFloat((Math.random() * 100).toFixed(2)),
          indice_flora: Math.floor(Math.random() * 10) + 1,
          indice_fauna: Math.floor(Math.random() * 10) + 1,
        },
        tip_stup:
          tipStupOptions[Math.floor(Math.random() * tipStupOptions.length)],
        data_instalare: new Date(
          Math.floor(Math.random() * 5.9) + 2020,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
        activ: Math.random() < 0.7,
        id_colonie: idColonie,
      };

      stupi.push(stup);
      usageCount[idColonie]++;
      zoneCounters[zone.cod]++;
      i++;
    }
  }

  const result = dbHandle.stupi.insertMany(stupi);
  return result;
}

function insertRecolte(dbName, stupiIds, recolteNum) {
  const tipuriMiere = ["salcam", "tei", "poliflora", "rapita"];
  const calitati = ["superioara", "medie", "inferioara"];
  const recolte = [];

  for (let i = 0; i < recolteNum; i++) {
    const idStup = stupiIds[Math.floor(Math.random() * stupiIds.length)];
    recolte.push({
      id_stup: idStup,
      cantitate_kg: parseFloat(
        (Math.random() * 15 + Math.random() * 15).toFixed(2)
      ),
      data_recolta: new Date(
        Math.floor(Math.random() * 5.9) + 2020,
        Math.floor(Math.random() * 3) + 3,
        Math.floor(Math.random() * 28) + 1
      ),
      tip_miere: tipuriMiere[Math.floor(Math.random() * tipuriMiere.length)],
      calitate: calitati[Math.floor(Math.random() * calitati.length)],
    });
  }

  const dbHandle = db.getSiblingDB(dbName);
  const result = dbHandle.recolte.insertMany(recolte);
  return result;
}

function populate_db(dbName, colNum, stupiNum, recolteNum) {
  const logs = {};

  logs.colonii = insertColonii(dbName, colNum);
  logs.stupi = insertStupi(dbName, logs.colonii.insertedIds, stupiNum);
  logs.recolte = insertRecolte(
    dbName,
    Object.values(logs.stupi.insertedIds),
    recolteNum
  );

  return logs;
}

const insertionLogs = populate_db("ECBD_PRJ", 16, 20, 15);
printjson(insertionLogs);
