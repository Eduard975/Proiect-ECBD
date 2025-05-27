use("ECBD_PRJ");

db.stupi.bulkWrite([
  {
    updateOne: {
      filter: { "zona_ecologica.tip": "Urbana" },
      update: { $inc: { "zona_ecologica.indice_flora": 1 } },
    },
  },
  {
    updateMany: {
      filter: { tip_stup: "Vertical" },
      update: { $set: { activ: true } },
    },
  },
  {
    deleteOne: {
      filter: {
        _id: "STP_URB_001",
      },
    },
  },
  {
    deleteMany: {
      filter: {
        cantitate_kg: {
          $gte: 0,
          $lte: 14,
        },
      },
    },
  },
]);
