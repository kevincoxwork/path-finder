import Edge from './Edge';
import Node from './Node';
import NODE_STATES from './NODE_STATES';

class AdjacencyList {
  constructor(sizeOfGridx, sizeOfGridy) {
    this.sizeOfGridy = sizeOfGridy;
    this.sizeOfGridx = sizeOfGridx;
    this.adjacencyList = new Map();
  }

  // addEdge(startingNode, nodeEnd, weight) {
  //   this.adjacencyList.get();
  // }

  addEdgeByID(startingNodeID, nodeEndID, weight) {
    try {
      const startingNode = this.adjacencyList.get(startingNodeID).node;
      const endingNode = this.adjacencyList.get(nodeEndID).node;
      this.adjacencyList.get(startingNodeID).edgeList.push(new Edge(startingNode, endingNode, weight));
    } catch (ex) {
      console.log(ex);
    }
  }

  // removeEdge(startingNode, nodeEnd) {

  // }

  removeEdgeByID(nodeID) {
    // remove reference in other nodes
    const otherNodes = this.adjacencyList.get(nodeID).edgeList;
    otherNodes.forEach((node) => {
      const currentNodeEdgeList = this.adjacencyList.get(node.nodeEnd.nodeKey);
      // for (let i = 0; i < currentNodeEdgeList.length; i += 1) {
      //   if (currentNodeEdgeList[i].nodeEnd.nodeKey === nodeID) {
      //     currentNodeEdgeList.remove(i);
      //   }
      // }
      currentNodeEdgeList.edgeList = currentNodeEdgeList.edgeList.filter((currentNode) => currentNode.nodeEnd.nodeKey !== nodeID);
      this.adjacencyList.set(node.nodeEnd.nodeKey, currentNodeEdgeList);
    });
    // remove reference in this node instance
    const nodeInfo = this.adjacencyList.get(nodeID);
    nodeInfo.edgeList = [];
    nodeInfo.node.nodeValue = NODE_STATES.FILLED;
    this.adjacencyList.set(nodeID, nodeInfo);
  }

  changeNodeType(nodeID, nodeType) {
    const nodeInfo = this.adjacencyList.get(nodeID);
    nodeInfo.node.nodeValue = nodeType;
    this.adjacencyList.set(nodeID, nodeInfo);
  }

  addNode(nodeKey, nodeValue, x, y) {
    this.adjacencyList.set(nodeKey, { node: new Node(nodeKey, nodeValue, x, y), edgeList: [] });
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
          this.addEdgeByID(i, i - this.sizeOfGridx, NODE_STATES.EMPTY);
        }
        if (y + 1 < this.sizeOfGridy) {
          this.addEdgeByID(i, i + this.sizeOfGridx, NODE_STATES.EMPTY);
        }
        i += 1;
      }
    }
  }
}

export default AdjacencyList;
