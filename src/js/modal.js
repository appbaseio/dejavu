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
                        <div id='for-copy'>{JSON.stringify(this.props.json, null, 2)}</div>
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
                    <Button onClick={copytext}>Copy</Button>
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