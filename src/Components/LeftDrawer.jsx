/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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
import ClearIcon from '@material-ui/icons/Clear';
import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
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
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const { getMouseType, setMouseType } = MouseClickState.get();

  const solveMaze = async (algorithm) => {
    const mazeSolver = new MazeSolver();
    if (!adjacencyList.startingNodeLocation) {
      setSnackbarInfo({
        open: true,
        message:
          'Starting Node Not Set - Please Add A Starting Note 🌟',
        severity: 'error',
      });
      return;
    }
    if (!adjacencyList.endingNodeLocation) {
      setSnackbarInfo({
        open: true,
        message: 'Ending Node Not Set - Please Add An Ending Note 🌟',
        severity: 'error',
      });
      return;
    }
    const startingNode = adjacencyList.getNodeById(
      adjacencyList.startingNodeLocation,
    );
    const endingNode = adjacencyList.getNodeById(
      adjacencyList.endingNodeLocation,
    );
    const result = { completePath: null, searchPath: null };
    switch (algorithm) {
      case 1:
        // eslint-disable-next-line no-case-declarations
        const dfsResult = mazeSolver.solveDFS(
          adjacencyList,
          startingNode,
          endingNode,
        );
        result.completePath = dfsResult;
        break;
      case 2:
        // eslint-disable-next-line no-case-declarations
        const { completePath, searchPath } = mazeSolver.solveDijkstra(
          adjacencyList,
          startingNode,
          endingNode,
        );
        result.completePath = completePath;
        result.searchPath = searchPath;
        break;
      default:
    }
    if (result.searchPath !== null) {
      await adjacencyList.drawLine(
        result.searchPath,
        NODE_STATES.SEARCH,
      );
    }
    if (result.completePath.length === 0) {
      setSnackbarInfo({
        open: true,
        message: 'No Path Found From Starting Node To Ending Node 💔',
        severity: 'error',
      });
      return;
    }
    await adjacencyList.drawLine(
      result.completePath,
      NODE_STATES.PATH,
    );
    setSnackbarInfo({
      open: true,
      message: 'Path Found! 🎉',
      severity: 'success',
    });
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
          <ListItem
            button
            key="Start"
            selected={getMouseType() === NODE_STATES.START}
            onClick={() => setMouseType(NODE_STATES.START)}
          >
            <ListItemIcon>
              <Tile style={{ backgroundColor: '#58BC82' }} />
            </ListItemIcon>
            <ListItemText primary="Starting Tile" />
          </ListItem>
          <ListItem
            button
            key="End"
            selected={getMouseType() === NODE_STATES.END}
            onClick={() => setMouseType(NODE_STATES.END)}
          >
            <ListItemIcon>
              <Tile style={{ backgroundColor: '#F05365' }} />
            </ListItemIcon>
            <ListItemText primary="Ending Tile" />
          </ListItem>
          <ListItem
            button
            key="Barrier"
            selected={getMouseType() === NODE_STATES.FILLED}
            onClick={() => setMouseType(NODE_STATES.FILLED)}
          >
            <ListItemIcon>
              <Tile style={{ backgroundColor: '#3A3238' }} />
            </ListItemIcon>
            <ListItemText primary="Barrier Tile" />
          </ListItem>
          <ListItem
            button
            key="Eraser"
            selected={getMouseType() === NODE_STATES.EMPTY}
            onClick={() => setMouseType(NODE_STATES.EMPTY)}
          >
            <ListItemIcon>
              <Tile style={{ backgroundColor: '#FCD5CE' }} />
            </ListItemIcon>
            <ListItemText primary="Eraser" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key="Clear"
            onClick={() => adjacencyList.buildEmptyGrid()}
          >
            <ListItemIcon>
              <ClearIcon />
            </ListItemIcon>
            <ListItemText primary="Clear Maze" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key="DFS" onClick={() => solveMaze(1)}>
            <ListItemIcon>
              <p>DFS</p>
            </ListItemIcon>
            <ListItemText primary="Perform DFS" />
          </ListItem>
          <ListItem button key="BFS" onClick={() => solveMaze(1)}>
            <ListItemIcon>
              <p>BFS</p>
            </ListItemIcon>
            <ListItemText primary="Perform BFS" />
          </ListItem>
          <ListItem
            button
            key="Dijkstra"
            onClick={() => solveMaze(2)}
          >
            <ListItemIcon>
              <p>SP</p>
            </ListItemIcon>
            <ListItemText primary="Perform Dijkstra" />
          </ListItem>
        </List>
        <Divider />
        <ListItem
          button
          key="About"
          onClick={() => setMouseType(NODE_STATES.EMPTY)}
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About Me" />
        </ListItem>
      </Drawer>
      <Snackbar
        open={
         snackbarInfo.open
        }
        autoHideDuration={6000}
        onClose={() => setSnackbarInfo({
          open: false,
          message: '',
          severity: 'success',
        })}
      >
        <MuiAlert elevation={6} severity={snackbarInfo.severity}>
          {snackbarInfo.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default observer(LeftDrawer);
