var WatchStock = React.createClass({
    getInitialState: function() {
        return {symbol: ""};
    },
    watchStock: function() {
        this.props.watchStockHandler(this.state.symbol);
        this.setState({symbol: ''});
    },
    handleChange: function(event) {
        this.setState({symbol: event.target.value});
    },
    render: function () {
        return (
            <div className="row">
            </div>
        );
    }
});

var StockRow = React.createClass({
    unwatch: function() {
        this.props.unwatchStockHandler(this.props.stock.symbol);
    },
    render: function () {
        var lastClass = '',
            changeClass = 'change-positive',
            iconClass = 'glyphicon glyphicon-triangle-top';
        if (this.props.stock === this.props.last) {
            lastClass = this.props.stock.change < 0 ? 'last-negative' : 'last-positive';
        }
        if (this.props.stock.change < 0) {
            changeClass = 'change-negative';
            iconClass = 'glyphicon glyphicon-triangle-bottom';
        }
        return (
            <tr>
                <td>{this.props.stock._type}</td>
                <td>{this.props.stock._id}</td>
                <td className={lastClass}>{this.props.stock._source}</td>
                <td className={changeClass}>{this.props.stock.change} <span className={iconClass} aria-hidden="true"></span></td>
            </tr>
        );
    }
});

var StockTable = React.createClass({
    render: function () {
        var items = [];
        for (var symbol in this.props.stocks) {
            var stock = this.props.stocks[symbol];
            items.push(<StockRow key={stock._id} stock={stock} last={this.props.last} unwatchStockHandler={this.props.unwatchStockHandler}/>);
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
    render: function() {
        return(
            <tr>
                <td>
                <input type="checkbox" name="vehicle" value="Bike"> {this.props.type} </input>
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
            rowObj.push(<TypeRow key={type} type={types[type]} />);
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
    getInitialState: function() {
        var stocks = {};
        feed.watch([".percolator", "_default_", "foo", "scalrtest", "tweet"]);
        feed.onChange(function(stock) {
            stocks[stock._type] = stock;
            this.setState({stocks: stocks, last: stock});
        }.bind(this));
        return {stocks: stocks};
    },
    watchStock: function(symbols) {
        symbols = symbols.replace(/ /g,'');
        var arr = symbols.split(",");
        feed.watch(arr);
    },
    unwatchStock: function(symbol) {
        feed.unwatch(symbol);
        var stocks = this.state.stocks;
        delete stocks[symbol];
        this.setState({stocks: stocks});
    },
    render: function () {
        var types = [".percolator", "_default_", "foo", "scalrtest", "tweet"];
        return (
            <div>
                <TypeTable Types={types} />
                <WatchStock watchStockHandler={this.watchStock}/>
                <StockTable stocks={this.state.stocks} last={this.state._source} unwatchStockHandler={this.unwatchStock}/>
            </div>
        );
    }
});

React.render(<HomePage />, document.getElementById('main'));