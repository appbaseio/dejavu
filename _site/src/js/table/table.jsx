var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Dropdown = require('./Dropdown.jsx');
var FeatureComponent = require('../features/FeatureComponent.jsx');
var FilterDropdown = require('./FilterDropdown.jsx');
var PageLoading = require('./PageLoading.jsx');
var Info = require('./Info.jsx');
var Column = require('./Column.jsx');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var Pretty = FeatureComponent.Pretty;
var Cell = require('./Cell.jsx');
// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.
var cellWidth = '250px';

// **Cell** defines the properties of each cell in the
// data table.


// This is another wrapper around the data table to implement
// pagination, throbbers, styling etc.
var Table = React.createClass({
    componentDidMount: function() {
        var elem = document.getElementById('table-scroller');
        // WE are listning for scroll even so we get notified
        // when the scroll hits the bottom. For pagination.
        elem.addEventListener('scroll', this.props.scrollFunction);
    },
    render: function() {
        var column_width = 250;
        var elem = document.getElementById('table-scroller');
        if (elem != null) {
            elem.style.width = this.props.visibleColumns.length * column_width + 'px';
        }
        return (
            <div id='table-container' className="table-container">
                <div id="table-scroller" className="table-scroller">
                    <table id="data-table"
                    className="table table-fixedheader table-bordered">
                        <thead id='columns'>
                            <tr>
                                {this.props.renderColumns}
                            </tr>
                        </thead>
                        <tbody className='exp-scrollable'>
                                {this.props.renderRows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = Table;
