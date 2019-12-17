export default function getPromotedURL(url) {
	const parsedURL = url.split('@');
	const protocol = url.split('://');
	return `${protocol}://${parsedURL[1]}`;
}
