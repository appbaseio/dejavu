var Dropdown = React.createClass({
    render: function(){
        var Dropdown = ReactBootstrap.Dropdown;
        var columns = this.props.cols;
        var MenuItem = ReactBootstrap.MenuItem;
        var ColumnsCheckbox =  columns.map(function(item){
            var key = dropdownKeyGen(item);
            return <FieldCheckbox _type={item} _key={this.key}/>;
        });
        return (
            <Dropdown
            className="dejavu-dropdown"
            pullRight={true}
            noCaret
            id='ab-dropdown'>
            <Dropdown.Toggle className='fa fa-cog' noCaret/>
            <Dropdown.Menu>
                <MenuItem header className='centered-text'>Displayed Attributes</MenuItem>
                <MenuItem divider/>
                {ColumnsCheckbox}
            </Dropdown.Menu>
            </Dropdown>
  );
}
});

var FieldCheckbox = React.createClass({
    getInitialState: function(){
        var elemID = this.props._type;
        var checked = true;
        var elem = document.getElementById(elemID);
        if(!elem)
            return {isChecked: checked};
        if(elem.style.display === "none"){
            checked = false;
        }
        return {isChecked: checked};
    },
    check: function(elementId, event){
        var checked = true;
        if(document.getElementById(elementId).style.display === "none"){
            document.getElementById(elementId).style.display = "";
            checked = true;

            for(var each in sdata){
                var key = keyGen(sdata[each], elementId);
                document.getElementById(key).style.display = ""
            }
        }
        else{
            document.getElementById(elementId).style.display = "none";
            checked = false;

            for(var each in sdata){
                var key = keyGen(sdata[each], elementId);
                document.getElementById(key).style.display = "none"
            }
        }
        this.setState({isChecked: checked});
    },
    render: function() {
        var Input = ReactBootstrap.Input;
        var key = dropdownKeyGen(this.props._type);
        return(
            <div className='ab-menu-item'>
                <input 
                id={key} 
                type="checkbox" key={key}
                defaultChecked={this.state.isChecked} 
                onChange={this.check.bind(null, this.props._type)} readOnly={false}/>
                <label htmlFor={key}> {this.props._type} </label>
            </div>
        );
    }
});
