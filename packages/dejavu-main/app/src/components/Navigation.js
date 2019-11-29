// @flow

import React from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mappingsReducers, appReducers, utils } from 'dejavu-data-browser';

const { getIndexes } = mappingsReducers;
const { getIsConnected } = appReducers;
const {
  normalizeSearchQuery,
  getImporterBaseUrl,
  getUrlParams,
  isExtension,
} = utils;

type Props = {
  indexes: string[],
  isConnected: boolean,
  history: any,
};

const { Item } = Menu;

const getImporterSearchParams = () => {
  let params = window.location.search;

  if (params) {
    params = normalizeSearchQuery(params);
    params += '&sidebar=true';
  } else {
    params = '?sidebar=true';
  }

  return params;
};

const navHandler = (key, history) => {
  switch (key) {
    case 'import':
      window.location.href = `${getImporterBaseUrl()}${getImporterSearchParams()}`;
      break;
    case 'browse':
      history.push('/');
      break;
    default:
      history.push(key);
      break;
  }
};

const Navigation = ({ indexes, isConnected, history }: Props) => {
  const routeName = window.location.pathname.substring(1);
  let defaultSelectedKey = routeName;

  if (!routeName) {
    defaultSelectedKey = 'browse';
  }

  // special case for chrome extension
  if (isExtension()) {
    const { route } = getUrlParams(window.location.search);
    if (route) {
      defaultSelectedKey = route;
    } else {
      defaultSelectedKey = 'browse';
    }
  }

  return (
    <Menu
      defaultSelectedKeys={[defaultSelectedKey]}
      mode="inline"
      onSelect={({ key }) => navHandler(key, history)}
    >
      <Item key="browse">
        <Icon type="table" />
        Data Browser
      </Item>
      <Item key="import">
        <Icon type="upload" />
        Import Data
      </Item>
      {(indexes.length <= 1 || !isConnected) && (
        <Item key="query">
          <Icon type="search" />
          Query Explorer
        </Item>
      )}
      {(indexes.length <= 1 || !isConnected) && (
        <Item key="preview">
          <Icon type="experiment" />
          Search Preview
        </Item>
      )}
    </Menu>
  );
};

const mapStateToProps = state => ({
  indexes: getIndexes(state),
  isConnected: getIsConnected(state),
});

export default connect(mapStateToProps)(withRouter(Navigation));
