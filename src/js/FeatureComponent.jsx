//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');
var ReactBootstrap = require('react-bootstrap');

var AddDocument = React.createClass({

    getInitialState: function() {
        return {
            showModal: false,
            validate: {
                touch: false,
                type: false,
                body: false

            }
        };
    },
    componentDidUpdate: function() {
        //apply select2 for auto complete
        if (!this.state.validate.type && typeof this.props.types != 'undefined' && typeof this.props.selectClass != 'undefined')
            this.applySelect();
    },
    applySelect: function(ele) {
        var $this = this;
        var $eventSelect = $("." + this.props.selectClass);
        var typeList = this.getType();
        $eventSelect.select2({
            tags: true,
            maximumSelectionLength: 1,
            data: typeList
        });
        $eventSelect.on("change", function(e) {
            var validateClass = $this.state.validate;
            validateClass.type = true;
            $this.setState({
                validate: validateClass
            });
            $this.props.getTypeDoc();
        });
    },
    close: function() {
        this.setState({
            showModal: false,
            validate: {
                touch: false,
                type: false,
                body: false
            },
            selectClass: ''
        });
    },

    open: function() {
        this.setState({
            showModal: true
        });
    },
    getType: function() {
        var typeList = this.props.types.map(function(type) {
            return {
                id: type,
                text: type
            };
        });
        return typeList;
    },
    validateInput: function() {
        var validateClass = this.state.validate;
        validateClass.touch = true;
        validateClass.type = document.getElementById('setType').value == '' ? false : true;
        validateClass.body = this.IsJsonString(document.getElementById('setBody').value);
        this.setState({
            validate: validateClass
        });
        if (validateClass.type && validateClass.body)
            this.props.addRecord();
    },
    IsJsonString: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    render: function() {
        var typeList = '';
        var btnText = this.props.text ? this.props.text : '';
        if (typeof this.props.types != 'undefined') {
            typeList = this.props.types.map(function(type) {
                return <option value={type}>{type}</option>
            });
        }
        if (this.state.validate.touch) {
            var validateClass = {};
            validateClass.body = this.state.validate.body ? 'form-group' : 'form-group has-error';
            validateClass.type = this.state.validate.type ? 'form-group' : 'form-group has-error';
        } else {
            var validateClass = {
                type: 'form-group',
                body: 'form-group'
            };
        }
        var btnLinkClass = this.props.link == "true" ? 'add-record-link fa fa-plus' : 'add-record-btn btn btn-primary fa fa-plus';
        var selectClass = this.props.selectClass + ' tags-select form-control';

        return (<div className="add-record-container pd-r10">
                    <a href="javascript:void(0);" className={btnLinkClass}  title="Add" onClick={this.open} >{btnText}</a>
                    <Modal show={this.state.showModal} onHide={this.close}>
                      <Modal.Header closeButton>
                        <Modal.Title>Add Data</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form className="form-horizontal" id="addObjectForm">
                          <div className={validateClass.type}>
                            <label for="inputEmail3" className="col-sm-3 control-label">Type <span className="small-span">(aka table)</span></label>
                            <div className="col-sm-9">
                              <select id="setType" className={selectClass} multiple="multiple" name="type">
                              </select>
                                <span className="help-block">
                                  Type in which the data will be stored.
                                </span>
                            </div>
                          </div>
                          <div className="form-group">
                            <label for="inputPassword3" className="col-sm-3 control-label">Document Id</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" id="setId" placeholder="set Id" name="id" />
                            </div>
                          </div>
                          <div className={validateClass.body}>
                            <label for="inputPassword3" className="col-sm-3 control-label">JSON</label>
                            <div className="col-sm-9">
                              <textarea id="setBody" className="form-control" rows="10" name="body"></textarea>
                               <span className="help-block">
                                  A data document is stored as a JSON object.
                                </span>
                            </div>
                          </div>
                        </form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button bsStyle="success" onClick={this.validateInput}>Add</Button>
                      </Modal.Footer>
                    </Modal>
                  </div>);
    }
});

