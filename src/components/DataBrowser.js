import React from 'react';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';

import ConnectApp from './ConnectApp';
import DataTable from './DataTable';

const DataBrowser = () => (
	<ReactiveBase
		app="good-books-ds"
		credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
	>
		<ConnectApp />
		<ReactiveList
			componentId="results"
			dataField="_id"
			pagination
			onAllData={data => <DataTable data={data} />}
		/>
	</ReactiveBase>
);

export default DataBrowser;
