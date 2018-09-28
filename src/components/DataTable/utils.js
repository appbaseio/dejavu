const extractColumns = mappings =>
	Object.keys(mappings.properties).map(property => ({
		key: property,
		dataIndex: property,
		title: property,
		width: 250,
	}));

export { extractColumns };
