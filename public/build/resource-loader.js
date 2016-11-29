(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Loader = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MiniSignalBinding = (function () {
  function MiniSignalBinding(fn, once, thisArg) {
    if (once === undefined) once = false;

    _classCallCheck(this, MiniSignalBinding);

    this._fn = fn;
    this._once = once;
    this._thisArg = thisArg;
    this._next = this._prev = this._owner = null;
  }

  _createClass(MiniSignalBinding, [{
    key: 'detach',
    value: function detach() {
      if (this._owner === null) return false;
      this._owner.detach(this);
      return true;
    }
  }]);

  return MiniSignalBinding;
})();

function _addMiniSignalBinding(self, node) {
  if (!self._head) {
    self._head = node;
    self._tail = node;
  } else {
    self._tail._next = node;
    node._prev = self._tail;
    self._tail = node;
  }

  node._owner = self;

  return node;
}

var MiniSignal = (function () {
  function MiniSignal() {
    _classCallCheck(this, MiniSignal);

    this._head = this._tail = undefined;
  }

  _createClass(MiniSignal, [{
    key: 'handlers',
    value: function handlers() {
      var exists = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var node = this._head;

      if (exists) return !!node;

      var ee = [];

      while (node) {
        ee.push(node);
        node = node._next;
      }

      return ee;
    }
  }, {
    key: 'has',
    value: function has(node) {
      if (!(node instanceof MiniSignalBinding)) {
        throw new Error('MiniSignal#has(): First arg must be a MiniSignalBinding object.');
      }

      return node._owner === this;
    }
  }, {
    key: 'dispatch',
    value: function dispatch() {
      var node = this._head;

      if (!node) return false;

      while (node) {
        if (node._once) this.detach(node);
        node._fn.apply(node._thisArg, arguments);
        node = node._next;
      }

      return true;
    }
  }, {
    key: 'add',
    value: function add(fn) {
      var thisArg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#add(): First arg must be a Function.');
      }
      return _addMiniSignalBinding(this, new MiniSignalBinding(fn, false, thisArg));
    }
  }, {
    key: 'once',
    value: function once(fn) {
      var thisArg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#once(): First arg must be a Function.');
      }
      return _addMiniSignalBinding(this, new MiniSignalBinding(fn, true, thisArg));
    }
  }, {
    key: 'detach',
    value: function detach(node) {
      if (!(node instanceof MiniSignalBinding)) {
        throw new Error('MiniSignal#detach(): First arg must be a MiniSignalBinding object.');
      }
      if (node._owner !== this) return this;

      if (node._prev) node._prev._next = node._next;
      if (node._next) node._next._prev = node._prev;

      if (node === this._head) {
        this._head = node._next;
        if (node._next === null) {
          this._tail = null;
        }
      } else if (node === this._tail) {
        this._tail = node._prev;
        this._tail._next = null;
      }

      node._owner = null;
      return this;
    }
  }, {
    key: 'detachAll',
    value: function detachAll() {
      var node = this._head;
      if (!node) return this;

      this._head = this._tail = null;

      while (node) {
        node._owner = null;
        node = node._next;
      }
      return this;
    }
  }]);

  return MiniSignal;
})();

MiniSignal.MiniSignalBinding = MiniSignalBinding;

exports['default'] = MiniSignal;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict'

module.exports = function parseURI (str, opts) {
  opts = opts || {}

  var o = {
    key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
    q: {
      name: 'queryKey',
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  }

  var m = o.parser[opts.strictMode ? 'strict' : 'loose'].exec(str)
  var uri = {}
  var i = 14

  while (i--) uri[o.key[i]] = m[i] || ''

  uri[o.q.name] = {}
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2
  })

  return uri
}

},{}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _miniSignals = require('mini-signals');

var _miniSignals2 = _interopRequireDefault(_miniSignals);

var _parseUri = require('parse-uri');

var _parseUri2 = _interopRequireDefault(_parseUri);

var _async = require('./async');

var async = _interopRequireWildcard(_async);

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// some constants
var MAX_PROGRESS = 100;
var rgxExtractUrlHash = /(#[\w\-]+)?$/;

/**
 * Manages the state and loading of multiple resources to load.
 *
 * @class
 */

var Loader = function () {
    /**
     * @param {string} [baseUrl=''] - The base url for all resources loaded by this loader.
     * @param {number} [concurrency=10] - The number of resources to load concurrently.
     */
    function Loader() {
        var _this = this;

        var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var concurrency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

        _classCallCheck(this, Loader);

        /**
         * The base url for all resources loaded by this loader.
         *
         * @member {string}
         */
        this.baseUrl = baseUrl;

        /**
         * The progress percent of the loader going through the queue.
         *
         * @member {number}
         */
        this.progress = 0;

        /**
         * Loading state of the loader, true if it is currently loading resources.
         *
         * @member {boolean}
         */
        this.loading = false;

        /**
         * A querystring to append to every URL added to the loader.
         *
         * This should be a valid query string *without* the question-mark (`?`). The loader will
         * also *not* escape values for you. Make sure to escape your parameters with
         * [`encodeURIComponent`](https://mdn.io/encodeURIComponent) before assigning this property.
         *
         * @example
         *
         * ```js
         * const loader = new Loader();
         *
         * loader.defaultQueryString = 'user=me&password=secret';
         *
         * // This will request 'image.png?user=me&password=secret'
         * loader.add('image.png').load();
         *
         * loader.reset();
         *
         * // This will request 'image.png?v=1&user=me&password=secret'
         * loader.add('iamge.png?v=1').load();
         * ```
         */
        this.defaultQueryString = '';

        /**
         * The middleware to run before loading each resource.
         *
         * @member {function[]}
         */
        this._beforeMiddleware = [];

        /**
         * The middleware to run after loading each resource.
         *
         * @member {function[]}
         */
        this._afterMiddleware = [];

        /**
         * The `_loadResource` function bound with this object context.
         *
         * @private
         * @member {function}
         * @param {Resource} r - The resource to load
         * @param {Function} d - The dequeue function
         * @return {undefined}
         */
        this._boundLoadResource = function (r, d) {
            return _this._loadResource(r, d);
        };

        /**
         * The resources waiting to be loaded.
         *
         * @private
         * @member {Resource[]}
         */
        this._queue = async.queue(this._boundLoadResource, concurrency);

        this._queue.pause();

        /**
         * All the resources for this loader keyed by name.
         *
         * @member {object<string, Resource>}
         */
        this.resources = {};

        /**
         * Dispatched once per loaded or errored resource.
         *
         * The callback looks like {@link Loader.OnProgressSignal}.
         *
         * @member {Signal}
         */
        this.onProgress = new _miniSignals2.default();

        /**
         * Dispatched once per errored resource.
         *
         * The callback looks like {@link Loader.OnErrorSignal}.
         *
         * @member {Signal}
         */
        this.onError = new _miniSignals2.default();

        /**
         * Dispatched once per loaded resource.
         *
         * The callback looks like {@link Loader.OnLoadSignal}.
         *
         * @member {Signal}
         */
        this.onLoad = new _miniSignals2.default();

        /**
         * Dispatched when the loader begins to process the queue.
         *
         * The callback looks like {@link Loader.OnStartSignal}.
         *
         * @member {Signal}
         */
        this.onStart = new _miniSignals2.default();

        /**
         * Dispatched when the queued resources all load.
         *
         * The callback looks like {@link Loader.OnCompleteSignal}.
         *
         * @member {Signal}
         */
        this.onComplete = new _miniSignals2.default();

        /**
         * When the progress changes the loader and resource are disaptched.
         *
         * @memberof Loader
         * @callback OnProgressSignal
         * @param {Loader} loader - The loader the progress is advancing on.
         * @param {Resource} resource - The resource that has completed or failed to cause the progress to advance.
         */

        /**
         * When an error occurrs the loader and resource are disaptched.
         *
         * @memberof Loader
         * @callback OnErrorSignal
         * @param {Loader} loader - The loader the error happened in.
         * @param {Resource} resource - The resource that caused the error.
         */

        /**
         * When a load completes the loader and resource are disaptched.
         *
         * @memberof Loader
         * @callback OnLoadSignal
         * @param {Loader} loader - The loader that laoded the resource.
         * @param {Resource} resource - The resource that has completed loading.
         */

        /**
         * When the loader starts loading resources it dispatches this callback.
         *
         * @memberof Loader
         * @callback OnStartSignal
         * @param {Loader} loader - The loader that has started loading resources.
         */

        /**
         * When the loader completes loading resources it dispatches this callback.
         *
         * @memberof Loader
         * @callback OnCompleteSignal
         * @param {Loader} loader - The loader that has finished loading resources.
         */
    }

    /**
     * Adds a resource (or multiple resources) to the loader queue.
     *
     * This function can take a wide variety of different parameters. The only thing that is always
     * required the url to load. All the following will work:
     *
     * ```js
     * loader
     *     // normal param syntax
     *     .add('key', 'http://...', function () {})
     *     .add('http://...', function () {})
     *     .add('http://...')
     *
     *     // object syntax
     *     .add({
     *         name: 'key2',
     *         url: 'http://...'
     *     }, function () {})
     *     .add({
     *         url: 'http://...'
     *     }, function () {})
     *     .add({
     *         name: 'key3',
     *         url: 'http://...'
     *         onComplete: function () {}
     *     })
     *     .add({
     *         url: 'https://...',
     *         onComplete: function () {},
     *         crossOrigin: true
     *     })
     *
     *     // you can also pass an array of objects or urls or both
     *     .add([
     *         { name: 'key4', url: 'http://...', onComplete: function () {} },
     *         { url: 'http://...', onComplete: function () {} },
     *         'http://...'
     *     ])
     *
     *     // and you can use both params and options
     *     .add('key', 'http://...', { crossOrigin: true }, function () {})
     *     .add('http://...', { crossOrigin: true }, function () {});
     * ```
     *
     * @param {string} [name] - The name of the resource to load, if not passed the url is used.
     * @param {string} [url] - The url for this resource, relative to the baseUrl of this loader.
     * @param {object} [options] - The options for the load.
     * @param {boolean} [options.crossOrigin] - Is this request cross-origin? Default is to determine automatically.
     * @param {Resource.LOAD_TYPE} [options.loadType=Resource.LOAD_TYPE.XHR] - How should this resource be loaded?
     * @param {Resource.XHR_RESPONSE_TYPE} [options.xhrType=Resource.XHR_RESPONSE_TYPE.DEFAULT] - How should
     *      the data being loaded be interpreted when using XHR?
     * @param {object} [options.metadata] - Extra configuration for middleware and the Resource object.
     * @param {HTMLImageElement|HTMLAudioElement|HTMLVideoElement} [options.metadata.loadElement=null] - The
     *      element to use for loading, instead of creating one.
     * @param {boolean} [options.metadata.skipSource=false] - Skips adding source(s) to the load element. This
     *      is useful if you want to pass in a `loadElement` that you already added load sources to.
     * @param {function} [cb] - Function to call when this specific resource completes loading.
     * @return {Loader} Returns itself.
     */


    Loader.prototype.add = function add(name, url, options, cb) {
        // special case of an array of objects or urls
        if (Array.isArray(name)) {
            for (var i = 0; i < name.length; ++i) {
                this.add(name[i]);
            }

            return this;
        }

        // if an object is passed instead of params
        if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
            cb = url || name.callback || name.onComplete;
            options = name;
            url = name.url;
            name = name.name || name.key || name.url;
        }

        // case where no name is passed shift all args over by one.
        if (typeof url !== 'string') {
            cb = options;
            options = url;
            url = name;
        }

        // now that we shifted make sure we have a proper url.
        if (typeof url !== 'string') {
            throw new Error('No url passed to add resource to loader.');
        }

        // options are optional so people might pass a function and no options
        if (typeof options === 'function') {
            cb = options;
            options = null;
        }

        // if loading already you can only add resources that have a parent.
        if (this.loading && (!options || !options.parentResource)) {
            throw new Error('Cannot add resources while the loader is running.');
        }

        // check if resource already exists.
        if (this.resources[name]) {
            throw new Error('Resource named "' + name + '" already exists.');
        }

        // add base url if this isn't an absolute url
        url = this._prepareUrl(url);

        // create the store the resource
        this.resources[name] = new _Resource2.default(name, url, options);

        if (typeof cb === 'function') {
            this.resources[name].onAfterMiddleware.once(cb);
        }

        // if loading make sure to adjust progress chunks for that parent and its children
        if (this.loading) {
            var parent = options.parentResource;
            var fullChunk = parent.progressChunk * (parent.children.length + 1); // +1 for parent
            var eachChunk = fullChunk / (parent.children.length + 2); // +2 for parent & new child

            parent.children.push(this.resources[name]);
            parent.progressChunk = eachChunk;

            for (var _i = 0; _i < parent.children.length; ++_i) {
                parent.children[_i].progressChunk = eachChunk;
            }
        }

        // add the resource to the queue
        this._queue.push(this.resources[name]);

        return this;
    };

    /**
     * Sets up a middleware function that will run *before* the
     * resource is loaded.
     *
     * @method before
     * @param {function} fn - The middleware function to register.
     * @return {Loader} Returns itself.
     */


    Loader.prototype.pre = function pre(fn) {
        this._beforeMiddleware.push(fn);

        return this;
    };

    /**
     * Sets up a middleware function that will run *after* the
     * resource is loaded.
     *
     * @alias use
     * @method after
     * @param {function} fn - The middleware function to register.
     * @return {Loader} Returns itself.
     */


    Loader.prototype.use = function use(fn) {
        this._afterMiddleware.push(fn);

        return this;
    };

    /**
     * Resets the queue of the loader to prepare for a new load.
     *
     * @return {Loader} Returns itself.
     */


    Loader.prototype.reset = function reset() {
        this.progress = 0;
        this.loading = false;

        this._queue.kill();
        this._queue.pause();

        // abort all resource loads
        for (var k in this.resources) {
            var res = this.resources[k];

            if (res._onLoadBinding) {
                res._onLoadBinding.detach();
            }

            if (res.isLoading) {
                res.abort();
            }
        }

        this.resources = {};

        return this;
    };

    /**
     * Starts loading the queued resources.
     *
     * @param {function} [cb] - Optional callback that will be bound to the `complete` event.
     * @return {Loader} Returns itself.
     */


    Loader.prototype.load = function load(cb) {
        // register complete callback if they pass one
        if (typeof cb === 'function') {
            this.onComplete.once(cb);
        }

        // if the queue has already started we are done here
        if (this.loading) {
            return this;
        }

        // distribute progress chunks
        var chunk = 100 / this._queue._tasks.length;

        for (var i = 0; i < this._queue._tasks.length; ++i) {
            this._queue._tasks[i].data.progressChunk = chunk;
        }

        // update loading state
        this.loading = true;

        // notify of start
        this.onStart.dispatch(this);

        // start loading
        this._queue.resume();

        return this;
    };

    /**
     * Prepares a url for usage based on the configuration of this object
     *
     * @private
     * @param {string} url - The url to prepare.
     * @return {string} The prepared url.
     */


    Loader.prototype._prepareUrl = function _prepareUrl(url) {
        var parsedUrl = (0, _parseUri2.default)(url, { strictMode: true });
        var result = void 0;

        // absolute url, just use it as is.
        if (parsedUrl.protocol || !parsedUrl.path || url.indexOf('//') === 0) {
            result = url;
        }
        // if baseUrl doesn't end in slash and url doesn't start with slash, then add a slash inbetween
        else if (this.baseUrl.length && this.baseUrl.lastIndexOf('/') !== this.baseUrl.length - 1 && url.charAt(0) !== '/') {
                result = this.baseUrl + '/' + url;
            } else {
                result = this.baseUrl + url;
            }

        // if we need to add a default querystring, there is a bit more work
        if (this.defaultQueryString) {
            var hash = rgxExtractUrlHash.exec(result)[0];

            result = result.substr(0, result.length - hash.length);

            if (result.indexOf('?') !== -1) {
                result += '&' + this.defaultQueryString;
            } else {
                result += '?' + this.defaultQueryString;
            }

            result += hash;
        }

        return result;
    };

    /**
     * Loads a single resource.
     *
     * @private
     * @param {Resource} resource - The resource to load.
     * @param {function} dequeue - The function to call when we need to dequeue this item.
     */


    Loader.prototype._loadResource = function _loadResource(resource, dequeue) {
        var _this2 = this;

        resource._dequeue = dequeue;

        // run before middleware
        async.eachSeries(this._beforeMiddleware, function (fn, next) {
            fn.call(_this2, resource, function () {
                // if the before middleware marks the resource as complete,
                // break and don't process any more before middleware
                next(resource.isComplete ? {} : null);
            });
        }, function () {
            if (resource.isComplete) {
                _this2._onLoad(resource);
            } else {
                resource._onLoadBinding = resource.onComplete.once(_this2._onLoad, _this2);
                resource.load();
            }
        });
    };

    /**
     * Called once each resource has loaded.
     *
     * @private
     */


    Loader.prototype._onComplete = function _onComplete() {
        this.loading = false;

        this.onComplete.dispatch(this, this.resources);
    };

    /**
     * Called each time a resources is loaded.
     *
     * @private
     * @param {Resource} resource - The resource that was loaded
     */


    Loader.prototype._onLoad = function _onLoad(resource) {
        var _this3 = this;

        resource._onLoadBinding = null;

        // run middleware, this *must* happen before dequeue so sub-assets get added properly
        async.eachSeries(this._afterMiddleware, function (fn, next) {
            fn.call(_this3, resource, next);
        }, function () {
            resource.onAfterMiddleware.dispatch(resource);

            _this3.progress += resource.progressChunk;
            _this3.onProgress.dispatch(_this3, resource);

            if (resource.error) {
                _this3.onError.dispatch(resource.error, _this3, resource);
            } else {
                _this3.onLoad.dispatch(_this3, resource);
            }

            // remove this resource from the async queue
            resource._dequeue();

            // do completion check
            if (_this3._queue.idle()) {
                _this3.progress = MAX_PROGRESS;
                _this3._onComplete();
            }
        });
    };

    return Loader;
}();

exports.default = Loader;

},{"./Resource":4,"./async":5,"mini-signals":1,"parse-uri":2}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parseUri = require('parse-uri');

var _parseUri2 = _interopRequireDefault(_parseUri);

var _miniSignals = require('mini-signals');

