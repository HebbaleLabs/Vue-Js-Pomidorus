import Pomodoro, { DEFAULT_TYPE, EVENT_FINISH } from './pomodoro';
import Pending from './pending';

export const DEFAULT_GOAL = 25;
export const BREAK_TYPE = 'break';

export default class Focus {
  constructor(options = {}) {
    this.goal = options.goal || DEFAULT_GOAL;
    this.items = [];
    this.pomodoro = null;
  }

  push(item) {
    if (item instanceof Pomodoro) {
      this.pomodoro = item;
    }

    this.items.push(item);
  }

  rotate() {
    if (this.isEmpty) {
      const work = new Pomodoro();
      work.on(EVENT_FINISH, () => this.rotate());
      work.start();
      this.push(work);
    }

    if (this.isPomodoro && this.latest.isFinished) {
      const pending = new Pending();
      pending.start();
      this.push(pending);
    }
  }

  pause() {
    if (this.isPomodoro) {
      this.latest.pause();
    }
  }

  unpause() {
    if (this.isPomodoro) {
      this.latest.unpause();
    }
  }

  get latest() {
    const items = this.items;
    return items[items.length - 1];
  }

  get isEmpty() {
    return this.items.length === 0;
  }

  get isPomodoro() {
    return this.latest instanceof Pomodoro;
  }

  get isFinishedPomodoro() {
    if (this.isPomodoro) {
      return this.latest.isFinished;
    }

    return false;
  }

  get isPending() {
    return this.latest instanceof Pending;
  }

  get isWork() {
    if (this.isPomodoro) {
      return this.latest && this.latest.type === DEFAULT_TYPE;
    }

    return false;
  }

  get isBreak() {
    if (this.isPomodoro) {
      return this.latest && this.latest.type === BREAK_TYPE;
    }

    return false;
  }
}
