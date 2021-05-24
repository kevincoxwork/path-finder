/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import MouseClickState from '../state/mouseClickState';
import MazeSolver from '../Graph/Solver';

const PaletteComponent = ({ adjacencyList }) => {
  const { getMouseType, cycleMouseType } = MouseClickState.get();
  const solveMaze = (algorithm) => {
    const mazeSolver = new MazeSolver();
    if (!adjacencyList.startingNodeLocation) {
      console.log('bad');
    }
    if (!adjacencyList.endingNodeLocation) {
      console.log('bad');
    }
    const startingNode = adjacencyList.getNodeById(adjacencyList.startingNodeLocation);
    const endingNode = adjacencyList.getNodeById(adjacencyList.endingNodeLocation);
    let result = null;
    switch (algorithm) {
      case 1:
        result = mazeSolver.solveFirstPath(adjacencyList, startingNode, endingNode);
        break;
      case 2:
        result = mazeSolver.solveDijkstraBlind(adjacencyList, startingNode, endingNode);
        break;
      default:
    }
    if (result === null) {
      console.log('No Path Exists');
    }
    adjacencyList.drawLine(result);
  };
  return (
    <div hidden>
      <p>Current Type: </p>
      {getMouseType()}
      <button onClick={() => cycleMouseType()} type="button">
        Cycle Mouse Type
      </button>
      <button onClick={() => solveMaze(1)} type="button">
        DFS Search
      </button>
      <button onClick={() => solveMaze(2)} type="button">
        Solve Maze - Shortest Path
      </button>
      <button onClick={() => solveMaze(2)} type="button">
        Clear Maze
      </button>
    </div>
  );
};
PaletteComponent.propTypes = {
  adjacencyList: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    adjacencyList: PropTypes.any,
    removeEdgeByID: PropTypes.func,
    changeNodeType: PropTypes.number,
    sizeOfGridx: PropTypes.number,
    sizeOfGridy: PropTypes.number,
  }).isRequired,
};

export default observer(PaletteComponent);