var _miniSignals2 = _interopRequireDefault(_miniSignals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// tests is CORS is supported in XHR, if not we need to use XDR
var useXdr = !!(window.XDomainRequest && !('withCredentials' in new XMLHttpRequest()));
var tempAnchor = null;

// some status constants
var STATUS_NONE = 0;
var STATUS_OK = 200;
var STATUS_EMPTY = 204;

// noop
function _noop() {} /* empty */

/**
 * Manages the state and loading of a resource and all child resources.
 *
 * @class
 */

var Resource = function () {
    /**
     * Sets the load type to be used for a specific extension.
     *
     * @static
     * @param {string} extname - The extension to set the type for, e.g. "png" or "fnt"
     * @param {Resource.LOAD_TYPE} loadType - The load type to set it to.
     */
    Resource.setExtensionLoadType = function setExtensionLoadType(extname, loadType) {
        setExtMap(Resource._loadTypeMap, extname, loadType);
    };

    /**
     * Sets the load type to be used for a specific extension.
     *
     * @static
     * @param {string} extname - The extension to set the type for, e.g. "png" or "fnt"
     * @param {Resource.XHR_RESPONSE_TYPE} xhrType - The xhr type to set it to.
     */


    Resource.setExtensionXhrType = function setExtensionXhrType(extname, xhrType) {
        setExtMap(Resource._xhrTypeMap, extname, xhrType);
    };

    /**
     * @param {string} name - The name of the resource to load.
     * @param {string|string[]} url - The url for this resource, for audio/video loads you can pass
     *      an array of sources.
     * @param {object} [options] - The options for the load.
     * @param {string|boolean} [options.crossOrigin] - Is this request cross-origin? Default is to
     *      determine automatically.
     * @param {Resource.LOAD_TYPE} [options.loadType=Resource.LOAD_TYPE.XHR] - How should this resource
     *      be loaded?
     * @param {Resource.XHR_RESPONSE_TYPE} [options.xhrType=Resource.XHR_RESPONSE_TYPE.DEFAULT] - How
     *      should the data being loaded be interpreted when using XHR?
     * @param {object} [options.metadata] - Extra configuration for middleware and the Resource object.
     * @param {HTMLImageElement|HTMLAudioElement|HTMLVideoElement} [options.metadata.loadElement=null] - The
     *      element to use for loading, instead of creating one.
     * @param {boolean} [options.metadata.skipSource=false] - Skips adding source(s) to the load element. This
     *      is useful if you want to pass in a `loadElement` that you already added load sources to.
     */


    function Resource(name, url, options) {
        _classCallCheck(this, Resource);

        if (typeof name !== 'string' || typeof url !== 'string') {
            throw new Error('Both name and url are required for constructing a resource.');
        }

        options = options || {};

        /**
         * The state flags of this resource.
         *
         * @member {number}
         */
        this._flags = 0;

        // set data url flag, needs to be set early for some _determineX checks to work.
        this._setFlag(Resource.STATUS_FLAGS.DATA_URL, url.indexOf('data:') === 0);

        /**
         * The name of this resource.
         *
         * @member {string}
         * @readonly
         */
        this.name = name;

        /**
         * The url used to load this resource.
         *
         * @member {string}
         * @readonly
         */
        this.url = url;

        /**
         * The data that was loaded by the resource.
         *
         * @member {any}
         */
        this.data = null;

        /**
         * Is this request cross-origin? If unset, determined automatically.
         *
         * @member {string}
         */
        this.crossOrigin = options.crossOrigin === true ? 'anonymous' : options.crossOrigin;

        /**
         * The method of loading to use for this resource.
         *
         * @member {Resource.LOAD_TYPE}
         */
        this.loadType = options.loadType || this._determineLoadType();

        /**
         * The type used to load the resource via XHR. If unset, determined automatically.
         *
         * @member {string}
         */
        this.xhrType = options.xhrType;

        /**
         * Extra info for middleware, and controlling specifics about how the resource loads.
         *
         * Note that if you pass in a `loadElement`, the Resource class takes ownership of it.
         * Meaning it will modify it as it sees fit.
         *
         * @member {object}
         * @property {HTMLImageElement|HTMLAudioElement|HTMLVideoElement} [loadElement=null] - The
         *  element to use for loading, instead of creating one.
         * @property {boolean} [skipSource=false] - Skips adding source(s) to the load element. This
         *  is useful if you want to pass in a `loadElement` that you already added load sources
         *  to.
         */
        this.metadata = options.metadata || {};

        /**
         * The error that occurred while loading (if any).
         *
         * @member {Error}
         * @readonly
         */
        this.error = null;

        /**
         * The XHR object that was used to load this resource. This is only set
         * when `loadType` is `Resource.LOAD_TYPE.XHR`.
         *
         * @member {XMLHttpRequest}
         * @readonly
         */
        this.xhr = null;

        /**
         * The child resources this resource owns.
         *
         * @member {Resource[]}
         * @readonly
         */
        this.children = [];

        /**
         * The resource type.
         *
         * @member {Resource.TYPE}
         * @readonly
         */
        this.type = Resource.TYPE.UNKNOWN;

        /**
         * The progress chunk owned by this resource.
         *
         * @member {number}
         * @readonly
         */
        this.progressChunk = 0;

        /**
         * The `dequeue` method that will be used a storage place for the async queue dequeue method
         * used privately by the loader.
         *
         * @private
         * @member {function}
         */
        this._dequeue = _noop;

        /**
         * Used a storage place for the on load binding used privately by the loader.
         *
         * @private
         * @member {function}
         */
        this._onLoadBinding = null;

        /**
         * The `complete` function bound to this resource's context.
         *
         * @private
         * @member {function}
         */
        this._boundComplete = this.complete.bind(this);

        /**
         * The `_onError` function bound to this resource's context.
         *
         * @private
         * @member {function}
         */
        this._boundOnError = this._onError.bind(this);

        /**
         * The `_onProgress` function bound to this resource's context.
         *
         * @private
         * @member {function}
         */
        this._boundOnProgress = this._onProgress.bind(this);

        // xhr callbacks
        this._boundXhrOnError = this._xhrOnError.bind(this);
        this._boundXhrOnAbort = this._xhrOnAbort.bind(this);
        this._boundXhrOnLoad = this._xhrOnLoad.bind(this);
        this._boundXdrOnTimeout = this._xdrOnTimeout.bind(this);

        /**
         * Dispatched when the resource beings to load.
         *
         * The callback looks like {@link Resource.OnStartSignal}.
         *
         * @member {Signal}
         */
        this.onStart = new _miniSignals2.default();

        /**
         * Dispatched each time progress of this resource load updates.
         * Not all resources types and loader systems can support this event
         * so sometimes it may not be available. If the resource
         * is being loaded on a modern browser, using XHR, and the remote server
         * properly sets Content-Length headers, then this will be available.
         *
         * The callback looks like {@link Resource.OnProgressSignal}.
         *
         * @member {Signal}
         */
        this.onProgress = new _miniSignals2.default();

        /**
         * Dispatched once this resource has loaded, if there was an error it will
         * be in the `error` property.
         *
         * The callback looks like {@link Resource.OnCompleteSignal}.
         *
         * @member {Signal}
         */
        this.onComplete = new _miniSignals2.default();

        /**
         * Dispatched after this resource has had all the *after* middleware run on it.
         *
         * The callback looks like {@link Resource.OnCompleteSignal}.
         *
         * @member {Signal}
         */
        this.onAfterMiddleware = new _miniSignals2.default();

        /**
         * When the resource starts to load.
         *
         * @memberof Resource
         * @callback OnStartSignal
         * @param {Resource} resource - The resource that the event happened on.
         */

        /**
         * When the resource reports loading progress.
         *
         * @memberof Resource
         * @callback OnProgressSignal
         * @param {Resource} resource - The resource that the event happened on.
         * @param {number} percentage - The progress of the load in the range [0, 1].
         */

        /**
         * When the resource finishes loading.
         *
         * @memberof Resource
         * @callback OnCompleteSignal
         * @param {Resource} resource - The resource that the event happened on.
         */
    }

    /**
     * Stores whether or not this url is a data url.
     *
     * @member {boolean}
     * @readonly
     */


    /**
     * Marks the resource as complete.
     *
     */
    Resource.prototype.complete = function complete() {
        // TODO: Clean this up in a wrapper or something...gross....
        if (this.data && this.data.removeEventListener) {
            this.data.removeEventListener('error', this._boundOnError, false);
            this.data.removeEventListener('load', this._boundComplete, false);
            this.data.removeEventListener('progress', this._boundOnProgress, false);
            this.data.removeEventListener('canplaythrough', this._boundComplete, false);
        }

        if (this.xhr) {
            if (this.xhr.removeEventListener) {
                this.xhr.removeEventListener('error', this._boundXhrOnError, false);
                this.xhr.removeEventListener('abort', this._boundXhrOnAbort, false);
                this.xhr.removeEventListener('progress', this._boundOnProgress, false);
                this.xhr.removeEventListener('load', this._boundXhrOnLoad, false);
            } else {
                this.xhr.onerror = null;
                this.xhr.ontimeout = null;
                this.xhr.onprogress = null;
                this.xhr.onload = null;
            }
        }

        if (this.isComplete) {
            throw new Error('Complete called again for an already completed resource.');
        }

        this._setFlag(Resource.STATUS_FLAGS.COMPLETE, true);
        this._setFlag(Resource.STATUS_FLAGS.LOADING, false);

        this.onComplete.dispatch(this);
    };

    /**
     * Aborts the loading of this resource, with an optional message.
     *
     * @param {string} message - The message to use for the error
     */


    Resource.prototype.abort = function abort(message) {
        // abort can be called multiple times, ignore subsequent calls.
        if (this.error) {
            return;
        }

        // store error
        this.error = new Error(message);

        // abort the actual loading
        if (this.xhr) {
            this.xhr.abort();
        } else if (this.xdr) {
            this.xdr.abort();
        } else if (this.data) {
            // single source
            if (this.data.src) {
                this.data.src = Resource.EMPTY_GIF;
            }
            // multi-source
            else {
                    while (this.data.firstChild) {
                        this.data.removeChild(this.data.firstChild);
                    }
                }
        }

        // done now.
        this.complete();
    };

    /**
     * Kicks off loading of this resource. This method is asynchronous.
     *
     * @param {function} [cb] - Optional callback to call once the resource is loaded.
     */


    Resource.prototype.load = function load(cb) {
        var _this = this;

        if (this.isLoading) {
            return;
        }

        if (this.isComplete) {
            if (cb) {
                setTimeout(function () {
                    return cb(_this);
                }, 1);
            }

            return;
        } else if (cb) {
            this.onComplete.once(cb);
        }

        this._setFlag(Resource.STATUS_FLAGS.LOADING, true);

        this.onStart.dispatch(this);

        // if unset, determine the value
        if (this.crossOrigin === false || typeof this.crossOrigin !== 'string') {
            this.crossOrigin = this._determineCrossOrigin(this.url);
        }

        switch (this.loadType) {
            case Resource.LOAD_TYPE.IMAGE:
                this.type = Resource.TYPE.IMAGE;
                this._loadElement('image');
                break;

            case Resource.LOAD_TYPE.AUDIO:
                this.type = Resource.TYPE.AUDIO;
                this._loadSourceElement('audio');
                break;

            case Resource.LOAD_TYPE.VIDEO:
                this.type = Resource.TYPE.VIDEO;
                this._loadSourceElement('video');
                break;

            case Resource.LOAD_TYPE.XHR:
            /* falls through */
            default:
                if (useXdr && this.crossOrigin) {
                    this._loadXdr();
                } else {
                    this._loadXhr();
                }
                break;
        }
    };

    /**
     * Checks if the flag is set.
     *
     * @private
     * @param {number} flag - The flag to check.
     * @return {boolean} True if the flag is set.
     */


    Resource.prototype._hasFlag = function _hasFlag(flag) {
        return !!(this._flags & flag);
    };

    /**
     * (Un)Sets the flag.
     *
     * @private
     * @param {number} flag - The flag to (un)set.
     * @param {boolean} value - Whether to set or (un)set the flag.
     */


    Resource.prototype._setFlag = function _setFlag(flag, value) {
        this._flags = value ? this._flags | flag : this._flags & ~flag;
    };

    /**
     * Loads this resources using an element that has a single source,
     * like an HTMLImageElement.
     *
     * @private
     * @param {string} type - The type of element to use.
     */


    Resource.prototype._loadElement = function _loadElement(type) {
        if (this.metadata.loadElement) {
            this.data = this.metadata.loadElement;
        } else if (type === 'image' && typeof window.Image !== 'undefined') {
            this.data = new Image();
        } else {
            this.data = document.createElement(type);
        }

        if (this.crossOrigin) {
            this.data.crossOrigin = this.crossOrigin;
        }

        if (!this.metadata.skipSource) {
            this.data.src = this.url;
        }

        this.data.addEventListener('error', this._boundOnError, false);
        this.data.addEventListener('load', this._boundComplete, false);
        this.data.addEventListener('progress', this._boundOnProgress, false);
    };

    /**
     * Loads this resources using an element that has multiple sources,
     * like an HTMLAudioElement or HTMLVideoElement.
     *
     * @private
     * @param {string} type - The type of element to use.
     */


    Resource.prototype._loadSourceElement = function _loadSourceElement(type) {
        if (this.metadata.loadElement) {
            this.data = this.metadata.loadElement;
        } else if (type === 'audio' && typeof window.Audio !== 'undefined') {
            this.data = new Audio();
        } else {
            this.data = document.createElement(type);
        }

        if (this.data === null) {
            this.abort('Unsupported element: ' + type);

            return;
        }

        if (!this.metadata.skipSource) {
            // support for CocoonJS Canvas+ runtime, lacks document.createElement('source')
            if (navigator.isCocoonJS) {
                this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
            } else if (Array.isArray(this.url)) {
                for (var i = 0; i < this.url.length; ++i) {
                    this.data.appendChild(this._createSource(type, this.url[i]));
                }
            } else {
                this.data.appendChild(this._createSource(type, this.url));
            }
        }

        this.data.addEventListener('error', this._boundOnError, false);
        this.data.addEventListener('load', this._boundComplete, false);
        this.data.addEventListener('progress', this._boundOnProgress, false);
        this.data.addEventListener('canplaythrough', this._boundComplete, false);

        this.data.load();
    };

    /**
     * Loads this resources using an XMLHttpRequest.
     *
     * @private
     */


    Resource.prototype._loadXhr = function _loadXhr() {
        // if unset, determine the value
        if (typeof this.xhrType !== 'string') {
            this.xhrType = this._determineXhrType();
        }

        var xhr = this.xhr = new XMLHttpRequest();

        // set the request type and url
        xhr.open('GET', this.url, true);

        // load json as text and parse it ourselves. We do this because some browsers
        // *cough* safari *cough* can't deal with it.
        if (this.xhrType === Resource.XHR_RESPONSE_TYPE.JSON || this.xhrType === Resource.XHR_RESPONSE_TYPE.DOCUMENT) {
            xhr.responseType = Resource.XHR_RESPONSE_TYPE.TEXT;
        } else {
            xhr.responseType = this.xhrType;
        }

        xhr.addEventListener('error', this._boundXhrOnError, false);
        xhr.addEventListener('abort', this._boundXhrOnAbort, false);
        xhr.addEventListener('progress', this._boundOnProgress, false);
        xhr.addEventListener('load', this._boundXhrOnLoad, false);

        xhr.send();
    };

    /**
     * Loads this resources using an XDomainRequest. This is here because we need to support IE9 (gross).
     *
     * @private
     */


    Resource.prototype._loadXdr = function _loadXdr() {
        // if unset, determine the value
        if (typeof this.xhrType !== 'string') {
            this.xhrType = this._determineXhrType();
        }

        var xdr = this.xhr = new XDomainRequest();

        // XDomainRequest has a few quirks. Occasionally it will abort requests
        // A way to avoid this is to make sure ALL callbacks are set even if not used
        // More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
        xdr.timeout = 5000;

        xdr.onerror = this._boundXhrOnError;
        xdr.ontimeout = this._boundXdrOnTimeout;
        xdr.onprogress = this._boundOnProgress;
        xdr.onload = this._boundXhrOnLoad;

        xdr.open('GET', this.url, true);

        // Note: The xdr.send() call is wrapped in a timeout to prevent an
        // issue with the interface where some requests are lost if multiple
        // XDomainRequests are being sent at the same time.
        // Some info here: https://github.com/photonstorm/phaser/issues/1248
        setTimeout(function () {
            return xdr.send();
        }, 1);
    };

    /**
     * Creates a source used in loading via an element.
     *
     * @private
     * @param {string} type - The element type (video or audio).
     * @param {string} url - The source URL to load from.
     * @param {string} [mime] - The mime type of the video
     * @return {HTMLSourceElement} The source element.
     */


    Resource.prototype._createSource = function _createSource(type, url, mime) {
        if (!mime) {
            mime = type + '/' + url.substr(url.lastIndexOf('.') + 1);
        }

        var source = document.createElement('source');

        source.src = url;
        source.type = mime;

        return source;
    };

    /**
     * Called if a load errors out.
     *
     * @param {Event} event - The error event from the element that emits it.
     * @private
     */


    Resource.prototype._onError = function _onError(event) {
        this.abort('Failed to load element using: ' + event.target.nodeName);
    };

    /**
     * Called if a load progress event fires for xhr/xdr.
     *
     * @private
     * @param {XMLHttpRequestProgressEvent|Event} event - Progress event.
     */


    Resource.prototype._onProgress = function _onProgress(event) {
        if (event && event.lengthComputable) {
            this.onProgress.dispatch(this, event.loaded / event.total);
        }
    };

    /**
     * Called if an error event fires for xhr/xdr.
     *
     * @private
     * @param {XMLHttpRequestErrorEvent|Event} event - Error event.
     */


    Resource.prototype._xhrOnError = function _xhrOnError() {
        var xhr = this.xhr;

        this.abort(reqType(xhr) + ' Request failed. Status: ' + xhr.status + ', text: "' + xhr.statusText + '"');
    };

    /**
     * Called if an abort event fires for xhr.
     *
     * @private
     * @param {XMLHttpRequestAbortEvent} event - Abort Event
     */


    Resource.prototype._xhrOnAbort = function _xhrOnAbort() {
        this.abort(reqType(this.xhr) + ' Request was aborted by the user.');
    };

    /**
     * Called if a timeout event fires for xdr.
     *
     * @private
     * @param {Event} event - Timeout event.
     */


    Resource.prototype._xdrOnTimeout = function _xdrOnTimeout() {
        this.abort(reqType(this.xhr) + ' Request timed out.');
    };

    /**
     * Called when data successfully loads from an xhr/xdr request.
     *
     * @private
     * @param {XMLHttpRequestLoadEvent|Event} event - Load event
     */


    Resource.prototype._xhrOnLoad = function _xhrOnLoad() {
        var xhr = this.xhr;
        var status = typeof xhr.status === 'undefined' ? xhr.status : STATUS_OK; // XDR has no `.status`, assume 200.

        // status can be 0 when using the `file://` protocol so we also check if a response is set
        if (status === STATUS_OK || status === STATUS_EMPTY || status === STATUS_NONE && xhr.responseText.length > 0) {
            // if text, just return it
            if (this.xhrType === Resource.XHR_RESPONSE_TYPE.TEXT) {
                this.data = xhr.responseText;
                this.type = Resource.TYPE.TEXT;
            }
            // if json, parse into json object
            else if (this.xhrType === Resource.XHR_RESPONSE_TYPE.JSON) {
                    try {
                        this.data = JSON.parse(xhr.responseText);
                        this.type = Resource.TYPE.JSON;
                    } catch (e) {
                        this.abort('Error trying to parse loaded json: ' + e);

                        return;
                    }
                }
                // if xml, parse into an xml document or div element
                else if (this.xhrType === Resource.XHR_RESPONSE_TYPE.DOCUMENT) {
                        try {
                            if (window.DOMParser) {
                                var domparser = new DOMParser();

                                this.data = domparser.parseFromString(xhr.responseText, 'text/xml');
                            } else {
                                var div = document.createElement('div');

                                div.innerHTML = xhr.responseText;

                                this.data = div;
                            }

                            this.type = Resource.TYPE.XML;
                        } catch (e) {
                            this.abort('Error trying to parse loaded xml: ' + e);

                            return;
                        }
                    }
                    // other types just return the response
                    else {
                            this.data = xhr.response || xhr.responseText;
                        }
        } else {
            this.abort('[' + xhr.status + '] ' + xhr.statusText + ': ' + xhr.responseURL);

            return;
        }

        this.complete();
    };

    /**
     * Sets the `crossOrigin` property for this resource based on if the url
     * for this resource is cross-origin. If crossOrigin was manually set, this
     * function does nothing.
     *
     * @private
     * @param {string} url - The url to test.
     * @param {object} [loc=window.location] - The location object to test against.
     * @return {string} The crossOrigin value to use (or empty string for none).
     */


    Resource.prototype._determineCrossOrigin = function _determineCrossOrigin(url, loc) {
        // data: and javascript: urls are considered same-origin
        if (url.indexOf('data:') === 0) {
            return '';
        }

        // default is window.location
        loc = loc || window.location;

        if (!tempAnchor) {
            tempAnchor = document.createElement('a');
        }

        // let the browser determine the full href for the url of this resource and then
        // parse with the node url lib, we can't use the properties of the anchor element
        // because they don't work in IE9 :(
        tempAnchor.href = url;
        url = (0, _parseUri2.default)(tempAnchor.href, { strictMode: true });

        var samePort = !url.port && loc.port === '' || url.port === loc.port;
        var protocol = url.protocol ? url.protocol + ':' : '';

        // if cross origin
        if (url.host !== loc.hostname || !samePort || protocol !== loc.protocol) {
            return 'anonymous';
        }

        return '';
    };

    /**
     * Determines the responseType of an XHR request based on the extension of the
     * resource being loaded.
     *
     * @private
     * @return {Resource.XHR_RESPONSE_TYPE} The responseType to use.
     */


    Resource.prototype._determineXhrType = function _determineXhrType() {
        return Resource._xhrTypeMap[this._getExtension()] || Resource.XHR_RESPONSE_TYPE.TEXT;
    };

    /**
     * Determines the loadType of a resource based on the extension of the
     * resource being loaded.
     *
     * @private
     * @return {Resource.LOAD_TYPE} The loadType to use.
     */


    Resource.prototype._determineLoadType = function _determineLoadType() {
        return Resource._loadTypeMap[this._getExtension()] || Resource.LOAD_TYPE.XHR;
    };

    /**
     * Extracts the extension (sans '.') of the file being loaded by the resource.
     *
     * @private
     * @return {string} The extension.
     */


    Resource.prototype._getExtension = function _getExtension() {
        var url = this.url;
        var ext = '';

        if (this.isDataUrl) {
            var slashIndex = url.indexOf('/');

            ext = url.substring(slashIndex + 1, url.indexOf(';', slashIndex));
        } else {
            var queryStart = url.indexOf('?');

            if (queryStart !== -1) {
                url = url.substring(0, queryStart);
            }

            ext = url.substring(url.lastIndexOf('.') + 1);
        }

        return ext.toLowerCase();
    };

    /**
     * Determines the mime type of an XHR request based on the responseType of
     * resource being loaded.
     *
     * @private
     * @param {Resource.XHR_RESPONSE_TYPE} type - The type to get a mime type for.
     * @return {string} The mime type to use.
     */


    Resource.prototype._getMimeFromXhrType = function _getMimeFromXhrType(type) {
        switch (type) {
            case Resource.XHR_RESPONSE_TYPE.BUFFER:
                return 'application/octet-binary';

            case Resource.XHR_RESPONSE_TYPE.BLOB:
                return 'application/blob';

            case Resource.XHR_RESPONSE_TYPE.DOCUMENT:
                return 'application/xml';

            case Resource.XHR_RESPONSE_TYPE.JSON:
                return 'application/json';

            case Resource.XHR_RESPONSE_TYPE.DEFAULT:
            case Resource.XHR_RESPONSE_TYPE.TEXT:
            /* falls through */
            default:
                return 'text/plain';

        }
    };

    _createClass(Resource, [{
        key: 'isDataUrl',
        get: function get() {
            return this._hasFlag(Resource.STATUS_FLAGS.DATA_URL);
        }

        /**
         * Describes if this resource has finished loading. Is true when the resource has completely
         * loaded.
         *
         * @member {boolean}
         * @readonly
         */

    }, {
        key: 'isComplete',
        get: function get() {
            return this._hasFlag(Resource.STATUS_FLAGS.COMPLETE);
        }

        /**
         * Describes if this resource is currently loading. Is true when the resource starts loading,
         * and is false again when complete.
         *
         * @member {boolean}
         * @readonly
         */

    }, {
        key: 'isLoading',
        get: function get() {
            return this._hasFlag(Resource.STATUS_FLAGS.LOADING);
        }
    }]);

    return Resource;
}();

/**
 * The types of resources a resource could represent.
 *
 * @static
 * @readonly
 * @enum {number}
 */


exports.default = Resource;
Resource.STATUS_FLAGS = {
    NONE: 0,
    DATA_URL: 1 << 0,
    COMPLETE: 1 << 1,
    LOADING: 1 << 2
};

/**
 * The types of resources a resource could represent.
 *
 * @static
 * @readonly
 * @enum {number}
 */
Resource.TYPE = {
    UNKNOWN: 0,
    JSON: 1,
    XML: 2,
    IMAGE: 3,
    AUDIO: 4,
    VIDEO: 5,
    TEXT: 6
};

/**
 * The types of loading a resource can use.
 *
 * @static
 * @readonly
 * @enum {number}
 */
Resource.LOAD_TYPE = {
    /** Uses XMLHttpRequest to load the resource. */
    XHR: 1,
    /** Uses an `Image` object to load the resource. */
    IMAGE: 2,
    /** Uses an `Audio` object to load the resource. */
    AUDIO: 3,
    /** Uses a `Video` object to load the resource. */
    VIDEO: 4
};

/**
 * The XHR ready states, used internally.
 *
 * @static
 * @readonly
 * @enum {string}
 */
Resource.XHR_RESPONSE_TYPE = {
    /** string */
    DEFAULT: 'text',
    /** ArrayBuffer */
    BUFFER: 'arraybuffer',
    /** Blob */
    BLOB: 'blob',
    /** Document */
    DOCUMENT: 'document',
    /** Object */
    JSON: 'json',
    /** String */
    TEXT: 'text'
};

Resource._loadTypeMap = {
    // images
    gif: Resource.LOAD_TYPE.IMAGE,
    png: Resource.LOAD_TYPE.IMAGE,
    bmp: Resource.LOAD_TYPE.IMAGE,
    jpg: Resource.LOAD_TYPE.IMAGE,
    jpeg: Resource.LOAD_TYPE.IMAGE,
    tif: Resource.LOAD_TYPE.IMAGE,
    tiff: Resource.LOAD_TYPE.IMAGE,
    webp: Resource.LOAD_TYPE.IMAGE,
    tga: Resource.LOAD_TYPE.IMAGE,
    svg: Resource.LOAD_TYPE.IMAGE,
    'svg+xml': Resource.LOAD_TYPE.IMAGE, // for SVG data urls

    // audio
    mp3: Resource.LOAD_TYPE.AUDIO,
    ogg: Resource.LOAD_TYPE.AUDIO,
    wav: Resource.LOAD_TYPE.AUDIO,

    // videos
    mp4: Resource.LOAD_TYPE.VIDEO,
    webm: Resource.LOAD_TYPE.VIDEO
};

Resource._xhrTypeMap = {
    // xml
    xhtml: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    html: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    htm: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    xml: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    tmx: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    svg: Resource.XHR_RESPONSE_TYPE.DOCUMENT,

    // This was added to handle Tiled Tileset XML, but .tsx is also a TypeScript React Component.
    // Since it is way less likely for people to be loading TypeScript files instead of Tiled files,
    // this should probably be fine.
    tsx: Resource.XHR_RESPONSE_TYPE.DOCUMENT,

    // images
    gif: Resource.XHR_RESPONSE_TYPE.BLOB,
    png: Resource.XHR_RESPONSE_TYPE.BLOB,
    bmp: Resource.XHR_RESPONSE_TYPE.BLOB,
    jpg: Resource.XHR_RESPONSE_TYPE.BLOB,
    jpeg: Resource.XHR_RESPONSE_TYPE.BLOB,
    tif: Resource.XHR_RESPONSE_TYPE.BLOB,
    tiff: Resource.XHR_RESPONSE_TYPE.BLOB,
    webp: Resource.XHR_RESPONSE_TYPE.BLOB,
    tga: Resource.XHR_RESPONSE_TYPE.BLOB,

    // json
    json: Resource.XHR_RESPONSE_TYPE.JSON,

    // text
    text: Resource.XHR_RESPONSE_TYPE.TEXT,
    txt: Resource.XHR_RESPONSE_TYPE.TEXT,

    // fonts
    ttf: Resource.XHR_RESPONSE_TYPE.BUFFER,
    otf: Resource.XHR_RESPONSE_TYPE.BUFFER
};

// We can't set the `src` attribute to empty string, so on abort we set it to this 1px transparent gif
Resource.EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

/**
 * Quick helper to set a value on one of the extension maps. Ensures there is no
 * dot at the start of the extension.
 *
 * @ignore
 * @param {object} map - The map to set on.
 * @param {string} extname - The extension (or key) to set.
 * @param {number} val - The value to set.
 */
function setExtMap(map, extname, val) {
    if (extname && extname.indexOf('.') === 0) {
        extname = extname.substring(1);
    }

    if (!extname) {
        return;
    }

    map[extname] = val;
}

/**
 * Quick helper to get string xhr type.
 *
 * @ignore
 * @param {XMLHttpRequest|XDomainRequest} xhr - The request to check.
 * @return {string} The type.
 */
function reqType(xhr) {
    return xhr.toString().replace('object ', '');
}

},{"mini-signals":1,"parse-uri":2}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.eachSeries = eachSeries;
exports.queue = queue;
/**
 * Smaller version of the async library constructs.
 *
 */
