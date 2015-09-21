var Dropdown = React.createClass({
    render: function(){
        var DropdownButton = ReactBootstrap.DropdownButton;
        var columns = this.props.cols;
        var ColumnsCheckbox =  columns.map(function(item){
            var key = dropdownKeyGen(item);
            // console.log(key);
            return <FieldCheckbox _type={item} />;
        });
        return (
            <DropdownButton className="dejavu-dropdown">
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
            
                <Input 
                type='checkbox'
                checked={this.state.isChecked} 
                onClick={this.check.bind(null, this.props._type)} 
                label={this.props._type} 
                id={this.props.key} />
        );
    }
});