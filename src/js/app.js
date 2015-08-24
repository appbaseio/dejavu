var StockRow = React.createClass({
    unwatch: function() {
        this.props.unwatchStockHandler(this.props.data._type);
    },
    render: function () {
        var source = this.props.data;
        var items = [];
        for(var each in source){
            items.push(source[each]);
        }
        var children = items.map(function(item){
            return <td key={item}>{item}</td>;
        });

        return (
            <tr>
                {children}
            </tr>
        );
    }
});

var Dropdown = React.createClass({
    render: function(){
        var DropdownButton = ReactBootstrap.DropdownButton;
        var MenuItem = ReactBootstrap.MenuItem;
        var columns = this.props.cols;
        var ColumnsCheckbox =  columns.map(function(item){
            return <TypeColumn type={item} />;
        });
  return (
    <DropdownButton title="Dropdown">
      {ColumnsCheckbox}
    </DropdownButton>
  );
}
});

var Column = React.createClass({
    render: function(){
        return <th id={this.props._key}>{this.props._item}</th>;
    }
});

var Cell = React.createClass({
    render: function(){
        console.log(this.props.unique);
        if(this.props.unique)
            return <td id={this.props.unique}>{this.props.item}</td>;
        else
            return <td>{this.props.item}</td>
    }
});

var keyGen = function(row, element){
    if(typeof element === 'string')
        return row['_type']+String(row['_id'])+element;
    if(typeof element === 'number')
        return row['_type']+String(row['_id'])+String(element);
    return false;
}

var StockTable = React.createClass({
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
            var newRow = [];
            newRow.push(data[row]['json']);
            for(var each in columns){
                if(columns[each] != 'json'){
                if(data[row][columns[each]]){
                    var cell = data[row][columns[each]];
                    newRow.push(cell);
                }
                else{
                    newRow.push('');
                }
                }
            }
            rows.push(newRow.map(
                function(item){
                    var _key = keyGen(data[row], item);
                    if(_key)
                        return <Cell item={item} unique={_key} key={_key} />;
                    return <Cell item={item} unique={_key} />
                }));
        }
        // console.log(columns);
        // console.log(rows);
        var renderColumns = columns.map(function(item){
            return <Column _item={item} key={item} />;
        });
        var renderRows = rows.map(function(item)
        {
            return <tr>{item}</tr>;
        });
        return (
            <div className="table-responsive dejavu-table">
            <Dropdown cols={columns}/>
                <table className="table table-striped">
                <thead>
                <tr>
                {renderColumns}
                </tr>
                </thead>
                <tbody>
                {renderRows}
                </tbody>
                </table>
            </div>
        );
    }
});

var TypeColumn = React.createClass({
    check: function(){
        if(document.getElementById(this.props.type).visibility == "collapse"){
            document.getElementById(this.props.type).visibility = "table-cell";
        }
        else
            document.getElementById(this.props.type).visibility = "collapse";
    },
    render: function() {
        var MenuItem = ReactBootstrap.MenuItem;
        var Input = ReactBootstrap.Input;
        return(
            <Input type='checkbox' onClick={this.check} label={this.props.type} />
        );
    }
});

var TypeRow = React.createClass({
    unwatch: function() {
        elem = document.getElementById(this.props.type);
        if(elem.check == "true"){
            elem.check = "false";
            this.props.unwatchTypeHandler(this.props.type);
        }
        else{
            elem.check = "true";
            this.props.watchTypeHandler(this.props.type);
        }
    },
    render: function() {
        return(
            <tr>
                <td>
                <input className="checkBox" type="checkbox" id={this.props.type} type="checkbox" onChange={this.unwatch} check="true" /> <div className="checkboxLabel">{this.props.type}</div>
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
            <div className="table-responsive data-table row-types">
            <table className="table-hover">
                <thead>
                    <tr>
                        <th>Types</th>
                    </tr>
                </thead>
                <tbody>
                    {rowObj}
                </tbody>
            </table>
            </div>
        );
    }
});

var Pretty = React.createClass({
    render: function() {
        return <div><pre>{JSON.stringify(this.props.json, null, 2) }</pre></div>;
    }
});

