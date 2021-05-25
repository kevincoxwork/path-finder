import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import NODE_STATES from '../Graph/NODE_STATES';
import Tile from './Tile';

// eslint-disable-next-line react/prop-types
const GridItemComponent = ({ parentCallBack, node }) => {
  const changeBackground = () => {
    switch (node.nodeValue) {
      case NODE_STATES.EMPTY:
        return '#FCD5CE';
      case NODE_STATES.FILLED:
        return '#3A3238';
      case NODE_STATES.SLOW:
        return '#b08968';
      case NODE_STATES.START:
        return '#58BC82';
      case NODE_STATES.END:
        return '#F05365 ';
      case NODE_STATES.PATH:
        return '#b7b7a4';
      case NODE_STATES.SEARCH:
        return '#fec89a';
      default:
        return '#FFCF9C';
    }
  };

  return (
    <Tile
      style={{ background: `${changeBackground(node)}` }}
      onMouseEnter={() => {
        parentCallBack(node, false);
      }}
      onMouseDown={() => {
        parentCallBack(node, true);
      }}
      onMouseClick={() => {
        parentCallBack(node, true);
      }}
      role="button"
      aria-hidden="true"
    />
  );
};

GridItemComponent.propTypes = {
  parentCallBack: PropTypes.func.isRequired,
  node: PropTypes.shape({
    nodeKey: PropTypes.number,
    nodeValue: PropTypes.number,
    xValue: PropTypes.number,
    yValue: PropTypes.number,
  }).isRequired,
};

export default observer(GridItemComponent);
