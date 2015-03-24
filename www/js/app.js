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
                <p>Available stocks for demo: MCD, BA, BAC, LLY, GM, GE, UAL, WMT, AAL, JPM</p>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Comma separated list of stocks to watch..." value={this.state.symbol} onChange={this.handleChange} />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.watchStock}>
                            <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Watch
                        </button>
                    </span>
                </div>
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
                <td>{this.props.stock.symbol}</td>
                <td>{this.props.stock.open}</td>
                <td className={lastClass}>{this.props.stock.last}</td>
                <td className={changeClass}>{this.props.stock.change} <span className={iconClass} aria-hidden="true"></span></td>
                <td>{this.props.stock.high}</td>
                <td>{this.props.stock.low}</td>
                <td><button type="button" className="btn btn-default btn-sm" onClick={this.unwatch}>
                    <span className="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
                </button></td>
            </tr>
        );
    }
});

var StockTable = React.createClass({
    render: function () {
        var items = [];
        for (var symbol in this.props.stocks) {
            var stock = this.props.stocks[symbol];
            items.push(<StockRow key={stock.symbol} stock={stock} last={this.props.last} unwatchStockHandler={this.props.unwatchStockHandler}/>);
        }
        return (
            <div className="row">
            <table className="table-hover">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Open</th>
                        <th>Last</th>
                        <th>Change</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Unwatch</th>
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

var HomePage = React.createClass({
    getInitialState: function() {
        var stocks = {};
        feed.watch(['MCD', 'BA', 'BAC', 'LLY', 'GM', 'GE', 'UAL', 'WMT', 'AAL', 'JPM']);
        feed.onChange(function(stock) {
            stocks[stock.symbol] = stock;
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
        return (
            <div>
                <WatchStock watchStockHandler={this.watchStock}/>
                <StockTable stocks={this.state.stocks} last={this.state.last} unwatchStockHandler={this.unwatchStock}/>
                <div className="row">
                    <div className="alert alert-warning" role="alert">All stock values are fake and changes are simulated. Do not trade based on the above data.</div>
                </div>
            </div>
        );
    }
});

React.render(<HomePage />, document.getElementById('main'));