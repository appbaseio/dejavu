//This contains the extra features like 
//Import data, Export Data, Add document, Pretty Json

var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');
var ReactBootstrap = require('react-bootstrap');

var AddDocument = React.createClass({

  getInitialState:function() {
    return { 
              showModal: false,
              validate:{
                touch:false,
                type:false,
                body:false
              }
           };
  },
  componentDidUpdate:function(){
    //apply select2 for auto complete
    if(!this.state.validate.type && typeof this.props.types != 'undefined')
      this.applySelect();
  },
  applySelect:function(){
    var $this = this;
    var $eventSelect = $(".tags-select");
    var typeList = this.getType();
    $eventSelect.select2({
      tags: true,
      maximumSelectionLength: 1,
      data:typeList
    });
    $eventSelect.on("change", function (e) { 
      var validateClass = $this.state.validate;
      validateClass.type = true;
      $this.setState({validate:validateClass});
      $this.props.getTypeDoc();
    });
  },
  close:function() {
    this.setState({ 
              showModal: false,
              validate:{
                touch:false,
                type:false,
                body:false
              }
          });
  },

  open:function() {
    this.setState({ showModal: true });
  },
  getType :function(){
    var typeList = this.props.types.map(function(type){
      return {id:type, text:type};
    });
    return typeList;
  },
  validateInput:function(){
    var validateClass = this.state.validate;
    validateClass.touch = true;
    validateClass.type = document.getElementById('setType').value == '' ? false:true;
    validateClass.body = this.IsJsonString(document.getElementById('setBody').value);
    this.setState({validate:validateClass});
    if(validateClass.type && validateClass.body)
      this.props.addRecord();
  },
  IsJsonString:function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  },
  render:function() {
    var typeList = '';
    var btnText = this.props.text ? this.props.text : '';
    if(typeof this.props.types != 'undefined')
    { 
      typeList = this.props.types.map(function(type){
        return <option value={type}>{type}</option>
      });
    }
    if(this.state.validate.touch){
      var validateClass = {};
      validateClass.body = this.state.validate.body ? 'form-group' : 'form-group has-error' ;
      validateClass.type = this.state.validate.type ? 'form-group' : 'form-group has-error' ;
    }
    else{
      var validateClass = {
        type:'form-group',
        body:'form-group'
      };
    }
    return (
      <div className="add-record-container pd-r10">
        <a className="add-record-btn btn btn-primary fa fa-plus"  title="Add" onClick={this.open} >{btnText}</a>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add Document</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal" id="addObjectForm">
              <div className={validateClass.type}>
                <label for="inputEmail3" className="col-sm-2 control-label">Type</label>
                <div className="col-sm-10">
                  <select id="setType" className="tags-select form-control" multiple="multiple" name="type">
                  </select>
                    <span className="help-block">
                      Type is required.
                    </span>
                </div>
              </div>
              <div className="form-group">
                <label for="inputPassword3" className="col-sm-2 control-label">Id</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="setId" placeholder="set Id" name="id" />
                </div>
              </div>
              <div className={validateClass.body}>
                <label for="inputPassword3" className="col-sm-2 control-label">Object</label>
                <div className="col-sm-10">
                  <textarea id="setBody" className="form-control" rows="10" name="body"></textarea>
                   <span className="help-block">
                      Body is required and should be valid JSON.
                    </span>
                </div>
              </div>              
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.validateInput}>Submit</Button>
            <Button id="close-modal" onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

var ExportData = React.createClass({

  getInitialState:function() {
    return { 
              showModal: false,
              validate:{
                touch:false,
                type:false,
                body:false
              }
           };
  },
  componentDidUpdate:function(){
    //apply select2 for auto complete
    if(!this.state.validate.type)
      this.applySelect();
  },
  applySelect:function(){
    var $this = this;
    var $eventSelect = $(".tags-select_export");
    var typeList = this.getType();
    $eventSelect.select2({
      //tags: true,
      data:typeList
    });
    $eventSelect.on("change", function (e) { 
      var validateClass = $this.state.validate;
      validateClass.type = true;
      $this.setState({validate:validateClass});
    });
  },
  close:function() {
    this.setState({ 
              showModal: false,
              validate:{
                touch:false,
                type:false,
                body:false
              }
          });
  },

  open:function() {
    this.setState({ showModal: true });
  },
  getType :function(){
    var typeList = this.props.types.map(function(type){
      return {id:type, text:type};
    });
    return typeList;
  },
  validateInput:function(){
    var validateClass = this.state.validate;
    validateClass.touch = true;
    validateClass.type = document.getElementById('setType_export').value == '' ? false:true;
    validateClass.body = this.IsJsonString(document.getElementById('setBody_export').value);
    this.setState({validate:validateClass});
    if(validateClass.type && validateClass.body)
      this.props.ExportData();
  },
  IsJsonString:function(str) {
    if(str != ''){
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
    }
    return true;
  },
  render:function() {
    var typeList = this.props.types.map(function(type){
      return <option value={type}>{type}</option>
    });
    if(this.state.validate.touch){
      var validateClass = {};
      validateClass.body = this.state.validate.body ? 'form-group' : 'form-group has-error' ;
      validateClass.type = this.state.validate.type ? 'form-group' : 'form-group has-error' ;
    }
    else{
      var validateClass = {
        type:'form-group',
        body:'form-group'
      };
    }
    var querySample = '{"query":{"match_all":{}}}';
    return (
      <div>
        <a title="Export" onClick={this.open} >
          Export
        </a>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Export Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal" id="addObjectForm_export">
              <div className={validateClass.type}>
                <label for="inputEmail3" className="col-sm-2 control-label">Type</label>
                <div className="col-sm-10">
                  <select id="setType_export" className="tags-select_export form-control" multiple="multiple" name="type">
                  </select>
                    <span className="help-block">
                      Type is required.
                    </span>
                </div>
              </div>
              <div className={validateClass.body}>
                <label for="inputPassword3" className="col-sm-2 control-label">Query</label>
                <div className="col-sm-10">
                  <textarea id="setBody_export" className="form-control" rows="10" name="body" defaultValue={querySample}></textarea>
                   <span className="help-block">
                      Query should be valid JSON.
                    </span>
                </div>
              </div>              
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.validateInput}>Submit</Button>
            <Button id="close-export-modal" onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});


var ImportData = React.createClass({

  getInitialState:function() {
    return { 
              showModal: false
           };
  },
  componentDidUpdate:function(){
  },
  close:function() {
    this.setState({ 
              showModal: false
          });
  },
  open:function() {
    this.setState({ showModal: true });
  },
  render:function() {
    return (
      <div>
        <a title="Import" onClick={this.open} >
          Import
        </a>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Import Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>Import content</h3>  
          </Modal.Body>
          <Modal.Footer>
            <Button id="close-modal" onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

// Prettify the json body i.e. embed that into
// a code block so that highlightjs recognises it.
var Pretty = React.createClass({
    componentDidMount: function(){
        var current = React.findDOMNode(this);
        hljs.highlightBlock(current);    
    },
    selectText:function() {
      var range = document.createRange();
      var selection = window.getSelection();
      var ele = document.getElementById('for-copy');
      range.selectNodeContents(ele);
      selection.removeAllRanges();
      selection.addRange(range);
    },
    render: function() {

        return  ( <pre className="custom-json-body" onClick={this.selectText}>
                    <code className="json">
                        <div id='for-copy'>{JSON.stringify(this.props.json, null, 1)}</div>
                    </code>
                  </pre>
                );
    }
});

//Signal to indicate stream
var SignalCircle = React.createClass({
    componentDidMount:function(){
       
    },
    render: function(){
        var signalColor = "signal-circle "+this.props.signalColor;
        var signalActive = "spinner "+this.props.signalActive;
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        var Popover = ReactBootstrap.Popover;
        return (
                <OverlayTrigger trigger="focus" placement="right" overlay={<Popover id="signal-pop">{this.props.signalText}</Popover>}>
                  <a className={signalColor}>
                    <span className={signalActive}></span>
                  </a>
                </OverlayTrigger>
    );
    }
});


//Remove filter
var RemoveFilterButton = React.createClass({
    componentDidMount:function(){
       
    },
    render: function(){
        var filterInfoText = JSON.stringify(this.props.filterInfo);
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        var Popover = ReactBootstrap.Popover;
        var removeclass = this.props.filterInfo.active ? "removeFilterbtn" : "hide";
        return (
                <OverlayTrigger trigger="focus" placement="right" overlay={<Popover id="remove-pop">{filterInfoText}</Popover>}>
                  <a className={removeclass} onClick={this.props.removeFilter}>
                    <i className="fa fa-times"></i>
                  </a>
                </OverlayTrigger>
    );
    }
});


var FeatureComponent = {
	AddDocument:AddDocument,
	ImportData:ImportData,
	ExportData:ExportData,
  Pretty:Pretty,
  SignalCircle:SignalCircle,
  RemoveFilterButton:RemoveFilterButton
};

module.exports = FeatureComponent;