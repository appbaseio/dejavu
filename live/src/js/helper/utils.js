var React = require('react');
var Utils = function() {
	this.bulkExample = 'https://gist.githubusercontent.com/siddharthlatest/5f580917f575d72dee182caa5b5ed1b3/raw/c0f80b5410f4d7c84d37d49f2d1f5dd11a03a78e/bulk_add_dejavu.json';
	this.getTypeMarkup = function(method, validateClass, selectClass) {
		var id = method === 'query' ? 'applyQueryOn' : 'setType';
		return (
			<div className={validateClass.type}>
				<label htmlFor="inputEmail3" className="col-sm-3 control-label">Type <span className="small-span">(aka table)</span></label>
				<div className="col-sm-9">
					<select id={id} className={selectClass} multiple="multiple" name="type">
					</select>
					<span className="help-block">
						Type on which the query will be applied.
					</span>
				</div>
			</div>
		);
	}
	this.getBodyMarkup = function(method, validateClass, selectClass, userTouch, defaultValue = '') {
		var labelText = method === 'query' ? 'Query body' : 'JSON';
		var smalltext = method === 'query' ? '(JSON)' : (<p>(use array for adding multiple records, <a href={this.bulkExample} target="_blank">see an example</a>.)</p>);
		var helpText = method === 'query' ? 'Elasticsearch Query is required.' : 'A data document is stored as a JSON object.';
		return (
			<div className={validateClass.body}>
				<label htmlFor="inputPassword3" className="col-sm-3 control-label">
					{labelText} <div className="small-span">{smalltext}</div>
				</label>
				<div className="col-sm-9">
					<textarea id="setBody" className="form-control" rows="10" name="body"
						defaultValue={
							typeof defaultValue === 'object' ?
								JSON.stringify(defaultValue, null, 4) :
								defaultValue
						}
						onClick={userTouch.bind(null, true)}
						onFocus={userTouch.bind(null, true)} ></textarea>
					<span className="help-block">
						{helpText}
					</span>
				</div>
			</div>
		);
	}
	this.openModal = function() {
		this.userTouch(false);
		this.setState({
			showModal: true
		});
		setTimeout(function() {
			this.editorref = help.setCodeMirror('setBody');
		}.bind(this), 300);
	};
	this.closeModal = function() {
		this.setState({
			showModal: false,
			validate: {
				touch: false,
				name: false,
				body: false
			},
			selectClass: ''
		});
	};
	this.applySelect = function() {
		//apply select2 for auto complete
		if (!this.state.validate.type && typeof this.props.types != 'undefined' && typeof this.props.selectClass != 'undefined')
			this.applySelect();
	};
}
module.exports = new Utils();
