// ==================== STUPI ====================
use("ECBD_PRJ");
// db.stupi.find({
//   "zona_ecologica.nivel_poluanti": { $gt: 20 },
//   activ: false,
// });

db.stupi.deleteOne({
  "zona_ecologica.nivel_poluanti": { $gt: 20 },
  activ: false,
});

use("ECBD_PRJ");
// db.stupi.find({
//   $or: [
//     { data_instalare: { $lt: new Date("2020-01-01") } },
//     {
//       $and: [
//         { "zona_ecologica.indice_fauna": { $lt: 4 } },
//         { "zona_ecologica.indice_flora": { $lt: 4 } },
//       ],
//     },
//   ],
// });

db.stupi.deleteMany({
  $or: [
    { data_instalare: { $lt: new Date("2020-01-01") } },
    {
      $and: [
        { "zona_ecologica.indice_fauna": { $lt: 4 } },
        { "zona_ecologica.indice_flora": { $lt: 4 } },
      ],
    },
  ],
});

// ==================== COLONII ====================
use("ECBD_PRJ");
// db.colonii.find({
//   numar_albine: { $lt: 30_000 },
// });

db.colonii.deleteOne({
  numar_albine: { $lt: 30_000 },
});

use("ECBD_PRJ");
// db.colonii.find({
//   specie: "Apis mellifera carnica",
//   "stare_sanatate.nevoie_interventie": true,
//   numar_albine: { $gte: 25_000, $lt: 36_000 },
// });

db.colonii.deleteMany({
  specie: "Apis mellifera carnica",
  "stare_sanatate.nevoie_interventie": true,
  numar_albine: { $gte: 25_000, $lt: 36_000 },
});

// ==================== RECOLTE ====================
use("ECBD_PRJ");
// db.recolte.find({
//   calitate: "Scazuta",
//   cantitate_kg: { $lt: 5 },
// });

db.recolte.deleteOne({
  calitate: "Scazuta",
  cantitate_kg: { $lt: 5 },
});

use("ECBD_PRJ");
// db.recolte.find({
//   data_recolta: {
//     $lt: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
//   },
// });

// Sterge recoltele vechi de 3 ani
db.recolte.deleteMany({
  data_recolta: {
    $lt: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
  },
});
