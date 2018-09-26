/**
 * Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 *         on 24/03/2016.
 * -------------------------------------------
 * @project base-ui
 * @file Base
 * @author nbchicong
 * @class BaseUI
 */

CC = {
  version: '1.0.0',
  undefined: window['undefined']
};


BaseUI = {version: '1.0.0'};
window['undefined'] = window['undefined'];
BaseUI.apply = function (obj, config, defaults) {
  if(defaults){
    BaseUI.apply(obj, defaults);
  }
  if(obj &&  typeof config == 'object'){
    for(var p in config){
      obj[p] = config[p];
    }
  }
  return obj;
};
(function(){
  var idSeed = 0, toString = Object.prototype.toString;
  var ua = navigator.userAgent.toLowerCase(),
      check = function(r){
        return r.test(ua);
      },
      isStrict = document.compatMode == "CSS1Compat",
      isOpera = check(/opera/),
      isChrome = check(/chrome/),
      isWebKit = check(/webkit/),
      isSafari = !isChrome && check(/safari/),
      isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
      isSafari3 = isSafari && check(/version\/3/),
      isSafari4 = isSafari && check(/version\/4/),
      isIE = !isOpera && check(/msie/),
      isIE7 = isIE && check(/msie 7/),
      isIE8 = isIE && check(/msie 8/),
      isIE6 = isIE && !isIE7 && !isIE8,
      isGecko = !isWebKit && check(/gecko/),
      isGecko2 = isGecko && check(/rv:1\.8/),
      isGecko3 = isGecko && check(/rv:1\.9/),
      isBorderBox = isIE && !isStrict,
      isWindows = check(/windows|win32/),
      isMac = check(/macintosh|mac os x/),
      isAir = check(/adobeair/),
      isLinux = check(/linux/),
      isSecure = /^https/i.test(window.location.protocol);

  // remove css image flicker
  if(isIE6){
    try{
      document.execCommand("BackgroundImageCache", false, true);
    }catch(e){}
  }
  BaseUI.apply(BaseUI, {
    /**
     * True if the detected browser is Opera.
     * @type Boolean
     */
    isOpera: isOpera,
    /**
     * True if the detected browser uses WebKit.
     * @type Boolean
     */
    isWebKit: isWebKit,
    /**
     * True if the detected browser is Chrome.
     * @type Boolean
     */
    isChrome: isChrome,
    /**
     * True if the detected browser is Safari.
     * @type Boolean
     */
    isSafari: isSafari,
    /**
     * True if the detected browser is Safari 4.x.
     * @type Boolean
     */
    isSafari4: isSafari4,
    /**
     * True if the detected browser is Safari 3.x.
     * @type Boolean
     */
    isSafari3: isSafari3,
    /**
     * True if the detected browser is Safari 2.x.
     * @type Boolean
     */
    isSafari2: isSafari2,
    /**
     * True if the detected browser is Internet Explorer.
     * @type Boolean
     */
    isIE: isIE,
    /**
     * True if the detected browser is Internet Explorer 6.x.
     * @type Boolean
     */
    isIE6: isIE6,
    /**
     * True if the detected browser is Internet Explorer 7.x.
     * @type Boolean
     */
    isIE7: isIE7,
    /**
     * True if the detected browser is Internet Explorer 8.x.
     * @type Boolean
     */
    isIE8: isIE8,
    /**
     * True if the detected browser uses the Gecko layout engine (e.g. Mozilla, Firefox).
     * @type Boolean
     */
    isGecko: isGecko,
    /**
     * True if the detected browser uses a pre-Gecko 1.9 layout engine (e.g. Firefox 2.x).
     * @type Boolean
     */
    isGecko2: isGecko2,
    /**
     * True if the detected browser uses a Gecko 1.9+ layout engine (e.g. Firefox 3.x).
     * @type Boolean
     */
    isGecko3: isGecko3,
    /**
     * True if the detected browser is Internet Explorer running in non-strict mode.
     * @type Boolean
     */
    isBorderBox: isBorderBox,
    /**
     * True if the detected platform is Linux.
     * @type Boolean
     */
    isLinux: isLinux,
    /**
     * True if the detected platform is Windows.
     * @type Boolean
     */
    isWindows: isWindows,
    /**
     * True if the detected platform is Mac OS.
     * @type Boolean
     */
    isMac: isMac,
    /**
     * True if the detected platform is Adobe Air.
     * @type Boolean
     */
    isAir: isAir,

    /**
     * By default, Ext intelligently decides whether floating elements should be shimmed. If you are using flash,
     * you may want to set this to true.
     * @type Boolean
     */
    useShims: ((isIE && !(isIE7 || isIE8)) || (isMac && isGecko && !isGecko3)),
    /**
     * Generate the identifier.
     */
    generateId: function () {
      var sid = '';
      for (var i=0; i<24; i++)  {
        sid += Math.floor(Math.random()*0xF).toString(0xF);
      }
      return sid;
    },
    /**
     * Returns true if the passed object is a JavaScript Function, otherwise false.
     * @param {Object} object The object to test
     * @return {Boolean}
     */
    isFunction: function (v) {
      return toString.apply(v) === '[object Function]';
    },
    /**
     * Returns true if the passed object is a JavaScript Object, otherwise false.
     *
     * @param {Object} object The object to test
     * @return {Boolean}
     */
    isObject: function (v) {
      return v && typeof v == "object";
    },
    /**
     * Returns true if the passed object is a string.
     *
     * @param {Object} v The object to test
     * @return {Boolean}
     */
    isString: function (v) {
      return typeof v === 'string';
    },
    /**
     * Returns true if the passed object is a boolean.
     *
     * @param {Object} v The object to test
     * @return {Boolean}
     */
    isBoolean: function (v) {
      return typeof v === 'boolean';
    },
    /**
     * Returns true if the passed value is null, undefined or an empty string.
     * @param {Mixed} value The value to test
     * @param {Boolean} allowBlank (optional) true to allow empty strings (defaults to false)
     * @return {Boolean}
     */
    isEmpty: function(value, allowBlank){
      return value === null || value === undefined || (!allowBlank ? value === '' : false);
    },
    /**
     * Returns true if the passed object is a number. Returns false for
     * non-finite numbers.
     *
     * @param {Object}
     *          v The object to test
     * @return {Boolean}
     */
    isNumber: function (v) {
      return typeof v === 'number' && isFinite(v);
    },
    /**
     * Returns true if the passed object is a JavaScript array, otherwise false.
     * @param {Object} object The object to test
     * @return {Boolean}
     */
    isArray: function(object){
      return object && typeof object.length == 'number' && typeof object.splice == 'function';
    },
    /**
     * Returns true if the passed object is not undefined.
     *
     * @param {Object} v The object to test
     * @return {Boolean}
     */
    isDefined: function (v) {
      return typeof v !== 'undefined';
    },
    /**
     * Return true if passed object is empty.
     * @param {Mixed} value The value to test
     * @returns {boolean}
     */
    isEmptyObject: function(v){
      if(!BaseUI.isObject(v)) {
        return false;
      }
      for(var key in v){
        return false;
      }
      return true;
    },
    /**
     * Returns true if the passed object is a email.
     *
     * @param {Object} v The object to test
     * @return {Boolean}
     */
    isEmail: function (v) {
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
    },
    /**
     * A reusable empty function
     * @property
     * @type Function
     */
    emptyFn: function(){},
    /**
     * function with each item
     *
     * @param {Object} array
     * @param {Object} fn
     * @param {Object} scope
     */
    each: function (array, fn, scope) {
      if (BaseUI.isEmpty(array, true)) {
        return;
      }
      for (var i = 0, len = array.length; i < len; i++) {
        if (fn.call(scope || array[i], array[i], i, array) === false) {
          return i;
        }
      }
    },
    /**
     * Converts any iterable (numeric indices and a length property) into a
     * true array Don't use this on strings. IE doesn't support "abc"[0]
     * which this implementation depends on. For strings, use this instead:
     * "abc".match(/./g) => [a,b,c];
     *
     * @param {Iterable} the iterable object to be turned into a true Array.
     * @return (Array) array
     */
    toArray: function () {
      return isIE ? function (a, i, j, res) {
        res = [];
        BaseUI.each(a, function (v) {
          res.push(v);
        });
        return res.slice(i || 0, j || res.length);
      } : function (a, i, j) {
        return Array.prototype.slice.call(a, i || 0, j || a.length);
      };
    }(),
    /**
     * Clone object
     * @param {Object} obj
     */
    clone: function (obj) {
      if (null == obj || "object" != typeof obj) {
        return obj;
      }
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = obj[attr];
        }
      }
      return copy;
    },
    /**
     * @param {String} namespace1
     * @param {String} namespace2
     * @param {String} etc
     * @method namespace
     */
    namespace: function () {
      var o, d;
      BaseUI.each(arguments, function (v) {
        d = v.split(".");
        o = window[d[0]] = window[d[0]] || {};
        BaseUI.each(d.slice(1), function (v2) {
          o = o[v2] = o[v2] || {};
        });
      });
      return o;
    },
    /**
     * Copies all the properties of config to obj if they don't already exist.
     * @param {Object} obj The receiver of the properties
     * @param {Object} config The source of the properties
     * @return {Object} returns obj
     */
    applyIf: function(obj, config) {
      if(obj && config){
        for(var p in config){
          if(typeof obj[p] == "undefined"){ obj[p] = config[p]; }
        }
      }
      return obj;
    },
    /**
     * Extends one class with another class and optionally overrides members with the passed literal. This class
     * also adds the function "override()" to the class that can be used to override
     * members on an instance.
     * * <p>
     * This function also supports a 2-argument call in which the subclass's constructor is
     * not passed as an argument. In this form, the parameters are as follows:</p><p>
     * <div class="mdetail-params"><ul>
     * <li><code>superclass</code>
     * <div class="sub-desc">The class being extended</div></li>
     * <li><code>overrides</code>
     * <div class="sub-desc">A literal with members which are copied into the subclass's
     * prototype, and are therefore shared among all instances of the new class.<p>
     * This may contain a special member named <tt><b>constructor</b></tt>. This is used
     * to define the constructor of the new class, and is returned. If this property is
     * <i>not</i> specified, a constructor is generated and returned which just calls the
     * superclass's constructor passing on its parameters.</p></div></li>
     * </ul></div></p><p>
     * For example, to create a subclass of the BaseUI GridPanel:
     * <pre><code>
     MyGridPanel = BaseUI.extend(BaseUI.grid.GridPanel, {
        constructor: function(config) {
            // Your preprocessing here
            MyGridPanel.superclass.constructor.apply(this, arguments);
            // Your postprocessing here
        },

        yourMethod: function() {
            // etc.
        }
     });
     </code></pre>
     * </p>
     * @param {Function} subclass The class inheriting the functionality
     * @param {Function} superclass The class being extended
     * @param {Object} overrides (optional) A literal with members which are copied into the subclass's
     * prototype, and are therefore shared between all instances of the new class.
     * @return {Function} The subclass constructor.
     * @method extend
     */
    extend: function() {
      // inline overrides
      var io = function(o){
        for(var m in o){
          this[m] = o[m];
        }
      };
      var oc = Object.prototype.constructor;

      return function(sb, sp, overrides){
        if(typeof sp == 'object'){
          overrides = sp;
          sp = sb;
          sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
        }
        var F = function(){}, sbp, spp = sp.prototype;
        F.prototype = spp;
        sbp = sb.prototype = new F();
        sbp.constructor=sb;
        sb.superclass=spp;
        if(spp.constructor == oc){
          spp.constructor=sp;
        }
        sb.override = function(o){
          BaseUI.override(sb, o);
        };
        sbp.override = io;
        BaseUI.override(sb, overrides);
        sb.extend = function(o){BaseUI.extend(sb, o);};
        return sb;
      };
    }(),

    /**
     * Adds a list of functions to the prototype of an existing class, overwriting any existing methods with the same name.
     * Usage:<pre><code>
     BaseUI.override(MyClass, {
         newMethod1: function(){
            // etc.
         },
         newMethod2: function(foo){
            // etc.
         }
       });
     </code></pre>
     * @param {Object} originClass The class to override
     * @param {Object} overrides The list of functions to add to origClass.  This should be specified as an object literal
     * containing one or more methods.
     * @method override
     */
    override: function(originClass, overrides) {
      if(overrides){
        var p = originClass.prototype;
        for(var method in overrides){
          p[method] = overrides[method];
        }
        if(BaseUI.isIE && overrides.toString != originClass.toString){
          p.toString = overrides.toString;
        }
      }
    }
  });
  BaseUI.ns = BaseUI.namespace;
})();
/**
 * @class String
 * These functions are available as static methods on the JavaScript String object.
 */
