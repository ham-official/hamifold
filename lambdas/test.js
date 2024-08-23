const formattedReturn = require('./utils/formattedReturn');

exports.handler = async () => {
  return formattedReturn(200, 'All good');
};
