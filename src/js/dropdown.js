var Dropdown = React.createClass({
    render: function(){
        var DropdownButton = ReactBootstrap.DropdownButton;
        var columns = this.props.cols;
        var ColumnsCheckbox =  columns.map(function(item){
            var key = dropdownKeyGen(item);
            console.log(key);
            return <FieldCheckbox _type={item} key={key}/>;
        });
        return (
            <DropdownButton>
                {ColumnsCheckbox}
            </DropdownButton>
  );
}
});

var FieldCheckbox = React.createClass({
    getInitialState: function(){
        return {isChecked: true};
    },
    check: function(elementId){
        var checked = true;
        var elem = document.getElementById(elementId);
        var display = "";
        
        if(elem.style.display === "none"){
            elem.style.display = display;
            checked = true;
        }
        else{
            display = "none";
            elem.style.display = display;
            checked = false;
        }

        for(var each in sdata){
            var key = keyGen(sdata[each], elementId);
            document.getElementById(key).style.display = display;
        }
        
        var key = dropdownKeyGen(elementId);
        console.log(document.getElementById(key).style.checked);
        //  = checked;
        this.setState({isChecked: checked});
    },
    render: function() {
        var MenuItem = ReactBootstrap.MenuItem;
        var Input = ReactBootstrap.Input;
        return(
            <MenuItem>
                <Input type='checkbox' checked={this.state.isChecked} onClick={this.check.bind(null, this.props._type)} label={this.props._type} id={this.props.key} />
            </MenuItem>
        );
    }
});