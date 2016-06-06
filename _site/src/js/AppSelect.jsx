//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');

var AppSelect = React.createClass({
    getInitialState: function() {
        return {
            selectVal: null,
            apps: null
        };
    },
    componentDidUpdate: function() {
        //apply select2 for auto complete
        if(typeof this.props.apps != 'undefined') {
            if (!this.state.apps) {
                this.applySelect();
            }
            else if(this.state.apps && this.props.apps.length !== this.state.apps.length) {
                this.applySelect();
            }
        }
    },
    applySelect: function(ele) {
        var $this = this;
        var $eventSelect = $(".setApp");
        this.setState({
            apps: this.props.apps
        });
        try {
            $eventSelect.select2('destroy').html('');
        } catch (e) {
        }
        $eventSelect.select2({
            tags: true,
            maximumSelectionLength: 1,
            placeholder: 'Type app name and hit enter..'
        });
        $eventSelect.on("select2:select", function(e) {
            try {
                var val = $eventSelect.select2().val();
                if(val && val.length) {
                    var app_config = this.props.apps.filter(function(app, index) {
                        if(app.appname === val[0]) {
                            return {
                                appname: app.appname,
                                url: app.url
                            };
                        }
                    });
                    if(app_config.length && app_config[0].url) {
                        this.props.setConfig(app_config[0].url);
                    }
                }
            } catch(e) {}
        }.bind(this));
    },
    render: function() {
        var options = this.props.apps.map(function(app, index) {
            var opt = <option key={index}>{app.appname}</option>;
            if(app.appname === config.appname) {
                opt = <option key={index} selected>{app.appname}</option>;
            }
            return opt;
        });
        return (<div>
                   <select id="setApp" className='setApp col-xs-12' multiple="multiple" name="apps">
                        {options}
                    </select>
                </div>
                );
    }
});

module.exports = AppSelect;
