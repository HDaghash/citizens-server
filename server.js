const express = require('express');
const app = express();
const Web3 = require('web3');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.post('/getPastEvents', async (request, response) => {
  const { infuraUrl, address, event, abi, filters, start, end } = request.body;
  const data = await getPastEvents(infuraUrl, address, event, abi, filters);
  const citizens = data.reverse().slice(start, end);
  response.json({ citizens, total: data.length });
});

app.post('/getCitizenNoteById', async (request, response) => {
  const { infuraUrl, address, abi, id } = request.body;
  const data = await getCitizenNoteById(infuraUrl, address, abi, id);
  response.json(data);
});

async function getCitizenNoteById(infuraUrl, address, abi, id) {
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
