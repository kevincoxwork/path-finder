import { makeAutoObservable } from 'mobx';

class Node {
  constructor(nodeKey, nodeValue, xValue, yValue) {
    this.nodeKey = nodeKey;
    this.nodeValue = nodeValue;
    this.xValue = xValue;
    this.yValue = yValue;
    makeAutoObservable(this);
  }
}
export default Node;
