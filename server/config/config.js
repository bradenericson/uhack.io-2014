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
    db: 'mongodb://131.212.232.181:27017/uHack_users'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'uhack-io-2014'
    },
    port: 8080,
    db: 'mongodb://localhost:27017/uHack_users'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'uhack-io-2014'
    },
    port: 8080,
    db: 'mongodb://localhost:27017/uHack_users'
    
  },

    isFirst: true
};

module.exports = config[env];
