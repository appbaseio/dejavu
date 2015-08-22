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

var StockTable = React.createClass({
    render: function () {
        var items = [];
        return (
            <Griddle results={this.props.stock} tableClassName="table" showFilter={true}
 showSettings={true} columns={["name", "city", "state", "country"]} />
        );
        for (var symbol in this.props.stocks) {
            var stock = this.props.stocks[symbol];
            items.push(<StockRow key={String(stock._id)+stock._type} stock={stock} last={this.props.last} unwatchStockHandler={this.props.unwatchStockHandler}/>);
        }
        return (
            <div className="row-data">
            <table className="table-hover">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>ID</th>
                        <th>SOURCE</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>
            </div>
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

var JSONview = React.createClass({
    render: function(){
        return (
            <div id="json-view" className="panel panel-default json-panel">
            </div>
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
        console.log(data);
        var view = document.getElementById("json-view");
        view.innerHTML = JSON.stringify(data);
    },
    flatten: function(data) {
    var result = {};
    result['JSON'] = <button className="btn btn-circle btn-info" onClick={this.viewJSON.bind(null, data)}>J</button>
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
        return result;
    },
    getStreamingData: function(typeName){
        // Logic to stream continuous data
        feed.getData(typeName, function(update){
            update = this.flatten(update);
            sdata.push(update);
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
                <TypeTable Types={this.state.types} watchTypeHandler={this.watchStock} unwatchTypeHandler={this.unwatchStock} />
                <Griddle
                results={this.state.stocks}
                tableClassName="table"
                showFilter={true}
                showSettings={true}
                columns={["JSON", "_type", "_id"]}
                settingsText={"settings"}
                enableInfiniteScroll={true} />
                <JSONview />
            </div>
        );
    }
});

React.render(<HomePage />, document.getElementById('main'));
