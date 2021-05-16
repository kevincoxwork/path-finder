import React from 'react';
import { observer } from 'mobx-react';
// import styled from 'styled-components';
// import PropTypes from 'prop-types';
import GridComponent from './Grid';
import PaletteComponent from './Palette';
import AdjacencyList from '../Graph/AdjacencyList';

const LandingComponent = () => {
  const adjacencyList = new AdjacencyList(25, 25);
  return (
    <div>
      <GridComponent adjacencyList={adjacencyList} />
      <PaletteComponent adjacencyList={adjacencyList} />
    </div>
  );
};

export default observer(LandingComponent);
