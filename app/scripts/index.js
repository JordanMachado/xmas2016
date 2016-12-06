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
window.DEBUG = true;
let device;
let webGL;


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
  Ressources.load(manifest);

  if (window.DEBUG || window.DEVMODE) {
    window.gui = new dat.GUI();
  }
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
        touch: {},
      },
      controls: true,
    });
    const intro = document.querySelector('.intro');
    const start = document.querySelector('.btn');
    document.body.appendChild(webGL.renderer.domElement);
    start.addEventListener('click', () => {
      console.log('click');
      sound.fade(0, 0.4);
      webGL.start();
      TweenLite.to(intro, 1.5, {
        autoAlpha: 0,
      });
    });
    TweenLite.to(webGL.renderer.domElement, 2.5, {
      autoAlpha: 1,
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
