export const getURL = () => {
	let url = localStorage.getItem('url') || sessionStorage.getItem('url');
	const params = new URLSearchParams(window.location.search);
	if (!url || url === 'undefined') {
		url = params.has('url') ? params.get('url') : 'null';

		if (url) localStorage.setItem('url', url.replace(/\/+$/, ''));
	}
	return url === 'null' ? 'http://localhost:8000' : url;
};

export const getVersion = () => {
	const version = localStorage.getItem('version');
	return version;
};
export const isUsingOpenSearch = () =>
	localStorage.getItem('isUsingOpenSearch') === 'true';
export const SCALR_URL = 'scalr.api.appbase.io';
export const ACC_API = 'https://accapi.appbase.io';
export const SCALR_API = 'https://scalr.api.appbase.io';
export const IMPORTER_LINK = 'https://importer.appbase.io/';

export const exampleConfig = [
	{
		title: 'Import Data',
		description: 'Learn how to bring your data to appbase.io.',
		image: {
			alt: 'Import Data',
			src: '/static/images/explainer/import_data.png',
		},
		href: 'https://docs.reactivesearch.io/docs/data/import/',
	},
	{
		title: 'Manage Mappings',
		description:
			'View and edit field mappings (aka data types), set synonyms.',
		image: {
			alt: 'Manage Mappings',
			src: '/static/images/explainer/manage_mappings.png',
		},
		href: 'https://docs.reactivesearch.io/docs/data/mappings/',
	},
	{
		title: 'Browse Data',
		description: 'View, filter, and edit your indexed data.',
		image: {
			alt: 'Browse Data',
			src: '/static/images/explainer/browse_data.png',
		},
		href: 'https://docs.reactivesearch.io/docs/data/Browser/',
	},
	{
		title: 'Search Preview',
		description: 'Visually build your search and test search relevance.',
		image: {
			alt: 'Search Preview',
			src: '/static/images/explainer/search_preview.png',
		},
		href:
			'https://docs.reactivesearch.io/docs/search/relevancy/#test-search-relevancy',
	},
	{
		title: 'Understand your Search ROI',
		description:
			'Use analytics to see how search is impacting your business.',
		image: {
			alt: 'Analytics',
			src: '/static/images/explainer/search_ROI.png',
		},
		href: 'https://docs.reactivesearch.io/docs/analytics/Overview/',
	},
	{
		title: 'Setup Analytics',
		description:
			'Learn how to start tracking your search and click analytics.',
		image: {
			alt: 'Setup Analytics',
			src: '/static/images/explainer/setup_analytics.png',
		},
		href: 'https://docs.reactivesearch.io/docs/analytics/Implement/',
	},
	{
		title: 'Access Analytics via APIs',
		description: 'Access search analytics via APIs for your custom needs.',
		image: {
			alt: 'Analytics via APIs',
			src: '/static/images/explainer/analytics_API.png',
		},
		href: 'https://docs.reactivesearch.io/docs/analytics/Implement/',
	},
	{
		title: 'Secure your Search App',
		description:
			'Use advanced security controls to secure your search app.',
		image: {
			alt: 'Analytics via APIs',
			src: '/static/images/explainer/security.png',
		},
		href: 'https://docs.reactivesearch.io/docs/security/Credentials/',
	},
];
