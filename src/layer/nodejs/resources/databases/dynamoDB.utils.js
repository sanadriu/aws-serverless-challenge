const { DynamoDB } = require("aws-sdk");
const config = require("./dynamoDB.config");
const ddb = new DynamoDB(config);

async function createTables(createTableInputs) {
	const creation = createTableInputs.map((createTableInput) => ddb.createTable(createTableInput).promise());

	await Promise.all(creation);
}

async function deleteTables() {
	const { TableNames } = await ddb.listTables().promise();

	const deletion = TableNames.map((TableName) => ddb.deleteTable({ TableName }).promise());

	await Promise.all(deletion);
}

async function deleteTableData(TableName) {
	const { Items } = await ddb.scan({ TableName }).promise();

	const dataDeletion = Items.map((Item) => ddb.deleteItem({ TableName, Key: { id: Item.id } }).promise());

	await Promise.all(dataDeletion);
}

async function getTableNames() {
	const { TableNames } = await ddb.listTables().promise();

	return TableNames;
}

module.exports = {
	createTables,
	deleteTables,
	deleteTableData,
	getTableNames,
};
