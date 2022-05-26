const consulta_api = require('./consulta_infra')

run = async () => {
    await consulta_api.ejecutarConsultas().finally( () => {
        process.exit()
    })
}

run()
