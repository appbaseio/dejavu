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
    this.countdown = 0;
    this.timer = 1;
    this.activetab = true;
    this.holdSubscribe = false;
    this.internalClose = false;
    this.init();
  },
  init: function() {
    authEmitter.addListener('profile', function(data) {
      this.setState({
        profile: data
      });
    }.bind(this));
    storageService.set('dejavuPopuptimerAlreadyOpen', 'no');
    var popupInterval = setInterval(function() {
      this.countdown++;
      if (!this.state.profile) {
        var subPopuptimer = storageService.get('dejavuPopuptimer');
        if (subPopuptimer && subPopuptimer !== 'NaN') {
          this.timer = parseInt(storageService.get('dejavuPopuptimer'), 10);
        }
        if(this.countdown === this.timer) {
          this.open();
        }
      } else {
        popupInterval();
      }
    }.bind(this), 1000 * 60);
    $(window).focus(function() {
      this.activetab = true;
      setTimeout(function() {
        if (!this.state.profile && this.holdSubscribe && !this.internalClose) {
          this.open();
        }
      }, 1000 * 60);
    }.bind(this));

    $(window).blur(function() {
      this.activetab = false;
    }.bind(this));
  },
  getInitialState: function() {
      return {
        showModal: false,
        profile: false,
        subscribeOption: 'major'
      };
  },
  close: function() {
    this.internalClose = true;
    storageService.set('dejavuPopuptimer', this.timer + 5);
    storageService.set('dejavuPopuptimerAlreadyOpen', 'no');
    this.setState({
      showModal: false,
      selectClass: ''
    });
  },
  open: function() {
  	if (!this.state.profile) {
      if (!$('.fade.in.modal').length) {
        if(this.activetab) {
          if(storageService.get('dejavuPopuptimerAlreadyOpen') == 'no') {
            this.setState({ showModal: true });
            storageService.set('dejavuPopuptimerAlreadyOpen', 'yes');
          }
        } else {
          this.holdSubscribe = true;
        }
      } else {
        setTimeout(function() {
          this.open();
          console.log('Subscribe waiting');
        }.bind(this), 1000 * 2);
      }
    }
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
                    <Modal keyboard={false} id="subscribeModal" show={this.state.showModal} onHide={this.close}>
                      <Modal.Header>
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