var Modal = React.createClass({
    hideModal: function(){
        React.unmountComponentAtNode(document.querySelector('#modal'));
    },
    render: function(){
        var Modal = ReactBootstrap.Modal;
        var Button = ReactBootstrap.Button;
        var showing = this.props.show;
        delete showing['json'];
        var prettyjson = JSON.stringify(showing);
        return (
            <Modal {...this.props} bsSize='small' onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-sm'>JSON</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{this.props.show['_type']}</h4>
          <h4>{this.props.show['_id']}</h4>
          <p>
            <Pretty json={showing} />
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideModal}>Close</Button>
        </Modal.Footer>
      </Modal>
        );
    }
});


var HomePage = React.createClass({
    key: function(obj){
        // some unique object-dependent key
        return obj._type + obj._id;
    },
    getInitialState: function() {
        return {stocks: [{}], types: []};
    },
    viewJSON: function(data, event){
        // console.log(data);
        var view = document.getElementById("json-view");
        view.innerHTML = JSON.stringify(data);
    },
    flatten: function(data, callback) {
        var fields = [];
        for(var each in data){
            if(typeof data[each] !== 'string'){
                if(typeof data[each] !== 'number'){
                    if(each !== '_source')
                        fields.push(each);
                }
            }
        }
        for(var each in data['_source']){
            data[each] = data['_source'][each];
            if(typeof data[each] !== 'string'){
                if(typeof data[each] !== 'number'){
                        fields.push(each);
                }
            }
        }
        delete data['_source'];
        return callback(data, fields);
    },
    showJSON: function(data, event){
        React.render(<Modal show={data}/>, document.getElementById('modal'));
    },
    injectLink: function(data, fields) {
        var ID = data['_id'];
        data['json'] = <a href="#" onClick={this.showJSON.bind(null, data)}><i className="fa fa-external-link"></i></a>;
        for(var each in fields){
            console.log(data[fields[each]]);
            data[fields[each]] = <a href="#" onClick={this.showJSON.bind(null, data[fields[each]])}><i className="fa fa-external-link"></i></a>;
        }
        return data;
    },
    diff: function(row, update){
        var fields = [];
        for(var each in update){
            if(row[each]){
                if(typeof row[each] === 'number'){
                    if(row[each] !== update[each])
                        fields.push(each);
                }
                if(typeof row[each] === 'string'){
                    if(row[each] !== update[each])
                        fields.push(each);
                }
                else{
                    if(JSON.stringify(row[each]) !== JSON.stringify(update[each]))
                        fields.push(each);
                }
            }
            else{
                fields.push(each);
            }
        }
        return fields;
    },
    transition: function(){

    },
    getStreamingData: function(typeName){
        // Logic to stream continuous data
        feed.getData(typeName, function(update){
            update = this.flatten(update, this.injectLink);
            var got = false;
            var changes = [];
            for(var each in sdata){
                if(sdata[each]['_id'] === update['_id']){
                    if(sdata[each]['_type'] === update['_type']){
                        sdata[each] = update;
                        changes = this.diff(sdata[each], update);
                        console.log("overlap");
                        got = true;
                        break;
                    }
                }
            }
            if(!got){
                sdata.push(update);
            }
            this.setState({stocks: sdata});
            if(got){
                /*
                var _key = keyGen(update, update['_id']);
                console.log(_key);
                var elem = document.getElementById(_key);
                elem.style.background = 'blue';
                */
                var _key;
                for(var each in changes){
                    _key = keyGen(update, update[changes[each]])
                    this.transition(_key);
                }
            }
        }.bind(this));
    },
    getStreamingTypes: function(){
        feed.getTypes( function(update){    // only called on change.
            this.setState({types: update});
        }.bind(this));
    },
    removeType: function(typeName) {
        feed.deleteData(typeName, function() {
            this.setState({stocks: sdata});
        }.bind(this));
    },
    componentDidMount: function(){
        this.getStreamingTypes();
        setInterval(this.getStreamingTypes, 5*60*1000);  // call every 5 min.
    },
    watchStock: function(typeName){
        subsetESTypes.push(typeName);
        this.getStreamingData(typeName);
        console.log("selections: ", subsetESTypes);
    },
    unwatchStock: function(typeName){
        subsetESTypes.splice(subsetESTypes.indexOf(typeName), 1);
        this.removeType(typeName);
        this.getStreamingData(null);
        console.log("selections: ", subsetESTypes);
    },
    render: function () {
        return (
            <div>
                <div id='modal' />
                <TypeTable className="dejavu-table" Types={this.state.types} watchTypeHandler={this.watchStock} unwatchTypeHandler={this.unwatchStock} />
                <StockTable _data={this.state.stocks} />
            </div>
        );
    }
});

React.render(<HomePage />, document.getElementById('main'));
