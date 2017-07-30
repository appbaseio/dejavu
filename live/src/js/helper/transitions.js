//    React doesn't allow you to mutate the component styles
//    so we do it this way, the ugly way !
const revertTransition = function (elem) {
	if (elem)		{ elem.style.background = "white"; }
};

const updateTransition = function (_key) {
	const elem = document.getElementById(_key);
	if (elem)		{ elem.style.background = "#F5E79E"; }
	setTimeout(this.revertTransition.bind(null, elem), 1000);
};

const deleteTransition = function (key) {
	const elem = document.getElementById(key);
	if (elem)		{ elem.style.background = "#FF5B5B"; }
	setTimeout(this.revertTransition.bind(null, elem), 1000);
};

const newTransition = function (_key) {
	const elem = document.getElementById(_key);
	if (elem)		{ elem.style.background = "#B6EF7E"; }
	setTimeout(this.revertTransition.bind(null, elem), 1000);
};

module.exports = {
	revertTransition,
	updateTransition,
	deleteTransition,
	newTransition
};
