var React = require('react');

var DeprecateInfo = React.createClass({
    render: function() {
	    return (
	        <div className="DeprecatePage">
	            <div className="container">
	            	<div className="row">
	            		<div className="col-sm-12 col-md-8 col-md-offset-2 text-center">
	            			<h1>
				            	Dejavu 0.9 is here!
				            </h1>
				            <p className="gap">
				            	<strong>Dejavu 0.9</strong> is available as a chrome extension with moar features and bug fixes. We highly recommend that over the current app as Google is phasing out chrome apps by mid 2017. This means that you won't be able to use the current app.
				            </p>
					    <p className="gap">
				            	Going forward, we will be freezing the current chrome app version and make all the future releases available as a chrome extension.
				            </p>
				            <div className="gap ">
				            	<a href="https://chrome.google.com/webstore/detail/dejavu/jopjeaiilkcibeohjdmejhoifenbnmlh" className="btn btn-lg btn-default" target="_blank">
				            		Get the Latest Dejavu Chrome Extension
				            	</a>
				            </div>
				            <div className="gap text-center">
				            	<a href="javascript:void;" className="pointer hide-message" onClick={this.props.hideMessage} >
							<u>Hide this message</u>
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