function _noop() {} /* empty */

/**
 * Iterates an array in series.
 *
 * @param {*[]} array - Array to iterate.
 * @param {function} iterator - Function to call for each element.
 * @param {function} callback - Function to call when done, or on error.
 */
function eachSeries(array, iterator, callback) {
    var i = 0;
    var len = array.length;

    (function next(err) {
        if (err || i === len) {
            if (callback) {
                callback(err);
            }

            return;
        }

        iterator(array[i++], next);
    })();
}

/**
 * Ensures a function is only called once.
 *
 * @param {function} fn - The function to wrap.
 * @return {function} The wrapping function.
 */
function onlyOnce(fn) {
    return function onceWrapper() {
        if (fn === null) {
            throw new Error('Callback was already called.');
        }

        var callFn = fn;

        fn = null;
        callFn.apply(this, arguments);
    };
}

/**
 * Async queue implementation,
 *
 * @param {function} worker - The worker function to call for each task.
 * @param {number} concurrency - How many workers to run in parrallel.
 * @return {*} The async queue object.
 */
function queue(worker, concurrency) {
    if (concurrency == null) {
        // eslint-disable-line no-eq-null,eqeqeq
        concurrency = 1;
    } else if (concurrency === 0) {
        throw new Error('Concurrency must not be zero');
    }

    var workers = 0;
    var q = {
        _tasks: [],
        concurrency: concurrency,
        saturated: _noop,
        unsaturated: _noop,
        buffer: concurrency / 4,
        empty: _noop,
        drain: _noop,
        error: _noop,
        started: false,
        paused: false,
        push: function push(data, callback) {
            _insert(data, false, callback);
        },
        kill: function kill() {
            workers = 0;
            q.drain = _noop;
            q.started = false;
            q._tasks = [];
        },
        unshift: function unshift(data, callback) {
            _insert(data, true, callback);
        },
        process: function process() {
            while (!q.paused && workers < q.concurrency && q._tasks.length) {
                var task = q._tasks.shift();

                if (q._tasks.length === 0) {
                    q.empty();
                }

                workers += 1;

                if (workers === q.concurrency) {
                    q.saturated();
                }

                worker(task.data, onlyOnce(_next(task)));
            }
        },
        length: function length() {
            return q._tasks.length;
        },
        running: function running() {
            return workers;
        },
        idle: function idle() {
            return q._tasks.length + workers === 0;
        },
        pause: function pause() {
            if (q.paused === true) {
                return;
            }

            q.paused = true;
        },
        resume: function resume() {
            if (q.paused === false) {
                return;
            }

            q.paused = false;

            // Need to call q.process once per concurrent
            // worker to preserve full concurrency after pause
            for (var w = 1; w <= q.concurrency; w++) {
                q.process();
            }
        }
    };

    function _insert(data, insertAtFront, callback) {
        if (callback != null && typeof callback !== 'function') {
            // eslint-disable-line no-eq-null,eqeqeq
            throw new Error('task callback must be a function');
        }

        q.started = true;

        if (data == null && q.idle()) {
            // eslint-disable-line no-eq-null,eqeqeq
            // call drain immediately if there are no tasks
            setTimeout(function () {
                return q.drain();
            }, 1);

            return;
        }

        var item = {
            data: data,
            callback: typeof callback === 'function' ? callback : _noop
        };

        if (insertAtFront) {
            q._tasks.unshift(item);
        } else {
            q._tasks.push(item);
        }

        setTimeout(function () {
            return q.process();
        }, 1);
    }

    function _next(task) {
        return function next() {
            workers -= 1;

            task.callback.apply(task, arguments);

            if (arguments[0] != null) {
                // eslint-disable-line no-eq-null,eqeqeq
                q.error(arguments[0], task.data);
            }

            if (workers <= q.concurrency - q.buffer) {
                q.unsaturated();
            }

            if (q.idle()) {
                q.drain();
            }

            q.process();
        };
    }

    return q;
}

},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.encodeBinary = encodeBinary;
var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function encodeBinary(input) {
    var output = '';
    var inx = 0;

    while (inx < input.length) {
        // Fill byte buffer array
        var bytebuffer = [0, 0, 0];
        var encodedCharIndexes = [0, 0, 0, 0];

        for (var jnx = 0; jnx < bytebuffer.length; ++jnx) {
            if (inx < input.length) {
                // throw away high-order byte, as documented at:
                // https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
                bytebuffer[jnx] = input.charCodeAt(inx++) & 0xff;
            } else {
                bytebuffer[jnx] = 0;
            }
        }

        // Get each encoded character, 6 bits at a time
        // index 1: first 6 bits
        encodedCharIndexes[0] = bytebuffer[0] >> 2;

        // index 2: second 6 bits (2 least significant bits from input byte 1 + 4 most significant bits from byte 2)
        encodedCharIndexes[1] = (bytebuffer[0] & 0x3) << 4 | bytebuffer[1] >> 4;

        // index 3: third 6 bits (4 least significant bits from input byte 2 + 2 most significant bits from byte 3)
        encodedCharIndexes[2] = (bytebuffer[1] & 0x0f) << 2 | bytebuffer[2] >> 6;

        // index 3: forth 6 bits (6 least significant bits from input byte 3)
        encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

        // Determine whether padding happened, and adjust accordingly
        var paddingBytes = inx - (input.length - 1);

        switch (paddingBytes) {
            case 2:
                // Set last 2 characters to padding char
                encodedCharIndexes[3] = 64;
                encodedCharIndexes[2] = 64;
                break;

            case 1:
                // Set last character to padding char
                encodedCharIndexes[3] = 64;
                break;

            default:
                break; // No padding - proceed
        }

        // Now we will grab each appropriate character out of our keystring
        // based on our index array and append it to the output string
        for (var _jnx = 0; _jnx < encodedCharIndexes.length; ++_jnx) {
            output += _keyStr.charAt(encodedCharIndexes[_jnx]);
        }
    }

    return output;
}

},{}],7:[function(require,module,exports){
'use strict';

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _async = require('./async');

var async = _interopRequireWildcard(_async);

var _b = require('./b64');

var b64 = _interopRequireWildcard(_b);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Loader2.default.Resource = _Resource2.default;
_Loader2.default.async = async;
_Loader2.default.base64 = b64;

module.exports = _Loader2.default; // eslint-disable-line no-undef

},{"./Loader":3,"./Resource":4,"./async":5,"./b64":6}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbWluaS1zaWduYWxzL2xpYi9taW5pLXNpZ25hbHMuanMiLCJub2RlX21vZHVsZXMvcGFyc2UtdXJpL2luZGV4LmpzIiwic3JjL0xvYWRlci5qcyIsInNyYy9SZXNvdXJjZS5qcyIsInNyYy9hc3luYy5qcyIsInNyYy9iNjQuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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VyxDQUFYLElBQWdCLElBQXhDOztBQUVBO0FBQ0EsWUFBTSxlQUFlLE9BQU8sTUFBTSxNQUFOLEdBQWUsQ0FBdEIsQ0FBckI7O0FBRUEsZ0JBQVEsWUFBUjtBQUNJLGlCQUFLLENBQUw7QUFDSTtBQUNBLG1DQUFtQixDQUFuQixJQUF3QixFQUF4QjtBQUNBLG1DQUFtQixDQUFuQixJQUF3QixFQUF4QjtBQUNBOztBQUVKLGlCQUFLLENBQUw7QUFDSTtBQUNBLG1DQUFtQixDQUFuQixJQUF3QixFQUF4QjtBQUNBOztBQUVKO0FBQ0ksc0JBYlIsQ0FhZTtBQWJmOztBQWdCQTtBQUNBO0FBQ0EsYUFBSyxJQUFJLE9BQU0sQ0FBZixFQUFrQixPQUFNLG1CQUFtQixNQUEzQyxFQUFtRCxFQUFFLElBQXJELEVBQTBEO0FBQ3RELHNCQUFVLFFBQVEsTUFBUixDQUFlLG1CQUFtQixJQUFuQixDQUFmLENBQVY7QUFDSDtBQUNKOztBQUVELFdBQU8sTUFBUDtBQUNIOzs7OztBQzlERDs7OztBQUNBOzs7O0FBQ0E7O0lBQVksSzs7QUFDWjs7SUFBWSxHOzs7Ozs7QUFFWixpQkFBTyxRQUFQO0FBQ0EsaUJBQU8sS0FBUCxHQUFlLEtBQWY7QUFDQSxpQkFBTyxNQUFQLEdBQWdCLEdBQWhCOztBQUVBLE9BQU8sT0FBUCxvQixDQUF5QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIE1pbmlTaWduYWxCaW5kaW5nID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTWluaVNpZ25hbEJpbmRpbmcoZm4sIG9uY2UsIHRoaXNBcmcpIHtcbiAgICBpZiAob25jZSA9PT0gdW5kZWZpbmVkKSBvbmNlID0gZmFsc2U7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWluaVNpZ25hbEJpbmRpbmcpO1xuXG4gICAgdGhpcy5fZm4gPSBmbjtcbiAgICB0aGlzLl9vbmNlID0gb25jZTtcbiAgICB0aGlzLl90aGlzQXJnID0gdGhpc0FyZztcbiAgICB0aGlzLl9uZXh0ID0gdGhpcy5fcHJldiA9IHRoaXMuX293bmVyID0gbnVsbDtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhNaW5pU2lnbmFsQmluZGluZywgW3tcbiAgICBrZXk6ICdkZXRhY2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXRhY2goKSB7XG4gICAgICBpZiAodGhpcy5fb3duZXIgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgIHRoaXMuX293bmVyLmRldGFjaCh0aGlzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBNaW5pU2lnbmFsQmluZGluZztcbn0pKCk7XG5cbmZ1bmN0aW9uIF9hZGRNaW5pU2lnbmFsQmluZGluZyhzZWxmLCBub2RlKSB7XG4gIGlmICghc2VsZi5faGVhZCkge1xuICAgIHNlbGYuX2hlYWQgPSBub2RlO1xuICAgIHNlbGYuX3RhaWwgPSBub2RlO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuX3RhaWwuX25leHQgPSBub2RlO1xuICAgIG5vZGUuX3ByZXYgPSBzZWxmLl90YWlsO1xuICAgIHNlbGYuX3RhaWwgPSBub2RlO1xuICB9XG5cbiAgbm9kZS5fb3duZXIgPSBzZWxmO1xuXG4gIHJldHVybiBub2RlO1xufVxuXG52YXIgTWluaVNpZ25hbCA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1pbmlTaWduYWwoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1pbmlTaWduYWwpO1xuXG4gICAgdGhpcy5faGVhZCA9IHRoaXMuX3RhaWwgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoTWluaVNpZ25hbCwgW3tcbiAgICBrZXk6ICdoYW5kbGVycycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZXJzKCkge1xuICAgICAgdmFyIGV4aXN0cyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXG4gICAgICB2YXIgbm9kZSA9IHRoaXMuX2hlYWQ7XG5cbiAgICAgIGlmIChleGlzdHMpIHJldHVybiAhIW5vZGU7XG5cbiAgICAgIHZhciBlZSA9IFtdO1xuXG4gICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBlZS5wdXNoKG5vZGUpO1xuICAgICAgICBub2RlID0gbm9kZS5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2hhcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhcyhub2RlKSB7XG4gICAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgTWluaVNpZ25hbEJpbmRpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWluaVNpZ25hbCNoYXMoKTogRmlyc3QgYXJnIG11c3QgYmUgYSBNaW5pU2lnbmFsQmluZGluZyBvYmplY3QuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub2RlLl9vd25lciA9PT0gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdkaXNwYXRjaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3BhdGNoKCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuXG4gICAgICBpZiAoIW5vZGUpIHJldHVybiBmYWxzZTtcblxuICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuX29uY2UpIHRoaXMuZGV0YWNoKG5vZGUpO1xuICAgICAgICBub2RlLl9mbi5hcHBseShub2RlLl90aGlzQXJnLCBhcmd1bWVudHMpO1xuICAgICAgICBub2RlID0gbm9kZS5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnYWRkJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKGZuKSB7XG4gICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMV07XG5cbiAgICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaW5pU2lnbmFsI2FkZCgpOiBGaXJzdCBhcmcgbXVzdCBiZSBhIEZ1bmN0aW9uLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9hZGRNaW5pU2lnbmFsQmluZGluZyh0aGlzLCBuZXcgTWluaVNpZ25hbEJpbmRpbmcoZm4sIGZhbHNlLCB0aGlzQXJnKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25jZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICAgIHZhciB0aGlzQXJnID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblxuICAgICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pbmlTaWduYWwjb25jZSgpOiBGaXJzdCBhcmcgbXVzdCBiZSBhIEZ1bmN0aW9uLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9hZGRNaW5pU2lnbmFsQmluZGluZyh0aGlzLCBuZXcgTWluaVNpZ25hbEJpbmRpbmcoZm4sIHRydWUsIHRoaXNBcmcpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdkZXRhY2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXRhY2gobm9kZSkge1xuICAgICAgaWYgKCEobm9kZSBpbnN0YW5jZW9mIE1pbmlTaWduYWxCaW5kaW5nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pbmlTaWduYWwjZGV0YWNoKCk6IEZpcnN0IGFyZyBtdXN0IGJlIGEgTWluaVNpZ25hbEJpbmRpbmcgb2JqZWN0LicpO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUuX293bmVyICE9PSB0aGlzKSByZXR1cm4gdGhpcztcblxuICAgICAgaWYgKG5vZGUuX3ByZXYpIG5vZGUuX3ByZXYuX25leHQgPSBub2RlLl9uZXh0O1xuICAgICAgaWYgKG5vZGUuX25leHQpIG5vZGUuX25leHQuX3ByZXYgPSBub2RlLl9wcmV2O1xuXG4gICAgICBpZiAobm9kZSA9PT0gdGhpcy5faGVhZCkge1xuICAgICAgICB0aGlzLl9oZWFkID0gbm9kZS5fbmV4dDtcbiAgICAgICAgaWYgKG5vZGUuX25leHQgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl90YWlsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChub2RlID09PSB0aGlzLl90YWlsKSB7XG4gICAgICAgIHRoaXMuX3RhaWwgPSBub2RlLl9wcmV2O1xuICAgICAgICB0aGlzLl90YWlsLl9uZXh0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgbm9kZS5fb3duZXIgPSBudWxsO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZGV0YWNoQWxsJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGV0YWNoQWxsKCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuICAgICAgaWYgKCFub2RlKSByZXR1cm4gdGhpcztcblxuICAgICAgdGhpcy5faGVhZCA9IHRoaXMuX3RhaWwgPSBudWxsO1xuXG4gICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBub2RlLl9vd25lciA9IG51bGw7XG4gICAgICAgIG5vZGUgPSBub2RlLl9uZXh0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE1pbmlTaWduYWw7XG59KSgpO1xuXG5NaW5pU2lnbmFsLk1pbmlTaWduYWxCaW5kaW5nID0gTWluaVNpZ25hbEJpbmRpbmc7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE1pbmlTaWduYWw7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlVVJJIChzdHIsIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cblxuICB2YXIgbyA9IHtcbiAgICBrZXk6IFsnc291cmNlJywgJ3Byb3RvY29sJywgJ2F1dGhvcml0eScsICd1c2VySW5mbycsICd1c2VyJywgJ3Bhc3N3b3JkJywgJ2hvc3QnLCAncG9ydCcsICdyZWxhdGl2ZScsICdwYXRoJywgJ2RpcmVjdG9yeScsICdmaWxlJywgJ3F1ZXJ5JywgJ2FuY2hvciddLFxuICAgIHE6IHtcbiAgICAgIG5hbWU6ICdxdWVyeUtleScsXG4gICAgICBwYXJzZXI6IC8oPzpefCYpKFteJj1dKik9PyhbXiZdKikvZ1xuICAgIH0sXG4gICAgcGFyc2VyOiB7XG4gICAgICBzdHJpY3Q6IC9eKD86KFteOlxcLz8jXSspOik/KD86XFwvXFwvKCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKT8oKCgoPzpbXj8jXFwvXSpcXC8pKikoW14/I10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gICAgICBsb29zZTogL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvXG4gICAgfVxuICB9XG5cbiAgdmFyIG0gPSBvLnBhcnNlcltvcHRzLnN0cmljdE1vZGUgPyAnc3RyaWN0JyA6ICdsb29zZSddLmV4ZWMoc3RyKVxuICB2YXIgdXJpID0ge31cbiAgdmFyIGkgPSAxNFxuXG4gIHdoaWxlIChpLS0pIHVyaVtvLmtleVtpXV0gPSBtW2ldIHx8ICcnXG5cbiAgdXJpW28ucS5uYW1lXSA9IHt9XG4gIHVyaVtvLmtleVsxMl1dLnJlcGxhY2Uoby5xLnBhcnNlciwgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcbiAgICBpZiAoJDEpIHVyaVtvLnEubmFtZV1bJDFdID0gJDJcbiAgfSlcblxuICByZXR1cm4gdXJpXG59XG4iLCJpbXBvcnQgU2lnbmFsIGZyb20gJ21pbmktc2lnbmFscyc7XG5pbXBvcnQgcGFyc2VVcmkgZnJvbSAncGFyc2UtdXJpJztcbmltcG9ydCAqIGFzIGFzeW5jIGZyb20gJy4vYXN5bmMnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuXG4vLyBzb21lIGNvbnN0YW50c1xuY29uc3QgTUFYX1BST0dSRVNTID0gMTAwO1xuY29uc3Qgcmd4RXh0cmFjdFVybEhhc2ggPSAvKCNbXFx3XFwtXSspPyQvO1xuXG4vKipcbiAqIE1hbmFnZXMgdGhlIHN0YXRlIGFuZCBsb2FkaW5nIG9mIG11bHRpcGxlIHJlc291cmNlcyB0byBsb2FkLlxuICpcbiAqIEBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYmFzZVVybD0nJ10gLSBUaGUgYmFzZSB1cmwgZm9yIGFsbCByZXNvdXJjZXMgbG9hZGVkIGJ5IHRoaXMgbG9hZGVyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY29uY3VycmVuY3k9MTBdIC0gVGhlIG51bWJlciBvZiByZXNvdXJjZXMgdG8gbG9hZCBjb25jdXJyZW50bHkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYmFzZVVybCA9ICcnLCBjb25jdXJyZW5jeSA9IDEwKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYmFzZSB1cmwgZm9yIGFsbCByZXNvdXJjZXMgbG9hZGVkIGJ5IHRoaXMgbG9hZGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcHJvZ3Jlc3MgcGVyY2VudCBvZiB0aGUgbG9hZGVyIGdvaW5nIHRocm91Z2ggdGhlIHF1ZXVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZGluZyBzdGF0ZSBvZiB0aGUgbG9hZGVyLCB0cnVlIGlmIGl0IGlzIGN1cnJlbnRseSBsb2FkaW5nIHJlc291cmNlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHF1ZXJ5c3RyaW5nIHRvIGFwcGVuZCB0byBldmVyeSBVUkwgYWRkZWQgdG8gdGhlIGxvYWRlci5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBzaG91bGQgYmUgYSB2YWxpZCBxdWVyeSBzdHJpbmcgKndpdGhvdXQqIHRoZSBxdWVzdGlvbi1tYXJrIChgP2ApLiBUaGUgbG9hZGVyIHdpbGxcbiAgICAgICAgICogYWxzbyAqbm90KiBlc2NhcGUgdmFsdWVzIGZvciB5b3UuIE1ha2Ugc3VyZSB0byBlc2NhcGUgeW91ciBwYXJhbWV0ZXJzIHdpdGhcbiAgICAgICAgICogW2BlbmNvZGVVUklDb21wb25lbnRgXShodHRwczovL21kbi5pby9lbmNvZGVVUklDb21wb25lbnQpIGJlZm9yZSBhc3NpZ25pbmcgdGhpcyBwcm9wZXJ0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogYGBganNcbiAgICAgICAgICogY29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuICAgICAgICAgKlxuICAgICAgICAgKiBsb2FkZXIuZGVmYXVsdFF1ZXJ5U3RyaW5nID0gJ3VzZXI9bWUmcGFzc3dvcmQ9c2VjcmV0JztcbiAgICAgICAgICpcbiAgICAgICAgICogLy8gVGhpcyB3aWxsIHJlcXVlc3QgJ2ltYWdlLnBuZz91c2VyPW1lJnBhc3N3b3JkPXNlY3JldCdcbiAgICAgICAgICogbG9hZGVyLmFkZCgnaW1hZ2UucG5nJykubG9hZCgpO1xuICAgICAgICAgKlxuICAgICAgICAgKiBsb2FkZXIucmVzZXQoKTtcbiAgICAgICAgICpcbiAgICAgICAgICogLy8gVGhpcyB3aWxsIHJlcXVlc3QgJ2ltYWdlLnBuZz92PTEmdXNlcj1tZSZwYXNzd29yZD1zZWNyZXQnXG4gICAgICAgICAqIGxvYWRlci5hZGQoJ2lhbWdlLnBuZz92PTEnKS5sb2FkKCk7XG4gICAgICAgICAqIGBgYFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kZWZhdWx0UXVlcnlTdHJpbmcgPSAnJztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG1pZGRsZXdhcmUgdG8gcnVuIGJlZm9yZSBsb2FkaW5nIGVhY2ggcmVzb3VyY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge2Z1bmN0aW9uW119XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9iZWZvcmVNaWRkbGV3YXJlID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBtaWRkbGV3YXJlIHRvIHJ1biBhZnRlciBsb2FkaW5nIGVhY2ggcmVzb3VyY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge2Z1bmN0aW9uW119XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9hZnRlck1pZGRsZXdhcmUgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGBfbG9hZFJlc291cmNlYCBmdW5jdGlvbiBib3VuZCB3aXRoIHRoaXMgb2JqZWN0IGNvbnRleHQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBtZW1iZXIge2Z1bmN0aW9ufVxuICAgICAgICAgKiBAcGFyYW0ge1Jlc291cmNlfSByIC0gVGhlIHJlc291cmNlIHRvIGxvYWRcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZCAtIFRoZSBkZXF1ZXVlIGZ1bmN0aW9uXG4gICAgICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2JvdW5kTG9hZFJlc291cmNlID0gKHIsIGQpID0+IHRoaXMuX2xvYWRSZXNvdXJjZShyLCBkKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHJlc291cmNlcyB3YWl0aW5nIHRvIGJlIGxvYWRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQG1lbWJlciB7UmVzb3VyY2VbXX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3F1ZXVlID0gYXN5bmMucXVldWUodGhpcy5fYm91bmRMb2FkUmVzb3VyY2UsIGNvbmN1cnJlbmN5KTtcblxuICAgICAgICB0aGlzLl9xdWV1ZS5wYXVzZSgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbGwgdGhlIHJlc291cmNlcyBmb3IgdGhpcyBsb2FkZXIga2V5ZWQgYnkgbmFtZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7b2JqZWN0PHN0cmluZywgUmVzb3VyY2U+fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGF0Y2hlZCBvbmNlIHBlciBsb2FkZWQgb3IgZXJyb3JlZCByZXNvdXJjZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIGNhbGxiYWNrIGxvb2tzIGxpa2Uge0BsaW5rIExvYWRlci5PblByb2dyZXNzU2lnbmFsfS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7U2lnbmFsfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vblByb2dyZXNzID0gbmV3IFNpZ25hbCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNwYXRjaGVkIG9uY2UgcGVyIGVycm9yZWQgcmVzb3VyY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBjYWxsYmFjayBsb29rcyBsaWtlIHtAbGluayBMb2FkZXIuT25FcnJvclNpZ25hbH0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge1NpZ25hbH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25FcnJvciA9IG5ldyBTaWduYWwoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGF0Y2hlZCBvbmNlIHBlciBsb2FkZWQgcmVzb3VyY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBjYWxsYmFjayBsb29rcyBsaWtlIHtAbGluayBMb2FkZXIuT25Mb2FkU2lnbmFsfS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7U2lnbmFsfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vbkxvYWQgPSBuZXcgU2lnbmFsKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BhdGNoZWQgd2hlbiB0aGUgbG9hZGVyIGJlZ2lucyB0byBwcm9jZXNzIHRoZSBxdWV1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIGNhbGxiYWNrIGxvb2tzIGxpa2Uge0BsaW5rIExvYWRlci5PblN0YXJ0U2lnbmFsfS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7U2lnbmFsfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vblN0YXJ0ID0gbmV3IFNpZ25hbCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNwYXRjaGVkIHdoZW4gdGhlIHF1ZXVlZCByZXNvdXJjZXMgYWxsIGxvYWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBjYWxsYmFjayBsb29rcyBsaWtlIHtAbGluayBMb2FkZXIuT25Db21wbGV0ZVNpZ25hbH0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge1NpZ25hbH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25Db21wbGV0ZSA9IG5ldyBTaWduYWwoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hlbiB0aGUgcHJvZ3Jlc3MgY2hhbmdlcyB0aGUgbG9hZGVyIGFuZCByZXNvdXJjZSBhcmUgZGlzYXB0Y2hlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlcm9mIExvYWRlclxuICAgICAgICAgKiBAY2FsbGJhY2sgT25Qcm9ncmVzc1NpZ25hbFxuICAgICAgICAgKiBAcGFyYW0ge0xvYWRlcn0gbG9hZGVyIC0gVGhlIGxvYWRlciB0aGUgcHJvZ3Jlc3MgaXMgYWR2YW5jaW5nIG9uLlxuICAgICAgICAgKiBAcGFyYW0ge1Jlc291cmNlfSByZXNvdXJjZSAtIFRoZSByZXNvdXJjZSB0aGF0IGhhcyBjb21wbGV0ZWQgb3IgZmFpbGVkIHRvIGNhdXNlIHRoZSBwcm9ncmVzcyB0byBhZHZhbmNlLlxuICAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hlbiBhbiBlcnJvciBvY2N1cnJzIHRoZSBsb2FkZXIgYW5kIHJlc291cmNlIGFyZSBkaXNhcHRjaGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyb2YgTG9hZGVyXG4gICAgICAgICAqIEBjYWxsYmFjayBPbkVycm9yU2lnbmFsXG4gICAgICAgICAqIEBwYXJhbSB7TG9hZGVyfSBsb2FkZXIgLSBUaGUgbG9hZGVyIHRoZSBlcnJvciBoYXBwZW5lZCBpbi5cbiAgICAgICAgICogQHBhcmFtIHtSZXNvdXJjZX0gcmVzb3VyY2UgLSBUaGUgcmVzb3VyY2UgdGhhdCBjYXVzZWQgdGhlIGVycm9yLlxuICAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hlbiBhIGxvYWQgY29tcGxldGVzIHRoZSBsb2FkZXIgYW5kIHJlc291cmNlIGFyZSBkaXNhcHRjaGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyb2YgTG9hZGVyXG4gICAgICAgICAqIEBjYWxsYmFjayBPbkxvYWRTaWduYWxcbiAgICAgICAgICogQHBhcmFtIHtMb2FkZXJ9IGxvYWRlciAtIFRoZSBsb2FkZXIgdGhhdCBsYW9kZWQgdGhlIHJlc291cmNlLlxuICAgICAgICAgKiBAcGFyYW0ge1Jlc291cmNlfSByZXNvdXJjZSAtIFRoZSByZXNvdXJjZSB0aGF0IGhhcyBjb21wbGV0ZWQgbG9hZGluZy5cbiAgICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZW4gdGhlIGxvYWRlciBzdGFydHMgbG9hZGluZyByZXNvdXJjZXMgaXQgZGlzcGF0Y2hlcyB0aGlzIGNhbGxiYWNrLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyb2YgTG9hZGVyXG4gICAgICAgICAqIEBjYWxsYmFjayBPblN0YXJ0U2lnbmFsXG4gICAgICAgICAqIEBwYXJhbSB7TG9hZGVyfSBsb2FkZXIgLSBUaGUgbG9hZGVyIHRoYXQgaGFzIHN0YXJ0ZWQgbG9hZGluZyByZXNvdXJjZXMuXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGVuIHRoZSBsb2FkZXIgY29tcGxldGVzIGxvYWRpbmcgcmVzb3VyY2VzIGl0IGRpc3BhdGNoZXMgdGhpcyBjYWxsYmFjay5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlcm9mIExvYWRlclxuICAgICAgICAgKiBAY2FsbGJhY2sgT25Db21wbGV0ZVNpZ25hbFxuICAgICAgICAgKiBAcGFyYW0ge0xvYWRlcn0gbG9hZGVyIC0gVGhlIGxvYWRlciB0aGF0IGhhcyBmaW5pc2hlZCBsb2FkaW5nIHJlc291cmNlcy5cbiAgICAgICAgICovXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIHJlc291cmNlIChvciBtdWx0aXBsZSByZXNvdXJjZXMpIHRvIHRoZSBsb2FkZXIgcXVldWUuXG4gICAgICpcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGNhbiB0YWtlIGEgd2lkZSB2YXJpZXR5IG9mIGRpZmZlcmVudCBwYXJhbWV0ZXJzLiBUaGUgb25seSB0aGluZyB0aGF0IGlzIGFsd2F5c1xuICAgICAqIHJlcXVpcmVkIHRoZSB1cmwgdG8gbG9hZC4gQWxsIHRoZSBmb2xsb3dpbmcgd2lsbCB3b3JrOlxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiBsb2FkZXJcbiAgICAgKiAgICAgLy8gbm9ybWFsIHBhcmFtIHN5bnRheFxuICAgICAqICAgICAuYWRkKCdrZXknLCAnaHR0cDovLy4uLicsIGZ1bmN0aW9uICgpIHt9KVxuICAgICAqICAgICAuYWRkKCdodHRwOi8vLi4uJywgZnVuY3Rpb24gKCkge30pXG4gICAgICogICAgIC5hZGQoJ2h0dHA6Ly8uLi4nKVxuICAgICAqXG4gICAgICogICAgIC8vIG9iamVjdCBzeW50YXhcbiAgICAgKiAgICAgLmFkZCh7XG4gICAgICogICAgICAgICBuYW1lOiAna2V5MicsXG4gICAgICogICAgICAgICB1cmw6ICdodHRwOi8vLi4uJ1xuICAgICAqICAgICB9LCBmdW5jdGlvbiAoKSB7fSlcbiAgICAgKiAgICAgLmFkZCh7XG4gICAgICogICAgICAgICB1cmw6ICdodHRwOi8vLi4uJ1xuICAgICAqICAgICB9LCBmdW5jdGlvbiAoKSB7fSlcbiAgICAgKiAgICAgLmFkZCh7XG4gICAgICogICAgICAgICBuYW1lOiAna2V5MycsXG4gICAgICogICAgICAgICB1cmw6ICdodHRwOi8vLi4uJ1xuICAgICAqICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24gKCkge31cbiAgICAgKiAgICAgfSlcbiAgICAgKiAgICAgLmFkZCh7XG4gICAgICogICAgICAgICB1cmw6ICdodHRwczovLy4uLicsXG4gICAgICogICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgKiAgICAgICAgIGNyb3NzT3JpZ2luOiB0cnVlXG4gICAgICogICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgLy8geW91IGNhbiBhbHNvIHBhc3MgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvciB1cmxzIG9yIGJvdGhcbiAgICAgKiAgICAgLmFkZChbXG4gICAgICogICAgICAgICB7IG5hbWU6ICdrZXk0JywgdXJsOiAnaHR0cDovLy4uLicsIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHt9IH0sXG4gICAgICogICAgICAgICB7IHVybDogJ2h0dHA6Ly8uLi4nLCBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7fSB9LFxuICAgICAqICAgICAgICAgJ2h0dHA6Ly8uLi4nXG4gICAgICogICAgIF0pXG4gICAgICpcbiAgICAgKiAgICAgLy8gYW5kIHlvdSBjYW4gdXNlIGJvdGggcGFyYW1zIGFuZCBvcHRpb25zXG4gICAgICogICAgIC5hZGQoJ2tleScsICdodHRwOi8vLi4uJywgeyBjcm9zc09yaWdpbjogdHJ1ZSB9LCBmdW5jdGlvbiAoKSB7fSlcbiAgICAgKiAgICAgLmFkZCgnaHR0cDovLy4uLicsIHsgY3Jvc3NPcmlnaW46IHRydWUgfSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lXSAtIFRoZSBuYW1lIG9mIHRoZSByZXNvdXJjZSB0byBsb2FkLCBpZiBub3QgcGFzc2VkIHRoZSB1cmwgaXMgdXNlZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3VybF0gLSBUaGUgdXJsIGZvciB0aGlzIHJlc291cmNlLCByZWxhdGl2ZSB0byB0aGUgYmFzZVVybCBvZiB0aGlzIGxvYWRlci5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIC0gVGhlIG9wdGlvbnMgZm9yIHRoZSBsb2FkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY3Jvc3NPcmlnaW5dIC0gSXMgdGhpcyByZXF1ZXN0IGNyb3NzLW9yaWdpbj8gRGVmYXVsdCBpcyB0byBkZXRlcm1pbmUgYXV0b21hdGljYWxseS5cbiAgICAgKiBAcGFyYW0ge1Jlc291cmNlLkxPQURfVFlQRX0gW29wdGlvbnMubG9hZFR5cGU9UmVzb3VyY2UuTE9BRF9UWVBFLlhIUl0gLSBIb3cgc2hvdWxkIHRoaXMgcmVzb3VyY2UgYmUgbG9hZGVkP1xuICAgICAqIEBwYXJhbSB7UmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEV9IFtvcHRpb25zLnhoclR5cGU9UmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuREVGQVVMVF0gLSBIb3cgc2hvdWxkXG4gICAgICogICAgICB0aGUgZGF0YSBiZWluZyBsb2FkZWQgYmUgaW50ZXJwcmV0ZWQgd2hlbiB1c2luZyBYSFI/XG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zLm1ldGFkYXRhXSAtIEV4dHJhIGNvbmZpZ3VyYXRpb24gZm9yIG1pZGRsZXdhcmUgYW5kIHRoZSBSZXNvdXJjZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fEhUTUxBdWRpb0VsZW1lbnR8SFRNTFZpZGVvRWxlbWVudH0gW29wdGlvbnMubWV0YWRhdGEubG9hZEVsZW1lbnQ9bnVsbF0gLSBUaGVcbiAgICAgKiAgICAgIGVsZW1lbnQgdG8gdXNlIGZvciBsb2FkaW5nLCBpbnN0ZWFkIG9mIGNyZWF0aW5nIG9uZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLm1ldGFkYXRhLnNraXBTb3VyY2U9ZmFsc2VdIC0gU2tpcHMgYWRkaW5nIHNvdXJjZShzKSB0byB0aGUgbG9hZCBlbGVtZW50LiBUaGlzXG4gICAgICogICAgICBpcyB1c2VmdWwgaWYgeW91IHdhbnQgdG8gcGFzcyBpbiBhIGBsb2FkRWxlbWVudGAgdGhhdCB5b3UgYWxyZWFkeSBhZGRlZCBsb2FkIHNvdXJjZXMgdG8uXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2NiXSAtIEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGlzIHNwZWNpZmljIHJlc291cmNlIGNvbXBsZXRlcyBsb2FkaW5nLlxuICAgICAqIEByZXR1cm4ge0xvYWRlcn0gUmV0dXJucyBpdHNlbGYuXG4gICAgICovXG4gICAgYWRkKG5hbWUsIHVybCwgb3B0aW9ucywgY2IpIHtcbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlIG9mIGFuIGFycmF5IG9mIG9iamVjdHMgb3IgdXJsc1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShuYW1lKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQobmFtZVtpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYW4gb2JqZWN0IGlzIHBhc3NlZCBpbnN0ZWFkIG9mIHBhcmFtc1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjYiA9IHVybCB8fCBuYW1lLmNhbGxiYWNrIHx8IG5hbWUub25Db21wbGV0ZTtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBuYW1lO1xuICAgICAgICAgICAgdXJsID0gbmFtZS51cmw7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5uYW1lIHx8IG5hbWUua2V5IHx8IG5hbWUudXJsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2FzZSB3aGVyZSBubyBuYW1lIGlzIHBhc3NlZCBzaGlmdCBhbGwgYXJncyBvdmVyIGJ5IG9uZS5cbiAgICAgICAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjYiA9IG9wdGlvbnM7XG4gICAgICAgICAgICBvcHRpb25zID0gdXJsO1xuICAgICAgICAgICAgdXJsID0gbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vdyB0aGF0IHdlIHNoaWZ0ZWQgbWFrZSBzdXJlIHdlIGhhdmUgYSBwcm9wZXIgdXJsLlxuICAgICAgICBpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gdXJsIHBhc3NlZCB0byBhZGQgcmVzb3VyY2UgdG8gbG9hZGVyLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb3B0aW9ucyBhcmUgb3B0aW9uYWwgc28gcGVvcGxlIG1pZ2h0IHBhc3MgYSBmdW5jdGlvbiBhbmQgbm8gb3B0aW9uc1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNiID0gb3B0aW9ucztcbiAgICAgICAgICAgIG9wdGlvbnMgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgbG9hZGluZyBhbHJlYWR5IHlvdSBjYW4gb25seSBhZGQgcmVzb3VyY2VzIHRoYXQgaGF2ZSBhIHBhcmVudC5cbiAgICAgICAgaWYgKHRoaXMubG9hZGluZyAmJiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMucGFyZW50UmVzb3VyY2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgcmVzb3VyY2VzIHdoaWxlIHRoZSBsb2FkZXIgaXMgcnVubmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIGlmIHJlc291cmNlIGFscmVhZHkgZXhpc3RzLlxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZXNbbmFtZV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVzb3VyY2UgbmFtZWQgXCIke25hbWV9XCIgYWxyZWFkeSBleGlzdHMuYCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgYmFzZSB1cmwgaWYgdGhpcyBpc24ndCBhbiBhYnNvbHV0ZSB1cmxcbiAgICAgICAgdXJsID0gdGhpcy5fcHJlcGFyZVVybCh1cmwpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgc3RvcmUgdGhlIHJlc291cmNlXG4gICAgICAgIHRoaXMucmVzb3VyY2VzW25hbWVdID0gbmV3IFJlc291cmNlKG5hbWUsIHVybCwgb3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXNbbmFtZV0ub25BZnRlck1pZGRsZXdhcmUub25jZShjYik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBsb2FkaW5nIG1ha2Ugc3VyZSB0byBhZGp1c3QgcHJvZ3Jlc3MgY2h1bmtzIGZvciB0aGF0IHBhcmVudCBhbmQgaXRzIGNoaWxkcmVuXG4gICAgICAgIGlmICh0aGlzLmxvYWRpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IG9wdGlvbnMucGFyZW50UmVzb3VyY2U7XG4gICAgICAgICAgICBjb25zdCBmdWxsQ2h1bmsgPSBwYXJlbnQucHJvZ3Jlc3NDaHVuayAqIChwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoICsgMSk7IC8vICsxIGZvciBwYXJlbnRcbiAgICAgICAgICAgIGNvbnN0IGVhY2hDaHVuayA9IGZ1bGxDaHVuayAvIChwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoICsgMik7IC8vICsyIGZvciBwYXJlbnQgJiBuZXcgY2hpbGRcblxuICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2godGhpcy5yZXNvdXJjZXNbbmFtZV0pO1xuICAgICAgICAgICAgcGFyZW50LnByb2dyZXNzQ2h1bmsgPSBlYWNoQ2h1bms7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyZW50LmNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuW2ldLnByb2dyZXNzQ2h1bmsgPSBlYWNoQ2h1bms7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgdGhlIHJlc291cmNlIHRvIHRoZSBxdWV1ZVxuICAgICAgICB0aGlzLl9xdWV1ZS5wdXNoKHRoaXMucmVzb3VyY2VzW25hbWVdKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHVwIGEgbWlkZGxld2FyZSBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuICpiZWZvcmUqIHRoZVxuICAgICAqIHJlc291cmNlIGlzIGxvYWRlZC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgYmVmb3JlXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBUaGUgbWlkZGxld2FyZSBmdW5jdGlvbiB0byByZWdpc3Rlci5cbiAgICAgKiBAcmV0dXJuIHtMb2FkZXJ9IFJldHVybnMgaXRzZWxmLlxuICAgICAqL1xuICAgIHByZShmbikge1xuICAgICAgICB0aGlzLl9iZWZvcmVNaWRkbGV3YXJlLnB1c2goZm4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdXAgYSBtaWRkbGV3YXJlIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gKmFmdGVyKiB0aGVcbiAgICAgKiByZXNvdXJjZSBpcyBsb2FkZWQuXG4gICAgICpcbiAgICAgKiBAYWxpYXMgdXNlXG4gICAgICogQG1ldGhvZCBhZnRlclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0gVGhlIG1pZGRsZXdhcmUgZnVuY3Rpb24gdG8gcmVnaXN0ZXIuXG4gICAgICogQHJldHVybiB7TG9hZGVyfSBSZXR1cm5zIGl0c2VsZi5cbiAgICAgKi9cbiAgICB1c2UoZm4pIHtcbiAgICAgICAgdGhpcy5fYWZ0ZXJNaWRkbGV3YXJlLnB1c2goZm4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgcXVldWUgb2YgdGhlIGxvYWRlciB0byBwcmVwYXJlIGZvciBhIG5ldyBsb2FkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7TG9hZGVyfSBSZXR1cm5zIGl0c2VsZi5cbiAgICAgKi9cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX3F1ZXVlLmtpbGwoKTtcbiAgICAgICAgdGhpcy5fcXVldWUucGF1c2UoKTtcblxuICAgICAgICAvLyBhYm9ydCBhbGwgcmVzb3VyY2UgbG9hZHNcbiAgICAgICAgZm9yIChjb25zdCBrIGluIHRoaXMucmVzb3VyY2VzKSB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSB0aGlzLnJlc291cmNlc1trXTtcblxuICAgICAgICAgICAgaWYgKHJlcy5fb25Mb2FkQmluZGluZykge1xuICAgICAgICAgICAgICAgIHJlcy5fb25Mb2FkQmluZGluZy5kZXRhY2goKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlcy5pc0xvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICByZXMuYWJvcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzb3VyY2VzID0ge307XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIGxvYWRpbmcgdGhlIHF1ZXVlZCByZXNvdXJjZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2JdIC0gT3B0aW9uYWwgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGJvdW5kIHRvIHRoZSBgY29tcGxldGVgIGV2ZW50LlxuICAgICAqIEByZXR1cm4ge0xvYWRlcn0gUmV0dXJucyBpdHNlbGYuXG4gICAgICovXG4gICAgbG9hZChjYikge1xuICAgICAgICAvLyByZWdpc3RlciBjb21wbGV0ZSBjYWxsYmFjayBpZiB0aGV5IHBhc3Mgb25lXG4gICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZS5vbmNlKGNiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBxdWV1ZSBoYXMgYWxyZWFkeSBzdGFydGVkIHdlIGFyZSBkb25lIGhlcmVcbiAgICAgICAgaWYgKHRoaXMubG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkaXN0cmlidXRlIHByb2dyZXNzIGNodW5rc1xuICAgICAgICBjb25zdCBjaHVuayA9IDEwMCAvIHRoaXMuX3F1ZXVlLl90YXNrcy5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9xdWV1ZS5fdGFza3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlLl90YXNrc1tpXS5kYXRhLnByb2dyZXNzQ2h1bmsgPSBjaHVuaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBsb2FkaW5nIHN0YXRlXG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgLy8gbm90aWZ5IG9mIHN0YXJ0XG4gICAgICAgIHRoaXMub25TdGFydC5kaXNwYXRjaCh0aGlzKTtcblxuICAgICAgICAvLyBzdGFydCBsb2FkaW5nXG4gICAgICAgIHRoaXMuX3F1ZXVlLnJlc3VtZSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByZXBhcmVzIGEgdXJsIGZvciB1c2FnZSBiYXNlZCBvbiB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGlzIG9iamVjdFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0byBwcmVwYXJlLlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHByZXBhcmVkIHVybC5cbiAgICAgKi9cbiAgICBfcHJlcGFyZVVybCh1cmwpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVXJsID0gcGFyc2VVcmkodXJsLCB7IHN0cmljdE1vZGU6IHRydWUgfSk7XG4gICAgICAgIGxldCByZXN1bHQ7XG5cbiAgICAgICAgLy8gYWJzb2x1dGUgdXJsLCBqdXN0IHVzZSBpdCBhcyBpcy5cbiAgICAgICAgaWYgKHBhcnNlZFVybC5wcm90b2NvbCB8fCAhcGFyc2VkVXJsLnBhdGggfHwgdXJsLmluZGV4T2YoJy8vJykgPT09IDApIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVybDtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBiYXNlVXJsIGRvZXNuJ3QgZW5kIGluIHNsYXNoIGFuZCB1cmwgZG9lc24ndCBzdGFydCB3aXRoIHNsYXNoLCB0aGVuIGFkZCBhIHNsYXNoIGluYmV0d2VlblxuICAgICAgICBlbHNlIGlmICh0aGlzLmJhc2VVcmwubGVuZ3RoXG4gICAgICAgICAgICAmJiB0aGlzLmJhc2VVcmwubGFzdEluZGV4T2YoJy8nKSAhPT0gdGhpcy5iYXNlVXJsLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICYmIHVybC5jaGFyQXQoMCkgIT09ICcvJ1xuICAgICAgICApIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGAke3RoaXMuYmFzZVVybH0vJHt1cmx9YDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuYmFzZVVybCArIHVybDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHdlIG5lZWQgdG8gYWRkIGEgZGVmYXVsdCBxdWVyeXN0cmluZywgdGhlcmUgaXMgYSBiaXQgbW9yZSB3b3JrXG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRRdWVyeVN0cmluZykge1xuICAgICAgICAgICAgY29uc3QgaGFzaCA9IHJneEV4dHJhY3RVcmxIYXNoLmV4ZWMocmVzdWx0KVswXTtcblxuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cigwLCByZXN1bHQubGVuZ3RoIC0gaGFzaC5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0LmluZGV4T2YoJz8nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gYCYke3RoaXMuZGVmYXVsdFF1ZXJ5U3RyaW5nfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gYD8ke3RoaXMuZGVmYXVsdFF1ZXJ5U3RyaW5nfWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdCArPSBoYXNoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyBhIHNpbmdsZSByZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtSZXNvdXJjZX0gcmVzb3VyY2UgLSBUaGUgcmVzb3VyY2UgdG8gbG9hZC5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkZXF1ZXVlIC0gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB3ZSBuZWVkIHRvIGRlcXVldWUgdGhpcyBpdGVtLlxuICAgICAqL1xuICAgIF9sb2FkUmVzb3VyY2UocmVzb3VyY2UsIGRlcXVldWUpIHtcbiAgICAgICAgcmVzb3VyY2UuX2RlcXVldWUgPSBkZXF1ZXVlO1xuXG4gICAgICAgIC8vIHJ1biBiZWZvcmUgbWlkZGxld2FyZVxuICAgICAgICBhc3luYy5lYWNoU2VyaWVzKFxuICAgICAgICAgICAgdGhpcy5fYmVmb3JlTWlkZGxld2FyZSxcbiAgICAgICAgICAgIChmbiwgbmV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIGZuLmNhbGwodGhpcywgcmVzb3VyY2UsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGJlZm9yZSBtaWRkbGV3YXJlIG1hcmtzIHRoZSByZXNvdXJjZSBhcyBjb21wbGV0ZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gYnJlYWsgYW5kIGRvbid0IHByb2Nlc3MgYW55IG1vcmUgYmVmb3JlIG1pZGRsZXdhcmVcbiAgICAgICAgICAgICAgICAgICAgbmV4dChyZXNvdXJjZS5pc0NvbXBsZXRlID8ge30gOiBudWxsKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLmlzQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25Mb2FkKHJlc291cmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlLl9vbkxvYWRCaW5kaW5nID0gcmVzb3VyY2Uub25Db21wbGV0ZS5vbmNlKHRoaXMuX29uTG9hZCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIG9uY2UgZWFjaCByZXNvdXJjZSBoYXMgbG9hZGVkLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25Db21wbGV0ZSgpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlLmRpc3BhdGNoKHRoaXMsIHRoaXMucmVzb3VyY2VzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgZWFjaCB0aW1lIGEgcmVzb3VyY2VzIGlzIGxvYWRlZC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtSZXNvdXJjZX0gcmVzb3VyY2UgLSBUaGUgcmVzb3VyY2UgdGhhdCB3YXMgbG9hZGVkXG4gICAgICovXG4gICAgX29uTG9hZChyZXNvdXJjZSkge1xuICAgICAgICByZXNvdXJjZS5fb25Mb2FkQmluZGluZyA9IG51bGw7XG5cbiAgICAgICAgLy8gcnVuIG1pZGRsZXdhcmUsIHRoaXMgKm11c3QqIGhhcHBlbiBiZWZvcmUgZGVxdWV1ZSBzbyBzdWItYXNzZXRzIGdldCBhZGRlZCBwcm9wZXJseVxuICAgICAgICBhc3luYy5lYWNoU2VyaWVzKFxuICAgICAgICAgICAgdGhpcy5fYWZ0ZXJNaWRkbGV3YXJlLFxuICAgICAgICAgICAgKGZuLCBuZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCByZXNvdXJjZSwgbmV4dCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc291cmNlLm9uQWZ0ZXJNaWRkbGV3YXJlLmRpc3BhdGNoKHJlc291cmNlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgKz0gcmVzb3VyY2UucHJvZ3Jlc3NDaHVuaztcbiAgICAgICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3MuZGlzcGF0Y2godGhpcywgcmVzb3VyY2UpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvci5kaXNwYXRjaChyZXNvdXJjZS5lcnJvciwgdGhpcywgcmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWQuZGlzcGF0Y2godGhpcywgcmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGlzIHJlc291cmNlIGZyb20gdGhlIGFzeW5jIHF1ZXVlXG4gICAgICAgICAgICAgICAgcmVzb3VyY2UuX2RlcXVldWUoKTtcblxuICAgICAgICAgICAgICAgIC8vIGRvIGNvbXBsZXRpb24gY2hlY2tcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcXVldWUuaWRsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNQVhfUFJPR1JFU1M7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHBhcnNlVXJpIGZyb20gJ3BhcnNlLXVyaSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJ21pbmktc2lnbmFscyc7XG5cbi8vIHRlc3RzIGlzIENPUlMgaXMgc3VwcG9ydGVkIGluIFhIUiwgaWYgbm90IHdlIG5lZWQgdG8gdXNlIFhEUlxuY29uc3QgdXNlWGRyID0gISEod2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gKG5ldyBYTUxIdHRwUmVxdWVzdCgpKSkpO1xubGV0IHRlbXBBbmNob3IgPSBudWxsO1xuXG4vLyBzb21lIHN0YXR1cyBjb25zdGFudHNcbmNvbnN0IFNUQVRVU19OT05FID0gMDtcbmNvbnN0IFNUQVRVU19PSyA9IDIwMDtcbmNvbnN0IFNUQVRVU19FTVBUWSA9IDIwNDtcblxuLy8gbm9vcFxuZnVuY3Rpb24gX25vb3AoKSB7IC8qIGVtcHR5ICovIH1cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBzdGF0ZSBhbmQgbG9hZGluZyBvZiBhIHJlc291cmNlIGFuZCBhbGwgY2hpbGQgcmVzb3VyY2VzLlxuICpcbiAqIEBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNvdXJjZSB7XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbG9hZCB0eXBlIHRvIGJlIHVzZWQgZm9yIGEgc3BlY2lmaWMgZXh0ZW5zaW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBleHRuYW1lIC0gVGhlIGV4dGVuc2lvbiB0byBzZXQgdGhlIHR5cGUgZm9yLCBlLmcuIFwicG5nXCIgb3IgXCJmbnRcIlxuICAgICAqIEBwYXJhbSB7UmVzb3VyY2UuTE9BRF9UWVBFfSBsb2FkVHlwZSAtIFRoZSBsb2FkIHR5cGUgdG8gc2V0IGl0IHRvLlxuICAgICAqL1xuICAgIHN0YXRpYyBzZXRFeHRlbnNpb25Mb2FkVHlwZShleHRuYW1lLCBsb2FkVHlwZSkge1xuICAgICAgICBzZXRFeHRNYXAoUmVzb3VyY2UuX2xvYWRUeXBlTWFwLCBleHRuYW1lLCBsb2FkVHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbG9hZCB0eXBlIHRvIGJlIHVzZWQgZm9yIGEgc3BlY2lmaWMgZXh0ZW5zaW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBleHRuYW1lIC0gVGhlIGV4dGVuc2lvbiB0byBzZXQgdGhlIHR5cGUgZm9yLCBlLmcuIFwicG5nXCIgb3IgXCJmbnRcIlxuICAgICAqIEBwYXJhbSB7UmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEV9IHhoclR5cGUgLSBUaGUgeGhyIHR5cGUgdG8gc2V0IGl0IHRvLlxuICAgICAqL1xuICAgIHN0YXRpYyBzZXRFeHRlbnNpb25YaHJUeXBlKGV4dG5hbWUsIHhoclR5cGUpIHtcbiAgICAgICAgc2V0RXh0TWFwKFJlc291cmNlLl94aHJUeXBlTWFwLCBleHRuYW1lLCB4aHJUeXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSByZXNvdXJjZSB0byBsb2FkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSB1cmwgLSBUaGUgdXJsIGZvciB0aGlzIHJlc291cmNlLCBmb3IgYXVkaW8vdmlkZW8gbG9hZHMgeW91IGNhbiBwYXNzXG4gICAgICogICAgICBhbiBhcnJheSBvZiBzb3VyY2VzLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBUaGUgb3B0aW9ucyBmb3IgdGhlIGxvYWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd8Ym9vbGVhbn0gW29wdGlvbnMuY3Jvc3NPcmlnaW5dIC0gSXMgdGhpcyByZXF1ZXN0IGNyb3NzLW9yaWdpbj8gRGVmYXVsdCBpcyB0b1xuICAgICAqICAgICAgZGV0ZXJtaW5lIGF1dG9tYXRpY2FsbHkuXG4gICAgICogQHBhcmFtIHtSZXNvdXJjZS5MT0FEX1RZUEV9IFtvcHRpb25zLmxvYWRUeXBlPVJlc291cmNlLkxPQURfVFlQRS5YSFJdIC0gSG93IHNob3VsZCB0aGlzIHJlc291cmNlXG4gICAgICogICAgICBiZSBsb2FkZWQ/XG4gICAgICogQHBhcmFtIHtSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRX0gW29wdGlvbnMueGhyVHlwZT1SZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5ERUZBVUxUXSAtIEhvd1xuICAgICAqICAgICAgc2hvdWxkIHRoZSBkYXRhIGJlaW5nIGxvYWRlZCBiZSBpbnRlcnByZXRlZCB3aGVuIHVzaW5nIFhIUj9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnMubWV0YWRhdGFdIC0gRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgbWlkZGxld2FyZSBhbmQgdGhlIFJlc291cmNlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR8SFRNTEF1ZGlvRWxlbWVudHxIVE1MVmlkZW9FbGVtZW50fSBbb3B0aW9ucy5tZXRhZGF0YS5sb2FkRWxlbWVudD1udWxsXSAtIFRoZVxuICAgICAqICAgICAgZWxlbWVudCB0byB1c2UgZm9yIGxvYWRpbmcsIGluc3RlYWQgb2YgY3JlYXRpbmcgb25lLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubWV0YWRhdGEuc2tpcFNvdXJjZT1mYWxzZV0gLSBTa2lwcyBhZGRpbmcgc291cmNlKHMpIHRvIHRoZSBsb2FkIGVsZW1lbnQuIFRoaXNcbiAgICAgKiAgICAgIGlzIHVzZWZ1bCBpZiB5b3Ugd2FudCB0byBwYXNzIGluIGEgYGxvYWRFbGVtZW50YCB0aGF0IHlvdSBhbHJlYWR5IGFkZGVkIGxvYWQgc291cmNlcyB0by5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihuYW1lLCB1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJyB8fCB0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb3RoIG5hbWUgYW5kIHVybCBhcmUgcmVxdWlyZWQgZm9yIGNvbnN0cnVjdGluZyBhIHJlc291cmNlLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzdGF0ZSBmbGFncyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9mbGFncyA9IDA7XG5cbiAgICAgICAgLy8gc2V0IGRhdGEgdXJsIGZsYWcsIG5lZWRzIHRvIGJlIHNldCBlYXJseSBmb3Igc29tZSBfZGV0ZXJtaW5lWCBjaGVja3MgdG8gd29yay5cbiAgICAgICAgdGhpcy5fc2V0RmxhZyhSZXNvdXJjZS5TVEFUVVNfRkxBR1MuREFUQV9VUkwsIHVybC5pbmRleE9mKCdkYXRhOicpID09PSAwKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG5hbWUgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB1cmwgdXNlZCB0byBsb2FkIHRoaXMgcmVzb3VyY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ31cbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGRhdGEgdGhhdCB3YXMgbG9hZGVkIGJ5IHRoZSByZXNvdXJjZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7YW55fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSXMgdGhpcyByZXF1ZXN0IGNyb3NzLW9yaWdpbj8gSWYgdW5zZXQsIGRldGVybWluZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jcm9zc09yaWdpbiA9IG9wdGlvbnMuY3Jvc3NPcmlnaW4gPT09IHRydWUgPyAnYW5vbnltb3VzJyA6IG9wdGlvbnMuY3Jvc3NPcmlnaW47XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBtZXRob2Qgb2YgbG9hZGluZyB0byB1c2UgZm9yIHRoaXMgcmVzb3VyY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge1Jlc291cmNlLkxPQURfVFlQRX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubG9hZFR5cGUgPSBvcHRpb25zLmxvYWRUeXBlIHx8IHRoaXMuX2RldGVybWluZUxvYWRUeXBlKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIHVzZWQgdG8gbG9hZCB0aGUgcmVzb3VyY2UgdmlhIFhIUi4gSWYgdW5zZXQsIGRldGVybWluZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54aHJUeXBlID0gb3B0aW9ucy54aHJUeXBlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeHRyYSBpbmZvIGZvciBtaWRkbGV3YXJlLCBhbmQgY29udHJvbGxpbmcgc3BlY2lmaWNzIGFib3V0IGhvdyB0aGUgcmVzb3VyY2UgbG9hZHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIE5vdGUgdGhhdCBpZiB5b3UgcGFzcyBpbiBhIGBsb2FkRWxlbWVudGAsIHRoZSBSZXNvdXJjZSBjbGFzcyB0YWtlcyBvd25lcnNoaXAgb2YgaXQuXG4gICAgICAgICAqIE1lYW5pbmcgaXQgd2lsbCBtb2RpZnkgaXQgYXMgaXQgc2VlcyBmaXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge29iamVjdH1cbiAgICAgICAgICogQHByb3BlcnR5IHtIVE1MSW1hZ2VFbGVtZW50fEhUTUxBdWRpb0VsZW1lbnR8SFRNTFZpZGVvRWxlbWVudH0gW2xvYWRFbGVtZW50PW51bGxdIC0gVGhlXG4gICAgICAgICAqICBlbGVtZW50IHRvIHVzZSBmb3IgbG9hZGluZywgaW5zdGVhZCBvZiBjcmVhdGluZyBvbmUuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3NraXBTb3VyY2U9ZmFsc2VdIC0gU2tpcHMgYWRkaW5nIHNvdXJjZShzKSB0byB0aGUgbG9hZCBlbGVtZW50LiBUaGlzXG4gICAgICAgICAqICBpcyB1c2VmdWwgaWYgeW91IHdhbnQgdG8gcGFzcyBpbiBhIGBsb2FkRWxlbWVudGAgdGhhdCB5b3UgYWxyZWFkeSBhZGRlZCBsb2FkIHNvdXJjZXNcbiAgICAgICAgICogIHRvLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tZXRhZGF0YSA9IG9wdGlvbnMubWV0YWRhdGEgfHwge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBlcnJvciB0aGF0IG9jY3VycmVkIHdoaWxlIGxvYWRpbmcgKGlmIGFueSkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge0Vycm9yfVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgWEhSIG9iamVjdCB0aGF0IHdhcyB1c2VkIHRvIGxvYWQgdGhpcyByZXNvdXJjZS4gVGhpcyBpcyBvbmx5IHNldFxuICAgICAgICAgKiB3aGVuIGBsb2FkVHlwZWAgaXMgYFJlc291cmNlLkxPQURfVFlQRS5YSFJgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtYTUxIdHRwUmVxdWVzdH1cbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnhociA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBjaGlsZCByZXNvdXJjZXMgdGhpcyByZXNvdXJjZSBvd25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtSZXNvdXJjZVtdfVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHJlc291cmNlIHR5cGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge1Jlc291cmNlLlRZUEV9XG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50eXBlID0gUmVzb3VyY2UuVFlQRS5VTktOT1dOO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcHJvZ3Jlc3MgY2h1bmsgb3duZWQgYnkgdGhpcyByZXNvdXJjZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NDaHVuayA9IDA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBgZGVxdWV1ZWAgbWV0aG9kIHRoYXQgd2lsbCBiZSB1c2VkIGEgc3RvcmFnZSBwbGFjZSBmb3IgdGhlIGFzeW5jIHF1ZXVlIGRlcXVldWUgbWV0aG9kXG4gICAgICAgICAqIHVzZWQgcHJpdmF0ZWx5IGJ5IHRoZSBsb2FkZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBtZW1iZXIge2Z1bmN0aW9ufVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZGVxdWV1ZSA9IF9ub29wO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVc2VkIGEgc3RvcmFnZSBwbGFjZSBmb3IgdGhlIG9uIGxvYWQgYmluZGluZyB1c2VkIHByaXZhdGVseSBieSB0aGUgbG9hZGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAbWVtYmVyIHtmdW5jdGlvbn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uTG9hZEJpbmRpbmcgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYGNvbXBsZXRlYCBmdW5jdGlvbiBib3VuZCB0byB0aGlzIHJlc291cmNlJ3MgY29udGV4dC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQG1lbWJlciB7ZnVuY3Rpb259XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9ib3VuZENvbXBsZXRlID0gdGhpcy5jb21wbGV0ZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYF9vbkVycm9yYCBmdW5jdGlvbiBib3VuZCB0byB0aGlzIHJlc291cmNlJ3MgY29udGV4dC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQG1lbWJlciB7ZnVuY3Rpb259XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9ib3VuZE9uRXJyb3IgPSB0aGlzLl9vbkVycm9yLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBgX29uUHJvZ3Jlc3NgIGZ1bmN0aW9uIGJvdW5kIHRvIHRoaXMgcmVzb3VyY2UncyBjb250ZXh0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAbWVtYmVyIHtmdW5jdGlvbn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2JvdW5kT25Qcm9ncmVzcyA9IHRoaXMuX29uUHJvZ3Jlc3MuYmluZCh0aGlzKTtcblxuICAgICAgICAvLyB4aHIgY2FsbGJhY2tzXG4gICAgICAgIHRoaXMuX2JvdW5kWGhyT25FcnJvciA9IHRoaXMuX3hock9uRXJyb3IuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fYm91bmRYaHJPbkFib3J0ID0gdGhpcy5feGhyT25BYm9ydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9ib3VuZFhock9uTG9hZCA9IHRoaXMuX3hock9uTG9hZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9ib3VuZFhkck9uVGltZW91dCA9IHRoaXMuX3hkck9uVGltZW91dC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNwYXRjaGVkIHdoZW4gdGhlIHJlc291cmNlIGJlaW5ncyB0byBsb2FkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGUgY2FsbGJhY2sgbG9va3MgbGlrZSB7QGxpbmsgUmVzb3VyY2UuT25TdGFydFNpZ25hbH0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge1NpZ25hbH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25TdGFydCA9IG5ldyBTaWduYWwoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGF0Y2hlZCBlYWNoIHRpbWUgcHJvZ3Jlc3Mgb2YgdGhpcyByZXNvdXJjZSBsb2FkIHVwZGF0ZXMuXG4gICAgICAgICAqIE5vdCBhbGwgcmVzb3VyY2VzIHR5cGVzIGFuZCBsb2FkZXIgc3lzdGVtcyBjYW4gc3VwcG9ydCB0aGlzIGV2ZW50XG4gICAgICAgICAqIHNvIHNvbWV0aW1lcyBpdCBtYXkgbm90IGJlIGF2YWlsYWJsZS4gSWYgdGhlIHJlc291cmNlXG4gICAgICAgICAqIGlzIGJlaW5nIGxvYWRlZCBvbiBhIG1vZGVybiBicm93c2VyLCB1c2luZyBYSFIsIGFuZCB0aGUgcmVtb3RlIHNlcnZlclxuICAgICAgICAgKiBwcm9wZXJseSBzZXRzIENvbnRlbnQtTGVuZ3RoIGhlYWRlcnMsIHRoZW4gdGhpcyB3aWxsIGJlIGF2YWlsYWJsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIGNhbGxiYWNrIGxvb2tzIGxpa2Uge0BsaW5rIFJlc291cmNlLk9uUHJvZ3Jlc3NTaWduYWx9LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtTaWduYWx9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBuZXcgU2lnbmFsKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BhdGNoZWQgb25jZSB0aGlzIHJlc291cmNlIGhhcyBsb2FkZWQsIGlmIHRoZXJlIHdhcyBhbiBlcnJvciBpdCB3aWxsXG4gICAgICAgICAqIGJlIGluIHRoZSBgZXJyb3JgIHByb3BlcnR5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGUgY2FsbGJhY2sgbG9va3MgbGlrZSB7QGxpbmsgUmVzb3VyY2UuT25Db21wbGV0ZVNpZ25hbH0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge1NpZ25hbH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25Db21wbGV0ZSA9IG5ldyBTaWduYWwoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGF0Y2hlZCBhZnRlciB0aGlzIHJlc291cmNlIGhhcyBoYWQgYWxsIHRoZSAqYWZ0ZXIqIG1pZGRsZXdhcmUgcnVuIG9uIGl0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGUgY2FsbGJhY2sgbG9va3MgbGlrZSB7QGxpbmsgUmVzb3VyY2UuT25Db21wbGV0ZVNpZ25hbH0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge1NpZ25hbH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25BZnRlck1pZGRsZXdhcmUgPSBuZXcgU2lnbmFsKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZW4gdGhlIHJlc291cmNlIHN0YXJ0cyB0byBsb2FkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyb2YgUmVzb3VyY2VcbiAgICAgICAgICogQGNhbGxiYWNrIE9uU3RhcnRTaWduYWxcbiAgICAgICAgICogQHBhcmFtIHtSZXNvdXJjZX0gcmVzb3VyY2UgLSBUaGUgcmVzb3VyY2UgdGhhdCB0aGUgZXZlbnQgaGFwcGVuZWQgb24uXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGVuIHRoZSByZXNvdXJjZSByZXBvcnRzIGxvYWRpbmcgcHJvZ3Jlc3MuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJvZiBSZXNvdXJjZVxuICAgICAgICAgKiBAY2FsbGJhY2sgT25Qcm9ncmVzc1NpZ25hbFxuICAgICAgICAgKiBAcGFyYW0ge1Jlc291cmNlfSByZXNvdXJjZSAtIFRoZSByZXNvdXJjZSB0aGF0IHRoZSBldmVudCBoYXBwZW5lZCBvbi5cbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHBlcmNlbnRhZ2UgLSBUaGUgcHJvZ3Jlc3Mgb2YgdGhlIGxvYWQgaW4gdGhlIHJhbmdlIFswLCAxXS5cbiAgICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZW4gdGhlIHJlc291cmNlIGZpbmlzaGVzIGxvYWRpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJvZiBSZXNvdXJjZVxuICAgICAgICAgKiBAY2FsbGJhY2sgT25Db21wbGV0ZVNpZ25hbFxuICAgICAgICAgKiBAcGFyYW0ge1Jlc291cmNlfSByZXNvdXJjZSAtIFRoZSByZXNvdXJjZSB0aGF0IHRoZSBldmVudCBoYXBwZW5lZCBvbi5cbiAgICAgICAgICovXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcmVzIHdoZXRoZXIgb3Igbm90IHRoaXMgdXJsIGlzIGEgZGF0YSB1cmwuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyIHtib29sZWFufVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGdldCBpc0RhdGFVcmwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNGbGFnKFJlc291cmNlLlNUQVRVU19GTEFHUy5EQVRBX1VSTCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzY3JpYmVzIGlmIHRoaXMgcmVzb3VyY2UgaGFzIGZpbmlzaGVkIGxvYWRpbmcuIElzIHRydWUgd2hlbiB0aGUgcmVzb3VyY2UgaGFzIGNvbXBsZXRlbHlcbiAgICAgKiBsb2FkZWQuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyIHtib29sZWFufVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGdldCBpc0NvbXBsZXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzRmxhZyhSZXNvdXJjZS5TVEFUVVNfRkxBR1MuQ09NUExFVEUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc2NyaWJlcyBpZiB0aGlzIHJlc291cmNlIGlzIGN1cnJlbnRseSBsb2FkaW5nLiBJcyB0cnVlIHdoZW4gdGhlIHJlc291cmNlIHN0YXJ0cyBsb2FkaW5nLFxuICAgICAqIGFuZCBpcyBmYWxzZSBhZ2FpbiB3aGVuIGNvbXBsZXRlLlxuICAgICAqXG4gICAgICogQG1lbWJlciB7Ym9vbGVhbn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBnZXQgaXNMb2FkaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzRmxhZyhSZXNvdXJjZS5TVEFUVVNfRkxBR1MuTE9BRElORyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFya3MgdGhlIHJlc291cmNlIGFzIGNvbXBsZXRlLlxuICAgICAqXG4gICAgICovXG4gICAgY29tcGxldGUoKSB7XG4gICAgICAgIC8vIFRPRE86IENsZWFuIHRoaXMgdXAgaW4gYSB3cmFwcGVyIG9yIHNvbWV0aGluZy4uLmdyb3NzLi4uLlxuICAgICAgICBpZiAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCB0aGlzLl9ib3VuZE9uRXJyb3IsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgdGhpcy5fYm91bmRDb21wbGV0ZSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5kYXRhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgdGhpcy5fYm91bmRPblByb2dyZXNzLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmRhdGEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCB0aGlzLl9ib3VuZENvbXBsZXRlLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy54aHIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnhoci5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy54aHIucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCB0aGlzLl9ib3VuZFhock9uRXJyb3IsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnhoci5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIHRoaXMuX2JvdW5kWGhyT25BYm9ydCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMueGhyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgdGhpcy5fYm91bmRPblByb2dyZXNzLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhpcy54aHIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIHRoaXMuX2JvdW5kWGhyT25Mb2FkLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnhoci5vbmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnhoci5vbnRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMueGhyLm9ucHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMueGhyLm9ubG9hZCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBsZXRlIGNhbGxlZCBhZ2FpbiBmb3IgYW4gYWxyZWFkeSBjb21wbGV0ZWQgcmVzb3VyY2UuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zZXRGbGFnKFJlc291cmNlLlNUQVRVU19GTEFHUy5DT01QTEVURSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX3NldEZsYWcoUmVzb3VyY2UuU1RBVFVTX0ZMQUdTLkxPQURJTkcsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLm9uQ29tcGxldGUuZGlzcGF0Y2godGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWJvcnRzIHRoZSBsb2FkaW5nIG9mIHRoaXMgcmVzb3VyY2UsIHdpdGggYW4gb3B0aW9uYWwgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gVGhlIG1lc3NhZ2UgdG8gdXNlIGZvciB0aGUgZXJyb3JcbiAgICAgKi9cbiAgICBhYm9ydChtZXNzYWdlKSB7XG4gICAgICAgIC8vIGFib3J0IGNhbiBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMsIGlnbm9yZSBzdWJzZXF1ZW50IGNhbGxzLlxuICAgICAgICBpZiAodGhpcy5lcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3RvcmUgZXJyb3JcbiAgICAgICAgdGhpcy5lcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcblxuICAgICAgICAvLyBhYm9ydCB0aGUgYWN0dWFsIGxvYWRpbmdcbiAgICAgICAgaWYgKHRoaXMueGhyKSB7XG4gICAgICAgICAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMueGRyKSB7XG4gICAgICAgICAgICB0aGlzLnhkci5hYm9ydCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZGF0YSkge1xuICAgICAgICAgICAgLy8gc2luZ2xlIHNvdXJjZVxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5zcmMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc3JjID0gUmVzb3VyY2UuRU1QVFlfR0lGO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbXVsdGktc291cmNlXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5kYXRhLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnJlbW92ZUNoaWxkKHRoaXMuZGF0YS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb25lIG5vdy5cbiAgICAgICAgdGhpcy5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEtpY2tzIG9mZiBsb2FkaW5nIG9mIHRoaXMgcmVzb3VyY2UuIFRoaXMgbWV0aG9kIGlzIGFzeW5jaHJvbm91cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYl0gLSBPcHRpb25hbCBjYWxsYmFjayB0byBjYWxsIG9uY2UgdGhlIHJlc291cmNlIGlzIGxvYWRlZC5cbiAgICAgKi9cbiAgICBsb2FkKGNiKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNDb21wbGV0ZSkge1xuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjYih0aGlzKSwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjYikge1xuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlLm9uY2UoY2IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc2V0RmxhZyhSZXNvdXJjZS5TVEFUVVNfRkxBR1MuTE9BRElORywgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5vblN0YXJ0LmRpc3BhdGNoKHRoaXMpO1xuXG4gICAgICAgIC8vIGlmIHVuc2V0LCBkZXRlcm1pbmUgdGhlIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLmNyb3NzT3JpZ2luID09PSBmYWxzZSB8fCB0eXBlb2YgdGhpcy5jcm9zc09yaWdpbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuY3Jvc3NPcmlnaW4gPSB0aGlzLl9kZXRlcm1pbmVDcm9zc09yaWdpbih0aGlzLnVybCk7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHRoaXMubG9hZFR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFOlxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IFJlc291cmNlLlRZUEUuSU1BR0U7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZEVsZW1lbnQoJ2ltYWdlJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgUmVzb3VyY2UuTE9BRF9UWVBFLkFVRElPOlxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IFJlc291cmNlLlRZUEUuQVVESU87XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZFNvdXJjZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgUmVzb3VyY2UuTE9BRF9UWVBFLlZJREVPOlxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IFJlc291cmNlLlRZUEUuVklERU87XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZFNvdXJjZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgUmVzb3VyY2UuTE9BRF9UWVBFLlhIUjpcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmICh1c2VYZHIgJiYgdGhpcy5jcm9zc09yaWdpbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2FkWGRyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2FkWGhyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBmbGFnIGlzIHNldC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZsYWcgLSBUaGUgZmxhZyB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBmbGFnIGlzIHNldC5cbiAgICAgKi9cbiAgICBfaGFzRmxhZyhmbGFnKSB7XG4gICAgICAgIHJldHVybiAhISh0aGlzLl9mbGFncyAmIGZsYWcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIChVbilTZXRzIHRoZSBmbGFnLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmxhZyAtIFRoZSBmbGFnIHRvICh1bilzZXQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2YWx1ZSAtIFdoZXRoZXIgdG8gc2V0IG9yICh1bilzZXQgdGhlIGZsYWcuXG4gICAgICovXG4gICAgX3NldEZsYWcoZmxhZywgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZmxhZ3MgPSB2YWx1ZSA/ICh0aGlzLl9mbGFncyB8IGZsYWcpIDogKHRoaXMuX2ZsYWdzICYgfmZsYWcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWRzIHRoaXMgcmVzb3VyY2VzIHVzaW5nIGFuIGVsZW1lbnQgdGhhdCBoYXMgYSBzaW5nbGUgc291cmNlLFxuICAgICAqIGxpa2UgYW4gSFRNTEltYWdlRWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiBlbGVtZW50IHRvIHVzZS5cbiAgICAgKi9cbiAgICBfbG9hZEVsZW1lbnQodHlwZSkge1xuICAgICAgICBpZiAodGhpcy5tZXRhZGF0YS5sb2FkRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5tZXRhZGF0YS5sb2FkRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnaW1hZ2UnICYmIHR5cGVvZiB3aW5kb3cuSW1hZ2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jcm9zc09yaWdpbikge1xuICAgICAgICAgICAgdGhpcy5kYXRhLmNyb3NzT3JpZ2luID0gdGhpcy5jcm9zc09yaWdpbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5tZXRhZGF0YS5za2lwU291cmNlKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuc3JjID0gdGhpcy51cmw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRhdGEuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCB0aGlzLl9ib3VuZE9uRXJyb3IsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5kYXRhLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLl9ib3VuZENvbXBsZXRlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZGF0YS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIHRoaXMuX2JvdW5kT25Qcm9ncmVzcywgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWRzIHRoaXMgcmVzb3VyY2VzIHVzaW5nIGFuIGVsZW1lbnQgdGhhdCBoYXMgbXVsdGlwbGUgc291cmNlcyxcbiAgICAgKiBsaWtlIGFuIEhUTUxBdWRpb0VsZW1lbnQgb3IgSFRNTFZpZGVvRWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiBlbGVtZW50IHRvIHVzZS5cbiAgICAgKi9cbiAgICBfbG9hZFNvdXJjZUVsZW1lbnQodHlwZSkge1xuICAgICAgICBpZiAodGhpcy5tZXRhZGF0YS5sb2FkRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5tZXRhZGF0YS5sb2FkRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnYXVkaW8nICYmIHR5cGVvZiB3aW5kb3cuQXVkaW8gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgQXVkaW8oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFib3J0KGBVbnN1cHBvcnRlZCBlbGVtZW50OiAke3R5cGV9YCk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5tZXRhZGF0YS5za2lwU291cmNlKSB7XG4gICAgICAgICAgICAvLyBzdXBwb3J0IGZvciBDb2Nvb25KUyBDYW52YXMrIHJ1bnRpbWUsIGxhY2tzIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NvdXJjZScpXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLmlzQ29jb29uSlMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc3JjID0gQXJyYXkuaXNBcnJheSh0aGlzLnVybCkgPyB0aGlzLnVybFswXSA6IHRoaXMudXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnVybCkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudXJsLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5hcHBlbmRDaGlsZCh0aGlzLl9jcmVhdGVTb3VyY2UodHlwZSwgdGhpcy51cmxbaV0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuYXBwZW5kQ2hpbGQodGhpcy5fY3JlYXRlU291cmNlKHR5cGUsIHRoaXMudXJsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRhdGEuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCB0aGlzLl9ib3VuZE9uRXJyb3IsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5kYXRhLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLl9ib3VuZENvbXBsZXRlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZGF0YS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIHRoaXMuX2JvdW5kT25Qcm9ncmVzcywgZmFsc2UpO1xuICAgICAgICB0aGlzLmRhdGEuYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCB0aGlzLl9ib3VuZENvbXBsZXRlLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5kYXRhLmxvYWQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyB0aGlzIHJlc291cmNlcyB1c2luZyBhbiBYTUxIdHRwUmVxdWVzdC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2xvYWRYaHIoKSB7XG4gICAgICAgIC8vIGlmIHVuc2V0LCBkZXRlcm1pbmUgdGhlIHZhbHVlXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy54aHJUeXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy54aHJUeXBlID0gdGhpcy5fZGV0ZXJtaW5lWGhyVHlwZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeGhyID0gdGhpcy54aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAvLyBzZXQgdGhlIHJlcXVlc3QgdHlwZSBhbmQgdXJsXG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCB0aGlzLnVybCwgdHJ1ZSk7XG5cbiAgICAgICAgLy8gbG9hZCBqc29uIGFzIHRleHQgYW5kIHBhcnNlIGl0IG91cnNlbHZlcy4gV2UgZG8gdGhpcyBiZWNhdXNlIHNvbWUgYnJvd3NlcnNcbiAgICAgICAgLy8gKmNvdWdoKiBzYWZhcmkgKmNvdWdoKiBjYW4ndCBkZWFsIHdpdGggaXQuXG4gICAgICAgIGlmICh0aGlzLnhoclR5cGUgPT09IFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLkpTT04gfHwgdGhpcy54aHJUeXBlID09PSBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5ET0NVTUVOVCkge1xuICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLlRFWFQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gdGhpcy54aHJUeXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5fYm91bmRYaHJPbkVycm9yLCBmYWxzZSk7XG4gICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIHRoaXMuX2JvdW5kWGhyT25BYm9ydCwgZmFsc2UpO1xuICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCB0aGlzLl9ib3VuZE9uUHJvZ3Jlc3MsIGZhbHNlKTtcbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLl9ib3VuZFhock9uTG9hZCwgZmFsc2UpO1xuXG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZHMgdGhpcyByZXNvdXJjZXMgdXNpbmcgYW4gWERvbWFpblJlcXVlc3QuIFRoaXMgaXMgaGVyZSBiZWNhdXNlIHdlIG5lZWQgdG8gc3VwcG9ydCBJRTkgKGdyb3NzKS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2xvYWRYZHIoKSB7XG4gICAgICAgIC8vIGlmIHVuc2V0LCBkZXRlcm1pbmUgdGhlIHZhbHVlXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy54aHJUeXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy54aHJUeXBlID0gdGhpcy5fZGV0ZXJtaW5lWGhyVHlwZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeGRyID0gdGhpcy54aHIgPSBuZXcgWERvbWFpblJlcXVlc3QoKTtcblxuICAgICAgICAvLyBYRG9tYWluUmVxdWVzdCBoYXMgYSBmZXcgcXVpcmtzLiBPY2Nhc2lvbmFsbHkgaXQgd2lsbCBhYm9ydCByZXF1ZXN0c1xuICAgICAgICAvLyBBIHdheSB0byBhdm9pZCB0aGlzIGlzIHRvIG1ha2Ugc3VyZSBBTEwgY2FsbGJhY2tzIGFyZSBzZXQgZXZlbiBpZiBub3QgdXNlZFxuICAgICAgICAvLyBNb3JlIGluZm8gaGVyZTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTc4Njk2Ni94ZG9tYWlucmVxdWVzdC1hYm9ydHMtcG9zdC1vbi1pZS05XG4gICAgICAgIHhkci50aW1lb3V0ID0gNTAwMDtcblxuICAgICAgICB4ZHIub25lcnJvciA9IHRoaXMuX2JvdW5kWGhyT25FcnJvcjtcbiAgICAgICAgeGRyLm9udGltZW91dCA9IHRoaXMuX2JvdW5kWGRyT25UaW1lb3V0O1xuICAgICAgICB4ZHIub25wcm9ncmVzcyA9IHRoaXMuX2JvdW5kT25Qcm9ncmVzcztcbiAgICAgICAgeGRyLm9ubG9hZCA9IHRoaXMuX2JvdW5kWGhyT25Mb2FkO1xuXG4gICAgICAgIHhkci5vcGVuKCdHRVQnLCB0aGlzLnVybCwgdHJ1ZSk7XG5cbiAgICAgICAgLy8gTm90ZTogVGhlIHhkci5zZW5kKCkgY2FsbCBpcyB3cmFwcGVkIGluIGEgdGltZW91dCB0byBwcmV2ZW50IGFuXG4gICAgICAgIC8vIGlzc3VlIHdpdGggdGhlIGludGVyZmFjZSB3aGVyZSBzb21lIHJlcXVlc3RzIGFyZSBsb3N0IGlmIG11bHRpcGxlXG4gICAgICAgIC8vIFhEb21haW5SZXF1ZXN0cyBhcmUgYmVpbmcgc2VudCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgICAgICAvLyBTb21lIGluZm8gaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL3Bob3RvbnN0b3JtL3BoYXNlci9pc3N1ZXMvMTI0OFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHhkci5zZW5kKCksIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzb3VyY2UgdXNlZCBpbiBsb2FkaW5nIHZpYSBhbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIFRoZSBlbGVtZW50IHR5cGUgKHZpZGVvIG9yIGF1ZGlvKS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHNvdXJjZSBVUkwgdG8gbG9hZCBmcm9tLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWltZV0gLSBUaGUgbWltZSB0eXBlIG9mIHRoZSB2aWRlb1xuICAgICAqIEByZXR1cm4ge0hUTUxTb3VyY2VFbGVtZW50fSBUaGUgc291cmNlIGVsZW1lbnQuXG4gICAgICovXG4gICAgX2NyZWF0ZVNvdXJjZSh0eXBlLCB1cmwsIG1pbWUpIHtcbiAgICAgICAgaWYgKCFtaW1lKSB7XG4gICAgICAgICAgICBtaW1lID0gYCR7dHlwZX0vJHt1cmwuc3Vic3RyKHVybC5sYXN0SW5kZXhPZignLicpICsgMSl9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NvdXJjZScpO1xuXG4gICAgICAgIHNvdXJjZS5zcmMgPSB1cmw7XG4gICAgICAgIHNvdXJjZS50eXBlID0gbWltZTtcblxuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCBpZiBhIGxvYWQgZXJyb3JzIG91dC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gVGhlIGVycm9yIGV2ZW50IGZyb20gdGhlIGVsZW1lbnQgdGhhdCBlbWl0cyBpdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbkVycm9yKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuYWJvcnQoYEZhaWxlZCB0byBsb2FkIGVsZW1lbnQgdXNpbmc6ICR7ZXZlbnQudGFyZ2V0Lm5vZGVOYW1lfWApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCBpZiBhIGxvYWQgcHJvZ3Jlc3MgZXZlbnQgZmlyZXMgZm9yIHhoci94ZHIuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3RQcm9ncmVzc0V2ZW50fEV2ZW50fSBldmVudCAtIFByb2dyZXNzIGV2ZW50LlxuICAgICAqL1xuICAgIF9vblByb2dyZXNzKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3MuZGlzcGF0Y2godGhpcywgZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIGlmIGFuIGVycm9yIGV2ZW50IGZpcmVzIGZvciB4aHIveGRyLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1hNTEh0dHBSZXF1ZXN0RXJyb3JFdmVudHxFdmVudH0gZXZlbnQgLSBFcnJvciBldmVudC5cbiAgICAgKi9cbiAgICBfeGhyT25FcnJvcigpIHtcbiAgICAgICAgY29uc3QgeGhyID0gdGhpcy54aHI7XG5cbiAgICAgICAgdGhpcy5hYm9ydChgJHtyZXFUeXBlKHhocil9IFJlcXVlc3QgZmFpbGVkLiBTdGF0dXM6ICR7eGhyLnN0YXR1c30sIHRleHQ6IFwiJHt4aHIuc3RhdHVzVGV4dH1cImApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCBpZiBhbiBhYm9ydCBldmVudCBmaXJlcyBmb3IgeGhyLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1hNTEh0dHBSZXF1ZXN0QWJvcnRFdmVudH0gZXZlbnQgLSBBYm9ydCBFdmVudFxuICAgICAqL1xuICAgIF94aHJPbkFib3J0KCkge1xuICAgICAgICB0aGlzLmFib3J0KGAke3JlcVR5cGUodGhpcy54aHIpfSBSZXF1ZXN0IHdhcyBhYm9ydGVkIGJ5IHRoZSB1c2VyLmApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCBpZiBhIHRpbWVvdXQgZXZlbnQgZmlyZXMgZm9yIHhkci5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgLSBUaW1lb3V0IGV2ZW50LlxuICAgICAqL1xuICAgIF94ZHJPblRpbWVvdXQoKSB7XG4gICAgICAgIHRoaXMuYWJvcnQoYCR7cmVxVHlwZSh0aGlzLnhocil9IFJlcXVlc3QgdGltZWQgb3V0LmApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGRhdGEgc3VjY2Vzc2Z1bGx5IGxvYWRzIGZyb20gYW4geGhyL3hkciByZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1hNTEh0dHBSZXF1ZXN0TG9hZEV2ZW50fEV2ZW50fSBldmVudCAtIExvYWQgZXZlbnRcbiAgICAgKi9cbiAgICBfeGhyT25Mb2FkKCkge1xuICAgICAgICBjb25zdCB4aHIgPSB0aGlzLnhocjtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gdHlwZW9mIHhoci5zdGF0dXMgPT09ICd1bmRlZmluZWQnID8geGhyLnN0YXR1cyA6IFNUQVRVU19PSzsgLy8gWERSIGhhcyBubyBgLnN0YXR1c2AsIGFzc3VtZSAyMDAuXG5cbiAgICAgICAgLy8gc3RhdHVzIGNhbiBiZSAwIHdoZW4gdXNpbmcgdGhlIGBmaWxlOi8vYCBwcm90b2NvbCBzbyB3ZSBhbHNvIGNoZWNrIGlmIGEgcmVzcG9uc2UgaXMgc2V0XG4gICAgICAgIGlmIChzdGF0dXMgPT09IFNUQVRVU19PS1xuICAgICAgICAgICAgfHwgc3RhdHVzID09PSBTVEFUVVNfRU1QVFlcbiAgICAgICAgICAgIHx8IChzdGF0dXMgPT09IFNUQVRVU19OT05FICYmIHhoci5yZXNwb25zZVRleHQubGVuZ3RoID4gMClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBpZiB0ZXh0LCBqdXN0IHJldHVybiBpdFxuICAgICAgICAgICAgaWYgKHRoaXMueGhyVHlwZSA9PT0gUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuVEVYVCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gUmVzb3VyY2UuVFlQRS5URVhUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYganNvbiwgcGFyc2UgaW50byBqc29uIG9iamVjdFxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy54aHJUeXBlID09PSBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5KU09OKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gUmVzb3VyY2UuVFlQRS5KU09OO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFib3J0KGBFcnJvciB0cnlpbmcgdG8gcGFyc2UgbG9hZGVkIGpzb246ICR7ZX1gKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgeG1sLCBwYXJzZSBpbnRvIGFuIHhtbCBkb2N1bWVudCBvciBkaXYgZWxlbWVudFxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy54aHJUeXBlID09PSBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5ET0NVTUVOVCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuRE9NUGFyc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkb21wYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRvbXBhcnNlci5wYXJzZUZyb21TdHJpbmcoeGhyLnJlc3BvbnNlVGV4dCwgJ3RleHQveG1sJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IHhoci5yZXNwb25zZVRleHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRpdjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IFJlc291cmNlLlRZUEUuWE1MO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFib3J0KGBFcnJvciB0cnlpbmcgdG8gcGFyc2UgbG9hZGVkIHhtbDogJHtlfWApO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBvdGhlciB0eXBlcyBqdXN0IHJldHVybiB0aGUgcmVzcG9uc2VcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHhoci5yZXNwb25zZSB8fCB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hYm9ydChgWyR7eGhyLnN0YXR1c31dICR7eGhyLnN0YXR1c1RleHR9OiAke3hoci5yZXNwb25zZVVSTH1gKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGBjcm9zc09yaWdpbmAgcHJvcGVydHkgZm9yIHRoaXMgcmVzb3VyY2UgYmFzZWQgb24gaWYgdGhlIHVybFxuICAgICAqIGZvciB0aGlzIHJlc291cmNlIGlzIGNyb3NzLW9yaWdpbi4gSWYgY3Jvc3NPcmlnaW4gd2FzIG1hbnVhbGx5IHNldCwgdGhpc1xuICAgICAqIGZ1bmN0aW9uIGRvZXMgbm90aGluZy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gdGVzdC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW2xvYz13aW5kb3cubG9jYXRpb25dIC0gVGhlIGxvY2F0aW9uIG9iamVjdCB0byB0ZXN0IGFnYWluc3QuXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgY3Jvc3NPcmlnaW4gdmFsdWUgdG8gdXNlIChvciBlbXB0eSBzdHJpbmcgZm9yIG5vbmUpLlxuICAgICAqL1xuICAgIF9kZXRlcm1pbmVDcm9zc09yaWdpbih1cmwsIGxvYykge1xuICAgICAgICAvLyBkYXRhOiBhbmQgamF2YXNjcmlwdDogdXJscyBhcmUgY29uc2lkZXJlZCBzYW1lLW9yaWdpblxuICAgICAgICBpZiAodXJsLmluZGV4T2YoJ2RhdGE6JykgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlZmF1bHQgaXMgd2luZG93LmxvY2F0aW9uXG4gICAgICAgIGxvYyA9IGxvYyB8fCB3aW5kb3cubG9jYXRpb247XG5cbiAgICAgICAgaWYgKCF0ZW1wQW5jaG9yKSB7XG4gICAgICAgICAgICB0ZW1wQW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGV0IHRoZSBicm93c2VyIGRldGVybWluZSB0aGUgZnVsbCBocmVmIGZvciB0aGUgdXJsIG9mIHRoaXMgcmVzb3VyY2UgYW5kIHRoZW5cbiAgICAgICAgLy8gcGFyc2Ugd2l0aCB0aGUgbm9kZSB1cmwgbGliLCB3ZSBjYW4ndCB1c2UgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGFuY2hvciBlbGVtZW50XG4gICAgICAgIC8vIGJlY2F1c2UgdGhleSBkb24ndCB3b3JrIGluIElFOSA6KFxuICAgICAgICB0ZW1wQW5jaG9yLmhyZWYgPSB1cmw7XG4gICAgICAgIHVybCA9IHBhcnNlVXJpKHRlbXBBbmNob3IuaHJlZiwgeyBzdHJpY3RNb2RlOiB0cnVlIH0pO1xuXG4gICAgICAgIGNvbnN0IHNhbWVQb3J0ID0gKCF1cmwucG9ydCAmJiBsb2MucG9ydCA9PT0gJycpIHx8ICh1cmwucG9ydCA9PT0gbG9jLnBvcnQpO1xuICAgICAgICBjb25zdCBwcm90b2NvbCA9IHVybC5wcm90b2NvbCA/IGAke3VybC5wcm90b2NvbH06YCA6ICcnO1xuXG4gICAgICAgIC8vIGlmIGNyb3NzIG9yaWdpblxuICAgICAgICBpZiAodXJsLmhvc3QgIT09IGxvYy5ob3N0bmFtZSB8fCAhc2FtZVBvcnQgfHwgcHJvdG9jb2wgIT09IGxvYy5wcm90b2NvbCkge1xuICAgICAgICAgICAgcmV0dXJuICdhbm9ueW1vdXMnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgdGhlIHJlc3BvbnNlVHlwZSBvZiBhbiBYSFIgcmVxdWVzdCBiYXNlZCBvbiB0aGUgZXh0ZW5zaW9uIG9mIHRoZVxuICAgICAqIHJlc291cmNlIGJlaW5nIGxvYWRlZC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJldHVybiB7UmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEV9IFRoZSByZXNwb25zZVR5cGUgdG8gdXNlLlxuICAgICAqL1xuICAgIF9kZXRlcm1pbmVYaHJUeXBlKCkge1xuICAgICAgICByZXR1cm4gUmVzb3VyY2UuX3hoclR5cGVNYXBbdGhpcy5fZ2V0RXh0ZW5zaW9uKCldIHx8IFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLlRFWFQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB0aGUgbG9hZFR5cGUgb2YgYSByZXNvdXJjZSBiYXNlZCBvbiB0aGUgZXh0ZW5zaW9uIG9mIHRoZVxuICAgICAqIHJlc291cmNlIGJlaW5nIGxvYWRlZC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJldHVybiB7UmVzb3VyY2UuTE9BRF9UWVBFfSBUaGUgbG9hZFR5cGUgdG8gdXNlLlxuICAgICAqL1xuICAgIF9kZXRlcm1pbmVMb2FkVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIFJlc291cmNlLl9sb2FkVHlwZU1hcFt0aGlzLl9nZXRFeHRlbnNpb24oKV0gfHwgUmVzb3VyY2UuTE9BRF9UWVBFLlhIUjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0cyB0aGUgZXh0ZW5zaW9uIChzYW5zICcuJykgb2YgdGhlIGZpbGUgYmVpbmcgbG9hZGVkIGJ5IHRoZSByZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgZXh0ZW5zaW9uLlxuICAgICAqL1xuICAgIF9nZXRFeHRlbnNpb24oKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybDtcbiAgICAgICAgbGV0IGV4dCA9ICcnO1xuXG4gICAgICAgIGlmICh0aGlzLmlzRGF0YVVybCkge1xuICAgICAgICAgICAgY29uc3Qgc2xhc2hJbmRleCA9IHVybC5pbmRleE9mKCcvJyk7XG5cbiAgICAgICAgICAgIGV4dCA9IHVybC5zdWJzdHJpbmcoc2xhc2hJbmRleCArIDEsIHVybC5pbmRleE9mKCc7Jywgc2xhc2hJbmRleCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcXVlcnlTdGFydCA9IHVybC5pbmRleE9mKCc/Jyk7XG5cbiAgICAgICAgICAgIGlmIChxdWVyeVN0YXJ0ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgcXVlcnlTdGFydCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4dCA9IHVybC5zdWJzdHJpbmcodXJsLmxhc3RJbmRleE9mKCcuJykgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHQudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHRoZSBtaW1lIHR5cGUgb2YgYW4gWEhSIHJlcXVlc3QgYmFzZWQgb24gdGhlIHJlc3BvbnNlVHlwZSBvZlxuICAgICAqIHJlc291cmNlIGJlaW5nIGxvYWRlZC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRX0gdHlwZSAtIFRoZSB0eXBlIHRvIGdldCBhIG1pbWUgdHlwZSBmb3IuXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgbWltZSB0eXBlIHRvIHVzZS5cbiAgICAgKi9cbiAgICBfZ2V0TWltZUZyb21YaHJUeXBlKHR5cGUpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLkJVRkZFUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LWJpbmFyeSc7XG5cbiAgICAgICAgICAgIGNhc2UgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuQkxPQjpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL2Jsb2InO1xuXG4gICAgICAgICAgICBjYXNlIFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLkRPQ1VNRU5UOlxuICAgICAgICAgICAgICAgIHJldHVybiAnYXBwbGljYXRpb24veG1sJztcblxuICAgICAgICAgICAgY2FzZSBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5KU09OOlxuICAgICAgICAgICAgICAgIHJldHVybiAnYXBwbGljYXRpb24vanNvbic7XG5cbiAgICAgICAgICAgIGNhc2UgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuREVGQVVMVDpcbiAgICAgICAgICAgIGNhc2UgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuVEVYVDpcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAndGV4dC9wbGFpbic7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBUaGUgdHlwZXMgb2YgcmVzb3VyY2VzIGEgcmVzb3VyY2UgY291bGQgcmVwcmVzZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEByZWFkb25seVxuICogQGVudW0ge251bWJlcn1cbiAqL1xuUmVzb3VyY2UuU1RBVFVTX0ZMQUdTID0ge1xuICAgIE5PTkU6ICAgICAgIDAsXG4gICAgREFUQV9VUkw6ICAgKDEgPDwgMCksXG4gICAgQ09NUExFVEU6ICAgKDEgPDwgMSksXG4gICAgTE9BRElORzogICAgKDEgPDwgMiksXG59O1xuXG4vKipcbiAqIFRoZSB0eXBlcyBvZiByZXNvdXJjZXMgYSByZXNvdXJjZSBjb3VsZCByZXByZXNlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQHJlYWRvbmx5XG4gKiBAZW51bSB7bnVtYmVyfVxuICovXG5SZXNvdXJjZS5UWVBFID0ge1xuICAgIFVOS05PV046ICAgIDAsXG4gICAgSlNPTjogICAgICAgMSxcbiAgICBYTUw6ICAgICAgICAyLFxuICAgIElNQUdFOiAgICAgIDMsXG4gICAgQVVESU86ICAgICAgNCxcbiAgICBWSURFTzogICAgICA1LFxuICAgIFRFWFQ6ICAgICAgIDYsXG59O1xuXG4vKipcbiAqIFRoZSB0eXBlcyBvZiBsb2FkaW5nIGEgcmVzb3VyY2UgY2FuIHVzZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAcmVhZG9ubHlcbiAqIEBlbnVtIHtudW1iZXJ9XG4gKi9cblJlc291cmNlLkxPQURfVFlQRSA9IHtcbiAgICAvKiogVXNlcyBYTUxIdHRwUmVxdWVzdCB0byBsb2FkIHRoZSByZXNvdXJjZS4gKi9cbiAgICBYSFI6ICAgIDEsXG4gICAgLyoqIFVzZXMgYW4gYEltYWdlYCBvYmplY3QgdG8gbG9hZCB0aGUgcmVzb3VyY2UuICovXG4gICAgSU1BR0U6ICAyLFxuICAgIC8qKiBVc2VzIGFuIGBBdWRpb2Agb2JqZWN0IHRvIGxvYWQgdGhlIHJlc291cmNlLiAqL1xuICAgIEFVRElPOiAgMyxcbiAgICAvKiogVXNlcyBhIGBWaWRlb2Agb2JqZWN0IHRvIGxvYWQgdGhlIHJlc291cmNlLiAqL1xuICAgIFZJREVPOiAgNCxcbn07XG5cbi8qKlxuICogVGhlIFhIUiByZWFkeSBzdGF0ZXMsIHVzZWQgaW50ZXJuYWxseS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAcmVhZG9ubHlcbiAqIEBlbnVtIHtzdHJpbmd9XG4gKi9cblJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFID0ge1xuICAgIC8qKiBzdHJpbmcgKi9cbiAgICBERUZBVUxUOiAgICAndGV4dCcsXG4gICAgLyoqIEFycmF5QnVmZmVyICovXG4gICAgQlVGRkVSOiAgICAgJ2FycmF5YnVmZmVyJyxcbiAgICAvKiogQmxvYiAqL1xuICAgIEJMT0I6ICAgICAgICdibG9iJyxcbiAgICAvKiogRG9jdW1lbnQgKi9cbiAgICBET0NVTUVOVDogICAnZG9jdW1lbnQnLFxuICAgIC8qKiBPYmplY3QgKi9cbiAgICBKU09OOiAgICAgICAnanNvbicsXG4gICAgLyoqIFN0cmluZyAqL1xuICAgIFRFWFQ6ICAgICAgICd0ZXh0Jyxcbn07XG5cblJlc291cmNlLl9sb2FkVHlwZU1hcCA9IHtcbiAgICAvLyBpbWFnZXNcbiAgICBnaWY6ICAgICAgICBSZXNvdXJjZS5MT0FEX1RZUEUuSU1BR0UsXG4gICAgcG5nOiAgICAgICAgUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFLFxuICAgIGJtcDogICAgICAgIFJlc291cmNlLkxPQURfVFlQRS5JTUFHRSxcbiAgICBqcGc6ICAgICAgICBSZXNvdXJjZS5MT0FEX1RZUEUuSU1BR0UsXG4gICAganBlZzogICAgICAgUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFLFxuICAgIHRpZjogICAgICAgIFJlc291cmNlLkxPQURfVFlQRS5JTUFHRSxcbiAgICB0aWZmOiAgICAgICBSZXNvdXJjZS5MT0FEX1RZUEUuSU1BR0UsXG4gICAgd2VicDogICAgICAgUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFLFxuICAgIHRnYTogICAgICAgIFJlc291cmNlLkxPQURfVFlQRS5JTUFHRSxcbiAgICBzdmc6ICAgICAgICBSZXNvdXJjZS5MT0FEX1RZUEUuSU1BR0UsXG4gICAgJ3N2Zyt4bWwnOiAgUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFLCAvLyBmb3IgU1ZHIGRhdGEgdXJsc1xuXG4gICAgLy8gYXVkaW9cbiAgICBtcDM6ICAgICAgICBSZXNvdXJjZS5MT0FEX1RZUEUuQVVESU8sXG4gICAgb2dnOiAgICAgICAgUmVzb3VyY2UuTE9BRF9UWVBFLkFVRElPLFxuICAgIHdhdjogICAgICAgIFJlc291cmNlLkxPQURfVFlQRS5BVURJTyxcblxuICAgIC8vIHZpZGVvc1xuICAgIG1wNDogICAgICAgIFJlc291cmNlLkxPQURfVFlQRS5WSURFTyxcbiAgICB3ZWJtOiAgICAgICBSZXNvdXJjZS5MT0FEX1RZUEUuVklERU8sXG59O1xuXG5SZXNvdXJjZS5feGhyVHlwZU1hcCA9IHtcbiAgICAvLyB4bWxcbiAgICB4aHRtbDogICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5ET0NVTUVOVCxcbiAgICBodG1sOiAgICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5ET0NVTUVOVCxcbiAgICBodG06ICAgICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5ET0NVTUVOVCxcbiAgICB4bWw6ICAgICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5ET0NVTUVOVCxcbiAgICB0bXg6ICAgICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5ET0NVTUVOVCxcbiAgICBzdmc6ICAgICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5ET0NVTUVOVCxcblxuICAgIC8vIFRoaXMgd2FzIGFkZGVkIHRvIGhhbmRsZSBUaWxlZCBUaWxlc2V0IFhNTCwgYnV0IC50c3ggaXMgYWxzbyBhIFR5cGVTY3JpcHQgUmVhY3QgQ29tcG9uZW50LlxuICAgIC8vIFNpbmNlIGl0IGlzIHdheSBsZXNzIGxpa2VseSBmb3IgcGVvcGxlIHRvIGJlIGxvYWRpbmcgVHlwZVNjcmlwdCBmaWxlcyBpbnN0ZWFkIG9mIFRpbGVkIGZpbGVzLFxuICAgIC8vIHRoaXMgc2hvdWxkIHByb2JhYmx5IGJlIGZpbmUuXG4gICAgdHN4OiAgICAgICAgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuRE9DVU1FTlQsXG5cbiAgICAvLyBpbWFnZXNcbiAgICBnaWY6ICAgICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5CTE9CLFxuICAgIHBuZzogICAgICAgIFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLkJMT0IsXG4gICAgYm1wOiAgICAgICAgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuQkxPQixcbiAgICBqcGc6ICAgICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5CTE9CLFxuICAgIGpwZWc6ICAgICAgIFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLkJMT0IsXG4gICAgdGlmOiAgICAgICAgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuQkxPQixcbiAgICB0aWZmOiAgICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5CTE9CLFxuICAgIHdlYnA6ICAgICAgIFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLkJMT0IsXG4gICAgdGdhOiAgICAgICAgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuQkxPQixcblxuICAgIC8vIGpzb25cbiAgICBqc29uOiAgICAgICBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5KU09OLFxuXG4gICAgLy8gdGV4dFxuICAgIHRleHQ6ICAgICAgIFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLlRFWFQsXG4gICAgdHh0OiAgICAgICAgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuVEVYVCxcblxuICAgIC8vIGZvbnRzXG4gICAgdHRmOiAgICAgICAgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuQlVGRkVSLFxuICAgIG90ZjogICAgICAgIFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLkJVRkZFUixcbn07XG5cbi8vIFdlIGNhbid0IHNldCB0aGUgYHNyY2AgYXR0cmlidXRlIHRvIGVtcHR5IHN0cmluZywgc28gb24gYWJvcnQgd2Ugc2V0IGl0IHRvIHRoaXMgMXB4IHRyYW5zcGFyZW50IGdpZlxuUmVzb3VyY2UuRU1QVFlfR0lGID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQVAvLy93QUFBQ0g1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlDUkFFQU93PT0nO1xuXG4vKipcbiAqIFF1aWNrIGhlbHBlciB0byBzZXQgYSB2YWx1ZSBvbiBvbmUgb2YgdGhlIGV4dGVuc2lvbiBtYXBzLiBFbnN1cmVzIHRoZXJlIGlzIG5vXG4gKiBkb3QgYXQgdGhlIHN0YXJ0IG9mIHRoZSBleHRlbnNpb24uXG4gKlxuICogQGlnbm9yZVxuICogQHBhcmFtIHtvYmplY3R9IG1hcCAtIFRoZSBtYXAgdG8gc2V0IG9uLlxuICogQHBhcmFtIHtzdHJpbmd9IGV4dG5hbWUgLSBUaGUgZXh0ZW5zaW9uIChvciBrZXkpIHRvIHNldC5cbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBUaGUgdmFsdWUgdG8gc2V0LlxuICovXG5mdW5jdGlvbiBzZXRFeHRNYXAobWFwLCBleHRuYW1lLCB2YWwpIHtcbiAgICBpZiAoZXh0bmFtZSAmJiBleHRuYW1lLmluZGV4T2YoJy4nKSA9PT0gMCkge1xuICAgICAgICBleHRuYW1lID0gZXh0bmFtZS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgaWYgKCFleHRuYW1lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtYXBbZXh0bmFtZV0gPSB2YWw7XG59XG5cbi8qKlxuICogUXVpY2sgaGVscGVyIHRvIGdldCBzdHJpbmcgeGhyIHR5cGUuXG4gKlxuICogQGlnbm9yZVxuICogQHBhcmFtIHtYTUxIdHRwUmVxdWVzdHxYRG9tYWluUmVxdWVzdH0geGhyIC0gVGhlIHJlcXVlc3QgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSB0eXBlLlxuICovXG5mdW5jdGlvbiByZXFUeXBlKHhocikge1xuICAgIHJldHVybiB4aHIudG9TdHJpbmcoKS5yZXBsYWNlKCdvYmplY3QgJywgJycpO1xufVxuIiwiLyoqXG4gKiBTbWFsbGVyIHZlcnNpb24gb2YgdGhlIGFzeW5jIGxpYnJhcnkgY29uc3RydWN0cy5cbiAqXG4gKi9cbmZ1bmN0aW9uIF9ub29wKCkgeyAvKiBlbXB0eSAqLyB9XG5cbi8qKlxuICogSXRlcmF0ZXMgYW4gYXJyYXkgaW4gc2VyaWVzLlxuICpcbiAqIEBwYXJhbSB7KltdfSBhcnJheSAtIEFycmF5IHRvIGl0ZXJhdGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRvciAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gY2FsbCB3aGVuIGRvbmUsIG9yIG9uIGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZWFjaFNlcmllcyhhcnJheSwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IGxlbiA9IGFycmF5Lmxlbmd0aDtcblxuICAgIChmdW5jdGlvbiBuZXh0KGVycikge1xuICAgICAgICBpZiAoZXJyIHx8IGkgPT09IGxlbikge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaXRlcmF0b3IoYXJyYXlbaSsrXSwgbmV4dCk7XG4gICAgfSkoKTtcbn1cblxuLyoqXG4gKiBFbnN1cmVzIGEgZnVuY3Rpb24gaXMgb25seSBjYWxsZWQgb25jZS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHJldHVybiB7ZnVuY3Rpb259IFRoZSB3cmFwcGluZyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb25seU9uY2UoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gb25jZVdyYXBwZXIoKSB7XG4gICAgICAgIGlmIChmbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsYmFjayB3YXMgYWxyZWFkeSBjYWxsZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYWxsRm4gPSBmbjtcblxuICAgICAgICBmbiA9IG51bGw7XG4gICAgICAgIGNhbGxGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogQXN5bmMgcXVldWUgaW1wbGVtZW50YXRpb24sXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gd29ya2VyIC0gVGhlIHdvcmtlciBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHRhc2suXG4gKiBAcGFyYW0ge251bWJlcn0gY29uY3VycmVuY3kgLSBIb3cgbWFueSB3b3JrZXJzIHRvIHJ1biBpbiBwYXJyYWxsZWwuXG4gKiBAcmV0dXJuIHsqfSBUaGUgYXN5bmMgcXVldWUgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcXVldWUod29ya2VyLCBjb25jdXJyZW5jeSkge1xuICAgIGlmIChjb25jdXJyZW5jeSA9PSBudWxsKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgICAgICAgY29uY3VycmVuY3kgPSAxO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb25jdXJyZW5jeSA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbmN1cnJlbmN5IG11c3Qgbm90IGJlIHplcm8nKTtcbiAgICB9XG5cbiAgICBsZXQgd29ya2VycyA9IDA7XG4gICAgY29uc3QgcSA9IHtcbiAgICAgICAgX3Rhc2tzOiBbXSxcbiAgICAgICAgY29uY3VycmVuY3ksXG4gICAgICAgIHNhdHVyYXRlZDogX25vb3AsXG4gICAgICAgIHVuc2F0dXJhdGVkOiBfbm9vcCxcbiAgICAgICAgYnVmZmVyOiBjb25jdXJyZW5jeSAvIDQsXG4gICAgICAgIGVtcHR5OiBfbm9vcCxcbiAgICAgICAgZHJhaW46IF9ub29wLFxuICAgICAgICBlcnJvcjogX25vb3AsXG4gICAgICAgIHN0YXJ0ZWQ6IGZhbHNlLFxuICAgICAgICBwYXVzZWQ6IGZhbHNlLFxuICAgICAgICBwdXNoKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBfaW5zZXJ0KGRhdGEsIGZhbHNlLCBjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgICAgIGtpbGwoKSB7XG4gICAgICAgICAgICB3b3JrZXJzID0gMDtcbiAgICAgICAgICAgIHEuZHJhaW4gPSBfbm9vcDtcbiAgICAgICAgICAgIHEuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcS5fdGFza3MgPSBbXTtcbiAgICAgICAgfSxcbiAgICAgICAgdW5zaGlmdChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgX2luc2VydChkYXRhLCB0cnVlLCBjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgICAgIHByb2Nlc3MoKSB7XG4gICAgICAgICAgICB3aGlsZSAoIXEucGF1c2VkICYmIHdvcmtlcnMgPCBxLmNvbmN1cnJlbmN5ICYmIHEuX3Rhc2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSBxLl90YXNrcy5zaGlmdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHEuX3Rhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBxLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd29ya2VycyArPSAxO1xuXG4gICAgICAgICAgICAgICAgaWYgKHdvcmtlcnMgPT09IHEuY29uY3VycmVuY3kpIHtcbiAgICAgICAgICAgICAgICAgICAgcS5zYXR1cmF0ZWQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3b3JrZXIodGFzay5kYXRhLCBvbmx5T25jZShfbmV4dCh0YXNrKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBsZW5ndGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gcS5fdGFza3MubGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBydW5uaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdvcmtlcnM7XG4gICAgICAgIH0sXG4gICAgICAgIGlkbGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gcS5fdGFza3MubGVuZ3RoICsgd29ya2VycyA9PT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICBpZiAocS5wYXVzZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHEucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzdW1lKCkge1xuICAgICAgICAgICAgaWYgKHEucGF1c2VkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcS5wYXVzZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gTmVlZCB0byBjYWxsIHEucHJvY2VzcyBvbmNlIHBlciBjb25jdXJyZW50XG4gICAgICAgICAgICAvLyB3b3JrZXIgdG8gcHJlc2VydmUgZnVsbCBjb25jdXJyZW5jeSBhZnRlciBwYXVzZVxuICAgICAgICAgICAgZm9yIChsZXQgdyA9IDE7IHcgPD0gcS5jb25jdXJyZW5jeTsgdysrKSB7XG4gICAgICAgICAgICAgICAgcS5wcm9jZXNzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9pbnNlcnQoZGF0YSwgaW5zZXJ0QXRGcm9udCwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGFzayBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHEuc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCAmJiBxLmlkbGUoKSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVxLW51bGwsZXFlcWVxXG4gICAgICAgICAgICAvLyBjYWxsIGRyYWluIGltbWVkaWF0ZWx5IGlmIHRoZXJlIGFyZSBubyB0YXNrc1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBxLmRyYWluKCksIDEpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpdGVtID0ge1xuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyBjYWxsYmFjayA6IF9ub29wLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChpbnNlcnRBdEZyb250KSB7XG4gICAgICAgICAgICBxLl90YXNrcy51bnNoaWZ0KGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcS5fdGFza3MucHVzaChpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcS5wcm9jZXNzKCksIDEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9uZXh0KHRhc2spIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgICB3b3JrZXJzIC09IDE7XG5cbiAgICAgICAgICAgIHRhc2suY2FsbGJhY2suYXBwbHkodGFzaywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1swXSAhPSBudWxsKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgICAgICAgICAgICAgICBxLmVycm9yKGFyZ3VtZW50c1swXSwgdGFzay5kYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHdvcmtlcnMgPD0gKHEuY29uY3VycmVuY3kgLSBxLmJ1ZmZlcikpIHtcbiAgICAgICAgICAgICAgICBxLnVuc2F0dXJhdGVkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChxLmlkbGUoKSkge1xuICAgICAgICAgICAgICAgIHEuZHJhaW4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcS5wcm9jZXNzKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHE7XG59XG4iLCJjb25zdCBfa2V5U3RyID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZUJpbmFyeShpbnB1dCkge1xuICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICBsZXQgaW54ID0gMDtcblxuICAgIHdoaWxlIChpbnggPCBpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgLy8gRmlsbCBieXRlIGJ1ZmZlciBhcnJheVxuICAgICAgICBjb25zdCBieXRlYnVmZmVyID0gWzAsIDAsIDBdO1xuICAgICAgICBjb25zdCBlbmNvZGVkQ2hhckluZGV4ZXMgPSBbMCwgMCwgMCwgMF07XG5cbiAgICAgICAgZm9yIChsZXQgam54ID0gMDsgam54IDwgYnl0ZWJ1ZmZlci5sZW5ndGg7ICsram54KSB7XG4gICAgICAgICAgICBpZiAoaW54IDwgaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhyb3cgYXdheSBoaWdoLW9yZGVyIGJ5dGUsIGFzIGRvY3VtZW50ZWQgYXQ6XG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvRW4vVXNpbmdfWE1MSHR0cFJlcXVlc3QjSGFuZGxpbmdfYmluYXJ5X2RhdGFcbiAgICAgICAgICAgICAgICBieXRlYnVmZmVyW2pueF0gPSBpbnB1dC5jaGFyQ29kZUF0KGlueCsrKSAmIDB4ZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBieXRlYnVmZmVyW2pueF0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IGVhY2ggZW5jb2RlZCBjaGFyYWN0ZXIsIDYgYml0cyBhdCBhIHRpbWVcbiAgICAgICAgLy8gaW5kZXggMTogZmlyc3QgNiBiaXRzXG4gICAgICAgIGVuY29kZWRDaGFySW5kZXhlc1swXSA9IGJ5dGVidWZmZXJbMF0gPj4gMjtcblxuICAgICAgICAvLyBpbmRleCAyOiBzZWNvbmQgNiBiaXRzICgyIGxlYXN0IHNpZ25pZmljYW50IGJpdHMgZnJvbSBpbnB1dCBieXRlIDEgKyA0IG1vc3Qgc2lnbmlmaWNhbnQgYml0cyBmcm9tIGJ5dGUgMilcbiAgICAgICAgZW5jb2RlZENoYXJJbmRleGVzWzFdID0gKChieXRlYnVmZmVyWzBdICYgMHgzKSA8PCA0KSB8IChieXRlYnVmZmVyWzFdID4+IDQpO1xuXG4gICAgICAgIC8vIGluZGV4IDM6IHRoaXJkIDYgYml0cyAoNCBsZWFzdCBzaWduaWZpY2FudCBiaXRzIGZyb20gaW5wdXQgYnl0ZSAyICsgMiBtb3N0IHNpZ25pZmljYW50IGJpdHMgZnJvbSBieXRlIDMpXG4gICAgICAgIGVuY29kZWRDaGFySW5kZXhlc1syXSA9ICgoYnl0ZWJ1ZmZlclsxXSAmIDB4MGYpIDw8IDIpIHwgKGJ5dGVidWZmZXJbMl0gPj4gNik7XG5cbiAgICAgICAgLy8gaW5kZXggMzogZm9ydGggNiBiaXRzICg2IGxlYXN0IHNpZ25pZmljYW50IGJpdHMgZnJvbSBpbnB1dCBieXRlIDMpXG4gICAgICAgIGVuY29kZWRDaGFySW5kZXhlc1szXSA9IGJ5dGVidWZmZXJbMl0gJiAweDNmO1xuXG4gICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIHBhZGRpbmcgaGFwcGVuZWQsIGFuZCBhZGp1c3QgYWNjb3JkaW5nbHlcbiAgICAgICAgY29uc3QgcGFkZGluZ0J5dGVzID0gaW54IC0gKGlucHV0Lmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHN3aXRjaCAocGFkZGluZ0J5dGVzKSB7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgLy8gU2V0IGxhc3QgMiBjaGFyYWN0ZXJzIHRvIHBhZGRpbmcgY2hhclxuICAgICAgICAgICAgICAgIGVuY29kZWRDaGFySW5kZXhlc1szXSA9IDY0O1xuICAgICAgICAgICAgICAgIGVuY29kZWRDaGFySW5kZXhlc1syXSA9IDY0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgLy8gU2V0IGxhc3QgY2hhcmFjdGVyIHRvIHBhZGRpbmcgY2hhclxuICAgICAgICAgICAgICAgIGVuY29kZWRDaGFySW5kZXhlc1szXSA9IDY0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrOyAvLyBObyBwYWRkaW5nIC0gcHJvY2VlZFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IHdlIHdpbGwgZ3JhYiBlYWNoIGFwcHJvcHJpYXRlIGNoYXJhY3RlciBvdXQgb2Ygb3VyIGtleXN0cmluZ1xuICAgICAgICAvLyBiYXNlZCBvbiBvdXIgaW5kZXggYXJyYXkgYW5kIGFwcGVuZCBpdCB0byB0aGUgb3V0cHV0IHN0cmluZ1xuICAgICAgICBmb3IgKGxldCBqbnggPSAwOyBqbnggPCBlbmNvZGVkQ2hhckluZGV4ZXMubGVuZ3RoOyArK2pueCkge1xuICAgICAgICAgICAgb3V0cHV0ICs9IF9rZXlTdHIuY2hhckF0KGVuY29kZWRDaGFySW5kZXhlc1tqbnhdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQ7XG59XG4iLCJpbXBvcnQgTG9hZGVyIGZyb20gJy4vTG9hZGVyJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCAqIGFzIGFzeW5jIGZyb20gJy4vYXN5bmMnO1xuaW1wb3J0ICogYXMgYjY0IGZyb20gJy4vYjY0JztcblxuTG9hZGVyLlJlc291cmNlID0gUmVzb3VyY2U7XG5Mb2FkZXIuYXN5bmMgPSBhc3luYztcbkxvYWRlci5iYXNlNjQgPSBiNjQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iXX0=
