
// This is the file which commands the data update/delete/append.
// Any react component that wishes to modify the data state should
// do so by flowing back the data and calling the `resetData` function
//here. This is sort of like the Darth Vader - Dangerous and
// Commands everything !
//
// ref: https://facebook.github.io/react/docs/two-way-binding-helpers.html

var HomePage = React.createClass({

    // The underlying data structure that holds the documents/records
    // is a hashmap with keys as `_id + _type`(refer to keys.js). Its
    // because no two records can have the same _type _id pair, so its
    // easy to check if a record already exists.

    getInitialState: function() {
        return {documents: [], types: [], signalColor:'', signalActive:'', signalText:'',
                    sortInfo:{
                        active:false
                    }
                };
    },
    //The record might have nested json objects. They can't be shown
    //as is since it looks cumbersome in the table. What we do in the
    //case of a nested json object is, we replace it with a font-icon
    //(in injectLink) which upon clicking shows a Modal with the json
    //object it contains.

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

    //We cannot render a hashmap of documents on the table,
    //hence we convert that to a list of documents every time
    //there is a delete/update/change. This can be more optimised
    //later but it is not that expensive right now, read writes to
    //DOM are much more expensive.

    resetData: function(){
        sdata_values = [];
        for(each in sdata){
            sdata_values.push(sdata[each]);
        }
        if(this.state.sortInfo.active){
            //if sort is already applied
            var sortedArray = this.sortIt(sdata_values, this.state.sortInfo.column, this.state.sortInfo.reverse);
            this.setState({documents: sortedArray});
        }  
        else
         this.setState({documents: sdata_values});
    },

    // Logic to stream continuous data.
    // We call the ``getData()`` function in feed.js
    // which returns a single json document(record).
    updateDataOnView: function(update) {
        update = this.flatten(update, this.injectLink);
        var key = rowKeyGen(update);

        //If the record already exists in sdata, it should
        //either be a delete request or a change to an
        //existing record.
        if(sdata[key]) {
            // If the update has a ``_deleted`` field, apply
            // a 'delete transition' and then delete
            // the record from sdata.
            if(update['_deleted']) {
                for(var each in sdata[key]) {
                    var _key = keyGen(sdata[key], each);
                    deleteTransition(_key);
                }
                deleteTransition(key);
                this.deleteRow(key);
                setTimeout(function(callback) {
                        callback();
                    }.bind(null, this.resetData), 1100);
            }

            // If it isn't a delete, we should find a record
            // with the same _type and _id and apply an ``update
            // transition`` and then update the record in sdata.
            //Since sdata is modeled as a hashmap, this is
            //trivial.
            else {
                sdata[key] = update;
                this.resetData();
                for(var each in update){
                    updateTransition(keyGen(update, each));
                }
                var key = rowKeyGen(update);
                updateTransition(key);
            }
        }
        //If its a new record, we add it to sdata and then
        //apply the `new transition`.
        else {
            sdata[key] = update;
            this.resetData();
            for(var each in update) {
                var _key = keyGen(update, each);
                newTransition(_key);
            }
            var _key = rowKeyGen(update);
            newTransition(_key);
            var checkType = update['_type'];
            if(checkType && offsets[checkType]) {
                offsets[checkType] += 1;
            } else offsets[checkType] = 1;
        }
        this.setSampleData(update);
    },
    getStreamingData: function(typeName){
        feed.getData(typeName, function(update, fromStream){
            this.updateDataOnView(update);
            this.setSignal(fromStream);
        }.bind(this));
    },
    setSignal:function(fromStream){
        this.setState({
            'signalColor':'btn-warning',
            'signalActive':'active',
            'signalText':'Stream is waiting for data updates.' 
        });
        if(fromStream){
            this.setState({'signalColor':'btn-success'});
        }
    },
    // infinite scroll implementation
    paginateData: function(offsets) {
        feed.paginateData(offsets, function(update) {
            this.updateDataOnView(update);
        }.bind(this));
    },
    // only called on change in types.
    getStreamingTypes: function() {
        feed.getTypes(function(update) {
            this.setState({types: update});
        }.bind(this));
    },
    removeType: function(typeName) {
        feed.deleteData(typeName, function() {
            this.resetData();
        }.bind(this));
    },
    componentDidMount: function(){
        // add a safe delay as app details are fetched from this
        // iframe's parent function.
        setTimeout(this.getStreamingTypes, 2000);
        // call every 1 min.
        setInterval(this.getStreamingTypes, 60*1000);
    },
    watchStock: function(typeName){
        this.setState({sortInfo:{active:false}});
        subsetESTypes.push(typeName);
        this.getStreamingData(typeName);
        console.log("selections: ", subsetESTypes);
    },
    unwatchStock: function(typeName){
        this.setState({sortInfo:{active:false}});
        subsetESTypes.splice(subsetESTypes.indexOf(typeName), 1);
        this.removeType(typeName);
        this.getStreamingData(null);
        console.log("selections: ", subsetESTypes);
    },
    handleScroll: function(event){
        var elem = document.getElementById('table-scroller');
            elemElem = document.getElementById('data-table');
        var upar = elem.scrollTop;
            scroll = elem.offsetHeight;
            niche = elem.scrollHeight;
        // Plug in a handler which takes care of infinite scrolling
        if(upar + scroll >= niche) {
            this.paginateData(offsets);
        }
    },
    getOrder:function(itemIn){
        var finalVal = false;
        if(itemIn == this.currentItem){
            if(!this.currentOrder)
                finalVal = true;
        }
        else{
            this.currentItem = itemIn;
        }
        this.currentOrder = finalVal;
        return finalVal;  
    },
    handleSort:function(item, type, eve){
        order = this.getOrder(item);
        this.setState({
            sortInfo:{
                active:true,
                column:item,
                reverse:order
            }
        });
        var docs = this.state.documents;
        var sortedArray = this.sortIt(docs, item, order);
        this.setState({documents: sortedArray});
    },
    sortIt:function(arr, prop, reverse) {
        console.log(prop);
        var $this = this;
        var existsOnly = _.filter(arr, function(elm){ return typeof elm[prop] != 'undefined' });
        var nonExistsOnly = _.filter(arr, function(elm){ return typeof elm[prop] == 'undefined' });
        
        var a2 = existsOnly.sort($this.dynamicSort(prop, reverse));
        var a2 = $.merge(a2, nonExistsOnly);
        return a2;
    },
    dynamicSort:function (property, reverse) {
        return function (a,b) {
            sortOrder = reverse ? -1 : 1;
            if(isNaN(a[property]))
                var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
            else
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    },
    addRecord:function(){
        var form = $('#addObjectForm').serializeArray();
        var recordObject = {};
        $.each(form,function(k2,v2){
            if(v2.value != '')
                recordObject[v2.name] = v2.value;
        });

        recordObject.body = JSON.parse(recordObject.body);
        feed.indexData(recordObject,function(){
            $('#close-modal').click();
        });

    },
    getTypeDoc:function(){
        var selectedType = $('#setType').val();
        var typeDocSample = this.state.typeDocSample;
        var $this = this;
        if(selectedType != '' && !typeDocSample.hasOwnProperty(selectedType)){

            feed.getSingleDoc(selectedType,function(data){
                typeDocSample[selectedType] = data.hits.hits[0]._source;
                $this.setState({typeDocSample:typeDocSample});
                $this.showSample(typeDocSample[selectedType]);
            });

        }
        else this.showSample(typeDocSample[selectedType]);
    },
    showSample:function(obj){
        $('#setBody').val(JSON.stringify(obj, null, 2));
    },
    setSampleData:function(update){
        var typeDocSample = this.state.typeDocSample ? this.state.typeDocSample : {};
        typeDocSample[update['_type']] = $.extend({}, update);
        delete typeDocSample[update['_type']]._id;
        delete typeDocSample[update['_type']]._type;
        this.setState({typeDocSample:typeDocSample});
    },
    //The homepage is built on two children components(which may
    //have other children components). TypeTable renders the
    //streaming types and DataTable renders the streaming documents.
    //main.js ties them together.
    
    // <SignalCircle 
    //             signalColor={this.state.signalColor}
    //             signalActive={this.state.signalActive}
    //             ></SignalCircle>

    render: function () {
        return (
            <div>
                <div id='modal' />
                <div className="row dejavuContainer">
                    <div className="typeContainer">
                        <TypeTable
                            Types={this.state.types}
                            watchTypeHandler={this.watchStock}
                            unwatchTypeHandler={this.unwatchStock} 
                            addRecord = {this.addRecord}
                            getTypeDoc={this.getTypeDoc}/>
                    </div>
                    <div className="col-xs-12 dataContainer">
                        <DataTable
                            _data={this.state.documents}
                            sortInfo={this.state.sortInfo}
                            scrollFunction={this.handleScroll}
                            selectedTypes={subsetESTypes}
                            handleSort={this.handleSort}/>
                    </div>
                    <SignalCircle 
                        signalColor={this.state.signalColor}
                        signalActive={this.state.signalActive}
                        signalText={this.state.signalText}
                        ></SignalCircle>
                </div>
            </div>
        );
    }
});
