# yalol-api
Yet Another League of Legends API


### Usage

```javascript
const KEY = process.env.RIOT_API_KEY;
const yalol = require('yalol-api')('euw', API_KEY);
const { API } = yalol;

API.getSummonerByName('FNC Rekkles')
  .then(data => {
    console.log(data);
  })
  .catch(err => console.error(err));

(async () => {
  try {
    const data = await yalol.getCurrentGameByName('FNC Rekkles');
  } catch (e) {
    console.error(e);
  }
})();


```
