var Expire = React.createClass({
  getDefaultProps: function(){
    return {delay: 1000};
  },
  getInitialState: function(){
    return {visible: false};
  },
  componentWillReceiveProps: function(nextProps){
    // reset the timer if children are changed
    if (nextProps.children !== this.props.children) {
      this.setTimer();
      this.setState({visible: false});
    }
  },
  componentDidMount: function(){
      this.setTimer();
  },
  setTimer: function(){
    // clear any existing timer
    this._timer != null ? clearTimeout(this._timer) : null;

    // hide after `delay` milliseconds
    this._timer = setTimeout(function(){
      this.setState({visible: true});
      this._timer = null;
    }.bind(this), this.props.delay);
  },
  render: function(){
    return this.state.visible 
           ? <div className='json-copy-alert'><span className='alert-message'>{this.props.content}</span></div>
           : <span/>;
  }
});

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

var copytext = function () {
        var apply = document.getElementById('for-copy');
        execCommandOnElement(apply, "copy");
}

var Pretty = React.createClass({
    componentDidMount: function(){
        var current = React.findDOMNode(this);
        hljs.highlightBlock(current);    
    },
    render: function() {
        return  ( <pre className="custom-json-body">
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
            if(['json', '_id', '_type'].indexOf(each) <= -1){
                showing[each] = this.props.show[each]; 
            }
        }
        return {showing: showing, alertSuccess: ''};
    },
    hideModal: function(){
        React.unmountComponentAtNode(document.getElementById('modal'));
    },
    copy: function(){
        copytext();
        this.setState({alertSuccess: 'the json has been successfully copied to your clipboard !'});
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
                    <Button onClick={this.copy} className="fa fa-files-o"/>
                    <Expire delay={3000} content={this.state.alertSuccess} id='copy-json'/>
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