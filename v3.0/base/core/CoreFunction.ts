// Ext from ES5
let toString = Object.prototype.toString;
let userAgent = navigator.userAgent.toLowerCase();

export function checkBrowser(r){
    return r.test(userAgent);
}
/**
 * Returns true if the passed object is a JavaScript Function, otherwise false.
 * @param {Object} v The object to test
 * @return {Boolean}
 */
export function isFunction (v) {
    return toString.apply(v) === '[object Function]';
}
/**
 * Returns true if the passed object is a JavaScript Object, otherwise false.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
export function isObject (v) {
    return v && typeof v == "object";
}
/**
 * Returns true if the passed object is a string.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
export function isString (v) {
    return typeof v === 'string';
}
/**
 * Returns true if the passed object is a number. Returns false for
 * non-finite numbers.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
export function isNumber (v) {
    return typeof v === 'number' && isFinite(v);
}

/**
 * Returns true if the passed object is a boolean.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
export function isBoolean (v) {
    return typeof v === 'boolean';
}
/**
 * Returns true if the passed object is a JavaScript array, otherwise false.
 *
 * @param {Object} object The object to test
 * @return {Boolean}
 */
export function isArray (v) {
    return toString.apply(v) === '[object Array]';
}
/**
 * Returns true if the passed object is not undefined.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
export function isDefined (v) {
    return typeof v !== 'undefined';
}
/**
 * Return true if passed object is empty.
 * @param {Object} v The value to test
 * @returns {boolean}
 */
export function isEmptyObject (v){
    if(!isObject(v))
        return false;

    //noinspection LoopStatementThatDoesntLoopJS
    for(let key in v)
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
export function isEmpty (v, allowBlank) {
    return v === null || v === undefined || ((isArray(v) && !v.length)) || (!allowBlank ? v === '' : false) || isEmptyObject(v);
}
/**
 * Returns true if the passed object is a email.
 *
 * @param {Object} v The object to test
 * @return {Boolean}
 */
export function isEmail (v) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
}
/**
 * Converts any iterable (numeric indices and a length property) into a
 * true array Don't use this on strings. IE doesn't support "abc"[0]
 * which this implementation depends on. For strings, use this instead:
 * "abc".match(/./g) => [a,b,c];
 *
 * @return (Array) array
 */
export function toArray(iterable) {
    return Array.prototype.slice.call(iterable, 0, iterable.length);
}
/**
 * Generate the identifier.
 */
export function generateId() {
    var uuid = '';
    for (var i = 0; i < 24; i++)
        uuid += Math.floor(Math.random() * 0xF).toString(0xF);

    return uuid;
}
/**
 * Declare a Global Object
 * @param {String} name
 * @param {Object} [value]
 */
export function globalDeclare(name, value) {
    window[name] = value;
}
/**
 * Get a global variable
 * @param variableName
 * @returns {*}
 */
export function getVariable(variableName) {
    return window[variableName];
}
/**
 * Declare a class
 * @param {String} className
 * @param {Function} classBody
 */
export function newClass(className, classBody) {
    globalDeclare(className, classBody);
}

let configKey = 'system_config';

export function applyConfig(config) {
    globalDeclare(configKey, config || {});
}

export function setConfig(name, value) {
    getVariable(configKey)[name] = value;
}

export function getConfig(name) {
    return getVariable(configKey)[name];
}

export function sendAjax(options, callback) {
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

export function uploadFile(files, callback) {
    let __fd = new FormData();
    let __files = files || [];
    for (let i = 0; i < __files.length; i++) {
        let __file = __files[i];
        __fd.append('name', __file.name);
        __fd.append('file', __file);
    }
    sendAjax({
        url: '',
        data: __fd
    }, callback);
}

// Apply new method to Function prototype
Function.prototype['delegate'] = function (obj, args, appendArgs) {
    let method = this;
    return function () {
        let callArgs = args || arguments;
        if (appendArgs === true) {
            callArgs = Array.prototype.slice.call(arguments, 0);
            callArgs = callArgs.concat(args);
        }
        else if (isNumber(appendArgs)) {
            callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
            let applyArgs = [appendArgs, 0].concat(args); // create method call params
            Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
        }
        return method.apply(obj || window, callArgs);
    };
};