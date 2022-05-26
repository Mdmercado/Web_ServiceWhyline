const express = require('express')
const app = express()
const datos = require('./datos')
const datos_cobros = require('./datos_cobros')


//Ruta coches usa a la funcion consulta
app.get('/infracciones/:desde/:hasta', datos.consulta )
app.get('/cobros/:desde/:hasta', datos_cobros.consulta )

app.listen(3000, () => {
    console.log('server iniciado en puerto 3000')
})
