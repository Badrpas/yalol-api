const KEY = process.env.RIOT_API_KEY;
if (!KEY) throw new Error('No API key defined');

const { api, getCurrentGameByName } = require('./index')('euw', KEY);

(async () => {
  try {
    const game = await getCurrentGameByName('Devison');
    debugger;
  } catch (e) {
    console.log(e);
  }
})();
