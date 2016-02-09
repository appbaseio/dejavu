var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var pageLoading = React.createClass({
    render: function() {
        return (<div className="pageLoading">
                    <div className="vertical1">
                        <i className="fa fa-5x fa-spinner fa-spin"></i>
                    </div>  
                </div>);
    }
});

module.exports = pageLoading;