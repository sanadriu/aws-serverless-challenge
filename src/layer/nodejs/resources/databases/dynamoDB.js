const { DocumentClient } = require("aws-sdk/clients/dynamodb");
const config = require("./dynamoDB.config");

module.exports = new DocumentClient(config);
