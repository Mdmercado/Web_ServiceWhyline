const request = require("request");
const fs = require("fs");
const datos = require("./datos_whyline_subscription");
const { ungzip } = require("node-gzip");
const csvtojson = require("csvtojson");

const post_data = {
  clientId: "e967bb895957c8febeac3cddf830f5f9587db3fe",
  clientSecret:
    "8b2d0916fae55da038a6e2b6780981d61a79fcdaad5f2b3032901262de10dffd9cf46dc19da8c9d5",
};

function auth() {
  return new Promise((resolve, reject) => {
    request(
      {
        headers: { "content-type": "application/json" },
        url: "https://api-enterprise.whyline.com/auth/thirdparty",
        method: "POST",
        json: post_data,
      },
      async function (error, response, body) {
        if (error) {
          reject(error);
        } else resolve(body.token);
      }
    );
  });
}

function consulta(fecha) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await auth();
      console.log(token);

      request(
        {
          headers: { authorization: "Bearer " + token },
          encoding: "binary",
          url:
            "https://api-enterprise.whyline.com/api/v1/organization/downloads/exports?organization=5d5d9821b750ee7371e58d2c&date=" +
            fecha +
            "&type=subscription",
          method: "GET",
        },
        async function (error, response, body) {
          if (error) {
            reject(error);
          } else resolve(body);
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

const descargar = async () => {
  const fechas = [
    "2021-08-23",
    "2021-06-30",
    "2021-07-01",
    "2021-07-02",
    "2021-07-03",
  ];

  for (let i = 0; i < fechas.length; i++) {
    try {
      const csv = await consulta(fechas[i]);
      const csvFilePath = "./" + fechas[i] + ".csv.gz";
      fs.writeFileSync(csvFilePath, Buffer.from(csv, "binary")); //vienen comprimidos desde la api

      let file_data = fs.readFileSync(csvFilePath);
      const decompressed = await ungzip(file_data);

      csvtojson()
        .fromString(decompressed.toString())
        .then(async (csvRows) => {
          console.log(csvRows.length);
          await datos.insertarJSON(csvRows, "csv");

          //borrar archivo ya procesado
          fs.unlinkSync(csvFilePath);
        });
    } catch (e) {
      console.error(e);
    }
  }
  return console.log("listo");
};

descargar().then((_) => {
  process.exit();
});

module.exports = descargar;
