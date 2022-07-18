const MongoClient = require("mongodb").MongoClient;

//String cadena de conex
// mongodb://myUser:12345678@x.x.x.x:xxxxx/myDatabase
// URL de Conexion
const url =
  "mongodb://usrmongo:Jo4Bal3M0ng!@190.106.146.98:27017/whyline?authSource=admin";

// Database Name
const dbName = "whyline";
const client = new MongoClient(url, { useUnifiedTopology: true });
const collection_name = "whyline"; //Nombre de la colección ( o "tabla")

exports.consulta = async (request, response) => {
  //Un ejemplo de como conectarse y leer datos. request y response vienen de la peticion http

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collection_name);

    console.log("encuestas");
    //        const query = {} //Cuando se hace find con query vacía equivale a hacer SELECT * en sql
    //      const query_por_color = { color : 'negro'} //Si usas esta, busca por el campo color.. como un "where color = negro"
    const query = {
      "Fecha respuesta": {
        $gte: request.params.desde,
        $lte: request.params.hasta,
      },
    };

    try {
      let results = await collection.find(query).toArray(); //Hago la busqueda con la funcion find, luego convierto a array
      response.json(results); //Mandamos la respuesta con el JSON.
    } catch (e) {
      console.error("Hubo un error al leer la colección ", collection_name);
      console.error(e);
    }
  } catch (e) {
    console.error("Error de conexión ", e);
  } finally {
    console.log("finally conex");
    await client.close();
  }
};
