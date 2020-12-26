import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import NODE_STATES from '../Graph/NODE_STATES';
import MouseClickState from '../state/mouseClickState';

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

const GridItemComponent = ({ parentCallBack, node }) => {
  const [backgroundColor, setBackgroundColor] = useState('white');
  const { isMouseDown } = MouseClickState.get();
  const changeBackground = () => {
    switch (node.nodeValue) {
      case NODE_STATES.EMPTY:
        setBackgroundColor('white');
        break;
      case NODE_STATES.FILLED:
        setBackgroundColor('black');
        break;
      case NODE_STATES.SLOW:
        setBackgroundColor('brown');
        break;
      case NODE_STATES.START:
        setBackgroundColor('green');
        break;
      case NODE_STATES.END:
        setBackgroundColor('blue');
        break;
      default:
        break;
    }
  };

  return (
    <NoSelect
      style={{ background: `${backgroundColor}` }}
      onMouseEnter={() => {
        if (isMouseDown) {
          parentCallBack(node);
          changeBackground();
        }
      }}
      onMouseDown={() => {
        parentCallBack(node);
        changeBackground();
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
