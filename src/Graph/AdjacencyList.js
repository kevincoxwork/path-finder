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

  // addEdge(startingNode, nodeEnd, weight) {
  //   this.adjacencyList.get();
  // }

  addEdgeByID(startingNodeID, nodeEndID, weight) {
    const startingNode = this.adjacencyList.get(startingNodeID).node;
    const endingNode = this.adjacencyList.get(nodeEndID).node;
    this.adjacencyList
      .get(startingNodeID)
      .edgeList.push(new Edge(startingNode, endingNode, weight));
  }

  // removeEdge(startingNode, nodeEnd) {

  // }

  removeEdgeByID(nodeID) {
    // remove reference in other nodes
    const otherNodes = this.adjacencyList.get(nodeID).edgeList;
    otherNodes.forEach((node) => {
      const currentNodeEdgeList = this.adjacencyList.get(
        node.nodeEnd.nodeKey,
      );
      // for (let i = 0; i < currentNodeEdgeList.length; i += 1) {
      //   if (currentNodeEdgeList[i].nodeEnd.nodeKey === nodeID) {
      //     currentNodeEdgeList.remove(i);
      //   }
      // }
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
    }
    const nodeInfo = this.adjacencyList.get(nodeID);
    nodeInfo.node.nodeValue = nodeType;
    this.adjacencyList.set(nodeID, nodeInfo);
  }

  getNodeById(nodeID) {
    return this.adjacencyList.get(nodeID).node;
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

  buildEmptyGrid() {
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
          this.addEdgeByID(i, i - 1, NODE_STATES.EMPTY);
        }
        if (x + 1 < this.sizeOfGridx) {
          this.addEdgeByID(i, i + 1, NODE_STATES.EMPTY);
        }
        // Handle y
        if (y > 0) {
          this.addEdgeByID(
            i,
            i - this.sizeOfGridx,
            NODE_STATES.EMPTY,
          );
        }
        if (y + 1 < this.sizeOfGridy) {
          this.addEdgeByID(
            i,
            i + this.sizeOfGridx,
            NODE_STATES.EMPTY,
          );
        }
        i += 1;
      }
    }
  }
}

export default AdjacencyList;
