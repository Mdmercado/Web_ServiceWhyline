const MongoClient = require('mongodb').MongoClient

// URL de Conexion
const url = 'mongodb://usrmongo:Jo4Bal3M0ng!@localhost:27017'

// Database Name
const dbName = 'infracciones'
const client = new MongoClient(url)


exports.insertarJSON = async ( data ) => {
    try{
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection('update') 

        try{
            await collection.insertMany( data )
            console.log("insertados ", data.length, " documentos")
        }
        catch(e){
            console.error("Hubo un error al insertar")
            console.error(e)
        }
    }
    catch(e){
        console.error("Error de conexión ", e)
    }
}

exports.borrarDesdeHasta = async (desde,hasta) => {
    try{
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection('update') 

        try{
            let resu = await collection.deleteMany( { fechaEmi : { $gte : desde, $lte : hasta } } )
            console.log(JSON.stringify(resu))
        }
        catch(e){
            console.error("Hubo un error al borrar")
            console.error(e)
        }
    }
    catch(e){
        console.error("Error de conexión ", e)
    }
}