var ExportData = React.createClass({

    getInitialState: function() {
        return {
            showModal: false,
            validate: {
                touch: false,
                type: false,
                body: false
            }
        };
    },
    componentDidUpdate: function() {
        //apply select2 for auto complete
        if (!this.state.validate.type)
            this.applySelect();
    },
    applySelect: function() {
        var $this = this;
        var $eventSelect = $(".tags-select_export");
        var typeList = this.getType();
        $eventSelect.select2({
            //tags: true,
            data: typeList
        });
        $eventSelect.on("change", function(e) {
            var validateClass = $this.state.validate;
            validateClass.type = true;
            $this.setState({
                validate: validateClass
            });
        });
    },
    close: function() {
        this.setState({
            showModal: false,
            validate: {
                touch: false,
                type: false,
                body: false
            }
        });
    },

    open: function() {
        this.setState({
            showModal: true
        });
    },
    getType: function() {
        var typeList = this.props.types.map(function(type) {
            return {
                id: type,
                text: type
            };
        });
        return typeList;
    },
    validateInput: function() {
        var validateClass = this.state.validate;
        validateClass.touch = true;
        validateClass.type = document.getElementById('setType_export').value == '' ? false : true;
        validateClass.body = this.IsJsonString(document.getElementById('setBody_export').value);
        this.setState({
            validate: validateClass
        });
        if (validateClass.type && validateClass.body)
            this.props.ExportData();
    },
    IsJsonString: function(str) {
        if (str != '') {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
        }
        return true;
    },
    render: function() {
        var typeList = this.props.types.map(function(type) {
            return <option value={type}>{type}</option>
        });
        if (this.state.validate.touch) {
            var validateClass = {};
            validateClass.body = this.state.validate.body ? 'form-group' : 'form-group has-error';
            validateClass.type = this.state.validate.type ? 'form-group' : 'form-group has-error';
        } else {
            var validateClass = {
                type: 'form-group',
                body: 'form-group'
            };
        }
        var querySample = '{"query":{"match_all":{}}}';
        return (
            <div>
        <a title="Export" onClick={this.open} >
          <img src="src/img/export.png" alt=""/> Export Data as JSON
        </a>
        <Modal className="modal-export" show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Export Appbase Data</Modal.Title>
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
            <Button className="export" id="exportBtn" className="loadingBtn" onClick={this.validateInput}>
              <span className="submitText">Export</span>
              <i className="fa fa-spinner fa-spin"></i>
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
        );
    }
});


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
    },
    render: function() {
        return (<div>
                    <a title="Import" onClick={this.open} >
                      <img src="src/img/import.png" /> Import <span className="small-span">from JSON, MongoDB</span>
                    </a>
                    <Modal show={this.state.showModal} onHide={this.close}>
                      <Modal.Header closeButton>
                        <Modal.Title>Import Data into Appbase <span className="small-span">from JSON, MongoDB</span></Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Use appbase.io's <a href="https://github.com/appbaseio/transporter" target="_new">transporter <span className="fa fa-external-link"></span></a> fork to import data from
                        MongoDB, any JSON structure, or text file in three simple steps:
                        </p>
                        <ol>
                          <li>Get the latest release for your system from
                            <a href="https://github.com/appbaseio/transporter/releases/tag/v0.1.2-appbase" target="_new"> here <span className="fa fa-external-link"></span></a>.</li>
                          <li>Set the source and sink configurations as mentioned
                          in the file here, and save it in the same folder as config.yml.</li>
                        <li>Run the transporter using ./transporter run --config &lt;config_file&gt; &lt;transform_file&gt;</li>
                        </ol>
                        <p>Or shoot us at info@appbase.io or intercom if you want us to help with importing data.</p>
                      </Modal.Body>
                    </Modal>
                  </div>);
    }
});

// Prettify the json body i.e. embed that into
// a code block so that highlightjs recognises it.
var Pretty = React.createClass({
    componentDidMount: function() {
        var current = React.findDOMNode(this);
        hljs.highlightBlock(current);
    },
    selectText: function() {
        var range = document.createRange();
        var selection = window.getSelection();
        var ele = document.getElementById('for-copy');
        range.selectNodeContents(ele);
        selection.removeAllRanges();
        selection.addRange(range);
    },
    render: function() {

        return (<pre className="custom-json-body" onClick={this.selectText}>
                    <code className="json">
                        <div id='for-copy'>{JSON.stringify(this.props.json, null, 1)}</div>
                    </code>
                  </pre>);
    }
});

