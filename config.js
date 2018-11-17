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

let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

let environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


module.exports = environmentToExport;