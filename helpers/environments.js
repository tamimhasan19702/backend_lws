/**
 * title: Environments
 * description: handels all the environment related things
 */

//module scaffholding

const environments = {}

//staging environment
environments.staging = {
    port: 5000,
    envName: 'staging',
    secretKey: 'TamimHasan'
}

//production environment
environments.production = {
    port : 6000,
    envName: 'production',
    secretKey: 'TareqMonower'
}

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;