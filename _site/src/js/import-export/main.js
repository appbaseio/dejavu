
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
        return {documents: [], 
                types: [], 
                signalColor:'', 
                signalActive:'', 
                signalText:'',
                sortInfo:{
                    active:false
                },
                currentPage:'Export'
                };
    },
    //The record might have nested json objects. They can't be shown
    //as is since it looks cumbersome in the table. What we do in the
    //case of a nested json object is, we replace it with a font-icon
    //(in injectLink) which upon clicking shows a Modal with the json
    //object it contains.

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
        console.log("selections: ", subsetESTypes);
    },
    unwatchStock: function(typeName){
        this.setState({sortInfo:{active:false}});
        subsetESTypes.splice(subsetESTypes.indexOf(typeName), 1);
        this.removeType(typeName);
        console.log("selections: ", subsetESTypes);
    },
    changePage:function(page){
        this.setState({currentPage:page});
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
        var setPageContent = '';
        if(this.state.currentPage == 'Import'){
            setPageContent = (<ImportPage />);
        }
        else if(this.state.currentPage == 'Export'){
            setPageContent = (<ExportPage />);
        }
        return (
            <div>
                <div id='modal' />
                <div className="row dejavuContainer">
                    <div className="typeContainer">
                        <TypeTable
                            Types={this.state.types}
                            watchTypeHandler={this.watchStock}
                            unwatchTypeHandler={this.unwatchStock} 
                            changePage={this.changePage}
                            currentPage = {this.state.currentPage}
                            ></TypeTable>
                    </div>
                    <div className="col-xs-12 ieContainer">
                        {setPageContent}   
                    </div>
                </div>
            </div>
        );
    }
});
