/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import NODE_STATES from '../Graph/NODE_STATES';
import MazeSolver from '../Graph/Solver';
import MouseClickState from '../state/mouseClickState';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const Tile = styled.div`
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

const LeftDrawer = ({ adjacencyList }) => {
  const classes = useStyles();
  const { getMouseType, setMouseType } = MouseClickState.get();

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
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{ backgroundColor: '#f5b2a6' }}>
          <Typography variant="h6" noWrap>
            Kevin Cox - Mazer Solver
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem button key="Start" selected={getMouseType() === NODE_STATES.START} onClick={() => setMouseType(NODE_STATES.START)}>
            <ListItemIcon>
              <Tile style={{ backgroundColor: '#58BC82' }} />
            </ListItemIcon>
            <ListItemText primary="Starting Tile" />
          </ListItem>
          <ListItem button key="End" selected={getMouseType() === NODE_STATES.END} onClick={() => setMouseType(NODE_STATES.END)}>
            <ListItemIcon>
              <Tile style={{ backgroundColor: '#F05365' }} />
            </ListItemIcon>
            <ListItemText primary="Ending Tile" />
          </ListItem>
          <ListItem button key="Barrier" selected={getMouseType() === NODE_STATES.FILLED} onClick={() => setMouseType(NODE_STATES.FILLED)}>
            <ListItemIcon>
              <Tile style={{ backgroundColor: '#3A3238' }} />
            </ListItemIcon>
            <ListItemText primary="Barrier Tile" />
          </ListItem>
          <ListItem button key="Eraser" selected={getMouseType() === NODE_STATES.EMPTY} onClick={() => setMouseType(NODE_STATES.EMPTY)}>
            <ListItemIcon>
              <Tile style={{ backgroundColor: '#FCD5CE' }} />
            </ListItemIcon>
            <ListItemText primary="Eraser" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key="Clear" onClick={() => adjacencyList.buildEmptyGrid()}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Clear Maze" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key="DFS" onClick={() => solveMaze(1)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Perform DFS" />
          </ListItem>
          <ListItem button key="BFS" onClick={() => solveMaze(1)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Perform BFS" />
          </ListItem>
          <ListItem button key="Dijkstra" onClick={() => solveMaze(2)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Perform Dijkstra" />
          </ListItem>
        </List>
        <Divider />
        <ListItem button key="About" onClick={() => setMouseType(NODE_STATES.EMPTY)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="About Me" />
        </ListItem>
      </Drawer>
    </div>
  );
};

export default observer(LeftDrawer);
