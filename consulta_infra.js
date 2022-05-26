const request = require('request')
const crypto = require('crypto')
const datos = require('./datos_infra')
const credentials = {
    API_KEY: 'eyJpZF9jb25jZXNpb24iOiIyMDUifQ==',
    API_SECRET: 'pEU0Gd6N74KZEHwbJbFTw%2FdsolAGqWLUSJMXLT6hIVorgYP%2BgpRQlftfRaRCSYg7d%2ByBmC3pLWPl3pu7rw%3D%3D'
}


const CANT_DIAS = 288
const DIAS_ITERACION = 1
const INTERVAL_TIME = 100000 //5MIN

const hoy = new Date() //hoy

let inicio = hoy
inicio.setDate( inicio.getDate() - CANT_DIAS ) // Hoy - cantidad de dias


function armarStringFecha( fecha ){
    let fechaStr = fecha.toISOString()
    let y = fechaStr.substr(0,4)
    let m = fechaStr.substr(5,2)
    let d = fechaStr.substr(8,2)

    return y+m+d
}

function consulta(desdeString,hastaString){
    return new Promise(( resolve, reject) => {

        var time = (new Date()).getTime()
        var message_to_sign = time + '/api/v1/traffic/violations'
        var signature = crypto.createHmac('sha384',credentials.API_SECRET).update(message_to_sign).digest('hex')


        var headers = {
            'X-SKTSEC-APIKEY': credentials.API_KEY,
            'X-SKTSEC-SIGNATURE': signature,
            'X-SKTSEC-TIMESTAMP': time
        }

        request({
            url: 'https://api.sitve.com/api/v1/traffic/violations?dateFrom='+desdeString+'&dateTo='+hastaString,
            headers: headers
        }, async function (error, response, body) {
            if (error) { reject(error) }
            var json_response = JSON.parse(body)

            //LIMPIAR DATOS ANTERIORES
            console.log(desdeString,hastaString)
            await datos.borrarDesdeHasta(desdeString,hastaString)
            //INSERTAR
            //Primero agrego el campo fechaEmi para borrar mas facil

            let data = json_response.object
            for(let i = 0; i < data.length; i++){
                data[i].fechaEmi = data[i].documento.fechaEmision.substring(6,10) + data[i].documento.fechaEmision.substring(3,5)+ data[i].documento.fechaEmision.substring(0,2)
            }

            if(data.length > 0)
                await datos.insertarJSON(data)

            resolve()
        })
    })
}


exports.ejecutarConsultas = async function (){

    let actual = inicio
    console.log(actual)
    let counter = 0

    const iteracion = async () => {
        if( counter == CANT_DIAS) return;
    
            counter++
            console.log('Dia ', counter )
    
            if(counter > 0)
                actual.setDate( actual.getDate() + 1 )
    
    
            let desdeString = armarStringFecha( actual )
    
            let hasta = actual
            hasta.setDate( actual.getDate() + DIAS_ITERACION )
    
            let hastaString = armarStringFecha( hasta )
    
            actual = hasta
    
            try{
                await consulta(desdeString,hastaString)
            }   
            catch(e){
                console.error(e)
            }
    }

    return new Promise( async (resolve,reject) => {
        
        await iteracion()//La primera la hago manualmente asi no espero..

        setInterval( async () => { 
            await iteracion()
            if( counter == CANT_DIAS ) return resolve()

        }, INTERVAL_TIME) 
    })
}










