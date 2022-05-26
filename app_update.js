const consulta_api = require('./consulta_update')

run = async () => {
    await consulta_api.ejecutarConsultas().finally( () => {
        process.exit()
    })
}

run()
