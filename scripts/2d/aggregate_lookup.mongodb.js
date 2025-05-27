use("ECBD_PRJ");
db.stupi.aggregate([
  {
    $lookup: {
      from: "colonii",
      localField: "id_colonie",
      foreignField: "_id",
      as: "colonie",
    },
  },
  {
    $lookup: {
      from: "recolte",
      let: { stup_id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$id_stup", "$$stup_id"] },
            data_recolta: { $gte: new Date(2023, 0, 1) },
          },
        },
      ],
      as: "recolte_recente",
    },
  },
  {
    $addFields: {
      productie_recenta: { $sum: "$recolte_recente.cantitate_kg" },
      colonie_info: { $arrayElemAt: ["$colonie", 0] },
    },
  },
  // Identificam stupi cu probleme
  {
    $match: {
      activ: true,
      $or: [
        { "colonie_info.stare_sanatate.nivel": "Nesanatoase" },
        { productie_recenta: { $lt: 20 } },
      ],
    },
  },
  {
    $sort: {
      productie_recenta: 1,
    },
  },
  {
    $project: {
      id_stup: 1,
      "zona_ecologica.tip": 1,
      "zona_ecologica.nivel_poluanti": 1,
      "colonie.specie": 1,
      "colonie.numar_albine": 1,
      "colonie.stare_sanatate": 1,
      "colonie.istoric_interventii": 1,
    },
  },
]);
