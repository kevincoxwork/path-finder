import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import GridItemComponent from './GridItem';
import MouseClickState from '../state/mouseClickState';

import NODE_STATES from '../Graph/NODE_STATES';

const OuterGrid = styled.div` 
  display: grid;
  grid-template-columns: repeat(${25}, 0fr);
  column-gap: 1px;
  padding: 0px;
`;

const GridComponent = ({ adjacencyList }) => {
  const { setMouseState } = MouseClickState.get();

  const [grid, setGrid] = useState([]);
  const parentCallBack = (node) => {
    const { mouseType, isMouseDown } = MouseClickState.get();
    if (!isMouseDown) {
      return;
    }
    if (mouseType === NODE_STATES.FILLED) {
      adjacencyList.removeEdgeByID(node.nodeKey);
    } else {
      adjacencyList.changeNodeType(node.nodeKey, mouseType);
    }
  };

  const renderGrid = () => {
    const tempGrid = [];
    adjacencyList.adjacencyList.forEach((entry) => {
      tempGrid.push(
        <GridItemComponent
          parentCallBack={parentCallBack}
          node={entry.node}
        />,
      );
    });
    if (
      tempGrid.length
      === adjacencyList.sizeOfGridy * adjacencyList.sizeOfGridx
    ) {
      setGrid(tempGrid);
    }
  };
  useEffect(() => {
    renderGrid();
  }, []);

  return (
    <OuterGrid
      onMouseDown={() => {
        setMouseState(true);
      }}
      onMouseUp={() => {
        setMouseState(false);
      }}
    >
      {grid === [] ? <></> : grid}
    </OuterGrid>
  );
};

GridComponent.propTypes = {
  adjacencyList: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    adjacencyList: PropTypes.any,
    removeEdgeByID: PropTypes.func,
    changeNodeType: PropTypes.number,
    sizeOfGridx: PropTypes.number,
    sizeOfGridy: PropTypes.number,
  }).isRequired,
};

export default observer(GridComponent);
