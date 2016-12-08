import Mediator from './Mediator';

export default class Energy {
  constructor(device) {
    if (device !== 'desktop') {
      const touch = document.querySelector('.touchzone');
      touch.addEventListener('touchstart', () => {
        TweenLite.to(this, 2.0, {
          value: 5,
          onUpdate: () => {
            const ratio = Math.abs(this.value / this.max);
            const r = (ratio) - 1.0;
            const value = r * r * r + 1.0;
            this.el.style.width = `${value * 100}%`;
            Mediator.emit('energy:charge', ratio);
          },
          onComplete: () => {
            Mediator.emit('switch');
            this.activate = true;
          },
        });
      });
      touch.addEventListener('touchend', () => {
        TweenLite.killTweensOf(this);
        if (this.activate) {
          Mediator.emit('switch');
        }
        this.release();
      });
      // window.
    }
    this.value = 0;
    this.activate = false;
    this.max = 5;
    this.el = document.querySelector('.energy');
    this.animating = false;
  }
  add() {
  }
  charge() {
    if (this.activate) return;
    if(this.animating)
    TweenLite.killTweensOf(this)
    if (this.value < this.max) {
      this.value += 0.04;
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
    this.animating = true;
    TweenLite.killTweensOf(this)
    TweenLite.to(this, 0.5, {
      value: 0,
      onUpdate: () => {
        const ratio = Math.abs(this.value / this.max);
        const r = (ratio) - 1.0;
        const value = r * r * r + 1.0;
        this.el.style.width = `${value * 100}%`;
        Mediator.emit('energy:charge', ratio);
      },
      onComplete: () => {
        this.activate = false;
        this.animating = false;
      },
      ease: Expo.easeOut,
    });

  }
  update() {

  }
}
