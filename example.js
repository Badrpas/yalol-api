const KEY = process.env.RIOT_API_KEY;
if (!KEY) throw new Error('No API key defined');

const { API, getCurrentGameByName } = require('.')('euw', KEY);

(async () => {
  try {
    const game = await getCurrentGameByName('FNC Rekkles');
  } catch (e) {
    console.log(e);
  }
})();
