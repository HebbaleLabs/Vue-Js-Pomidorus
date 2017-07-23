import Emitter from 'component-emitter';

export const DEFAULT_TYPE = 'default';
export const DEFAULT_DURATION = 25 * 60;
export const DEFAULT_INTERVAL = 1000;
export const EVENT_FINISH = 'finish';

export default class Pomodoro {
  constructor(options = {}) {
    this.type = options.type || DEFAULT_TYPE;
    this.duration = options.duration || DEFAULT_DURATION;
    this.interval = options.interval || DEFAULT_INTERVAL;

    this.state = 0;
    this.started = false;
    this.paused = false;
    this.pauses = {};
    this.timer = null;

    Emitter(this);
  }

  start() {
    if (this.started) { return; }

    this.started = true;

    const tick = this.tick.bind(this);
    this.timer = setInterval(tick, this.interval);
  }

  stop() {
    clearInterval(this.timer);
  }

  pause() {
    this.paused = true;
  }

  unpause() {
    this.paused = false;
  }

  tick() {
    if (this.paused) {
      const pauses = this.pauses;
      const current = this.state;

      pauses[current] = pauses[current] || 0;
      pauses[current] += 1;

      return;
    }

    if (this.isFinished) {
      this.stop();
      this.emit(EVENT_FINISH);
      return;
    }

    if (this.state >= this.duration) {
      this.state = this.duration;
    } else {
      this.state += 1;
    }
  }

  get clock() {
    const minutes = Math.round(this.state / 60);
    const seconds = this.state % 60;
    const m = (`0${minutes}`).slice(-2);
    const s = (`0${seconds}`).slice(-2);

    return `${m}:${s}`;
  }

  get isFinished() {
    return this.state >= this.duration;
  }
}
