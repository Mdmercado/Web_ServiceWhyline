const consulta_api = require("./consulta_whyline_subscription");

run = async () => {
  await consulta_api.ejecutarConsultas().finally(() => {
    process.exit();
  });
};

run();
