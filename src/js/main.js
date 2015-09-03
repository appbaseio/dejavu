/*
    This is the file which commands the data update/delete/append.
    Any react component that wishes to modify the data state should 
    do so by flowing back the data and calling the `resetData` function
    here. This is sort of like the Darth Vader - Dangerous and
    Commands everything !

    ref: https://facebook.github.io/react/docs/two-way-binding-helpers.html

*/

var HomePage = React.createClass({
    getInitialState: function() {
        return {documents: [{}], types: []};
    },
    flatten: function(data, callback) {
        //console.log(window.localStorage.getItem("name"));
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
        elem.style.background = '#86DDF8';
        setTimeout(this.revertTransition.bind(null, elem), 1000);
    },
    deleteTransition: function(key){
        var elem = document.getElementById(key);
        elem.style.background = '#FF5B5B';
        setTimeout(this.revertTransition.bind(null, elem), 1000);
    },
    newTransition: function(_key){
        var elem = document.getElementById(_key);
        elem.style.background = '#B6EF7E';
        setTimeout(this.revertTransition.bind(null, elem), 1000);
    },
    deleteRow: function(index){
        delete sdata[index];
    },
    resetData: function(){
        this.setState({documents: sdata});
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
                    }.bind(null, this.resetData), 1100);
            }
            else{
                if(!got){
                    sdata.push(update);
                    this.resetData();
                    for(var each in update){
                        var key = keyGen(update, each);
                        this.newTransition(key);
                    }
                    var key = rowKeyGen(update);
                    this.newTransition(key);
                }
                else{
                    this.resetData();
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
            this.resetData();
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
                <TypeTable className="dejavu-table" Types={this.state.types} watchTypeHandler={this.watchStock} unwatchTypeHandler={this.unwatchStock} />
                <DataTable _data={this.state.documents} scrollFunction={this.handleScroll}/>
            </div>
        );
    }
});