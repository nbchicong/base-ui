/**
 * #PACKAGE: uploader
 * #MODULE: file-uploader
 */
/**
 * @license Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 * -------------------------------------------
 */
/**
 * @project base-ui-core
 * @file FileUploader
 * @author nbchicong
 */

$(function () {
  /**
   *
   * @class UI.FileUploader
   * @extends UI.Component
   * @param options
   * @constructor
   */

  /**
   * Init Component
   * @private
   */
  function __initComponent() {
    var _this = this;
    var __html = String.format('<label id="{0}" class="ace-file-input">', this.getWrapperId());
    __html += this.getInput()[0].outerHTML;
    __html += String.format('<span id="{0}" class="ace-file-container" data-title="{1}">',
        this.getContainerId(), this.getText('choose'));
    __html += String.format('<span id="{0}" class="ace-file-name" data-title="{1}">',
        this.getLabelNameId(), this.getText('noFileSelected'));
    __html += String.format('<i class="ace-icon {0}"></i></span></span>', this.getIconCls());
    __html += String.format('<a id="{0}" class="remove" href="javascript:;"><i class="ace-icon {1}"></i></a></label>',
        this.getBtnRemoveId(), this.getIconRemoveCls());
    this.getInput().before(__html);
    this.getInput().remove();
  }
  UI.FileUploader = function (options) {
    BaseUI.apply(this, options || {});
    this.inputId = this.inputId || 'input-file';
    this.wrapperId = BaseUI.generateId();
    this.containerId = BaseUI.generateId();
    this.labelNameId = BaseUI.generateId();
    this.btnRemoveId = BaseUI.generateId();
    this.iconCls = this.iconCls || 'fa fa-upload';
    this.iconRemoveCls = this.iconRemoveCls || 'fa fa-times';
    this.resources = this.resources || {
      choose: 'Chọn tập tin',
      noFileSelected: 'Chưa có tập tin nào được chọn ...'
    };
    this.$inputEl = $('#' + this.inputId);
    this.$wrapper = $('#' + this.wrapperId);
    this.$container = $('#' + this.containerId);
    this.$labelName = $('#' + this.labelNameId);
    this.$btnRemove = $('#' + this.btnRemoveId);
    UI.FileUploader.superclass.constructor.call(this);
    __initComponent.call(this);
  };
  BaseUI.extend(UI.FileUploader, UI.Component, {
    getInput: function () {
      return this.$inputEl;
    },
    getWrapperId: function () {
      return this.wrapperId;
    },
    getWrapper: function () {
      return this.$wrapper;
    },
    getContainerId: function () {
      return this.containerId;
    },
    getContainer: function () {
      return this.$container;
    },
    getLabelNameId: function () {
      return this.labelNameId;
    },
    getLabelName: function () {
      return this.$labelName;
    },
    getIconCls: function () {
      return this.iconCls;
    },
    getIconRemoveCls: function () {
      return this.iconRemoveCls;
    },
    getBtnRemoveId: function () {
      return this.btnRemoveId;
    },
    getBtnRemove: function () {
      return this.$btnRemove;
    },
    getResources: function () {
      return this.resources;
    },
    getText: function (key) {
      return this.getResources()[key];
    }
  });
});