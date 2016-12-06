import Mediator from './Mediator';

export default class Energy {
  constructor () {
    this.value = 0;
    this.activate = false;
    this.max = 5;
    this.el = document.querySelector('.energy');
  }
  add() {
  }
  charge() {
    if (this.activate) return;
    if (this.value < this.max) {
      this.value += 0.05;
      const ratio = Math.abs(this.value / this.max);
      const r = (ratio) - 1.0;
      const value = r * r * r + 1.0;
      this.el.style.width = `${value * 100}%`;
      Mediator.emit('energy:charge', ratio);

    }
    if (this.value > this.max) {
      Mediator.emit('switch');
      this.activate = true;
    }


  }
  release() {
    this.value = 0;
    this.activate = false;
    this.el.style.width = `${this.value / this.max * 100}%`;
    Mediator.emit('energy:charge', 0);


  }
  update() {

  }
}
