const request = require("request");
const fs = require("fs");
const { ungzip } = require("node-gzip");

const csvtoJson = require("csvtojson");
var dateFormat = require("dateformat");
const insertarJSON = require("./datos_whyline");
//const fechas=  new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

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
      async function (error, _response, body) {
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
      //console.log(token);

      request(
        {
          headers: { authorization: "Bearer " + token },
          encoding: "binary",
          url:
            "https://api-enterprise.whyline.com/api/v1/organization/downloads/exports?organization=5d5d9821b750ee7371e58d2c&date=" +
            fecha +
            "&type=poll-answers",
          method: "GET",
        },
        async function (error, _response, body) {
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

const descargar = async function () {
  ///const fechas=  new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const fechas = [dateFormat(new Date() - 24 * 60 * 60 * 1000, "yyyy-mm-dd")];
  console.log(fechas);

  for (let i = 0; i < fechas.length; i++) {
    try {
      const csv = await consulta(fechas[i]);
      const csvFilePath = "./" + fechas[i] + ".csv.gz";
      fs.writeFileSync(csvFilePath, Buffer.from(csv, "binary")); //vienen comprimidos desde la api

      let file_data = fs.readFileSync(csvFilePath);
      const decompressed = await ungzip(file_data);
      const fileString = decompressed.toString();
      try {
        await csvtoJson({ output: "json" })
          .fromString(fileString)
          .then(async (csvRows) => {
            console.log(csvRows);
            await insertarJSON(csvRows, "csv");
            fs.unlinkSync(csvFilePath);
          });
      } catch (error) {
        console.log(error);
      }
    } catch (e) {
      console.error(e);
    }
  }
};

module.exports = descargar;
