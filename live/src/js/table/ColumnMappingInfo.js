import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import FeatureComponent from '../features/FeatureComponent';

const Pretty = FeatureComponent.Pretty;

const ColumnMappingInfo = ({ datatype, json, children }) => (
	<OverlayTrigger
		trigger="click"
		rootClose
		placement="left"
		overlay={
			<Popover id={`${datatype} label`} className="nestedJson">
				{
					<Pretty json={json} />
				}
			</Popover>
		}
	>
		{children}
	</OverlayTrigger>
);

ColumnMappingInfo.propTypes = {
	datatype: PropTypes.string.isRequired,
	json: PropTypes.object,	// eslint-disable-line
	children: PropTypes.element
};

export default ColumnMappingInfo;
