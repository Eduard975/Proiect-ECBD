use("ECBD_PRJ");
db.stupi.aggregate([
  { $match: { activ: true } },

  {
    $group: {
      _id: "$zona_ecologica.tip",
      numar_stupi: { $sum: 1 },
      nivel_poluanti_mediu: { $avg: "$zona_ecologica.nivel_poluanti" },
      indice_flora_mediu: { $avg: "$zona_ecologica.indice_flora" },
      indice_fauna_mediu: { $avg: "$zona_ecologica.indice_fauna" },
      lista_stupi: { $push: "$_id" },
    },
  },

  {
    $sort: {
      nivel_poluanti_mediu: 1,
      indice_flora_mediu: -1,
    },
  },

  {
    $project: {
      zona: "$_id",
      numar_stupi: 1,
      nivel_poluanti_mediu: { $round: ["$nivel_poluanti_mediu", 3] },
      indice_flora_mediu: { $round: ["$indice_flora_mediu", 1] },
      primul_stup: { $arrayElemAt: ["$lista_stupi", 0] },
      _id: 0,
    },
  },
]);
