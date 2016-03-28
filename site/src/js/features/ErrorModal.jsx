//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var ReactBootstrap = require('react-bootstrap');

var ErrorModal = React.createClass({
    getInitialState: function() {
        return {
            showModal: false
        };
    },
    componentDidUpdate: function() {},
    close: function() {
        this.props.closeErrorModal();
    },
    render: function() {
        var errorShow = this.props.errorShow;
        var defaultMessage = "It looks like your app name, username, password combination doesn't match. Check your url and appname and then connect it again.";
        var errorMessage = this.props.errorMessage == null ? defaultMessage : errorMessage;

        return (<div>
                    <Modal  className="modal-danger" show={errorShow} onHide={this.close}>
                      <Modal.Header closeButton>
                        <Modal.Title>Authentication Error</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>{errorMessage}</p>
                      </Modal.Body>
                    </Modal>
                  </div>);
    }
});

module.exports = ErrorModal;