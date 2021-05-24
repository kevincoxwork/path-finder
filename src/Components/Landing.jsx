import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import GridComponent from './Grid';
import PaletteComponent from './Palette';
import LeftDrawer from './LeftDrawer';
import AdjacencyList from '../Graph/AdjacencyList';

const CenetedDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 47%;
  -webkit-transform: translate(-30%, -50%);
  transform: translate(-30%, -50%);
  text-align: center;
`;

const LandingComponent = () => {
  const adjacencyList = new AdjacencyList(15, 15);
  return (
    <>
      <CenetedDiv>
        <GridComponent adjacencyList={adjacencyList} />
        <PaletteComponent adjacencyList={adjacencyList} />
      </CenetedDiv>
      <LeftDrawer adjacencyList={adjacencyList} />
    </>
  );
};

export default observer(LandingComponent);
