const isTest = process.env.JEST_WORKER_ID;

module.exports = {
	convertEmptyValues: true,
	...(isTest && {
		endpoint: "localhost:8000",
		region: "local-env",
		sslEnabled: false,
	}),
};
