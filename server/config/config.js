var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'uhack-io-2014'
    },
    port: 8080,
    db: 'mongodb://localhost:27017'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'uhack-io-2014'
    },
    port: 8080,
    db: 'mongodb://localhost:27017'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'uhack-io-2014'
    },
    port: 8080,
    db: 'mongodb://localhost:27017'
    
  },

    isFirst: true
};

module.exports = config[env];