//Signal to indicate stream
var SignalCircle = React.createClass({
    componentDidMount: function() {

    },
    render: function() {
        var signalColor = "signal-circle " + this.props.signalColor;
        var signalActive = "spinner " + this.props.signalActive;
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
    componentDidMount: function() {

    },
    render: function() {
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

//Update Document
var UpdateDocument = React.createClass({

    getInitialState: function() {
        return {
            showModal: false,
            validate: {
                touch: false,
                type: false,
                body: false
            }
        };
    },
    componentDidUpdate: function() {

    },
    close: function() {
        this.setState({
            showModal: false,
            validate: {
                touch: false,
                body: false
            },
            selectClass: ''
        });
    },
    open: function() {
        this.setState({
            showModal: true
        });
    },
    validateInput: function() {
        var validateClass = this.state.validate;
        validateClass.touch = true;
        validateClass.body = this.IsJsonString(document.getElementById('setBodyUpdate').value);
        this.setState({
            validate: validateClass
        });
        if (validateClass.body) {
            var updateJson = document.getElementById('setBodyUpdate').value;
            this.props.actionOnRecord.updateRecord(updateJson);
        }
    },
    IsJsonString: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    render: function() {
        var typeList = '';
        var actionOnRecord = this.props.actionOnRecord;
        if (this.state.validate.touch) {
            var validateClass = {};
            validateClass.body = this.state.validate.body ? 'form-group' : 'form-group has-error';
        } else {
            var validateClass = {
                type: 'form-group',
                body: 'form-group'
            };
        }

        return (
            <div className="inlineBlock pd-r10 pull-left">
        <a href="javascript:void(0);" className='btn btn-default themeBtn'  title="Update" onClick={this.open} >
          <i className="fa fa-pencil greyBtn"></i>&nbsp;&nbsp;Update
        </a>
        <Modal className="modal-update" show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Update Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal" id="updateObjectForm">
              <div className="form-group">
                <label for="inputEmail3" className="col-sm-3 control-label">Type <span className="small-span">(aka Table)</span></label>
                <div className="col-sm-9">
                    <input type="text" className="form-control" id="type" name="type" value={actionOnRecord.type} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label for="inputPassword3" className="col-sm-3 control-label">Document Id</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="setId"
                  value={actionOnRecord.id} readOnly placeholder="set Id" name="id" />
                </div>
              </div>
              <div className={validateClass.body}>
                <label for="inputPassword3" className="col-sm-3 control-label">JSON <span className="small-span">(partial object)</span></label>
                <div className="col-sm-9">
                  <textarea id="setBodyUpdate" className="form-control" rows="10" name="body" defaultValue={actionOnRecord.row}></textarea>
                   <span className="help-block">
                      Body is required and should be valid JSON.
                    </span>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="update" onClick={this.validateInput}>Update</Button>
          </Modal.Footer>
        </Modal>
      </div>
        );
    }
});

var DeleteDocument = React.createClass({

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
    },
    render: function() {
        return (
            <div className="inlineBlock pd-r10 pull-left ">
        <a title="Delete" onClick={this.open} className="btn btn-default themeBtn">
          <i className="fa fa-trash greyBtn"></i>&nbsp;&nbsp;Delete
        </a>
        <Modal className="modal-danger" show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You are about to <b>permanently</b> delete the selected data.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" id="deleteBtn" className="loadingBtn"
              onClick={this.props.actionOnRecord.deleteRecord}>
              <span className="submitText">Confirm Deletion</span>
              <i className="fa fa-spinner fa-spin"></i>
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
        );
    }
});

var FeatureComponent = {
    AddDocument: AddDocument,
    ImportData: ImportData,
    ExportData: ExportData,
    Pretty: Pretty,
    SignalCircle: SignalCircle,
    RemoveFilterButton: RemoveFilterButton,
    UpdateDocument: UpdateDocument,
    DeleteDocument: DeleteDocument
};

module.exports = FeatureComponent;