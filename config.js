const environments = {};

// staging environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
};

// development environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
};

// determine which environment was passed as a command line argument
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the current environment is on eof the environments above, fallback to staging
const environmentToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
