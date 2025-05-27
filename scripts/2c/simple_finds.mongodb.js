use("ECBD_PRJ");
db.colonii
  .find({
    istoric_interventii: {
      $elemMatch: {
        data: { $gte: new Date("2024-01-01") },
        interventie: "Observatie externa",
      },
    },
  })
  .sort({
    "istoric_interventii.data": -1,
  });

use("ECBD_PRJ");
db.colonii.find({
  istoric_interventii: { $size: 0 },
});

use("ECBD_PRJ");
db.colonii
  .find(
    {
      "istoric_interventii.interventie": {
        $all: ["Inspectie generala", "Observatie externa"],
      },
    },
    {
      _id: 0,
      specie: 1,
      numar_albine: 1,
      "stare_sanatate.nivel": 1,
      istoric_interventii: 1,
    }
  )
  .sort({ numar_albine: -1 });

use("ECBD_PRJ");
db.colonii.find({
  $or: [
    { "stare_sanatate.nevoie_interventie": null },
    { "stare_sanatate.nevoie_interventie": { $exists: false } },
  ],
});

use("ECBD_PRJ");
db.stupi.find({}).sort({
  "zona_ecologica.nivel_poluanti": 1,
  "zona_ecologica.indice_flora": -1,
});

// ==================== CAUTARE PAGINATA ====================
use("ECBD_PRJ");
let page = 1;
let resultsPerPage = 10;

db.recolte
  .find({
    data_recolta: { $gte: new Date("2024-01-01") },
  })
  .sort({
    data_recolta: -1,
  })
  .skip((page - 1) * resultsPerPage)
  .limit(resultsPerPage);

use("ECBD_PRJ");
page = 3;
resultsPerPage = 2;

db.stupi
  .find({
    _id: { $regex: "^STP_URB" },
  })
  .sort({
    data_recolta: -1,
  });

use("ECBD_PRJ");
page = 1;
resultsPerPage = 12;

page = db.colonii
  .find(
    {
      $or: [
        { "stare_sanatate.nivel": "Nesanatoase" },
        { nivel_agresivitate: { $gte: 7 } },
      ],
      "istoric_interventii.0": { $exists: true },
    },
    {
      specie: 1,
      numar_albine: 1,
      nivel_agresivitate: 1,
      "stare_sanatate.nivel": 1,
      istoric_interventii: { $slice: 2 },
    }
  )
  .sort({
    nivel_agresivitate: -1,
    numar_albine: -1,
  })
  .skip((page - 1) * resultsPerPage)
  .limit(resultsPerPage);
