const express = require('express');
const app = express();
const Web3 = require('web3');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.post('/getPastEvenets', async (request, response) => {
  const { infuraUrl, address, event, abi, filters } = request.body;
  const data = await getPastEvents(infuraUrl, address, event, abi, filters);
  response.json(data);
});

app.post('/getCitizenById', async (request, response) => {
  const { infuraUrl, address, abi, id } = request.body;
  const data = await getCitizenById(infuraUrl, address, abi, id);
  response.json(data);
});

async function getCitizenById(infuraUrl, address, abi, id) {
  const httpProvider = new Web3.providers.HttpProvider(infuraUrl);
  const web3Provider = new Web3(httpProvider);
  return await new web3Provider.eth.Contract(abi, address).methods
    .getNoteByCitizenId(id)
    .call()
    .then(response => {
      return response;
    });
}

async function getPastEvents(infuraUrl, address, event, abi, filters) {
  const httpProvider = new Web3.providers.HttpProvider(infuraUrl);
  const web3Provider = new Web3(httpProvider);
  return await new web3Provider.eth.Contract(abi, address)
    .getPastEvents(event, filters)
    .then(response => {
      return response;
    });
}

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
