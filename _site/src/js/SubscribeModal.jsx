//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');
var ReactBootstrap = require('react-bootstrap');
var authService = require('./authService/authOperation.jsx');
var authOperation = authService.authOperation;
var authEmitter = authService.authEmitter;

var SubscribeModal = React.createClass({
  componentWillMount: function() {
    this.options = {
      option1: {
        value: 'major',
        text: 'New Dejavu releases'
      },
      option2: {
        value: 'all',
        text: 'Limited major updates'
      }
    };
    this.timer = 1;
    this.init();
  },
  init: function() {
    authEmitter.addListener('profile', function(data) {
      this.setState({
        profile: data
      });
    }.bind(this));
    if(storageService.get('popuptimer')) {
      this.timer = parseInt(storageService.get('popuptimer'));
    }
    setTimeout(function() {
      if(!this.state.profile) {
        this.open();
      }
    }.bind(this), 1000*60*this.timer);
  },
  getInitialState: function() {
      return {
        showModal: false,
        profile: false,
        subscribeOption: 'major'
      };
  },
  close: function() {
    this.setState({
      showModal: false,
      selectClass: ''
    });
  },
  open: function() {
    this.setState({
        showModal: true
    });
  },
  showIcon: function() {
    var icon = (<i className="fa fa-envelope-o"></i>);
    if(this.state.profile) {
      icon = (<i className="fa fa-check"></i>);
    }
    return icon;
  },
  subscribe: function() {
    authOperation.login(this.state.subscribeOption);
  },
  subscribeOptionChange: function(value) {
    this.setState({
      subscribeOption: value
    });
  },
  render: function() {
        return (<div className="add-record-container pd-r10">
                    <a href="javascript:void(0);" className="subscribe"  title="Subscribe" onClick={this.open} >
                      {this.showIcon()}
                    </a>
                    <Modal id="subscribeModal" show={this.state.showModal} onHide={this.close}>
                      <Modal.Header closeButton>
                        <Modal.Title>Be in the know about major updates!</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="row">
                          <div className="col-xs-12">
                            <div className="row">
                              <div className="col-xs-12 single-option">
                                <label className="radio-inline">
                                  <input type="radio"
                                    checked={this.state.subscribeOption === this.options.option1.value}
                                    onChange={this.subscribeOptionChange.bind(this, this.options.option1.value)}
                                    name="subscribeOption" id="subscribeOption" value={this.options.option1.value} /> {this.options.option1.text}
                                </label>
                              </div>
                              <div className="col-xs-12 single-option">
                                <label className="radio-inline">
                                  <input type="radio"
                                    checked={this.state.subscribeOption === this.options.option2.value}
                                    onChange={this.subscribeOptionChange.bind(this, this.options.option2.value)}
                                    name="subscribeOption1" id="subscribeOption1" value={this.options.option2.value} /> {this.options.option2.text}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-12 text-center">
                          <button className="btn btn-primary" onClick={this.subscribe}>
                            <i className="fa fa-github"></i> Subscribe with Github
                          </button>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>);
    }
});

module.exports = SubscribeModal;
