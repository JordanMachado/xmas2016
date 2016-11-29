import ResourceLoader from 'resource-loader';
// import Resource from 'resource-loader/src/Resource';
// import b64 from 'resource-loader/src/b64';
import Emitter from 'component-emitter';

import THREE from 'three';
require('utils/THREE/OBJLoader')(THREE);

const objLoader = new THREE.OBJLoader();


const Url = window.URL || window.webkitURL;

const cache = {};

class Loader extends Emitter {
  constructor() {
    super();
    this.loader = new ResourceLoader();
    this.loaded = false;

    this._onLoadError = this._onLoadError.bind(this);
    this._onLoadProgress = this._onLoadProgress.bind(this);
    this._onLoadComplete = this._onLoadComplete.bind(this);

    this.loader.on('error', this._onLoadError);
    this.loader.on('progress', this._onLoadProgress);
    this.loader.on('complete', this._onLoadComplete);
    this.loader.before(this.beforeLoad);
    this.loader.after(this.afterLoad);

    this.file = cache;

    this.emit('load:start');
  }

  beforeLoad(resource, next) {
    // if cached, then set data and complete the resource
    if (cache[resource.name] && cache[resource.name]) {
      // console.log('beforeLoad', 1);
      resource.data = cache[resource.name].data;
      resource.complete();
    } else {
      // if not cached, wait for complete and store it in the cache.
      resource.once('complete', function onResourceComplete() {
        // console.log('beforeLoad2', resource.url, this);
        cache[this.name] = {};
        cache[this.name].data = this.data;
        cache[this.name].type = this.name.split('-')[0];
      });
    }

    next();

  }

  afterLoad(resource, next) {

    // console.log(
    //   'afterLoad',
    //   !!resource.data,
    //   resource,
    //   resource.name,
    //   resource.name.split('-')[0],
    //   resource.data.type
    // );

    if (!resource.data) {
      // console.log('no data');
      return next();
    }

    const type = resource.name.split('-')[0];

    switch (type) {
      case 'txr':
        cache[resource.name].resource = new THREE.Texture(resource.data);
        next();
        break;
      case 'obj':
        objLoader.load(Url.createObjectURL(new Blob([resource.data])), (object) => {
          cache[resource.name].resource = object;
          next();
        });
        break;
      case 'snd': {
        // const res = resource.xhr.response;
        // let byteArray;
        // if (res) {
        //   byteArray = new Uint8Array(res);
        // }
        // cache[resource.name].resource = Url.createObjectURL(
        //   new Blob([byteArray.buffer],
        //   { type: 'audio/mp3' })
        // );
        const audioElement = document.createElement('audio');
        audioElement.preload = 'auto';
        audioElement.src = resource.url;
        cache[resource.name].resource = audioElement;
        next();
        break;
      }
      default:
        next();
        break;
    }
    // return;
  }

  get(name) {
    if (cache[name]) {
      return cache[name].resource || cache[name].data;
    }
  }

  load(manifest) {
    manifest.forEach((file) => {
      this.loader.add(file, file);
    });
    this.loader.load();
  }

  _onLoadProgress(event) {
    this.emit('load:progress', event);
  }

  _onLoadComplete(event) {
    this.loaded = true;
    this.emit('load:complete', event);
  }

  _onLoadError(event) {
    this.emit('load:error', event);
  }
}
const loader = window.loader = new Loader();
export default loader;
