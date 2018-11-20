// @flow

import React from 'react';
import { Popover } from 'antd';
import { MultiList } from '@appbaseio/reactivesearch';

type Props = {
	field: string,
};

const TermFilter = ({ field }: Props) => (
	<Popover
		content={<MultiList componentId={field} dataField={field} size={100} />}
		title="Filter"
		trigger="click"
		placement="bottomRight"
	>
		<i className="fa fa-filter" />
	</Popover>
);

export default TermFilter;
