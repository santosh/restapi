let environments = {};

// staging environment
environments.staging = {
    'port': 3000,
    'envName': 'staging'
};

// development environment
environments.production = {
    'port': 5000,
    'envName': 'production'
};

// determine which environment was passed as a command line argument
let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the current environment is on eof the environments above, fallback to staging
let environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;