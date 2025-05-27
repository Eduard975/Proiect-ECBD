db.colonii.aggregate([
  {
    $match: {
      "stare_sanatate.nivel": { $in: ["Posibil nesanatoase", "Nesanatoase"] },
    },
  },

  { $unwind: "$istoric_interventii" },

  {
    $match: {
      "istoric_interventii.data": {
        $gte: new Date(new Date().getFullYear() - 1, 0, 1),
      },
    },
  },

  {
    $group: {
      _id: {
        specie: "$specie",
      },
      numar_interventii: { $sum: 1 },
      colonii_afectate: { $addToSet: "$_id" },
      ultima_interventie: { $max: "$istoric_interventii.data" },
      descrieri: { $push: "$istoric_interventii.descriere" },
    },
  },

  {
    $project: {
      _id: 0,
      specie: "$_id.specie",
      numar_interventii: 1,
      ultima_interventie: 1,
    },
  },

  { $sort: { numar_interventii: -1, ultima_interventie: -1 } },
]);
