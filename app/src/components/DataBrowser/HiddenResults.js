import React from 'react';
import { Collapse, Icon, Button, Tooltip } from 'antd';

import { PromotedResultsContext } from './PromotedResultsContainer';
import UnHideButton from '../DataTable/UnHideButton';

const { Panel } = Collapse;

const customPanelStyle = {
	background: '#fff1f0',
	borderRadius: 4,
	marginTop: 50,
	marginBottom: 24,
	border: 0,
	overflow: 'hidden',
};

class HiddenResults extends React.Component {
	render() {
		const { hiddenResults } = this.context;
		console.log(hiddenResults);
		const filteredResults = hiddenResults.map(item => item.doc_id);

		return (
			<React.Fragment>
				<Collapse
					bordered={false}
					expandIcon={({ isActive }) => (
						<Icon type="caret-right" rotate={isActive ? 90 : 0} />
					)}
				>
					{filteredResults.length && (
						<Panel
							header={`${filteredResults.length} Hidden Items`}
							key="1"
							style={customPanelStyle}
						>
							{filteredResults.map(item => (
								<UnHideButton
									id={item}
									key={item}
									renderButton={({
										unHideItem,
										isLoading,
									}) => (
										<Tooltip
											placement="top"
											title="Remove this item"
										>
											<Button
												type="danger"
												loading={isLoading}
												onClick={unHideItem}
											>
												{item}
											</Button>
										</Tooltip>
									)}
								/>
							))}
						</Panel>
					)}
				</Collapse>
			</React.Fragment>
		);
	}
}

HiddenResults.contextType = PromotedResultsContext;

export default HiddenResults;
