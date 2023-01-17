export const MODES = {
	VIEW: 'view',
	EDIT: 'edit',
};

export const LOCAL_CONNECTIONS = 'localConnections';

export const IMPORTER_LINK = 'https://importer.appbase.io/?app=';

export const SETTINGS = {
	'index.max_ngram_diff': 10,
	analysis: {
		analyzer: {
			autosuggest_analyzer: {
				filter: ['lowercase', 'asciifolding', 'autosuggest_filter'],
				tokenizer: 'standard',
				type: 'custom',
			},
			ngram_analyzer: {
				filter: ['lowercase', 'asciifolding', 'ngram_filter'],
				tokenizer: 'standard',
				type: 'custom',
			},
		},
		filter: {
			autosuggest_filter: {
				max_gram: '20',
				min_gram: '1',
				token_chars: ['letter', 'digit', 'punctuation', 'symbol'],
				type: 'edge_ngram',
			},
			ngram_filter: {
				max_gram: '9',
				min_gram: '2',
				token_chars: ['letter', 'digit', 'punctuation', 'symbol'],
				type: 'ngram',
			},
		},
	},
};

const USER = {
	LOAD: 'USER_LOAD',
	LOAD_SUCCESS: 'USER_LOAD_SUCCESS',
	LOAD_FAIL: 'USER_LOAD_FAIL',
};

const SAVE_HISTORY = 'SAVE_HISTORY';

const SAVE_CSB_URL = 'SAVE_CSB_URL';

const SET_SESSION_DATA = 'SET_SESSION_DATA';

const APPS = {
	LOAD: 'APPS_LOAD',
	LOAD_SUCCESS: 'APPS_LOAD_SUCCESS',
	LOAD_FAIL: 'APPS_LOAD_FAIL',
	LOAD_METRICS_SUCCESS: 'APPS_LOAD_METRICS_SUCCESS',
	LOAD_METRICS_FAIL: 'APPS_LOAD_METRICS_FAIL',
	APPEND: 'APPS_APPEND',
	LOAD_OWNERS: 'APPS_LOAD_OWNERS',
	LOAD_OWNERS_SUCCESS: 'APPS_LOAD_OWNERS_SUCCESS',
	LOAD_OWNERS_FAIL: 'APPS_LOAD_OWNERS_FAIL',
	DELETE_APP: 'DELETE_APP',
};

const ENDPOINTS = {
	LOAD: 'ENDPOINTS_LOAD',
	LOAD_SUCCESS: 'ENDPOINTS_LOAD_SUCCESS',
	LOAD_FAIL: 'ENDPOINTS_LOAD_FAIL',
};

const CREATE_APP = {
	LOAD: 'CREATING_APP',
	LOAD_SUCCESS: 'CREATE_APP_SUCCESS',
	LOAD_FAIL: 'CREATE_APP_FAIL',
	RESET: 'CREATE_APP_RESET',
};

const TYPE_FORM = {
	UNLOADED: 0,
	LOADED: 1,
	SUBMITTED: 2,
};

const STRIPE_KEY = {
	TEST: 'pk_test_DYtAxDRTg6cENksacX1zhE02',
	LIVE: 'pk_live_ihb1fzO4h1ykymhpZsA3GaQR',
};

const APP_SCREEN_PREFERENCES = {
	UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
};

const FUNCTIONS = {
	NOT_INVOKED: 0,
	INVOKING: 1,
	INVOKED: 2,
};

const SIDE_BAR = {
	SET_COLLAPSED: 'SET_COLLAPSED',
};

const ALLOWED_ACTIONS = {
	UI_BUILDER: 'uibuilder',
	DEVELOP: 'develop',
	PIPELINES: 'pipelines',
	SEARCH_RELEVANCY: 'search-relevancy',
	USER_MANAGEMENT: 'user-management',
	ACCESS_CONTROL: 'access-control',
	ANALYTICS: 'analytics',
	OVERVIEW: 'overview',
	// CURATED_INSIGHTS: 'curated-insights',
	BILLING: 'billing',
	DOWNTIME_ALERTS: 'downtime-alerts',
	SPEED: 'speed',
};

const ALLOWED_ACTIONS_LABELS = {
	[ALLOWED_ACTIONS.OVERVIEW]: 'Overview',
	[ALLOWED_ACTIONS.DEVELOP]: 'Data',
	[ALLOWED_ACTIONS.ANALYTICS]: 'Analytics',
	[ALLOWED_ACTIONS.CURATED_INSIGHTS]: 'Curated Insights',
	[ALLOWED_ACTIONS.SEARCH_RELEVANCY]: 'Search Relevance',
	[ALLOWED_ACTIONS.PIPELINES]: 'Pipelines',
	[ALLOWED_ACTIONS.ACCESS_CONTROL]: 'API Credentials',
	[ALLOWED_ACTIONS.USER_MANAGEMENT]: 'User Management', // moved under Access Control menu
	[ALLOWED_ACTIONS.BILLING]: 'Billing',
	[ALLOWED_ACTIONS.DOWNTIME_ALERTS]: 'Downtime Alerts',
	[ALLOWED_ACTIONS.UI_BUILDER]: 'UI Builder',
	[ALLOWED_ACTIONS.SPEED]: 'Speed',
};

const ROUTES_ACTION = {
	SET_APP_ROUTES: 'SET_APP_ROUTES',
	SET_CLUSTER_ROUTES: 'SET_CLUSTER_ROUTES',
};

const SUB_FIELDS = {
	KEYWORD: 'keyword',
	AUTOSUGGEST: 'autosuggest',
	SEARCH: 'search',
	LANGUAGE: 'lang',
	SYNONYMS: 'synonyms',
	DELIMITER: 'delimiter',
};

const RANGE_FIELDS = [
	'long',
	'integer',
	'double',
	'short',
	'byte',
	'float',
	'half_float',
	'scaled_float',
	'unsigned_long',
	'pint',
	'plong',
	'pfloat',
	'pdouble',
];

const CALENDAR_INTERVAL_FIELDS = [
	{
		label: 'Minute',
		value: 'minute',
	},
	{
		label: 'Hour',
		value: 'hour',
	},
	{
		label: 'Day',
		value: 'day',
	},
	{
		label: 'Week',
		value: 'week',
	},
	{
		label: 'Month',
		value: 'month',
	},
	{
		label: 'Quarter',
		value: 'quarter',
	},
	{
		label: 'Year',
		value: 'year',
	},
];

export {
	USER,
	APPS,
	ENDPOINTS,
	CREATE_APP,
	STRIPE_KEY,
	TYPE_FORM,
	APP_SCREEN_PREFERENCES,
	FUNCTIONS,
	ALLOWED_ACTIONS,
	ROUTES_ACTION,
	SIDE_BAR,
	SUB_FIELDS,
	ALLOWED_ACTIONS_LABELS,
	SAVE_HISTORY,
	SAVE_CSB_URL,
	RANGE_FIELDS,
	CALENDAR_INTERVAL_FIELDS,
	SET_SESSION_DATA,
};
