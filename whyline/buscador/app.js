const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const datos_whyline = require("./datos_whyline");
const datos_whyline_subscription = require("./datos_whyline_subscription");

app.use(bodyParser.urlencoded({ extended: true, limit: "40000MB" }));
app.use(bodyParser.json({ limit: "40000MB" }));

// index routes
app.get("/", (_req, res) => {
  res.send("Hello World! whyline API");
});
//Rutas API buscador
app.get("/whyline/:desde/:hasta", datos_whyline.consulta);
app.get("/subscriptions/:desde/:hasta", datos_whyline_subscription.consulta);

app.listen(8080, () => {
  console.log("server iniciado");
});
