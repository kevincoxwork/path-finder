import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import NODE_STATES from '../Graph/NODE_STATES';

const NoSelect = styled.div`
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  height: 25px;
  width: 25px;
  border-radius: 5px;
  padding: 1px;
`;

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
        return '#E8B4BC';
      default:
        return '#FFCF9C';
    }
  };

  return (
    <NoSelect
      style={{ background: `${changeBackground(node)}` }}
      onMouseEnter={() => {
        parentCallBack(node);
      }}
      onMouseDown={() => {
        parentCallBack(node);
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
