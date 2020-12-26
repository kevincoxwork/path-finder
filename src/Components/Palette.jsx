import React from 'react';
// import styled from 'styled-components';
// import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import MouseClickState from '../state/mouseClickState';

const PaletteComponent = () => {
  const { mouseType, cycleMouseType } = MouseClickState.get();
  return (
    <div>
      <p>Current Type: </p>
      {mouseType}
      <button onClick={() => cycleMouseType()} type="button">
        Cycle Mouse Type
      </button>
    </div>
  );
};

export default observer(PaletteComponent);
