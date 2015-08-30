var Dropdown = React.createClass({
    render: function(){
        var DropdownButton = ReactBootstrap.DropdownButton;
        var MenuItem = ReactBootstrap.MenuItem;
        var columns = this.props.cols;
        var ColumnsCheckbox =  columns.map(function(item){
            return <TypeColumn _type={item} />;
        });
        return (
            <DropdownButton className="">
                {ColumnsCheckbox}
            </DropdownButton>
  );
}
});