export default function getPromotedURL(url) {
	const parsedURL = url && url.split('@');
	const protocol = url && url.split('://')[0];
	return `${protocol}://${parsedURL[1]}`;
}
