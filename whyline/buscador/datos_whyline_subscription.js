const MongoClient = require('mongodb').MongoClient

// URL de Conexion
const url = 'mongodb://usrmongo:Jo4Bal3M0ng!@localhost:27017'

// Database Name
const dbName = 'whyline'
const client = new MongoClient(url)
const collection_name = 'whyline_subscription' //Nombre de la colección ( o "tabla")




exports.consulta = async (request, response) => {//Un ejemplo de como conectarse y leer datos. request y response vienen de la peticion http
    try{
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collection_name) 
console.error(request.params.desde)

//        const query = {} //Cuando se hace find con query vacía equivale a hacer SELECT * en sql
  //      const query_por_color = { color : 'negro'} //Si usas esta, busca por el campo color.. como un "where color = negro"

const query = { "Subscription hour" : { $gte : request.params.desde, $lte :  request.params.hasta } }


 try{


            let results = await collection.find(query).toArray() //Hago la busqueda con la funcion find, luego convierto a array

            response.json( results ) //Mandamos la respuesta con el JSON.

        }
        catch(e){
            console.error("Hubo un error al leer la colección ", collection_name)
            console.error(e)
        }
       

//        client.close()//Importante cerrar la conexión una vez no la precisamos mas

    }
    catch(e){
        console.error("Error de conexión ", e)
    }
}


