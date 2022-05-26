# PAra pedir token

import requests

API_ENDPOINT = "https://api-enterprise.whyline.com/auth/thirdparty"
CLIENT_ID = "e967bb895957c8febeac3cddf830f5f9587db3fe"
CLIENT_SECRET = "8b2d0916fae55da038a6e2b6780981d61a79fcdaad5f2b3032901262de10dffd9cf46dc19da8c9d5"

data = {'clientId':CLIENT_ID, 'clientSecret':CLIENT_SECRET}

r = requests.post(url = API_ENDPOINT, data = data)


# Una vez que tenemos el token

class BearerAuth(requests.auth.AuthBase):
    def __init__(self, token):
        self.token = token
    def __call__(self, r):
        r.headers["authorization"] = "Bearer " + self.token
        return r

token=eval(r.text)["token"]

fechas = ['2021-06-29','2021-06-30','2021-07-01','2021-07-02','2021-07-03']

for fecha in fechas:
  url = 'https://api-enterprise.whyline.com/api/v1/organization/downloads/exports?organization=5d5d9821b750ee7371e58d2c&date='+fecha
  response = requests.get(url, auth=BearerAuth(token))
  response.raise_for_status() # ensure we notice bad responses
  file = open("resp_content"+fecha+".csv", "wb")
  file.write(response.content)
  file.close()


