const tables = [
	{
		TableName: process.env.blogsTableName,
		BillingMode: "PAY_PER_REQUEST",
		AttributeDefinitions: [
			{
				AttributeName: "id",
				AttributeType: "S",
			},
			{
				AttributeName: "createdAt",
				AttributeType: "S",
			},
			{
				AttributeName: "updatedAt",
				AttributeType: "S",
			},
			{
				AttributeName: "type",
				AttributeType: "S",
			},
		],
		KeySchema: [
			{
				AttributeName: "id",
				KeyType: "HASH",
			},
		],
		GlobalSecondaryIndexes: [
			{
				IndexName: process.env.blogsIndexNameCreatedAt,
				KeySchema: [
					{
						AttributeName: "type",
						KeyType: "HASH",
					},
					{
						AttributeName: "createdAt",
						KeyType: "RANGE",
					},
				],
				Projection: {
					ProjectionType: "ALL",
				},
			},
			{
				IndexName: process.env.blogsIndexNameUpdatedAt,
				KeySchema: [
					{
						AttributeName: "type",
						KeyType: "HASH",
					},
					{
						AttributeName: "updatedAt",
						KeyType: "RANGE",
					},
				],
				Projection: {
					ProjectionType: "ALL",
				},
			},
		],
	},
];

module.exports = tables;
