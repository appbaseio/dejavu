// This is for the copy-to-clipboard
var Expire = React.createClass({
  getDefaultProps: function(){
    return {delay: 1000};
  },
  getInitialState: function(){
    return {visible: true};
  },
  componentWillReceiveProps: function(nextProps){
    // reset the timer if children are changed
    if (nextProps.children !== this.props.children) {
      this.setTimer();
      this.setState({visible: true});
    }
  },
  handleClick: function(){
    this.setTimer();
    var apply = document.getElementById('for-copy');
    execCommandOnElement(apply, "copy");

  },
  setTimer: function(){
    // clear any existing timer
    this._timer != null ? clearTimeout(this._timer) : null;

    // hide for `delay` milliseconds
    this.setState({visible: false});
    this._timer = setTimeout(function(){
      this.setState({visible: true});
      this._timer = null;
    }.bind(this), this.props.delay);
  },
  render: function(){
    return this.state.visible 
           ? <div>
                <a>
                    <i 
                    onClick={this.handleClick}
                    className='fa copy-board text-center fa-clipboard' 
                    id='normal-clipboard-before'/>
                </a>
             </div>
           : <i 
              className='fa fa-check' 
              id='normal-clipboard-after'/>;
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

var Modal = React.createClass({
    getInitialState: function(){
        var showing = {};
        for(var each in this.props.show){
            // we don't show _id, _type in the JSON body
            // we show in the header.
            if(['json', '_id', '_type'].indexOf(each) <= -1){
                showing[each] = this.props.show[each]; 
            }
        }
        return {showing: showing};
    },
    hideModal: function(){
        React.unmountComponentAtNode(document.getElementById('modal'));
    },
    render: function(){
        var Modal = ReactBootstrap.Modal;
            Button = ReactBootstrap.Button;
        return (
            <Modal 
            {...this.props}
            bsSize='medium'
            onHide={this.hideModal}
            >
                <Modal.Body>
                    <h4>
                        {this.props._type}
                        <br/>
                        {this.props._id}
                    </h4>
                    <Expire delay={2000} onClick={this.copytext} id='copy-json'/>
                    <p id='modal-body'>
                        <Pretty json={this.state.showing} />
                    </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.hideModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

// This stuff is for knowing the kind of browser and applying the
// copy-to-clipboard functionality accordingly.
// I had to write so much of stupid code because we have just too many browsers.
// Cmon'n guys it wasn't just the IE's fault. Okay fine, it was just that.
var execCommandOnElement = function(el, commandName, value) {
    if (typeof value == "undefined") {
        value = null;
    }

    if (typeof window.getSelection != "undefined") {
        // Non-IE case
        var sel = window.getSelection();

        // Save the current selection
        var savedRanges = [];
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
            savedRanges[i] = sel.getRangeAt(i).cloneRange();
        }

        // Temporarily enable designMode so that
        // document.execCommand() will work
        document.designMode = "on";

        // Select the element's content
        sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);

        // Execute the command
        document.execCommand(commandName, false, value);

        // Disable designMode
        document.designMode = "off";

        // Restore the previous selection
        sel = window.getSelection();
        sel.removeAllRanges();
        for (var i = 0, len = savedRanges.length; i < len; ++i) {
            sel.addRange(savedRanges[i]);
        }
    } else if (typeof document.body.createTextRange != "undefined") {
        // IE case
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.execCommand(commandName, false, value);
    }
}

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
    if(!this.state.validate.type)
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
    var Modal = ReactBootstrap.Modal;
    var Button = ReactBootstrap.Button;
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
    return (
      <div>
        <a className="add-record-btn btn btn-primary fa fa-plus" onClick={this.open} >
        </a>
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
                  <textarea id="setBody" className="form-control" rows="3" name="body"></textarea>
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