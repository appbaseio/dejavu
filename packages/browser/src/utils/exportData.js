import { search } from '../apis';

let jsonData = [];

export const MAX_DATA = 100000;

const defaultQuery = {
	query: {
		match_all: {},
	},
};

/**
 * A function to convert multilevel object to single level object and use key value pairs as Column and row pairs using recursion
 */
export const flatten = data => {
	const result = {};

	function recurse(cur, prop = '') {
		if (Object(cur) !== cur) {
			result[prop] = cur;
		} else if (Array.isArray(cur)) {
			result[prop] = JSON.stringify(cur);
		} else {
			let isEmpty = true;
			Object.keys(cur).forEach(p => {
				isEmpty = false;
				recurse(cur[p], prop ? `${prop}.${p}` : p);
			});
			if (isEmpty && prop) {
				result[prop] = {};
			}
		}
	}

	recurse(data);
	return result;
};

export const searchAfter = async (
	app,
	types,
	url,
	version,
	query,
	chunkInfo,
	searchAfterData,
) => {
	try {
		const others = {};
		if (searchAfterData) {
			others.search_after = [searchAfterData];
		}
		const sortKey = version > 5 ? '_id' : '_uid';
		const data = await search(app, types, url, version, {
			...query,
			size: 1000,
			sort: [
				{
					[sortKey]: 'desc',
				},
			],
			...others,
		});

		// eslint-disable-next-line
		const res = await getSearchAfterData(
			app,
			types,
			url,
			version,
			query,
			chunkInfo,
			searchAfterData,
			data,
		);

		if (typeof res === 'string') {
			let exportData = JSON.parse(res);
			const lastObject = exportData[exportData.length - 1];
			exportData = exportData.map(value => {
				const item = Object.assign(value._source);
				item['_id'] = value._id;
				return item;
			});

			return {
				data: exportData,
				searchAfter:
					version > 5
						? lastObject._id
						: `${lastObject._type}#${lastObject._id}`,
			};
		}

		return res;
	} catch (e) {
		console.error('SEARCH ERROR', e);
		return e;
	}
};

const getSearchAfterData = async (
	app,
	types,
	url,
	version,
	query,
	chunkInfo,
	searchAfterData,
	data,
) => {
	const { hits } = data;
	let str = null;
	/**
	 * Checking if the current length is less than chunk total, recursive call searchAfter
	 */
	if (hits && jsonData.length < chunkInfo.total) {
		const { hits: totalhits, total } = hits;
		jsonData = jsonData.concat(totalhits);
		const lastObject = totalhits[totalhits.length - 1];
		const nextSearchData =
			version > 5
				? lastObject._id
				: `${lastObject._type}#${lastObject._id}`;
		return searchAfter(
			app,
			types,
			url,
			version,
			query,
			chunkInfo,
			totalhits.length === total ? '' : nextSearchData,
		);
	}

	str = JSON.stringify(jsonData, null, 4);
	jsonData = [];
	return str;
};

/**
 * Main function for getting data to be exported;
 * @param {*} app
 * @param {*} types
 * @param {*} url
 * @param {*} query
 * @param {*} searchAfter
 */
const exportData = async (
	app,
	types,
	url,
	version,
	query,
	chunkInfo,
	searchAfterData,
) => {
	try {
		const finalQuery = query || defaultQuery;
		const res = await searchAfter(
			app,
			types,
			url,
			version,
			finalQuery,
			chunkInfo,
			searchAfterData,
		);

		return res;
	} catch (e) {
		return e;
	}
};

export default exportData;
