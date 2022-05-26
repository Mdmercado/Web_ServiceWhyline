# WEP SERVICE

## Consideraciones a tomar en cuenta

Este WebService esta realizado con nodeJs integrando mongoDB como base datos no ralcional.

## Idea General del sistema

El WS tiene varias funciones, una de las mas importantes se trata de consultar la api de whyline (cambiando el type devuelve encuestas o turnos(subscriptions)). De esta manera se le pasa una fecha especifica a al api y entrega datos relacionado a ese dia, la respuesta del servicio es en formato comprimido csv y .gz. El algoritmo descomprime el archivo con los datos csv, luego lo pasamos a objeto json finalmente se inserta en la base de datos mongo db propia de municipalidad SN.

## Arbol de docs

wep_service => whyline => app_whyline.js es el script a correr para extraer las encuestas del dia anterior.

### Documentacion/repo de ayuda

- [DocuCSVTOJSON](https://github.com/Keyang/node-csvtojson#from-csv-string-to-csv-row)
- [DocuMongodb](https://www.mongodb.com/docs/manual/tutorial/query-documents/)