BaseUI.applyIf(String, {

  /**
   * Escapes the passed string for ' and \
   * @param {String} string The string to escape
   * @return {String} The escaped string
   * @static
   */
  escape: function(string) {
    return string.replace(/('|\\)/g, "\\$1");
  },

  /**
   * Pads the left side of a string with a specified character.  This is especially useful
   * for normalizing number and date strings.  Example usage:
   * <pre><code>
   var s = String.leftPad('123', 5, '0');
   // s now contains the string: '00123'
   </code></pre>
   * @param {String} val The original string
   * @param {Number} size The total length of the output string
   * @param {String} ch (optional) The character with which to pad the original string (defaults to empty string " ")
   * @return {String} The padded string
   * @static
   */
  leftPad: function (val, size, ch) {
    var result = new String(val);
    if(!ch) {
      ch = " ";
    }
    while (result.length < size) {
      result = ch + result;
    }
    return result.toString();
  },

  /**
   * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
   * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
   * <pre><code>
   var cls = 'my-class', text = 'Some text';
   var s = String.format('&lt;div class="{0}">{1}&lt;/div>', cls, text);
   // s now contains the string: '&lt;div class="my-class">Some text&lt;/div>'
   </code></pre>
   * @param {String} string The tokenized string to be formatted
   * @param {String} value1 The value to replace token {0}
   * @param {String} value2 Etc...
   * @return {String} The formatted string
   * @static
   */
  format: function(format){
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function(m, i){
      return args[i];
    });
  }
});
/**
 * @class String
 * These functions are available as static methods on the JavaScript String object.
 */
BaseUI.applyIf(String.prototype, {
  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  trim: function () {
    var re = /^\s+|\s+$/g;
    return function(){ return this.replace(re, ""); };
  }()
});
/**
 * @class Array
 */
BaseUI.applyIf(Array.prototype, {
  /**
   * Checks whether or not the specified object exists in the array.
   * @param {Object} o The object to check for
   * @return {Number} The index of o in the array (or -1 if it is not found)
   */
  indexOf: function(o){
    for (var i = 0, len = this.length; i < len; i++){
      if(this[i] == o) return i;
    }
    return -1;
  },
  /**
   * Removes the specified object from the array.  If the object is not found nothing happens.
   * @param {Object} o The object to remove
   * @return {Array} this array
   */
  remove: function(o){
    var index = this.indexOf(o);
    if(index != -1){
      this.splice(index, 1);
    }
    return this;
  },
  /**
   *
   * @param index
   * @returns {*}
   */
  get: function (index) {
    return this[index];
  }
});

BaseUI.apply(Function.prototype, {
  /**
   * Creates a delegate (callback) that sets the scope to obj. Call directly
   * on any function. Example:
   * <code>this.myFunction.createDelegate(this, [arg1, arg2])</code> Will
   * create a function that is automatically scoped to obj so that the
   * <tt>this</tt> variable inside the callback points to obj.
   *
   * @param {Object}
   *          obj (optional) The object for which the scope is set
   * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
   * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args
   *          instead of overriding, if a number the args are inserted at the specified position
   * @return {Function} The new function
   */
  createDelegate: function (obj, args, appendArgs) {
    var method = this;
    return function () {
      var callArgs = args || arguments;
      if (appendArgs === true) {
        callArgs = Array.prototype.slice.call(arguments, 0);
        callArgs = callArgs.concat(args);
      }
      else if (BaseUI.isNumber(appendArgs)) {
        callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
        var applyArgs = [appendArgs, 0].concat(args); // create method call params
        Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
      }
      return method.apply(obj || window, callArgs);
    };
  }//,
  // extend: function (supClass, overrides) {
  //   var F = function () {};
  //   F.prototype = supClass.prototype;
  //   this.prototype = new F();
  //   this.prototype.constructor = this;
  //   this.superclass = supClass.prototype;
  //   if (supClass.constructor == Object.prototype.constructor) {
  //     supClass.constructor = supClass;
  //   }
  //   if (overrides) {
  //     for (var method in overrides) {
  //       this.prototype[method] = overrides[method];
  //     }
  //   }
  //   return this;
  // }
  ,
  /**
   * Calls this function after the number of millseconds specified, optionally
   * in a specific scope. Example usage:
   *
   * @param {Number} millis The number of milliseconds for the setTimeout call (if
   *          less than or equal to 0 the function is executed immediately)
   * @param {Object}
   *          obj (optional) The object for which the scope is set
   * @param {Array} args (optional) Overrides arguments for the call. (Defaults to
   *          the arguments passed by the caller)
   * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args
   *          instead of overriding, if a number the args are inserted at the
   *          specified position
   * @return {Number} The timeout id that can be used with clearTimeout
   */
  defer: function (millis, obj, args, appendArgs) {
    var fn = this.createDelegate(obj, args, appendArgs);
    if (millis > 0) {
      return setTimeout(fn, millis);
    }
    fn();
    return 0;
  }
});
UI = BaseUI;