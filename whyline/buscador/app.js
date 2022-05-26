const express = require("express");
const app = express();
const datos_whyline = require("./datos_whyline");
const datos_whyline_subscription = require("./datos_whyline_subscription");

// index routes
app.get("/", (_req, res) => {
  res.send("Hello World!");
});
//Ruta coches usa a la funcion consulta
app.get("/whyline/:desde/:hasta", datos_whyline.consulta);
app.get("/subscriptions/:desde/:hasta", datos_whyline_subscription.consulta);

app.listen(8080, () => {
  console.log("server iniciado en puerto 8080");
});
