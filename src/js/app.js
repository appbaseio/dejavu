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
        return <th id={this.props._item}>{this.props._item}</th>;
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
            var newRow = [];
            newRow.push(data[row]['json']);
            for(var each in columns){
                if(columns[each] != 'json'){
                if(data[row][columns[each]]){
                    newRow.push(data[row][columns[each]]);
                }
                else{
                    newRow.push('');
                }
                }
            }
            rows.push(newRow.map(
                function(item){
                    return <td>{item}</td>;
                }));
        }
        console.log(columns);
        // console.log(rows);
        var renderColumns = columns.map(function(item){
            return <Column _item={item} key={item} />;
        });
        var renderRows = rows.map(function(item)
        {
            return <tr>{item}</tr>;
        });
        return (
            <div>
            <Dropdown cols={columns}/>
            <div className="table-responsive dejavu-table">
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
            </div>
        );
    }
});

var TypeColumn = React.createClass({
    check: function(){
        if(document.getElementById(this.props.type).style.display == "none"){
            document.getElementById(this.props.type).style.display = "table-cell";
        }
        else
            document.getElementById(this.props.type).style.display = "none";
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
            <div className="row-types">
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
    var result = {};
    // result['JSON'] = <button className="btn btn-circle btn-info" onClick={this.viewJSON.bind(null, data)}>J</button>
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
        }
        recurse(data, "");
        return callback(result);
    },
    showJSON: function(data, event){
        React.render(<Modal show={data}/>, document.getElementById('modal'));
    },
    injectLink: function(data) {
        var ID = data['_id'];
        data['json'] = <a href="#" onClick={this.showJSON.bind(null, data)}><i className="fa fa-external-link"></i></a>;
        return data;
    },
    getStreamingData: function(typeName){
        // Logic to stream continuous data
        feed.getData(typeName, function(update){
            update = this.flatten(update, this.injectLink);
            var got = false;
            for(var each in sdata){
                if(sdata[each]['_id'] === update['_id']){
                    if(sdata[each]['_type'] === update['_type']){
                        sdata[each] = update;
                        console.log("overlap");
                        got = true;
                    }
                }
            }
            if(!got){
                sdata.push(update);
            }
            this.setState({stocks: sdata});
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
                <input type="text" className="form-control" placeholder="#" />
                <TypeTable Types={this.state.types} watchTypeHandler={this.watchStock} unwatchTypeHandler={this.unwatchStock} />
                <StockTable _data={this.state.stocks} />
            </div>
        );
    }
});

React.render(<HomePage />, document.getElementById('main'));
