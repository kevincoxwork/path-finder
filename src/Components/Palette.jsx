import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import MouseClickState from '../state/mouseClickState';

const PaletteComponent = ({ adjacencyList }) => {
  const { mouseType, cycleMouseType } = MouseClickState.get();
  const changeSomething = () => {
    adjacencyList.changeNodeType(0, 1);
  };
  return (
    <div>
      <p>Current Type: </p>
      {mouseType}
      <button onClick={() => cycleMouseType()} type="button">
        Cycle Mouse Type
      </button>
      <button onClick={() => changeSomething()} type="button">
        Change First Element
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
