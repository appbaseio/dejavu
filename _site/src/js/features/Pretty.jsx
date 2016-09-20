//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');
var ReactBootstrap = require('react-bootstrap');

// Prettify the json body i.e. embed that into
// a code block so that highlightjs recognises it.
var Pretty = React.createClass({
    componentDidMount: function() {
        var current = React.findDOMNode(this);
        hljs.highlightBlock(current);
    },
    selectText: function() {
        var range = document.createRange();
        var selection = window.getSelection();
        var ele = document.getElementById('for-copy');
        range.selectNodeContents(ele);
        selection.removeAllRanges();
        selection.addRange(range);
    },
    render: function() {

        return (<pre className="custom-json-body" onClick={this.selectText}>
                    <code className="json">
                        <div id='for-copy'>{JSON.stringify(this.props.json, null, 1)}</div>
                    </code>
                  </pre>);
    }
});

module.exports = Pretty;