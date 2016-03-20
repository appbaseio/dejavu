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
        return (<div className="pull-left">
                    <a title="export" className="btn btn-default themeBtn m-r5 export-json-btn pull-left" onClick={this.open} >
                      <i className="fa fa-cloud-download"></i>
                    </a>
                    <Modal show={this.state.showModal} onHide={this.close}>
                      <Modal.Header closeButton>
                        <Modal.Title>Export data <span className="small-span">in json</span></Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p className="json-spinner"> 
                            <i className="fa fa-spinner fa-spin"></i>
                            <span>&nbsp;Please wait, while we are loading</span>
                        </p>
                        <a href="#" id="jsonlink"
                            target="_blank"
                            download="data.json" 
                            className="btn btn-success hide">
                            Download json
                        </a>
                      </Modal.Body>
                    </Modal>
                  </div>);
    }
});

module.exports = ImportData;