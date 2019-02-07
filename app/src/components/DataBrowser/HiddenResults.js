import React from 'react';
import { Collapse, Icon, Button, Tooltip, Alert } from 'antd';

import { PromotedResultsContext } from './PromotedResultsContainer';
import UnHideButton from '../DataTable/UnHideButton';

const { Panel } = Collapse;

const customPanelStyle = {
	background: '#fff1f0',
	borderRadius: 4,
	marginTop: 20,
	marginBottom: 24,
	border: 0,
	overflow: 'hidden',
};

class HiddenResults extends React.Component {
	render() {
		const { hiddenResults } = this.context;
		const filteredResults = hiddenResults.map(item => item.doc_id);

		return (
			<React.Fragment>
				<div css={{ margin: '25px 0 10px' }}>
					<h3 css={{ margin: 0 }}>
						<Icon type="eye-invisible" /> Hidden Results
					</h3>
					<p css={{ paddingLeft: 20 }} className="ant-form-extra">
						Hidden results are not returned by the API when the
						query matches the current query conditions. Read more{' '}
						<a href="#" target="_blank">
							here
						</a>
						.
					</p>
				</div>
				{filteredResults.length > 0 ? (
					<Collapse
						bordered={false}
						expandIcon={({ isActive }) => (
							<Icon
								type="caret-right"
								rotate={isActive ? 90 : 0}
							/>
						)}
					>
						<Panel
							header={`${filteredResults.length} Hidden Results`}
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
												css={{
													marginRight: 10,
												}}
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
					</Collapse>
				) : (
					<Alert
						css={{ margin: '15px 0' }}
						type="error"
						message="No Hidden Results"
					/>
				)}
			</React.Fragment>
		);
	}
}

HiddenResults.contextType = PromotedResultsContext;

export default HiddenResults;
