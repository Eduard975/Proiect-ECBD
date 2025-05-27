use("ECBD_PRJ");

const page = 1;
const resultsPerPage = 10;
const skipCount = (page - 1) * resultsPerPage;

const totalDocumente = db.recolte.countDocuments({
  calitate: { $in: ["medie", "superioara"] },
  cantitate_kg: { $gte: 15 },
});
db.recolte.aggregate([
  {
    $match: {
      calitate: { $in: ["medie", "superioara"] },
      cantitate_kg: { $gte: 15 },
    },
  },
  {
    $sort: { data_recolta: -1 },
  },
  // Adaug un field care contine al catalea document gasit
  // este documentul curent
  {
    $setWindowFields: {
      sortBy: { data_recolta: -1 },
      output: {
        resultIdx: {
          $documentNumber: {},
        },
      },
    },
  },
  // Adaug un nou field care arata al catalea document
  // din total este documentul curent
  {
    $addFields: {
      resultOfTotal: {
        $concat: [
          { $toString: "$resultIdx" },
          "/",
          { $toString: totalDocumente },
        ],
      },
    },
  },
  {
    $project: {
      id_stup: 1,
      cantitate_kg: 1,
      data_recolta: 1,
      resultOfTotal: 1,
    },
  },
  { $skip: skipCount },
  { $limit: resultsPerPage },
]);
