var ExportPage = React.createClass({
    render: function()  {
    	return(<div className="well">
        	<h3>Query</h3>
        	<form>
			  <div className="form-group">
			    <label for="Query">Type your Query</label>
			    <textarea id="Query" className="form-control" rows="10"></textarea>
			  </div>
			  <button type="submit" className="btn btn-default btn-success">Submit</button>
			</form>
        </div>);
    }
});

var ImportPage = React.createClass({
    render: function()  {
    	return(<div className="well">
	        	<h3>Export Data</h3>
	        </div>);
    }
});
