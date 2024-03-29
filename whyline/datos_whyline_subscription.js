const MongoClient = require("mongodb").MongoClient;

// URL de Conexion
const url =
  "mongodb://usrmongo:Jo4Bal3M0ng!@190.106.146.98:27017/whyline?authSource=admin";

// Database Name
const dbName = "whyline_subscription";
const client = new MongoClient(url, { useUnifiedTopology: true });

module.exports.insertarJSON = async (data) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("whyline_subscription");

    try {
      collection.insertMany(data, function (err, res) {
        if (err) throw err;
        console.log("Exito" + res.insertedCount + " documents inserted");
        client.close();
      });
    } catch (e) {
      console.error("Hubo un error al insertar");
      console.error(e);
    }
  } catch (e) {
    console.error("Error de conexión ", e);
  }
};

exports.borrarDesdeHasta = async (desde, hasta) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("whyline_subscription");

    try {
      let resu = await collection.deleteMany({
        fechaEmi: { $gte: desde, $lte: hasta },
      });
      console.log(JSON.stringify(resu));
    } catch (e) {
      console.error("Hubo un error al borrar");
      console.error(e);
    }
  } catch (e) {
    console.error("Error de conexión ", e);
  }
};
