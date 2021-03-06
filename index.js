const _ = require('lodash');
const axios = require('axios');
const MAPPING = require('./mapping');
const apiCraft = require('api-craft');


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

const initialize = (region, API_KEY) => {
  region = region.toLowerCase();
  region = REGION_MAP[region] || region;

  const baseURL = `https://${region}.api.riotgames.com`;

  const API = apiCraft(MAPPING, requestOptions => {
    const baseOptions = {
      baseURL, 
      method: 'get',
      headers: { "X-Riot-Token": API_KEY }
    };

    const options = _.extend(baseOptions, requestOptions);

    return axios(options).then( ({ data }) => data );
  });


  return {
    API,
    
    async getCurrentGameByName (name) {
      const { id } = await API.getSummoner(name);
      try {
        return await API.getCurrentGame(id);
      } catch (e) {
        if (_.get(e, 'response.status') === 404) {
          throw new Error(`Summoner ${name} currently is not in game.` );
        } else {
          throw e;
        }
      }
    }
  };

};

module.exports = _.memoize(initialize);