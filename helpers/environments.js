/**
 * title: Environments
 * description: handels all the environment related things
 *
 * @format
 */

//module scaffholding

const environments = {};

//staging environment
environments.staging = {
  port: 5000,
  envName: "staging",
  secretKey: "TamimHasan",
  maxChecks: 5,
  twilio: {
    formPhone: "+8801714270830",
    accountSid: "AC16fe2942c78aef53a3a5323beb8b86f7",
    authToken: "bb977b08e3bcdabf3427b961ba1fd2f8",
  },
};

//production environment
environments.production = {
  port: 6000,
  envName: "production",
  secretKey: "TareqMonower",
  maxChecks: 5,
  twilio: {
    formPhone: "+8801714270830",
    accountSid: "AC16fe2942c78aef53a3a5323beb8b86f7",
    authToken: "bb977b08e3bcdabf3427b961ba1fd2f8",
  },
};

// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
