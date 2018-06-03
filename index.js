const axios = require('axios');
const MAPPING = require('./mapping');
const getUriEntry = require('./api-entry');
const _ = require('lodash');


const REGION_MAP = {
  eune: 'eune1',
  euw : 'euw1',
  br  : 'br1',
  oc  : 'oc1',
  jp  : 'jp1',
  na  : 'na1',
  tr  : 'tr1',
  la  : 'la1'
};

module.exports = (region, API_KEY) => {
  region = region.toLowerCase();
  region = REGION_MAP[region] || region;

  const baseURL = `https://${region}.api.riotgames.com`;

  const api = {};

  Object.keys(MAPPING).forEach(key => {
    let path = MAPPING[key];
    let queriesDescriptions;
    
    if (typeof path === 'array') {
      path = path[0];
      queriesDescriptions = path[1];
    }
    
    const entry = getUriEntry(path, queriesDescriptions);
    
    api[key] = (...args) => 
      axios(_.extend(entry(...args), {
        baseURL, 
        method: 'get',
        headers: { "X-Riot-Token": API_KEY }
      })).then(({data}) => data);
  
  });

  return {
    api,
    
    async getCurrentGameByName (name) {
      const { id } = await api.getSummoner(name);
      try {
        return await api.getCurrentGame(id);
      } catch (e) {
        if (_.get(e, 'response.status') === 404) {
          throw new Error(`Summoner ${name} currently is not in game.` );
        } else {
          throw e;
        }
      }
    }
  };
}