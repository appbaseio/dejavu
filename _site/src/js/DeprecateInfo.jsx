var React = require('react');

var DeprecateInfo = React.createClass({
    render: function() {
	    return (
	        <div className="DeprecatePage">
	            <div className="container">
	            	<div className="row">
	            		<div className="col-sm-12 col-md-8 col-md-offset-2 text-center">
	            			<h1>
				            	Dejavu 9.0 is here!
				            </h1>
				            <p className="gap">
				            	<strong>Dejavu</strong> fits the unmet need of being a modern Web UI for Elasticsearch. 
				            	Existing UIs were either built with a legacy UI and have left much to be desired from a 
				            	Ux perspective or have been built with server side page rendering techniques (I am looking at you, Kibana).
				            </p>
				            <div className="gap ">
				            	<a href="https://github.com/appbaseio/dejavu/" className="btn btn-lg btn-default">
				            		Upgrade to v9.0
				            	</a>
				            </div>
				            <div className="gap text-center">
				            	<a href="javascript:void;" className="pointer hide-message" onClick={this.props.hideMessage} >
				            		Hide this message
				            	</a>
				            </div>
	            		</div>
	            	</div>
	            </div>
	        </div>
	    );
    }
});

module.exports = DeprecateInfo;
