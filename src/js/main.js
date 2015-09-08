/**
 * This is the file which commands the data update/delete/append.
 * Any react component that wishes to modify the data state should 
 * do so by flowing back the data and calling the `resetData` function
 * here. This is sort of like the Darth Vader - Dangerous and
 * Commands everything !

 * ref: https://facebook.github.io/react/docs/two-way-binding-helpers.html
 */

var HomePage = React.createClass({
    getInitialState: function() {
        return {documents: [{}], types: []};
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
        if(data['_source'])
            delete data['_source'];
        if(data['_index'])
            delete data['_index'];
        return callback(data, fields);
    },
    showJSON: function(data, event){
        React.render(<Modal show={data}/>, document.getElementById('modal'));
    },
    injectLink: function(data, fields) {
        var ID = data['_id'];
        data['json'] = <a href="#"
                        onClick={this.showJSON.bind(null, data)}>
                        <i className="fa fa-external-link" />
                        </a>;
        for(var each in fields){
            data[fields[each]] = <a href="#"
                                    onClick={this.showJSON.bind(null, data[fields[each]])}>
                                    <i className="fa fa-external-link" />
                                </a>;
        }
        return data;
    },
    deleteRow: function(index){
        delete sdata[index];
    },
    resetData: function(){
        sdata_values = [];
        for(each in sdata){
            sdata_values.push(sdata[each]);
        }
        this.setState({documents: sdata_values});
    },
    getStreamingData: function(typeName){
        // Logic to stream continuous data
        feed.getData(typeName, function(update){
            update = this.flatten(update, this.injectLink);
            var key = rowKeyGen(update);
            if(sdata[key]){
                if(update['_deleted']){
                    for(var each in sdata[key]){
                            var _key = keyGen(sdata[key], each);
                            deleteTransition(_key);
                    }
                    deleteTransition(key);
                    this.deleteRow(key);
                    setTimeout(
                        function(callback){
                            callback();
                        }.bind(null, this.resetData)
                    , 1100);
                }
                else{
                    sdata[key] = update;
                    this.resetData();
                    for(var each in update){
                        var key = keyGen(update, each);
                        updateTransition(key);
                    }
                    var key = rowKeyGen(update);
                    updateTransition(key);
                }
            }
            else{
                    sdata[key] = update;
                    this.resetData();
                    for(var each in update){
                        var _key = keyGen(update, each);
                        newTransition(_key);
                    }
                    var _key = rowKeyGen(update);
                    newTransition(_key);
            }
        }.bind(this));
    },
    getStreamingTypes: function(){
        // only called on change.
        feed.getTypes( function(update){
            this.setState({types: update});
        }.bind(this));
    },
    removeType: function(typeName) {
        feed.deleteData(typeName, function() {
            this.resetData();
        }.bind(this));
    },
    componentDidMount: function(){
        this.getStreamingTypes();
        // call every 5 min.
        setInterval(this.getStreamingTypes, 5*60*1000);
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
    handleScroll: function(event){
        var elem = document.getElementById('table-container');
            elemElem = document.getElementById('data-table');
        var upar = elem.scrollTop;
            scroll = elem.offsetHeight;
            niche = elem.scrollHeight;
        if(upar + scroll >= niche){
            console.log("bottom");
        }
    },
    render: function () {
        return (
            <div>
                <div id='modal' />
                
                <TypeTable 
                Types={this.state.types}
                watchTypeHandler={this.watchStock}
                unwatchTypeHandler={this.unwatchStock} />
                
                <DataTable
                _data={this.state.documents}
                scrollFunction={this.handleScroll}/>
            
            </div>
        );
    }
});