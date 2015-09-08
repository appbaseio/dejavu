var Pretty = React.createClass({
    componentDidMount: function(){
        hljs.initHighlightingOnLoad();
        var current = React.findDOMNode(this);
        hljs.highlightBlock(current);
    },
    render: function() {
        return <pre className="custom-json-body"><code className="json">{JSON.stringify(this.props.json, null, 2)}</code></pre>;
    }
});

var Modal = React.createClass({
    hideModal: function(){
        React.unmountComponentAtNode(document.querySelector('#modal'));
    },
    render: function(){
        var Modal = ReactBootstrap.Modal;
        var Button = ReactBootstrap.Button;
        var showing = this.props.show;
        var _id = showing['_id'];
        var _type = showing['_type'];
        delete showing['json'];
        delete showing['_id'];
        delete showing['_type'];
        var prettyjson = JSON.parse(JSON.stringify(showing));
        return (
            <Modal 
            {...this.props}
            bsSize='small'
            onHide={this.hideModal}
            >
                <Modal.Header>
                  <Modal.Title id='contained-modal-title-sm'>JSON</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>
                        {_type}
                        <br/>
                        {_id}
                    </h4>
                    <p>
                        <Pretty json={showing} />
                    </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.hideModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});