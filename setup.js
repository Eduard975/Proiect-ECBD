function createCollections() {
  const session = db.getMongo().startSession();
  const dbHandle = session.getDatabase("ECBD_PRJ");

  const stupi_schema = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "_id",
        "zona_ecologica",
        "tip_stup",
        "data_instalare",
        "activ",
        "id_colonie",
      ],
      properties: {
        _id: {
          bsonType: "string",
          pattern: "^STP_(URB|RUR|MTN|IND)_\\d{3}$",
          description: "Custom ID in format STP_<ZONE>_<NUM>",
        },
        zona_ecologica: {
          bsonType: "object",
          required: ["tip", "nivel_poluanti", "indice_flora", "indice_fauna"],
          properties: {
            tip: { bsonType: "string" },
            nivel_poluanti: { bsonType: "double" },
            indice_flora: { bsonType: "int" },
            indice_fauna: { bsonType: "int" },
          },
        },
        tip_stup: { bsonType: "string" },
        data_instalare: { bsonType: "date" },
        activ: { bsonType: "bool" },
        id_colonie: { bsonType: "objectId" },
      },
    },
  };

  const colonii_schema = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "specie",
        "numar_albine",
        "nivel_agresivitate",
        "stare_sanatate",
        "istoric_interventii",
      ],
      properties: {
        specie: { bsonType: "string" },
        numar_albine: { bsonType: "int" },
        nivel_agresivitate: { bsonType: "int" },
        stare_sanatate: {
          bsonType: "object",
          required: ["nivel"],
          properties: {
            nivel: {
              enum: ["Sanatoase", "Posibil nesanatoase", "Nesanatoase"],
            },
            nevoie_control: { bsonType: "bool" },
            nevoie_interventie: { bsonType: "bool" },
          },
        },
        istoric_interventii: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["data", "descriere", "interventie"],
            properties: {
              data: { bsonType: "date" },
              descriere: { bsonType: "string" },
              interventie: { bsonType: "string" },
            },
          },
        },
      },
      dependencies: {
        "stare_sanatate.nivel": {
          oneOf: [
            {
              properties: {
                stare_sanatate: {
                  properties: {
                    nivel: { enum: ["Sanatoase"] },
                  },
                },
              },
            },
            {
              properties: {
                stare_sanatate: {
                  properties: {
                    nivel: { enum: ["Posibil nesanatoase"] },
                    nevoie_control: { bsonType: "bool" },
                  },
                  required: ["nevoie_control"],
                },
              },
            },
            {
              properties: {
                stare_sanatate: {
                  properties: {
                    nivel: { enum: ["Nesanatoase"] },
                    nevoie_interventie: { bsonType: "bool" },
                  },
                  required: ["nevoie_interventie"],
                },
              },
            },
          ],
        },
      },
    },
  };

  const recolte_schema = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "id_stup",
        "cantitate_kg",
        "data_recolta",
        "tip_miere",
        "calitate",
      ],
      properties: {
        id_stup: { bsonType: "string" },
        cantitate_kg: { bsonType: "double" },
        data_recolta: { bsonType: "date" },
        tip_miere: { bsonType: "string" },
        calitate: { bsonType: "string" },
      },
    },
  };

  const colectii = [
    { nume: "stupi", schema: stupi_schema },
    { nume: "colonii", schema: colonii_schema },
    { nume: "recolte", schema: recolte_schema },
  ];

  for (const colectie of colectii) {
    const col = colectie.nume;
    dbHandle[col].drop();
  }

  let result = {};

  try {
    session.startTransaction();

    for (const colectie of colectii) {
      dbHandle.createCollection(colectie.nume, {
        validator: colectie.schema,
        validationLevel: "strict",
        validationAction: "error",
      });
      result[`create_${colectie.nume}`] = "success";
    }

    session.commitTransaction();
  } catch (err) {
    session.abortTransaction();
    throw new Error(
      "Transaction failed, all operations rolled back. Error: " + err.message
    );
  } finally {
    session.endSession();
  }

  return result;
}

try {
  const rez = createCollections();
  printjson(rez);
} catch (error) {
  print("Error creating collections: " + error.message);
}
