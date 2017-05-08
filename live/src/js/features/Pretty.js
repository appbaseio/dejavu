//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');

// Prettify the json body i.e. embed that into
// a code block so that highlightjs recognises it.
class Pretty extends React.Component {
	componentDidMount() {
		hljs.highlightBlock(this.currentRef);
	}

	selectText = () => {
		var range = document.createRange();
		var selection = window.getSelection();
		var ele = document.getElementById('for-copy');
		range.selectNodeContents(ele);
		selection.removeAllRanges();
		selection.addRange(range);
	};

	render() {

		return (<pre ref={pretty => this.currentRef = pretty} className="custom-json-body" onClick={this.selectText}>
					<code className="json">
						<div id='for-copy'>{JSON.stringify(this.props.json, null, 1)}</div>
					</code>
				  </pre>);
	}
}

module.exports = Pretty;
