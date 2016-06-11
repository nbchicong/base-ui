/**
 * Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 *         on 25/03/2016.
 * -------------------------------------------
 * @project base-ui
 * @file Clazz
 * @author nbchicong
 */
$(function () {
  /**
   * @class UI.Clazz
   * @extends UI.Component
   * @constructor
   */
  UI.Clazz = function () {
    this.id = this.id || null;
    this.activeMenuById();
    this._init();
    UI.Clazz.superclass.constructor.call(this);
  };
  BaseUI.extend(UI.Clazz, UI.Component, {
    constructor: UI.Clazz,
    _init: function () {
      new UI.Notify({element: this.getEl()});
    },
    getEl: function () {
      return $('#'+this.id);
    },
    setId: function (id) {
      this.id = id;
    },
    getId: function () {
      return this.id;
    },
    activeMenuById: function () {
      var $sideBar = $('#sidebar-menu');
      $sideBar.find('li.treeview').removeClass('active')
              .find('ul.treeview-menu').removeClass('menu-open').hide();
      $('#menu-'+this.getId()).addClass('active')
              .parent().addClass('menu-open').show()
              .parent().addClass('active');
    },
    responseHandle: function (response, callback) {
      var __fn = callback || BaseUI.emptyFn;
      if (response.success || response.id) {
        __fn(response);
      }
    },
    /**
     *
     * @param {String} message Message notify
     * @param {String} type Type of notify: info|success|warning|error
     */
    notify: function (message, type) {
      this.getEl().trigger('notify', [message, type]);
    }
  });
});