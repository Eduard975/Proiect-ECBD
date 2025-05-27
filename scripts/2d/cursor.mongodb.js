use("ECBD_PRJ");

let totalStupi = 0;
const cantitateStupiPerZona = [
  { zona: "Urbana", cantitate: 0 },
  { zona: "Rurala", cantitate: 0 },
  { zona: "Montana", cantitate: 0 },
  { zona: "Industriala", cantitate: 0 },
];

const cursor = db.stupi.find({ activ: true });
cursor.forEach(function (stup) {
  totalStupi++;

  const zona = stup.zona_ecologica.tip;

  for (let i = 0; i < cantitateStupiPerZona.length; i++) {
    if (cantitateStupiPerZona[i].zona === zona) {
      cantitateStupiPerZona[i].cantitate++;
      break;
    }
  }
});

print(`Total Stupi: ${totalStupi}`);
print("Distributie pe zone:");
cantitateStupiPerZona.forEach((x) => {
  print(`\t${x.zona}: ${x.cantitate}`);
});
