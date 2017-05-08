var React = require('react');

//Radio button with appropriate search input field
class SingleMenuItem extends React.Component {
	state = {
		filterField: '',
		filterValue: ''
	};

	changeFilter = (e) => {
		if(this.props.val != 'true' && this.props.val != 'false') {
			var filterField = e.currentTarget.value;
			this.props.changeFilter(filterField, this.state.filterValue);
			var key = filterKeyGen(this.props.columnField, this.props.val);
			var keyInput = key + '-input';
			setTimeout(function(){
				$('#' + keyInput).focus();
			}, 300);
		}
		else {
			this.props.changeFilter('term', e.currentTarget.value);
		}
	};

	valChange = (e) => {
		var filterValue = e.currentTarget.value;
		this.setState({
			filterValue: filterValue
		});
		this.props.getFilterVal(filterValue);
	};

	rangeChange = (key) => {
		var keyInput = key + '-input';
		var keyInputRange = key + '-inputRange';
		var startDate = $('#'+keyInput).val();
		var endDate = $('#'+keyInputRange).val();
		if(startDate != '' && endDate != '') {
			var filterValue = startDate+'@'+endDate;
			this.setState({
				filterValue: filterValue
			});
			this.props.getFilterVal(filterValue);
		}
	};

	render() {
		var singleItemClass = this.props.filterField == this.props.val ? 'singleItem active' : 'singleItem';
		var placeholder = this.props.val == 'has' || this.props.val == 'has not' ? 'Type , for multiple' : 'Type here...';
		var key = filterKeyGen(this.props.columnField, this.props.val);
		var keyInput = key + '-input';
		var keyInputRange = key + '-inputRange';
		var searchElement = (<div className="searchElement">
								<input id={keyInput} className="form-control" type="text" placeholder={placeholder} onKeyUp={this.valChange} />
							</div>);
		
		if(this.props.val == 'range') {
			searchElement = (<div className="searchElement">
								<input id={keyInput} 
									className="form-control" 
									type="text" 
									placeholder="starting date" 
									onKeyUp={this.rangeChange.bind(null, key)} />
								<input id={keyInputRange}
									className="form-control mt-5" 
									type="text" 
									placeholder="ending date" 
									onKeyUp={this.rangeChange.bind(null, key)} />
							</div>)  
		} else if(this.props.val == 'true' || this.props.val == 'false' ) {
			searchElement = <span></span>;
		}
							
		
		return (<div className={singleItemClass}>
					<div className="theme-element radio">
						<input onChange={this.changeFilter} type="radio" name="optionsRadios"
						 value={this.props.val} id={key} />
						<label htmlFor={key}><span className="lableText">{this.props.val}</span></label>
					</div>
						{searchElement}
				</div>);
	}
}

module.exports = SingleMenuItem;