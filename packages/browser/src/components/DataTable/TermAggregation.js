// @flow

import React from 'react';
import { SyncOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { MultiList } from '@appbaseio/reactivesearch';
import { css } from 'react-emotion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import Flex from '../Flex';

import filterIconStyles from '../CommonStyles/filterIcons';
import overflowStyles from '../CommonStyles/overflowText';
import termAggregationStyles from '../CommonStyles/termAggregations';
import colors from '../theme/colors';

type Props = {
	field: string,
};

type State = {
	hasMounted: boolean,
};

class TermAggregation extends React.Component<Props, State> {
	state = {
		hasMounted: true,
	};

	onUpdate = () => {
		this.setState(
			() => ({
				hasMounted: false,
			}),
			() =>
				setTimeout(() =>
					this.setState({
						hasMounted: true,
					}),
				),
		);
	};

	render() {
		const { field } = this.props;
		const { hasMounted } = this.state;
		let componentId = field;
		if (field === '_type') {
			componentId = 'typeField';
		}

		if (field === '_index') {
			componentId = 'indexField';
		}

		return (
            <Popover
				content={
					hasMounted && (
						<MultiList
							componentId={componentId}
							dataField={field}
							size={100}
							css={termAggregationStyles}
							innerClass={{
								input: `ant-input ${css`
									height: 32px;
									background: ${colors.white} !important;
								`}`,
								checkbox: 'ant-checkbox-input',
							}}
							renderItem={(label, count) => (
								<Flex
									alignItem="center"
									wrap="nowrap"
									justifyContent="space-between"
									css={{
										width: '100%',
									}}
								>
									<span
										css={{ maxWidth: 100 }}
										className={overflowStyles}
									>
										{label}
									</span>
									<span>{count}</span>
								</Flex>
							)}
							loader="Loading..."
							renderNoResults={() => <p>No Results Found!</p>}
						/>
					)
				}
				title={
					<Flex justifyContent="space-between" alignItems="center">
						<span>Filter</span>
						<SyncOutlined
                            css={css`
								cursor: pointer;
							`}
                            onClick={this.onUpdate} />
					</Flex>
				}
				trigger="click"
				placement="bottomRight"
			>
				<FontAwesomeIcon icon={faFilter} className={filterIconStyles} />
			</Popover>
        );
	}
}

export default TermAggregation;
