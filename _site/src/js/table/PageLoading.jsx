var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var pageLoading = React.createClass({
    render: function() {
        return (<div className="pageLoading">
                    <div className="loadingBar"></div>
                    <div className="vertical1">
                    </div>  
                </div>);
    }
});

module.exports = pageLoading;
