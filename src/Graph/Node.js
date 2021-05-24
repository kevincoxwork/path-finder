import { makeAutoObservable } from 'mobx';

class Node {
  constructor(nodeKey, nodeValue, xValue, yValue) {
    this.nodeKey = nodeKey;
    this.nodeValue = nodeValue;
    this.xValue = xValue;
    this.yValue = yValue;
    this.isMarked = false;
    this.predecessor = null;
    this.distance = Number.MAX_SAFE_INTEGER;
    makeAutoObservable(this);
  }

  setPredecessor(predecessor) {
    this.predecessor = predecessor;
  }

  setDistance(newDistance) {
    this.distance = newDistance;
  }
}
export default Node;
