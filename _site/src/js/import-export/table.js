// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.

// Each row in the types table on the left side.
var TypeRow = React.createClass({
    getInitialState: function(){
        // we store the state(checked/unchecked) for every type
        // so that when we reload, the state restores.
        var value = window.localStorage.getItem(this.props.type);
            checked = false;
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
        // every time its checked we update the local storage.
        window.localStorage.setItem(this.props.type, checked);
        this.setState({isChecked: checked});
    },
    render: function() {
        return(
                <li>
                    <input
                     id={this.props.type}
                     type="checkbox"
                     key={this.props.type}
                     defaultChecked={this.state.isChecked}
                     onChange={this.unwatch}
                     readOnly={false}/>
                    <label htmlFor={this.props.type}>{this.props.type}</label>
                </li>
        );
    }
});

// This is for the table holding the types on the
// left tab.
var SwitchBtn = React.createClass({
    changePage:function(){
        this.props.changePage(this.props.name);
    },
    render: function()  {
        var setClass = this.props.currentPage == this.props.name ? ' col-xs-6 switch btn btn-primary' : ' col-xs-6 switch btn btn-default';
        return (
                <span className={setClass} onClick={this.changePage}>{this.props.name}</span>
        );
    }
});


var TypeTable = React.createClass({
    render: function()  {
        var types = this.props.Types,
            rowObj = [],
            appname = APPNAME,
            pageList = '';

        for(var type in types){
            rowObj.push(<TypeRow
                         key={type}
                         type={types[type]}
                         unwatchTypeHandler={this.props.unwatchTypeHandler}
                         watchTypeHandler={this.props.watchTypeHandler} />);
        }
        
        if(this.props.currentPage == 'Export'){
            pageList = (<ul className='fa-ul types-list'>
                {rowObj}
            </ul>
            );
        }
        else if(this.props.currentPage == 'Import'){
            pageList = (<ul>
                <li>Link for import docs</li>
            </ul>);
        }

        return (
            <div className='left-tab'>
            <div className='row'>
                <div className=" col-xs-12">
                    <div className="switchContainer col-xs-12">
                        <SwitchBtn name="Import" currentPage={this.props.currentPage} changePage={this.props.changePage} />
                        <SwitchBtn name="Export" currentPage={this.props.currentPage} changePage={this.props.changePage} />
                    </div>
                </div>
            </div>
            {pageList}
            </div>
        );
    }
});


