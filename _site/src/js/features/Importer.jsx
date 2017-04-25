var React = require('react');

var Importer = React.createClass({

	getInitialState: function() {
		return {
			show: false
		};
	},
	close: function() {
		$(".typeContainer").removeClass("importer-included");
		this.setState({
			show: false,
		});
	},
	open: function() {
		$(".typeContainer").addClass("importer-included");
		this.setState({
			show: true
		});
	},
	render: function() {
		return (
			<div className="dejavu-importer">
				<button onClick={this.open} className="btn btn-primary dejavu-importer-btn">
					Importer
				</button>
				{
					this.state.show ? (
						<div className="dejavu-importer-iframe-container">
							<iframe src="https://appbaseio-confidential.github.io/importer/?header=false" frameBorder="0" className="dejavu-importer-iframe" />
							<button className="btn dejavu-importer-close" onClick={this.close}>x</button>
						</div>
					) : null
				}
			</div>
		);
	}
});

module.exports = Importer;