/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import PriorityQueue from 'priorityqueuejs';

function removeItemOnce(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

class MazeSolver {
  constructor() {
    this.pathStack = [];
  }

  doesFirstPathExist(graph, startingNode, endingNode) {
    graph.markNodeById(startingNode.nodeKey);
    this.pathStack.push(startingNode);
    if (startingNode.nodeKey === endingNode.nodeKey) return true;

    // eslint-disable-next-line no-restricted-syntax
    for (const edge of graph.getIncidentEdgesbyId(startingNode.nodeKey)) {
      if (!edge.nodeEnd.isMarked) {
        if (this.doesFirstPathExist(graph, edge.nodeEnd, endingNode)) {
          return true;
        }
      }
    }

    // Un-mark the node, we might need to traverse with this node again
    graph.unmarkNodeById(startingNode.nodeKey);
    this.pathStack.pop();
    return false;
  }

  solveFirstPath(graph, startingNode, endingNode) {
    if (!this.doesFirstPathExist(graph, startingNode, endingNode)) {
      graph.clearMarkings();
      return null;
    }
    graph.clearMarkings();
    // remove first & last element
    this.pathStack.pop();
    this.pathStack.shift();
    return this.pathStack;
  }

  closestReachableUnvisited(graph, shortestPathMap) {
    let shortestDistance = Number.MAX_SAFE_INTEGER;
    let closestReachableNode = null;
    // eslint-disable-next-line no-empty
    for (const node of graph.getAllUnmarkedNodes()) {
      const currentDistance = shortestPathMap.get(node.node);
      if (currentDistance === Number.MAX_SAFE_INTEGER || currentDistance === undefined) continue;

      if (currentDistance < shortestDistance) {
        shortestDistance = currentDistance;
        closestReachableNode = node.node;
      }
    }
    return closestReachableNode;
  }

  solveDijkstraBlind(graph, startingNode, endingNode) {
    // eslint-disable-next-line no-param-reassign
    startingNode.distance = 0;
    const priorityQueue = new PriorityQueue();
    priorityQueue.enq(startingNode);
    graph.markNodeById(startingNode.nodeKey);
    while (!priorityQueue.isEmpty()) {
      const currentNode = priorityQueue.deq();
      for (const edge of graph.getIncidentEdgesbyId(startingNode.nodeKey)) {
        const node = edge.nodeEnd;
        if (!node.isMarked) {
          const newDistance = currentNode.distance + edge.weight;
          if (newDistance < node.distance) {
            // eslint-disable-next-line no-underscore-dangle
            removeItemOnce(priorityQueue._elements, node);
            node.distance = newDistance;
            node.predecessor = currentNode;
            priorityQueue.enq(node);
          }
        }
      }
      graph.markNodeById(currentNode.nodeKey);
    }
    return this.getShortestPathTo(graph.getNodeById(endingNode.nodeKey));
  }

  getShortestPathTo(endingNode) {
    let path = [];
    let currentNode = endingNode;
    while (currentNode.predecessor !== null) {
      path.push(currentNode);
      currentNode = currentNode.predecessor;
    }
    path = path.reverse();
    return path;
  }
}

export default MazeSolver;
