//    React doesn't allow you to mutate the component styles
//    so we do it this way, the ugly way !
var revertTransition = function(elem) {
	if (elem)
		elem.style.background = 'white';
}

var updateTransition = function(_key) {
	var elem = document.getElementById(_key);
	if (elem)
		elem.style.background = '#F5E79E';
	setTimeout(this.revertTransition.bind(null, elem), 1000);
}

var deleteTransition = function(key) {
	var elem = document.getElementById(key);
	if (elem)
		elem.style.background = '#FF5B5B';
	setTimeout(this.revertTransition.bind(null, elem), 1000);
}

var newTransition = function(_key) {
	var elem = document.getElementById(_key);
	if (elem)
		elem.style.background = '#B6EF7E';
	setTimeout(this.revertTransition.bind(null, elem), 1000);
}