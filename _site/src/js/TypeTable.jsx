var React = require('react');
var FeatureComponent = require('./features/FeatureComponent.jsx');

// Each row in the types table on the left side.
var TypeRow = React.createClass({
    getInitialState: function() {
        // we store the state(checked/unchecked) for every type
        // so that when we reload, the state restores.
        return {
            isChecked: false
        };
    },
    componentDidMount: function() {
        if(BRANCH !== 'chrome') {
            var types = window.storageService.getItem('types');
            checked = false;
            try {
                types = JSON.parse(types);
                if (types.indexOf(this.props.type) !== -1) {
                    checked = true;
                    this.props.watchTypeHandler(this.props.type);
                }
            } catch(e) {

            }
            this.setState({
                isChecked: checked
            });
            this.props.typeInfo.typeCounter();
        } else {
            var value;
            var intype = this.props.type;
            var value = this.props.checkValue;
            this.setType(value);
        }
    },
    componentDidUpdate: function() {
        if(this.props.cleanTypes != this.cleanTypes) {
            this.cleanTypes = this.props.cleanTypes
            this.cleanType();
        }
    },
    cleanType: function() {
        if(this.props.cleanTypes) {
            this.setState({
                isChecked: false
            });
        }
    },
    setType: function(value){
        checked = false;
        if (value) {
            checked = true;
            this.props.watchTypeHandler(this.props.type);
        }
        this.setState({
            isChecked: checked
        });
        this.props.typeInfo.typeCounter();
    },
    unwatch: function() {
        // every time its checked we update the local storage.
        if(BRANCH !== 'chrome') {
            this.justUnwatch();
        } else {
           this.chromeUnwatch();
        }
    },
    justUnwatch: function() {
        var checked = false;
        if (this.state.isChecked) {
            this.props.unwatchTypeHandler(this.props.type);
        } else {
            checked = true;
            this.props.watchTypeHandler(this.props.type);
        }
        // every time its checked we update the local storage.
        var types = window.storageService.getItem('types');
          try {
            types = JSON.parse(types);
        } catch(e) {
            types = []
        }
        types = types == null ? [] : types;
        if(checked) {
            types.push(this.props.type);
        } else {
            types.forEach(function(val, index) {
                if(val == this.props.type) {
                    types.splice(index, 1);
                }
            }.bind(this));
        }
        window.storageService.setItem('types', JSON.stringify(types));
        this.setState({
            isChecked: checked
        });
    },
    chromeUnwatch: function() {
        var checked = false;
        if (this.state.isChecked) {
            this.props.unwatchTypeHandler(this.props.type);
        } else {
            checked = true;
            this.props.watchTypeHandler(this.props.type);
        }

        // every time its checked we update the local storage.
        // window.localStorage.setItem(this.props.type, checked);
        var intype = this.props.type;
        var setObj = {};
        setObj[intype] = checked;

        storageService.getItem('types', function(result) {
            var types = result.types;
            try {
                types = JSON.parse(types);
            } catch(e) {
                types = []
            }
            if(checked) {
                types.push(intype);
            } else {
                types.forEach(function(val, index) {
                    if(val == intype) {
                        types.splice(index, 1);
                    }
                })
            }
            storageService.setItem({'types': types});
        });  
        this.setState({
            isChecked: checked
        });
    },
    setUnwatch: function(types) {
        try {
            types = JSON.parse(types);
        } catch(e) {
            types = []
        }
        types = types == null ? [] : types;
        if(checked) {
            types.push(this.props.type);
        } else {
            types.forEach(function(val, index) {
                if(val == this.props.type) {
                    types.splice(index, 1);
                }
            }.bind(this));
        }
        window.storageService.setItem('types', JSON.stringify(types));
        this.setState({
            isChecked: checked
        });
    },
    render: function() {
        return (
            <li>
                    <div className="theme-element checkbox">
                    <input
                         id={this.props.type}
                         type="checkbox"
                         key={this.props.type}
                         checked={this.state.isChecked}
                         onChange={this.unwatch}
                         readOnly={false}/>
                        <label htmlFor={this.props.type}>{this.props.type}</label>
                    </div>
                </li>
        );
    }
});

// This is for the table holding the types on the
// left tab.
var TypeTable = React.createClass({
    render: function() {
        var types = this.props.Types;
        var typeCheck = this.props.typeCheck;
        var checkValue;
        if(typeCheck && typeCheck[singleType]) {
            checkValue = {
                checkValue: typeCheck[singleType]
            };
        }
        rowObj = [];
        appname = APPNAME;
        for (var type in types) {
            var singleType = types[type];
                rowObj.push(<TypeRow
                     key={type}
                     type={types[type]}
                     {...checkValue}
                     cleanTypes={this.props.cleanTypes}
                     unwatchTypeHandler={this.props.unwatchTypeHandler}
                     watchTypeHandler={this.props.watchTypeHandler}
                     typeInfo={this.props.typeInfo} />);
        }
        if (types.length < 1) {
            return (
                <div className='left-tab'>
              <div className="highlight-tip left-tip">
                  <strong>Loading data</strong> ...
              </div>
            </div>
            );
        }
        return (
            <div className='left-tab'>
                <div className="row typesList">
                    <ul className='fa-ul types-list clearfix'>
                        {rowObj}
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = TypeTable;
