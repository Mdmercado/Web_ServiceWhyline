const MongoClient = require("mongodb").MongoClient;

// URL de Conexion
const url =
  "mongodb://usrmongo:Jo4Bal3M0ng!@190.106.146.98:27017/whyline?authSource=admin";

// Database Name
const dbName = "whyline";
const client = new MongoClient(url, { useUnifiedTopology: true });
const collection_name = "whyline"; //Nombre de la colección ( o "tabla")

const insertarJSON = async (data) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("entra a try conex");
    try {
      console.log("entra al try");
      db.collection(collection_name).insertMany(data, function (err, res) {
        if (err) throw err;
        console.log(res);
        console.log(res.insertedCount + " documents inserted");
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
    const collection = db.collection("whyline");

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

module.exports = insertarJSON;
