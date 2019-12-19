export default function getPromotedURL(url) {
	const parsedURL = url.split('@');
	const protocol = url.split('://')[0];
	return `${protocol}://${parsedURL[1]}`;
}
