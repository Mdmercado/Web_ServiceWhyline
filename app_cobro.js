const consulta_api = require('./consulta_cobro')

run = async () => {
    await consulta_api.ejecutarConsultas().finally( () => {
        process.exit()
    })
}

run()
