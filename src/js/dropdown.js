var Dropdown = React.createClass({
    render: function(){
        var DropdownButton = ReactBootstrap.DropdownButton;
        var Menu = ReactBootstrap.Dropdown.Menu;
        var columns = this.props.cols;
        var ColumnsCheckbox =  columns.map(function(item){
            var key = dropdownKeyGen(item);
            return <FieldCheckbox _type={item} className="ab-checkbox" />;
        });
        return (
            <DropdownButton className="dejavu-dropdown" pullRight={true}>
                {ColumnsCheckbox}
            </DropdownButton>
  );
}
});

var FieldCheckbox = React.createClass({
    getInitialState: function(){
        return {isChecked: true};
    },
    check: function(elementId, event){
        var checked = true;
        if(document.getElementById(elementId).style.display == "none"){
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
        var MenuItem = ReactBootstrap.MenuItem;
        var Input = ReactBootstrap.Input;
        return(
            <MenuItem onSelect={this.check.bind(null, this.props._type)}>
                <Input 
                type='checkbox'
                checked={this.state.isChecked}
                label={this.props._type}
                onSelect={this.check.bind(null, this.props._type)}
                id={this.props.key} />
            </MenuItem>
        );
    }
});