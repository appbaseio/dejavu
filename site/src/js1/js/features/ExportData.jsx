//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');
var ReactBootstrap = require('react-bootstrap');

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
        <Modal className="modal-info" show={this.state.showModal} onHide={this.close}>
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
            <Button className="info" id="exportBtn" className="loadingBtn" onClick={this.validateInput}>
              <span className="submitText">Export</span>
              <i className="fa fa-spinner fa-spin"></i>
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
        );
    }
});

module.exports = ExportData;