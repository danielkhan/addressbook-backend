const Mongoose = require('mongoose');

Mongoose.Promise = global.Promise;

module.exports.connect = async (dbhost, dbport, dbname, logger) => {
  try {
    await Mongoose.connect(`mongodb://${dbhost}:${dbport}/${dbname}`);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.fatal('Could not connect to MongoDB');
    throw err;
  }
};
