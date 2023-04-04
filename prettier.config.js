/* eslint-disable @typescript-eslint/no-var-requires */
const { prettierConfig } = require("@fairdataihub/config");

const config = prettierConfig();

config.endOfLine = "auto";

module.exports = config;
