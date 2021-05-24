import { makeAutoObservable } from 'mobx';
import singletonGetter from './singletonGetter';
import NODE_STATES from '../Graph/NODE_STATES';

export default class MouseClickState {
  static get = singletonGetter(MouseClickState);

  isMouseDown = false;

  mouseType = NODE_STATES.FILLED;

  constructor() {
    makeAutoObservable(this);
  }

  setMouseState = (state) => {
    this.isMouseDown = state;
  };

  setMouseType = (state) => {
    this.mouseType = state;
  }

  getMouseType = () => this.mouseType;

  cycleMouseType = () => {
    this.mouseType += 1;
    if (this.mouseType > NODE_STATES.END) {
      this.mouseType = NODE_STATES.EMPTY;
    }
  };
}
