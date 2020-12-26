import { makeAutoObservable } from 'mobx';
import singletonGetter from './singletonGetter';
import AdjacencyList from '../Graph/AdjacencyList';

export default class GridState {
  static get = singletonGetter(GridState);

  constructor() {
    makeAutoObservable(this);
    this.adjacencyList = new AdjacencyList(50, 50);
  }

  getGridState() {
    return this === undefined ? undefined : this.adjacencyList;
  }
}
