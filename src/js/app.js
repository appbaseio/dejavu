var StockRow = React.createClass({
    unwatch: function() {
        this.props.unwatchStockHandler(this.props.stock._type);
    },
    render: function () {
        var source = this.props.stock._source;
        var items = [];
        for(var each in source){
            items.push(source[each]);
        }
        var children = items.map(function(item){
            return <td key={item}>{item}</td>;
        });

        return (
            <tr>
                <td>{this.props.stock._type}</td>
                <td>{this.props.stock._id}</td>
                {children}
            </tr>
        );
    }
});

/*
var SourceTable = React.createClass({

});
*/

var StockTable = React.createClass({
    render: function () {
        var items = [];
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

var HomePage = React.createClass({
    key: function(obj){
        // some unique object-dependent key
        return obj._type + obj._id;
    },
    getInitialState: function() {
        var data = {};
        var newtypes = [".percolator", "_default_", "foo", "scalrtest", "tweet"];
        return {stocks: data, types: newtypes};
    },
    getStreamingData: function(){
        // Logic to stream continous data
        feed.getData( function(update){
            console.log(update.hits.hits[0]);
            sdata.push(update.hits.hits[0]);
            this.setState({stocks: sdata});
        }.bind(this));
    },
    getStreamingTypes: function(){
        feed.getTypes( function(update){
            console.log(update);
            this.setState({types: update});
        }.bind(this));
    },
    componentDidMount: function(){
        setInterval(this.getStreamingData, 200);
        setInterval(this.getStreamingTypes, 200);
    },
    render: function () {
        return (
            <div>
                <TypeTable Types={this.state.types} watchTypeHandler={this.watchStock} unwatchTypeHandler={this.unwatchStock} />
                <StockTable stocks={this.state.stocks} last={this.state._source} unwatchStockHandler={this.unwatchStock}/>
            </div>
        );
    }
});

React.render(<HomePage />, document.getElementById('main'));
