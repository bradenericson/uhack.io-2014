var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'uhack-io-2014'
    },
    port: 3000,
    db: 'mongodb://localhost/uhack-io-2014-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'uhack-io-2014'
    },
    port: 3000,
    db: 'mongodb://localhost/uhack-io-2014-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'uhack-io-2014'
    },
    port: 3000,
    db: 'mongodb://localhost/uhack-io-2014-production'
    
  }
};

module.exports = config[env];
