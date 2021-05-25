/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { observer } from 'mobx-react';
import Tile from './Tile';
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
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const LeftDrawer = ({ adjacencyList }) => {
  const classes = useStyles();
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
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
      case 3:
        // eslint-disable-next-line no-case-declarations
        const bfsResult = mazeSolver.solveBFS(
          adjacencyList,
          startingNode,
          endingNode,
        );
        result.completePath = bfsResult;
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
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{ backgroundColor: '#f5b2a6' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Kevin Cox - Maze Solver
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
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
            onClick={() => window.location.reload()}
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
          <ListItem button key="BFS" onClick={() => solveMaze(3)}>
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
        <a href="/" style={{ textDecoration: 'none', color: 'black' }}>
          <ListItem
            button
            key="About"
          >
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About Me" />
          </ListItem>
        </a>
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
