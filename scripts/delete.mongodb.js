function deleteOneFromCollection(dbName, collectionName, filter) {
  const dbHandle = db.getSiblingDB(dbName);
  const result = dbHandle[collectionName].deleteOne(filter);
  return result;
}

deleteOneFromCollection("ECBD_PRJ", "stupi", { _id: "STP_URB_001" });

function deleteManyFromCollection(dbName, collectionName, filter) {
  const dbHandle = db.getSiblingDB(dbName);
  const result = dbHandle[collectionName].deleteMany(filter);
  return result;
}

deleteManyFromCollection("ECBD_PRJ", "recolte", {
  cantitate_kg: {
    $gte: 0,
    $lte: 14,
  },
});
