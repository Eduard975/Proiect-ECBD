// ==================== STUPI ====================
use("ECBD_PRJ");
db.stupi.updateOne(
  {
    "zona_ecologica.nivel_poluanti": { $gt: 20 },
    activ: true,
  },
  {
    $set: { activ: false },
  }
);

use("ECBD_PRJ");
db.stupi.updateMany(
  {
    $or: [
      { data_instalare: { $lt: new Date("2020-01-01") } },
      {
        $and: [
          { "zona_ecologica.indice_fauna": { $lt: 6 } },
          { "zona_ecologica.indice_flora": { $lt: 6 } },
        ],
      },
    ],
  },
  {
    $set: {
      activ: false,
      "zona_ecologica.nivel_poluanti": 65.5,
    },
  }
);

// ==================== COLONII ====================
use("ECBD_PRJ");
db.colonii.updateOne(
  {
    numar_albine: { $gt: 36_000 },
  },
  {
    $push: {
      istoric_interventii: {
        data: new Date(),
        descriere: "Control de rutina pentru colonie mare",
        interventie: "Inspectie generala",
      },
    },
  }
);

use("ECBD_PRJ");
db.colonii.updateMany(
  {
    nivel_agresivitate: { $gt: 5 },
    "stare_sanatate.nivel": "Sanatoase",
  },
  {
    $set: {
      "stare_sanatate.nivel": "Posibil nesanatoase",
      "stare_sanatate.nevoie_control": true,
    },
    $inc: { nivel_agresivitate: -1 },
  }
);

// ==================== RECOLTE ====================
use("ECBD_PRJ");
db.recolte.updateOne(
  {
    calitate: "inferioara",
    cantitate_kg: { $gt: 10 },
  },
  {
    $set: { calitate: "medie" },
  }
);

use("ECBD_PRJ");
db.recolte.updateMany(
  {
    data_recolta: {
      $gte: new Date("2023-06-09"),
    },
    cantitate_kg: { $lt: 10 },
    tip_miere: "tei",
  },
  {
    $inc: { cantitate_kg: 0.5 },
    $set: { calitate: "superioara" },
  }
);
