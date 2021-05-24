import {
  makeObservable, action, observable,
} from 'mobx';
import Edge from './Edge';
import Node from './Node';
import NODE_STATES from './NODE_STATES';

class AdjacencyList {
  constructor(sizeOfGridx, sizeOfGridy) {
    this.sizeOfGridy = sizeOfGridy;
    this.sizeOfGridx = sizeOfGridx;
    this.startingNodeLocation = null;
    this.endingNodeLocation = null;
    this.adjacencyList = new Map();
    makeObservable(this, {
      adjacencyList: observable,
      addEdgeByID: action,
      removeEdgeByID: action,
      changeNodeType: action,
      addNode: action,
      buildEmptyGrid: action,
    });
    this.buildEmptyGrid();
  }

  addEdgeByID(startingNodeID, nodeEndID, weight) {
    const startingNode = this.adjacencyList.get(startingNodeID).node;
    const endingNode = this.adjacencyList.get(nodeEndID).node;
    this.adjacencyList
      .get(startingNodeID)
      .edgeList.push(new Edge(startingNode, endingNode, weight));
  }

  removeEdgeByID(nodeID) {
    // remove reference in other nodes
    const otherNodes = this.adjacencyList.get(nodeID).edgeList;
    otherNodes.forEach((node) => {
      const currentNodeEdgeList = this.adjacencyList.get(
        node.nodeEnd.nodeKey,
      );
      currentNodeEdgeList.edgeList = currentNodeEdgeList.edgeList.filter(
        (currentNode) => currentNode.nodeEnd.nodeKey !== nodeID,
      );
      this.adjacencyList.set(
        node.nodeEnd.nodeKey,
        currentNodeEdgeList,
      );
    });
    // remove reference in this node instance
    const nodeInfo = this.adjacencyList.get(nodeID);
    nodeInfo.edgeList = [];
    nodeInfo.node.nodeValue = NODE_STATES.FILLED;
    this.adjacencyList.set(nodeID, nodeInfo);
  }

  changeNodeType(nodeID, nodeType) {
    if (nodeType === NODE_STATES.START) {
      if (this.isStartingNodeDefined()) {
        this.changeNodeType(
          this.startingNodeLocation,
          NODE_STATES.EMPTY,
        );
      }
      this.startingNodeLocation = nodeID;
    } else if (nodeType === NODE_STATES.END) {
      if (this.isEndingNodeDefined()) {
        this.changeNodeType(
          this.endingNodeLocation,
          NODE_STATES.EMPTY,
        );
      }
      this.endingNodeLocation = nodeID;
    } else if (nodeType === NODE_STATES.EMPTY) {
      // todo check for out of scope
    }
    const nodeInfo = this.adjacencyList.get(nodeID);
    nodeInfo.node.nodeValue = nodeType;
    this.adjacencyList.set(nodeID, nodeInfo);
  }

  getNodeById(nodeID) {
    return this.adjacencyList.get(nodeID).node;
  }

  getAllNodeInfoById(nodeID) {
    return this.adjacencyList.get(nodeID);
  }

  getIncidentEdgesbyId(nodeID) {
    return this.adjacencyList.get(nodeID).edgeList;
  }

  getAllUnmarkedNodes() {
    // eslint-disable-next-line no-unused-vars
    const test = Array.from(this.adjacencyList.values());
    const result = test.filter((node) => !node.node.isMarked);
    return result;
  }

  markNodeById(nodeID) {
    this.getNodeById(nodeID).isMarked = true;
  }

  unmarkNodeById(nodeID) {
    this.getNodeById(nodeID).isMarked = false;
  }

  clearMarkings() {
    this.adjacencyList.forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      node.isMarked = false;
    });
  }

  isStartingNodeDefined() {
    return this.startingNodeLocation !== null;
  }

  isEndingNodeDefined() {
    return this.endingNodeLocation !== null;
  }

  addNode(nodeKey, nodeValue, x, y) {
    this.adjacencyList.set(nodeKey, {
      node: new Node(nodeKey, nodeValue, x, y),
      edgeList: [],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async drawLine(pathToDraw, state) {
    let timeout = 50;
    if (pathToDraw.length > 50) {
      timeout = 25;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const node of pathToDraw) {
      this.changeNodeType(node.nodeKey, state);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, timeout));
    }
  }

  addNodePredecessor(node1, node2) {
    this.getNodeById(node1.nodeKey).setPredecessor(node2);
  }

  updateNodeDistance(nodeID, distance) {
    this.getNodeById(nodeID).setDistance(distance);
  }

  buildEmptyGrid() {
    this.startingNodeLocation = null;
    this.endingNodeLocation = null;
    this.adjacencyList = new Map();
    // For simplicity, build the node set and then create the edge connections.
    let i = 0;
    for (let y = 0; y < this.sizeOfGridy; y += 1) {
      for (let x = 0; x < this.sizeOfGridx; x += 1) {
        this.addNode(i, NODE_STATES.EMPTY, x, y);
        i += 1;
      }
    }

    i = 0;
    for (let y = 0; y < this.sizeOfGridy; y += 1) {
      for (let x = 0; x < this.sizeOfGridx; x += 1) {
        // Handle X
        if (x > 0) {
          this.addEdgeByID(i, i - 1, 1);
        }
        if (x + 1 < this.sizeOfGridx) {
          this.addEdgeByID(i, i + 1, 1);
        }
        // Handle y
        if (y > 0) {
          this.addEdgeByID(
            i,
            i - this.sizeOfGridx,
            1,
          );
        }
        if (y + 1 < this.sizeOfGridy) {
          this.addEdgeByID(
            i,
            i + this.sizeOfGridx,
            1,
          );
        }
        i += 1;
      }
    }
  }
}

export default AdjacencyList;
