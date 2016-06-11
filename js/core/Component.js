/**
 * Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 *         on 15/04/2016.
 * -------------------------------------------
 * @project base-ui
 * @file Component
 * @author nbchicong
 */
/**
 * @class UI.Component
 * @constructor
 */
UI.Component = function () {
  'use strict';
};
UI.Component.prototype = {
  /**
   * Appends an event handler to this object
   * @param {String} eventName The type of event to listen for
   * @param {Function} handler The method the event invokes
   */
  on : function(e, fn) {
    this.events = this.events || {};
    if (!BaseUI.isEmpty(e) && BaseUI.isFunction(fn)) {
      var __fn = fn || BaseUI.emptyFn;
      this.events[e] = __fn;
    }
    return true;
  },

  /**
   * Removes an event handler.
   * @param {String} eventName
   * @param {Function} handler The handler to remove.
   *
   */
  un: function(e) {
    this.events = this.events || {};
    if (!BaseUI.isEmpty(e)) {
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
    return BaseUI.isFunction(e);
  },
  /**
   *
   Fires the specified event with the passed parameters (minus the event name).
   */
  fireEvent : function() {
    this.events = this.events || {};
    var args = BaseUI.toArray(arguments);
    if (args.length < 1) {
      return;
    }
    var eventName = args[0].toLowerCase();
    var __fn = this.events[eventName] || BaseUI.emptyFn;
    //args.splice(0, 1);
    args.shift();
    //shift = [].shift;shift.apply(args);
    __fn.apply(this, args);
  }
}