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
    <DropdownButton title="">
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
        return <td id={this.props.unique} key={this.props.unique}>{this.props.item}</td>;
    }
});

var keyGen = function(row, element){
    return row['_type']+String(row['_id'])+String(element);
}

var rowKeyGen = function(row){
    return row['_id']+row['_type'];
}

var Row = React.createClass({
    render: function(){
        console.log(this.props._id);
        return <tr id={this.props._id}>{this.props.row}</tr>;
    }
});

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
                renderRow.push(<Cell item={newRow[each]} unique={_key} key={_key} />);
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
            <div className="table-responsive dejavu-table">
            <Dropdown cols={columns}/>
                <table className="table table-striped table-bordered">
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
            data[fields[each]] = <a href="#" onClick={this.showJSON.bind(null, data[fields[each]])}><i className="fa fa-external-link"></i></a>;
        }
        return data;
    },
    revertTransition: function(elem){
        elem.style.background = 'white';
    },
    updateTransition: function(_key){
        var elem = document.getElementById(_key);
        elem.style.background = '#F4A460';
        setTimeout(this.revertTransition.bind(null, elem), 500);
    },
    deleteTransition: function(key){
        var elem = document.getElementById(key);
        elem.style.background = '#CC0033';
        setTimeout(this.revertTransition.bind(null, elem), 500);
    },
    newTransition: function(_key){
        var elem = document.getElementById(_key);
        elem.style.background = '#33FF33';
        setTimeout(this.revertTransition.bind(null, elem), 500);
    },
    deleteRow: function(index){
        delete sdata[index];
    },
    reset: function(){
        this.setState({stocks: sdata});
    },
    getStreamingData: function(typeName){
        // Logic to stream continuous data
        feed.getData(typeName, function(update){
            update = this.flatten(update, this.injectLink);
            var got = false;
            var index = -1;
            for(var each in sdata){
                    if(sdata[each]['_id'] === update['_id']){
                        if(sdata[each]['_type'] === update['_type']){
                            sdata[each] = update;
                            got = true;
                            index = each;
                            break;
                        }
                    }
            }
            if(update['_deleted']){
                for(var each in update){
                    if(each !== '_deleted'){
                        var key = keyGen(update, each);
                        this.deleteTransition(key);
                    }
                }
                var key = rowKeyGen(update);
                this.deleteTransition(key);
                delete sdata[index];
                setTimeout(
                    function(callback){
                        callback();
                    }.bind(null, this.reset), 600);
            }
            else{
                if(!got){
                    sdata.push(update);
                    this.reset();
                    for(var each in update){
                        var key = keyGen(update, each);
                        this.newTransition(key);
                    }
                    var key = rowKeyGen(update);
                    this.newTransition(key);
                }
                else{
                    this.reset();
                    for(var each in update){
                        var key = keyGen(update, each);
                        this.updateTransition(key);
                    }
                    var key = rowKeyGen(update);
                    this.updateTransition(key);
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
