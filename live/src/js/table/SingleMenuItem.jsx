var React = require('react');
var ReactBootstrap = require('react-bootstrap');

//Radio button with appropriate search input field
var SingleMenuItem = React.createClass({
    getInitialState: function() {
        return {
            filterField: '',
            filterValue: ''
        };
    },
    changeFilter: function(e) {
        var filterField = e.currentTarget.value;
        this.props.changeFilter(filterField, this.state.filterValue);
        var key = filterKeyGen(this.props.columnField, this.props.val);
        var keyInput = key + '-input';
        setTimeout(function(){
            $('#' + keyInput).focus();
        }, 300);
        //this.setState({filterField:filterField});
    },
    valChange: function(e) {
        var filterValue = e.currentTarget.value;
        this.setState({
            filterValue: filterValue
        });
        this.props.getFilterVal(filterValue);
    },
    rangeChange: function(key) {
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
    },
    render: function() {
        var singleItemClass = this.props.filterField == this.props.val ? 'singleItem active' : 'singleItem';
        var placeholder = this.props.val == 'has' || this.props.val == 'has not' ? 'Type , for multiple' : 'Type here...';
        var key = filterKeyGen(this.props.columnField, this.props.val);
        var keyInput = key + '-input';
        var keyInputRange = key + '-inputRange';
        
        var searchElement = this.props.val == 'range' ?
                            (<div className="searchElement">
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
                            </div>) :
                            (<div className="searchElement">
                                <input id={keyInput} className="form-control" type="text" placeholder={placeholder} onKeyUp={this.valChange} />
                            </div>);
        
        return (<div className={singleItemClass}>
                    <div className="theme-element radio">
                        <input onChange={this.changeFilter} type="radio" name="optionsRadios"
                         value={this.props.val} id={key} />
                        <label htmlFor={key}><span className="lableText">{this.props.val}</span></label>
                    </div>
                        {searchElement}
                </div>);
    }
});

module.exports = SingleMenuItem;