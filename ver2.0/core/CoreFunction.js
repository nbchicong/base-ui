/**
 * Copyright (c) 2017 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * Date: 14/02/2017
 * Time: 11:18 PM
 * ---------------------------------------------------
 * Project: market-mini
 * @name: CoreFunction
 * @author: nbchicong
 */

var CT = {
  version: '1.0.0',
  apply: function (obj, config, defaults) {
    if (defaults)
      CT.apply(obj, defaults);

    if (obj && typeof config === 'object')
      for (var p in config)
        if (config.hasOwnProperty(p))
          obj[p] = config[p];

    return obj;
  },
  /**
   * Copies all the properties of config to obj if they don't already exist.
   * @param {Object} obj The receiver of the properties
   * @param {Object} config The source of the properties
   * @return {Object} returns obj
   */
  applyIf: function (obj, config) {
    if (obj && config)
      for (var p in config)
        if (typeof obj[p] === "undefined")
          obj[p] = config[p];

    return obj;
  },
  /**
   * function with each item
   *
   * @param {Object} array
   * @param {Object} fn
   * @param {Object} [scope]
   */
  each: function (array, fn, scope) {
    if (isEmpty(array, true)) {
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
   * @return (Array) array
   */
  toArray: function () {
    return checkBrowser(/msie/) ? function (a, i, j, res) {
          res = [];
          CT.each(a, function (v) {
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
    if (null == obj || "object" != typeof obj)
      return obj;

    var copy = obj.constructor();
    for (var attr in obj)
      if (obj.hasOwnProperty(attr))
        copy[attr] = obj[attr];

    return copy;
  },
  /**
   * Adds a list of functions to the prototype of an existing class, overwriting any existing methods with the same name.
   * Usage:<pre><code>
   CT.override(MyClass, {
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
  override: function (originClass, overrides) {
    if (overrides) {
      var p = originClass.prototype;
      for (var method in overrides)
        p[method] = overrides[method];

      if (checkBrowser(/msie/)
          && !checkBrowser(/opera/)
          && overrides.toString != originClass.toString)
        p.toString = overrides.toString;

    }
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
   * For example, to create a subclass of the CiCo GridPanel:
   * <pre><code>
   MyGridPanel = CiCo.extend(CiCo.src.grid.GridPanel, {
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
  extend: function () {
    // inline overrides
    var io = function (o) {
      for (var m in o)
        if (o.hasOwnProperty(m))
          this[m] = o[m];
    };
    var oc = Object.prototype.constructor;

    return function (sb, sp, overrides) {
      if (typeof sp === 'object') {
        overrides = sp;
        sp = sb;
        sb = overrides.constructor !== oc ? overrides.constructor : function () {
              sp.apply(this, arguments);
            };
      }
      var F = function () {
      }, sbp, spp = sp.prototype;
      F.prototype = spp;
      sbp = sb.prototype = new F();
      sbp.constructor = sb;
      sb.superclass = spp;
      if (spp.constructor === oc) {
        spp.constructor = sp;
      }
      sb.override = function (o) {
        CT.override(sb, o);
      };
      sbp.override = io;
      CT.override(sb, overrides);
      sb.extend = function (o) {
        CT.extend(sb, o);
      };
      return sb;
    };
  }(),
  /**
   * Generate the identifier.
   */
  generateId: function () {
    var uuid = '';
    for (var i = 0; i < 24; i++)
      uuid += Math.floor(Math.random() * 0xF).toString(0xF);

    return uuid;
  }
};

/**
 * @class String
 * These functions are available as static methods on the JavaScript String object.
 */
CT.applyIf(String, {

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
   * @param {String} format The tokenized string to be formatted
   * @param {String} value1 The value to replace token {0}
   * @param {String} value2 Etc...
   * @return {String} The formatted string
   * @static
   */
  format: function(format){
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{(\d+)}/g, function(m, i) {
      return args[i];
    });
  }
});
/**
 * @class String
 * These functions are available as static methods on the JavaScript String object.
 */
CT.applyIf(String.prototype, {
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
CT.applyIf(Array.prototype, {
  /**
   * Checks whether or not the specified object exists in the array.
   * @param {Object} o The object to check for
   * @return {Number} The index of o in the array (or -1 if it is not found)
   */
  indexOf: function(o){
    for (var i = 0, len = this.length; i < len; i++)
      if(this[i] === o) return i;

    return -1;
  },
  /**
   * Removes the specified object from the array.  If the object is not found nothing happens.
   * @param {Object} o The object to remove
   * @return {Array} this array
   */
  remove: function(o){
    var index = this.indexOf(o);
    if(index !== -1)
      this.splice(index, 1);

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

CT.apply(Function.prototype, {
  /**
   * Creates a delegate (callback) that sets the scope to obj. Call directly
   * on any function. Example:
   * <code>this.myFunction.createDelegate(this, [arg1, arg2])</code> Will
   * create a function that is automatically scoped to obj so that the
   * <tt>this</tt> variable inside the callback points to obj.
   *
   * @param {Object} obj (optional) The object for which the scope is set
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
      else if (isNumber(appendArgs)) {
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

// Ext from ES5
var toString = Object.prototype.toString;
var userAgent = navigator.userAgent.toLowerCase();

function checkBrowser(r){
  return r.test(userAgent);
}
/**
 * Returns true if the passed object is a JavaScript Function, otherwise false.
 * @param {Object} v The object to test
 * @return {Boolean}
 */
function isFunction (v) {
  return toString.apply(v) === '[object Function]';
}
/**
 * Returns true if the passed object is a JavaScript Object, otherwise false.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
function isObject (v) {
  return v && typeof v == "object";
}
/**
 * Returns true if the passed object is a string.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
function isString (v) {
  return typeof v === 'string';
}
/**
 * Returns true if the passed object is a number. Returns false for
 * non-finite numbers.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
function isNumber (v) {
  return typeof v === 'number' && isFinite(v);
}

/**
 * Returns true if the passed object is a boolean.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
function isBoolean (v) {
  return typeof v === 'boolean';
}
/**
 * Returns true if the passed object is a JavaScript array, otherwise false.
 *
 * @param {Object} object The object to test
 * @return {Boolean}
 */
function isArray (v) {
  return toString.apply(v) === '[object Array]';
}
/**
 * Returns true if the passed object is not undefined.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
function isDefined (v) {
  return typeof v !== 'undefined';
}
/**
 * Return true if passed object is empty.
 * @param {Object} v The value to test
 * @returns {boolean}
 */
function isEmptyObject (v){
  if(!isObject(v))
    return false;

  //noinspection LoopStatementThatDoesntLoopJS
  for(var key in v)
    return false;

  return true;
}
/**
 * Returns true if the passed value is empty. The value is deemed to be
 * empty if it is * null * undefined * an empty array * a zero length * an empty object
 * string (Unless the allowBlank parameter is true)
 *
 * @param {Object} v The value to test
 * @param {Boolean} [allowBlank] true to allow empty strings (defaults to false)
 * @return {Boolean}
 */
function isEmpty (v, allowBlank) {
  return v === null || v === undefined || ((isArray(v) && !v.length)) || (!allowBlank ? v === '' : false) || isEmptyObject(v);
}
/**
 * Returns true if the passed object is a email.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
function isEmail (v) {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
}
/**
 * Declare a Global Object
 * @param {String} name
 * @param {Object} [value]
 */
function globalDeclare(name, value) {
  window[name] = value;
}
/**
 * Get a global variable
 * @param variableName
 * @returns {*}
 */
function getVariable(variableName) {
  return window[variableName];
}
/**
 * Declare a class
 * @param {String} className
 * @param {Function} classBody
 */
function newClass(className, classBody) {
  globalDeclare(className, classBody);
}

function sendAjax(options, callback) {
  options.success = function (data) {
    callback && callback(data);
  };
  if (!options.method)
    options.method = 'POST';

  options.dataType = 'JSON';
  options.processData = false;
  options.contentType = false;
  options.cache = false;
  return $.ajax(options);
}

function uploadFile(files, callback) {
  var __fd = new FormData();
  var __files = files || [];
  for (var i = 0; i < __files.length; i++) {
    var __file = __files[i];
    __fd.append('name', __file.name);
    __fd.append('file', __file);
  }
  sendAjax({
    url: '',
    data: __fd
  }, callback);
}