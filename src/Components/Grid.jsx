import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
// import PropTypes from 'prop-types';
import GridItemComponent from './GridItem';
import MouseClickState from '../state/mouseClickState';
import GridState from '../state/gridState';

import NODE_STATES from '../Graph/NODE_STATES';

const OuterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${50}, 0fr);
  column-gap: 1px;
  padding: 0px;
`;
const GridComponent = () => {
  const { setMouseState } = MouseClickState.get();
  const { adjacencyList } = GridState.get();
  const [grid, setGrid] = useState([]);
  const parentCallBack = (node) => {
    const { mouseType } = MouseClickState.get();
    console.log(`Grid ID is ${node.nodeKey} ${node.nodeValue}`);
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
    adjacencyList.buildEmptyGrid();
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

export default observer(GridComponent);
