import WebGL from './WebGL';
import deviceType from 'ua-device-type';
import LOL from './LOL';
import domReady from 'domready';
import raf from 'raf';
import dat from 'dat-gui';
import 'gsap';
import manifest from './manifest';
import Ressources from './Ressources';
import sono from 'sono';

// Vars
window.DEBUG = false;
let device;
let webGL;

console.warn = function() {};
function animate() {
  raf(animate);
  webGL.render();
}

// Events
function resize() {
  webGL.resize(window.innerWidth, window.innerHeight);
}
// KeyBoard
function keyPress(e) {
  if (!webGL.params.events.keyboard.press) return;
  webGL.keyPress(e);
}
function keyDown(e) {
  if (!webGL.params.events.keyboard.down) return;
  webGL.keyDown(e);
}
function keyUp(e) {
  if (!webGL.params.events.keyboard.up) return;
  webGL.keyUp(e);
}
// Mouse
function click(e) {
  if (!webGL.params.events.mouse.click) return;
  webGL.click(e.clientX, e.clientY, e.timeStamp);
}
function mouseMove(e) {
  if (!webGL.params.events.mouse.move) return;
  webGL.mouseMove(e.clientX, e.clientY, e.timeStamp);
}
// Touch
function touchStart(e) {
  if (!webGL.params.events.touch.start) return;
  webGL.touchStart(e.touches);
}
function touchEnd(e) {
  if (!webGL.params.events.touch.end) return;
  webGL.touchEnd(e.touches);
}
function touchMove(e) {
  if (!webGL.params.events.touch.move) return;
  webGL.touchMove(e.touches);
}

domReady(() => {
  device = deviceType(navigator.userAgent);
  document.querySelector('html').classList.add(device);

  const sound = sono.createSound({
    id: 'foo',
    src: 'assets/sound/crepi.mp3',
    volume: 0.5,
    loop: true,
  });
  sound.play();

  if (window.DEBUG || window.DEVMODE) {
    window.gui = new dat.GUI();
  }

  const intro = document.querySelector('.intro');
  const title = document.querySelector('.intro h1');
  const start = document.querySelector('.btn');
  const loaderEl = document.querySelector('.loader');
  const headphoneEl = document.querySelector('.headphone');
  const progressEl = document.querySelector('.loader .progress');
  const instructionEl = document.querySelector('.instruction');
  const creditEl = document.querySelector('.credits');
  TweenLite.set(title, { y: -20 });
  TweenLite.set(loaderEl, { y: -30 });
  TweenLite.set(start, { y: -20 });
  TweenLite.set(headphoneEl, { y: -20 });
  TweenLite.to(title, 0.8, {
    y: 0,
    autoAlpha: 1,
    ease: Quad.easeOut,
    onComplete: () => {
      Ressources.load(manifest);
    },
  });
  TweenLite.to(headphoneEl, 0.8, {
    y: 0,
    autoAlpha: 1,
    delay: 0.5,
    ease: Quad.easeOut,
    onComplete: () => {
    },
  });


  TweenLite.to(loaderEl, 0.8, {
    y: '-50%',
    autoAlpha: 1,
    ease: Quad.easeOut,
    delay: 0.3,
  });
  Ressources.on('load:progress', (loader) => {
    progressEl.style.width = `${loader.progress}%`;
  });
  Ressources.on('load:complete', () => {
    // WebGL

    webGL = new WebGL({
      device,
      name: 'EXPERIMENT',
      postProcessing: true,
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      events: {
        keyboard: {
          down: true,
          up: true,
        },
        mouse: {
          move: true,
        },
        touch: {
          move: true,
        },
      },
      // controls: true,
    });

    document.body.appendChild(webGL.renderer.domElement);
    start.addEventListener('click', () => {
      TweenLite.delayedCall(0.5, () => {
        sound.fade(0, 0.4);
        webGL.start();
        TweenLite.set(instructionEl, { y: 20 });
        TweenLite.set(creditEl, { y: 20 });
        TweenLite.to(instructionEl, 1.2, {
          y: 0,
          autoAlpha: 1,
          delay: 0.7,
          ease: Quad.easeOut,
        });
        TweenLite.to(creditEl, 1.2, {
          y: 0,
          autoAlpha: 1,
          delay: 1.3,
          ease: Quad.easeOut,
        });
      });
      TweenLite.to(intro, 0.5, {
        autoAlpha: 0,
        ease: Quad.easeIn,
      });
      TweenLite.to(headphoneEl, 0.5, {
        autoAlpha: 0,
        ease: Quad.easeIn,
      });
    });
    //
    TweenLite.to(loaderEl, 0.8, {
      y: 20,
      autoAlpha: 0,
      ease: Quad.easeIn,
      delay: 1,
    });
    TweenLite.to(start, 0.8, {
      y: '-50%',
      autoAlpha: 1,
      delay: 1.7,
      ease: Quad.easeOut,
    });
    TweenLite.to(webGL.renderer.domElement, 2, {
      autoAlpha: 1,
      ease: Quad.easeOut,
    });
    // Events
    window.addEventListener('resize', resize);
    // KeyBoard
    window.addEventListener('keypress', keyPress);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    // Mouse
    window.addEventListener('click', click);
    window.addEventListener('mousemove', mouseMove);
    // Touch
    window.addEventListener('touchstart', touchStart);
    window.addEventListener('touchend', touchEnd);
    window.addEventListener('touchmove', touchMove);
      // let's start
    animate();
  });


  if (window.DEBUG) {
    const p = document.createElement('p');
    p.id = 'debug';
    p.innerHTML = 'DEBUG';
    document.body.appendChild(p);
  }

});
