//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');
var ReactBootstrap = require('react-bootstrap');

var ImportData = React.createClass({

    getInitialState: function() {
        return {
            showModal: false
        };
    },
    componentDidUpdate: function() {},
    close: function() {
        this.setState({
            showModal: false
        });
    },
    open: function() {
        this.setState({
            showModal: true
        });
        this.props.exportJsonData();
    },
    render: function() {
        return (<div>
                    <a title="export" onClick={this.open} >
                      <img src="src/img/export.png" /> export
                    </a>
                    <Modal show={this.state.showModal} onHide={this.close}>
                      <Modal.Header closeButton>
                        <Modal.Title>Import Data into Appbase <span className="small-span">from JSON, MongoDB</span></Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Please wait, while we are loading</p>
                        
                        <i className="fa fa-spinner fa-spin json-spinner"></i>

                        <a href="#" id="jsonlink" download="data.json" className="btn btn-success">Download json</a>
                      </Modal.Body>
                    </Modal>
                  </div>);
    }
});

module.exports = ImportData;