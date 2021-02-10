// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
const Web3 = require('web3');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/getPastEvenets', async (request, response) => {
  const data = await getPastEvents();
  response.json(data);
});

async function getPastEvents() {
  const httpProvider = new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/b7523984eb60456797e0e04d011f773f'
  );
  const web3Provider = new Web3(httpProvider);

  return await new web3Provider.eth.Contract(
    [
      {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256'
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'age',
            type: 'uint256'
          },
          {
            indexed: true,
            internalType: 'string',
            name: 'city',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'name',
            type: 'string'
          }
        ],
        name: 'Citizen',
        type: 'event'
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'age',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'city',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'someNote',
            type: 'string'
          }
        ],
        name: 'addCitizen',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256'
          }
        ],
        name: 'getNoteByCitizenId',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      }
    ],
    '0xb5842e2384f5b6f1dbec5e130c75e82d3803c3d3'
  )
    .getPastEvents('Citizen', { fromBlock: 'earliest', toBlock: 'latest' })
    .then(response => {
      console.log('response is', response);
      return response;
      //response.json(response);
    });
}

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
