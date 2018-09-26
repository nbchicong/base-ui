/**
 * Copyright (c) 2017 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * Date: 14/02/2017
 * Time: 11:42 PM
 * ---------------------------------------------------
 * Project: market-mini
 * @name: CoreClazz
 * @author: nbchicong
 */

/**
 * @class Component
 * @constructor
 */
var Component = function () {
  'use strict';
  this.initial();
};
Component.prototype = {
  /**
   * Declared component
   */
  initial: function () {
    window[this.name] = null;
  },
  /**
   * Init component
   */
  initComponent: function () {},
  /**
   * Appends an event handler to this object
   * @param {String} e The type of event to listen for
   * @param {Function} fn The method the event invokes
   */
  on: function(e, fn) {
    this.events = this.events || {};
    if (!isEmpty(e) && isFunction(fn)) {
      this.events[e] = (fn || function () {});
    }
    return true;
  },

  /**
   * Removes an event handler.
   * @param {String} e
   *
   */
  un: function(e) {
    this.events = this.events || {};
    if (!isEmpty(e)) {
      delete this.events[e];
    }
    return true;
  },

  /**
   * Checks to see if this object has any event name for a specified event
   * @param {String} eventName The name of the event to check for
   * @return {Boolean} True if the event is being listened for, else false
   */
  hasEvent : function(eventName) {
    this.events = this.events || {};
    var e = this.events[eventName];
    return isFunction(e);
  },
  /**
   *
   Fires the specified event with the passed parameters (minus the event name).
   */
  fireEvent: function() {
    this.events = this.events || {};
    var args = CT.toArray(arguments);
    if (args.length < 1)
      return;

    var eventName = args[0].toLowerCase();
    var fn = this.events[eventName] || function () {};
    args.shift();
    fn.apply(this, args);
  }
};

/**
 * @class AbstractClass
 * @constructor
 */

window.CTLoading = null;
var __getCsrf = function () {
  var __csrf = {};
  __csrf[ID_TK] = ID_TK_VL;
  return __csrf;
};
AbstractClass = function () {
  this.id = this.id || null;
  this.idProperties = this.idProperties || 'id';
  this.activeMenuById();
  this.init();
};
AbstractClass.prototype = {
  init: function () {
    new Notify({element: this.getEl()});

    if (!window.CTLoading)
      window.CTLoading = new AjaxLoading();
  },
  setTextLoading: function (message) {
    this.loadingMsg = message;
  },
  getTextLoading: function () {
    return this.loadingMsg || 'Đang tải dữ liệu';
  },
  /**
   * @returns {AjaxLoading|null}
   */
  getLoading: function () {
    return window.CTLoading;
  },
  getIdProperties: function () {
    return this.idProperties;
  },
  getEl: function () {
    return $('#' + this.id);
  },
  setId: function (id) {
    this.id = id;
  },
  getId: function () {
    return this.id;
  },
  getToken: __getCsrf,
  putToken: function (data) {
    var token = __getCsrf();
    for (var key in token)
      if (token.hasOwnProperty(key))
        data[key] = token[key];

    return data;
  },
  getAction: function (el) {
    var $el = $(el);
    var actionArr = $el.attr('data-action').split('-');
    var actionName = '';
    for (var i = 0; i < actionArr.length; i++)
      actionName += (i === 0 ? actionArr[i] : actionArr[i].capitalize());

    return actionName;
  },
  activeMenuById: function () {
    var $sideBar = $('#sidebar-menu');
    $sideBar.find('li.treeview').removeClass('active')
        .find('ul.treeview-menu').removeClass('menu-open').hide();
    $('#menu-' + this.getId()).addClass('active')
        .parent().addClass('menu-open').show()
        .parent().addClass('active');
  },
  responseHandler: function (response, callback) {
    if (response.success || response.id || response === true)
      callback && callback(response);
  },
  /**
   *
   * @param {String} message Message notify
   * @param {String} type Type of notify: info|success|warning|error
   */
  notify: function (message, type) {
    this.getEl().trigger('notify', [message, type]);
  }
};

var Requests = {
  getUrl: function (path, timeStamp) {
    if (getConfig('context') !== undefined) {
      var url = getConfig('context') + '/' + path;
      url += (!isEmpty(getConfig('ext')) && isDefined(getConfig('ext'))) ? getConfig('ext') : '';
      url += timeStamp ? '?_t=' + timeStamp : '';
      return url;
    }
    return path + (timeStamp ? '?_t=' + timeStamp : '');
  },
  parseFormData: function (data) {
    if (toString.apply(data) === '[object Object]') {
      var fd = new FormData();
      for (var key in data)
        if (data.hasOwnProperty(key))
          fd.append(key, data[key]);

      fd.append(ID_TK, ID_TK_VL);
      return fd;
    }
    if (toString.apply(data) === '[object FormData]')
      data.append(ID_TK, ID_TK_VL);

    return data;
  }
};

var Responses = {
  handler: function (response, callback) {
    if (response.success || response.id || response === true)
      callback && callback(response);
  }
};