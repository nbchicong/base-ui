/**
 * #PACKAGE: notification
 * #MODULE: notify
 */
/**
 * @license Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 *         on 27/04/2016.
 * -------------------------------------------
 * @project base-ui-core
 * @file Notify
 * @author nbchicong
 */
$(function () {
  /**
   * @class UI.Notify
   * @extends UI.Component
   * @param options
   * @constructor
   */
  UI.Notify = function (options) {
    var _this = this;
    BaseUI.apply(this, options || {});
    _this.element = _this.element || document;
    _this.$el = $(_this.element);
    _this.options = _this.options || {};
    _this.defaultOptions = {
      globalPosition: 'top right',
      style: 'bootstrap2'
    };
    _this.__init();
  };
  BaseUI.extend(UI.Notify, UI.Component, {
    __initStyle: function () {
      $.notify.addStyle('bootstrap2', {
        html: '<div>\n<span data-notify-text></span>\n</div>',
        classes: {
          base: {
            'font-weight': 'bold',
            'padding': '8px 15px 8px 14px',
            'text-shadow': '0 1px 0 rgba(255, 255, 255, 0.5)',
            'background-color': '#fcf8e3',
            'border': '1px solid #fbeed5',
            'border-radius': '4px',
            'white-space': 'nowrap'
          },
          error: {
            'color': '#B94A48',
            'background-color': '#F2DEDE',
            'border-color': '#EED3D7'
          },
          success: {
            'color': '#468847',
            'background-color': '#DFF0D8',
            'border-color': '#D6E9C6'
          },
          info: {
            'color': '#3A87AD',
            'background-color': '#D9EDF7',
            'border-color': '#BCE8F1'
          },
          warn: {
            'color': '#C09853',
            'background-color': '#FCF8E3',
            'border-color': '#FBEED5'
          }
        }
      });
    },
    __init: function () {
      this.__initStyle();
      var __options = BaseUI.apply(this.defaultOptions, this.options);
      $.notify.defaults(__options);
      this.eventsFx();
    },
    getEl: function () {
      return this.$el;
    },
    eventsFx: function () {
      this.getEl().on('notify', function (e, msg, type) {
        $.notify(msg, type);
      });
    }
  });
});