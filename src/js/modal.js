var Pretty = React.createClass({
    componentDidMount: function(){
        var current = React.findDOMNode(this);
        hljs.highlightBlock(current);
    },
    render: function() {
        return <pre className="custom-json-body"><code className="json">{JSON.stringify(this.props.json, null, 2)}</code></pre>;
    }
});

var Modal = React.createClass({
    getInitialState: function(){
        var showing = {};
        var _id = this.props.show['_id'];
        var _type = this.props.show['_type'];
        for(var each in this.props.show){
            if(['json', '_id', '_type'].indexOf(each) <= -1){
                showing[each] = this.props.show[each]; 
            }
        }
        return {showing: showing,
                _type: _type,
                _id: _id};
    },
    hideModal: function(){
        React.unmountComponentAtNode(document.getElementById('modal'));
    },
    render: function(){
        var Modal = ReactBootstrap.Modal;
        var Button = ReactBootstrap.Button;
        return (
            <Modal 
            {...this.props}
            bsSize='medium'
            onHide={this.hideModal}
            >
                <Modal.Header>
                  <Modal.Title id='contained-modal-title-sm'>JSON</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>
                        {this.state._type}
                        <br/>
                        {this.state._id}
                    </h4>
                    <p>
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