/**
 * #PACKAGE: components
 * #MODULE: ajax-loading
 */
/**
 * Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 *         on 2:36 PM 19/10/2016.
 * -------------------------------------------
 * @project base-ui-core
 * @author nbccong
 * @file AjaxLoading.js
 */

/**
 * @class AjaxLoading
 * @extends Component
 */

var GLOBAL_LOADING_ATTR = 'js-loading';

var $doc = $(document);
var $body = $('body');

function isExisted() {
  return $body[0].hasAttribute(GLOBAL_LOADING_ATTR);
}
function setTextLoading(msg) {
  this.getEl().find('.text-loading').html(msg || this.message);
}
var AjaxLoading = function (options) {
  var _this = this;
  CT.apply(this, options || {});
  this.name = 'AjaxLoading';
  this.id = null;
  this.message = this.message || 'Đang tải dữ liệu ...';

  AjaxLoading.superclass.constructor.call(this);

  $doc.ajaxStart(function () {
    if (!isExisted()) {
      _this.initComponent();
    }
    _this.show();
  });
  $doc.ajaxStop(function () {
    if (isExisted()) {
      _this.hide();
    }
  });

  this.initComponent();
};
CT.extend(AjaxLoading, Component, {
  initComponent: function () {
    this.id = CT.generateId();
    var html = '<div id="' + this.id + '" style="display:none">' +
        '<div class="mask-loading"></div>' +
        '<div class="loading-container">' +
        '<div class="box box-solid box-loading">' +
        '<div class="box-body">' +
        '<div class="progress active">' +
        '<div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar">' +
        '<span class="text-loading"></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    this.$element = $(html);
    $body.attr(GLOBAL_LOADING_ATTR, this.id)
        .append(this.$element);
  },
  getEl: function () {
    return this.$element || null;
  },
  setText: function (message) {
    this.getEl().find('.text-loading').html(message || this.message);
  },
  destroy: function () {
    $body.removeAttr(GLOBAL_LOADING_ATTR);
    if (this.getEl())
      this.getEl().remove();
  },
  show: function (message) {
    if (this.getEl()) {
      setTextLoading.call(this, message);
      this.getEl().show();
      this.fireEvent('shown', this);
    }
  },
  hide: function () {
    if (this.getEl()) {
      this.getEl().hide();
      this.fireEvent('hidden', this);
    }
  }
});
