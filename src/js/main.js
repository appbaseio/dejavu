/**
 * This is the file which commands the data update/delete/append.
 * Any react component that wishes to modify the data state should 
 * do so by flowing back the data and calling the `resetData` function
 * here. This is sort of like the Darth Vader - Dangerous and
 * Commands everything !
 *
 * ref: https://facebook.github.io/react/docs/two-way-binding-helpers.html
 */

var HomePage = React.createClass({
    /*
     * The underlying data structure that holds the documents/records
     * is a hashmap with keys as `_id + _type`(refer to keys.js). Its
     * because no two records can have the same _type _id pair, so its
     * easy to check if a record already exists.
     */
    getInitialState: function() {
        return {documents: [{}], types: []};
    },
    /*
     * The record might have nested json objects. They can't be shown
     * as is since it looks cumbersome in the table. What we do in the
     * case of a nested json object is, we replace it with a font-icon
     * (in injectLink) which upon clicking shows a Modal with the json
     * object it contains.
     */
    flatten: function(data, callback) {
        var fields = [];
        for(var each in data['_source']){
            data[each] = data['_source'][each];
            if(typeof data[each] !== 'string'){
                if(typeof data[each] !== 'number'){
                        fields.push(each);
                }
            }
        }
        data['json'] = data['_source'];
        if(data['_source'])
            delete data['_source'];
        if(data['_index'])
            delete data['_index'];
        if(data['_score'])
            delete data['_score'];
        return callback(data, fields);
    },
    injectLink: function(data, fields) {
        return data;
    },
    deleteRow: function(index){
        delete sdata[index];
    },
    /*
     * We cannot render a hashmap of documents on the table,
     * hence we convert that to a list of documents every time
     * there is a delete/update/change. This can be more optimised
     * later but it is not that expensive right now, read writes to 
     * DOM are much more expensive.
     */
    resetData: function(){
        sdata_values = [];
        for(each in sdata){
            sdata_values.push(sdata[each]);
        }
        this.setState({documents: sdata_values});
    },

    /* Logic to stream continuous data.
     * We call the `getData` function in feed.js
     * which returns an update which is a single
     * json document(record).
     */
    getStreamingData: function(typeName){
        feed.getData(typeName, function(update){
            update = this.flatten(update, this.injectLink);
            var key = rowKeyGen(update);
            /* 
             * If the record already exists in sdata, it should
             * either be a delete request or a change to an 
             * existing record.
             */
            if(sdata[key]){
                /*
                 * If the update has a `_deleted` field, apply
                 * a 'delete transition' and then delete
                 * the record from sdata.
                 */
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
                /*
                 * If it isn't a delete, we should find a record
                 * with the same _type and _id and apply an `update
                 * transition` and then update the record in sdata.
                 * Since sdata is modeled as a hashmap, this is 
                 * trivial.
                 */
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
            /*
             * If its a new record, we add it to sdata and then
             * apply the `new transition`.
             */
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
    // only called on change in types.
    getStreamingTypes: function(){
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
        // Plug in a handler which takes care of infinite scrolling
        if(upar + scroll >= niche){
            console.log("bottom");
        }
    },
    /*
     * The homepage is built on two children components(which may
     * have other children components). TypeTable renders the 
     * streaming types and DataTable renders the streaming documents.
     * main.js ties them together.
     */
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
                scrollFunction={this.handleScroll} />
            
            </div>
        );
    }
});