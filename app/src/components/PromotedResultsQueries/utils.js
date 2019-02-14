export default function getPromotedURL(url) {
	const parsedURL = url.split('@');
	return `https://${parsedURL[1]}`;
}
