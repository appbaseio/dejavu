import testConnection from './app';
import { fetchMappings, addMapping } from './mappings';
import setCellValue from './cell';
import { updateDocument, deleteData, addData } from './data';
import getVersion from './version';
import getCount from './count';
import search from './search';
import { getAnalyzersApi, closeApp, openApp, putSettings } from './analyzers';

export {
	testConnection,
	fetchMappings,
	addMapping,
	setCellValue,
	updateDocument,
	deleteData,
	addData,
	getVersion,
	getCount,
	search,
	getAnalyzersApi,
	closeApp,
	openApp,
	putSettings,
};
