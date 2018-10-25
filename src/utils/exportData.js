import { getHeaders, parseUrl } from './index';

let jsonData = [];

const defaultQuery = () => ({
	query: {
		match_all: {},
	},
});

/**
 * A function to convert multilevel object to single level object and use key value pairs as Column and row pairs using recursion
 */
const flatten = data => {
	const result = {};

	function recurse(cur, prop = '') {
		if (Object(cur) !== cur) {
			result[prop] = cur;
		} else if (Array.isArray(cur)) {
			const l = cur.length;
			for (let i = 0; i < l; i += 1) {
				recurse(cur[i], `${prop}[${i}]`);
			}
			if (l === 0) {
				result[prop] = [];
			}
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

// Calling the ES using fetch for the given query
const applyQuery = (url, queryBody, rawUrl) => {
	const headers = getHeaders(rawUrl);
	return fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify(queryBody),
	}).then(data => data.json());
};
/**
 * Setting up the query,
 * If scrollId is defined then it will continue the last scroll call and fetch the next chunk of data.
 */
const scrollQuery = (rawUrl, indexes, types, queryBody, scroll, scrollId) => {
	const { url } = parseUrl(rawUrl);
	const createUrl = `${url}/${indexes.join(',')}/${types.join(
		',',
	)}/_search?scroll=5m`;
	const scrollUrl = `${url}/_search/scroll?scroll=5m&scroll_id=${scrollId}`;

	if (scroll) {
		return applyQuery(scrollUrl, queryBody, rawUrl);
	}

	return applyQuery(
		createUrl,
		Object.assign(
			{
				size: 1000,
			},
			queryBody,
		),
		rawUrl,
	);
};

/**
 * Param info { activeQuery, scroll, scroll_id }
 */
const scrollApi = async (rawUrl, indexes, types, info) => {
	try {
		const res = await scrollQuery(
			rawUrl,
			indexes,
			types,
			info.activeQuery,
			info.scroll,
			info.scroll_id,
		);

		const data = await getScrollApiData(rawUrl, indexes, types, res); // eslint-disable-line
		if (typeof data === 'string') {
			let exportData = JSON.parse(data);
			exportData = exportData.map(value => {
				const item = Object.assign(value._source);
				return flatten(item);
			});

			return exportData;
		}

		return data;
	} catch (e) {
		throw e;
	}
};

const getScrollApiData = (rawUrl, indexes, types, data) => {
	const {
		hits: { hits },
	} = data;
	jsonData = jsonData.concat(hits);
	let str = null;
	/**
	 * Checking if the current data length is less then the total hits from the ES results,
	 * If yes calling the scrollApi function again to fetch the remaining data.
	 *
	 * */
	if (jsonData.length < data.hits.total) {
		const scrollObj = {
			scroll_id: data._scroll_id,
		};
		return scrollApi(rawUrl, indexes, types, {
			activeQuery: scrollObj,
			scroll: true,
			scroll_id: data._scroll_id,
		});
	}

	str = JSON.stringify(jsonData, null, 4);
	jsonData = [];
	return str;
};

/*
 * Exports data as a CSV file based on the provided ES app and query info.
 */
const exportData = (rawUrl, indexes, types, query) => {
	jsonData = [];

	const activeQuery = query || defaultQuery();
	return scrollApi(rawUrl, indexes, types, {
		activeQuery,
	});
};

export default exportData;
