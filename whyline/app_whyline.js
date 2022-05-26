const descargar = require("./consulta_whyline");

run = async () => {
  await descargar();
  // await descargar().finally(() => {
  //   process.exit();
  // });
};

run();
