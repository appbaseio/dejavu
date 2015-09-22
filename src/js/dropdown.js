var Dropdown = React.createClass({
    render: function(){
        var DropdownButton = ReactBootstrap.DropdownButton;
        var columns = this.props.cols;
        var MenuItem = ReactBootstrap.MenuItem;
        var ColumnsCheckbox =  columns.map(function(item){
            var key = dropdownKeyGen(item);
            return <FieldCheckbox _type={item} _key={this.key}/>;
        });
        return (
            <DropdownButton 
            className="dejavu-dropdown fa fa-cog"
            pullRight={true}
            noCaret
            id='ab-dropdown'>
                <MenuItem header className='centered-text'>Data Fields</MenuItem>
                <MenuItem divider/>
                {ColumnsCheckbox}
                <MenuItem divider/>
            </DropdownButton>
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
        return(
            <div className='ab-menu-item'>
                <Input 
                type='checkbox'
                checked={this.state.isChecked}
                label={this.props._type}
                onClick={this.check.bind(null, this.props._type)}
                key={this.props._key}
                id={this.props._key}/>
            </div>
        );
    }
});