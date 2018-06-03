const _ = require('lodash');

const getPathParts = path => {
  let parts = path.split(/[\{\}]/);
  const uriConstParts = [];
  const uriVars = [];
  
  parts.forEach((part, i) => (i % 2 ? uriVars : uriConstParts).push(part));

  return [uriConstParts, uriVars];
};

const getCompile = (uriConsts, queriesDescription) => {

  //TODO: add validation
  const QUERIES = _.mapValues(queriesDescription, descr => {
    return descr;
  });

  const getParams = queries => {
    const params = {};
    
    Object.keys(QUERIES).forEach(key => {
      if (_.has(queries, key)) {
        //TODO: Should check for query param type and validate
        params[key] = queries[key];
      }
    });

    return params;
  };

  return (vars, queries) => {
    const parts = uriConsts.concat();
    
    vars.forEach((option, i) => {
      const index = (i + 1) * 2 - 1;
      parts.splice(index, 0, option);
    });

    const url = parts.join('');
    const params = getParams(queries);

    return {
      url,
      params
    };
  };
};

const _getHandler = (path, queries) => {
  const [uriConsts, uriVars] = getPathParts(path);
  const compile = getCompile(uriConsts, queries);

  return (...args) => {
    let queries = {};

    if (typeof args[0] === 'object') {
      const [options] = args;
      args = uriVars.map(key => options[key]);
    }

    if (typeof _.last(args) === 'object') {
      queries = _.last(args);
    }

    return compile(args, queries);
  };
}

const getHandler = _.memoize(_getHandler);

module.exports = (path, queries = {}) => {
  const uri = getHandler(path, queries);

  return uri;
};