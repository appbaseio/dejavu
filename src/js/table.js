/*
    A bunch of row/column/manipulation functions.
    Things din't work well with most of the existing
    libraries especially on the frontend and
    configuring with react.

*/

var Column = React.createClass({
    render: function(){
        return <th id={this.props._item}>{this.props._item}</th>;
    }
});

var Cell = React.createClass({
    render: function(){
        var vb = this.props.visibility;
        var style = {display:vb};
        return <td id={this.props.unique} key={this.props.unique} style={style}>{this.props.item}</td>;
    }
});

var Row = React.createClass({
    render: function(){
        return <tr id={this.props._id}>{this.props.row}</tr>;
    }
});

var Table = React.createClass({
    componentDidMount: function() {
        console.log("mounted");
        window.addEventListener('scroll', this.props.scrollFunction);
    },
    render: function() {
        return (
            <div id="data-table-container" className="table-container">
            <table id="data-table" className="table table-striped table-bordered table-responsive table-scrollable">
                <thead>
                    <tr>
                        {this.props.renderColumns}
                    </tr>
                </thead>
                <tbody>
                        {this.props.renderRows}
                </tbody>
            </table>
            </div>

        );
    }
})
var DataTable = React.createClass({
    render: function () {
        data = this.props._data;
        var columns = ['json'];
        for(var each in data){
            for(column in data[each]){
                if(column != 'json'){
                    if(columns.indexOf(column) <= -1){
                        columns.push(column);
                    }
                }
            }
        }
        var rows = [];
        for(var row in data){
            var newRow = {};
            newRow['json'] = data[row]['json'];
            for(var each in columns){
                if(columns[each] != 'json'){
                    if(data[row][columns[each]]){
                        var cell = data[row][columns[each]];
                        newRow[columns[each]] = cell;
                    }
                    else{
                        newRow[columns[each]] = '';
                    }
                }
            }
            renderRow = [];
            for(var each in newRow){
                var _key = keyGen(data[row], each);
                var elem = document.getElementById(each);
                var visibility = '';
                if(elem){
                    visibility = elem.style.display;
                }
                renderRow.push(<Cell item={newRow[each]} unique={_key} key={_key} visibility={visibility} />);
            }
            rows.push({'_key': String(data[row]['_id'])+String(data[row]['_type']), 'row':renderRow});
        }
        var renderColumns = columns.map(function(item){
            return <Column _item={item} key={item} />;
        });
        var renderRows = rows.map(function(item)
        {
            var _key = item['_key'];
            var row = item['row'];
            return <Row key={_key} _id={_key} row={row} />;
        });
        return (
            <div className="dejavu-table">
            <Dropdown cols={columns} />
            <Table renderColumns={renderColumns} renderRows={renderRows} scrollFunction={this.props.scrollFunction} />
            </div>
        );
    }
});

var TypeRow = React.createClass({
    getInitialState: function(){
        var value = window.localStorage.getItem(this.props.type);
        console.log(this.props.type, value)
        var checked = false;
        if(value == "true"){
            checked = true;
            this.props.watchTypeHandler(this.props.type);
        }
        return {isChecked: checked};
    },
    unwatch: function() {
        var checked = false;
        if(this.state.isChecked){
            this.props.unwatchTypeHandler(this.props.type);
        }
        else{
            checked = true;
            this.props.watchTypeHandler(this.props.type);
        }
        window.localStorage.setItem(this.props.type, checked);
        this.setState({isChecked: checked});
    },
    render: function() {
        return(
            <tr>
                <td>
                    <input className="checkBox" type="checkbox" id={this.props.type} type="checkbox" onChange={this.unwatch} checked={this.state.isChecked} /> <div className="checkboxLabel">{this.props.type}</div>
                </td>
            </tr>
        );
    }
});

var TypeTable = React.createClass({
    render: function()  {
        var types = this.props.Types;
        var rowObj = [];
        for(var type in types){
            rowObj.push(<TypeRow key={type} type={types[type]} unwatchTypeHandler={this.props.unwatchTypeHandler} watchTypeHandler={this.props.watchTypeHandler} />);
        }
        return (
            <table className="table-hover table-responsive row-types">
                <thead>
                    <tr>
                        <th>Types</th>
                    </tr>
                </thead>
                <tbody>
                    {rowObj}
                </tbody>
            </table>
        );
    }
});