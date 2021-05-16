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
  outline: 1px solid black;
`;

// eslint-disable-next-line react/prop-types
const GridItemComponent = ({ parentCallBack, node }) => {
  const changeBackground = () => {
    switch (node.nodeValue) {
      case NODE_STATES.EMPTY:
        return 'white';
      case NODE_STATES.FILLED:
        return 'black';
      case NODE_STATES.SLOW:
        return 'brown';
      case NODE_STATES.START:
        return 'green';
      case NODE_STATES.END:
        return 'blue';
      default:
        return 'white';
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
