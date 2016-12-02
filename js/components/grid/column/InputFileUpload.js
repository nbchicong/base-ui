// #PACKAGE: grid-columns
// #MODULE: InputFileUpload
/**
 * Copyright (c) 2015 BaseUI Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@BaseUIcloud.vn>
 *         on 12:51 29/09/2015.
 * -------------------------------------------
 * @project BaseUI-ui-core
 * @file InputFileUpload
 * @author nbchicong
 */

$(function () {
  BaseUI.ns('UI.grid.column.InputFileUpload');
  /**
   * @class UI.grid.column.InputFileUpload
   * @extends UI.grid.Editor
   * @param options
   * @constructor
     */
  UI.grid.column.InputFileUpload = function (options) {
    var __opts = options || {};
    BaseUI.apply(this, __opts);
    this.isChange = false;
    UI.grid.column.InputFileUpload.superclass.constructor.call(this);
  };
  BaseUI.extend(UI.grid.column.InputFileUpload, UI.grid.Editor, {
    render: function (v) {
      if (!v) {
        this.getCell().html('<i>Chưa đính kèm tập tin</i>');
        return;
      }
      var __column = this.getColumn();
      var __multiple = __column.multiple || false;
      var __idField = __column.idField || 'uuid';
      var __displayField = __column.displayField || 'file';
      var __nameField = __column.nameField || 'name';
      var __html = '<ul class="list-unstyled">';
      if (__multiple) {
        if (BaseUI.isArray(v)) {
          for (var i = 0; i < BaseUI.getSize(v); i++) {
            __html += String.format('<li class="text-primary" data-code="{0}" data-name="{1}">{2}</li>', v[i][__idField], v[i][__nameField], v[i][__displayField]);
          }
        }
      } else {
        __html += String.format('<li class="text-primary" data-code="{0}" data-name="{1}">{2}</li>', v[0][__idField], v[0][__nameField], v[0][__displayField]);
      }
      this.setEl($(String.format('<span>{0}</ul></span>', __html)));
      return this.getEl();
    },
    edit: function (v) {
      var _this = this;
      var __column = this.getColumn();
      var __multiple = __column.multiple || false;
      var __idField = __column.idField || 'uuid';
      var __displayField = __column.displayField || 'file';
      var __nameField = __column.nameField || 'name';
      var __acceptFile = __column.acceptFile || '.zip';
      var __onChange = __column.onChange || BaseUI.emptyFn;
      var __deleteHtml = '<i data-action="delete" data-type="file" class="ace-icon fa fa-times red"></i>';
      var __html = '<ul class="list-unstyled">';
      if (!v)
        __html += String.format('<li data-type="input">' +
            '<label id="file-upload-container" class="ace-file-input">' +
            '<input type="file" id="input-file-upload" ' + (__multiple?'multiple="multiple"':'') + ' accept="{3}" />' +
            '<span class="ace-file-container" data-type="button" data-title="Chọn tập tin">' +
            '<span class="ace-file-name" data-type="label" data-title="Chưa tập tin nào được chọn">' +
            '<i data-type="icon" class="ace-icon fa fa-upload"></i>' +
            '</span>' +
            '</span>' +
            '<a class="remove" href="javascript:;" data-action="remove"><i class="ace-icon fa fa-times"></i></a>' +
            '</label>' +
            '</li>', '', '', __acceptFile);
      else {
        if (__multiple) {
          if (BaseUI.isArray(v)) {
            for (var i = 0; i < BaseUI.getSize(v); i++) {
              __html += String.format('<li class="text-primary" data-code="{0}" data-name="{1}">{2} {3}</li>', v[i][__idField], v[i][__nameField], v[i][__displayField], __deleteHtml);
            }
          }
          __html += String.format('<li data-type="input"><label id="file-upload-container" class="ace-file-input">' +
              '<input type="file" id="input-file-upload" multiple="multiple" accept="{0}" />' +
              '<span class="ace-file-container" data-type="button" data-title="Chọn tập tin">' +
              '<span class="ace-file-name" data-type="label" data-title="Chưa tập tin nào được chọn">' +
              '<i data-type="icon" class="ace-icon fa fa-upload"></i>' +
              '</span>' +
              '</span>' +
              '<a class="remove" href="javascript:;" data-action="remove"><i class="ace-icon fa fa-times"></i></a>' +
              '</label></li>', __acceptFile);
        } else {
          __html += String.format('<li data-type="input" data-code="{0}" data-name="{1}">' +
              '<label id="file-upload-container" class="ace-file-input">' +
              '<input type="file" id="input-file-upload" accept="{3}" />' +
              '<span class="ace-file-container" data-type="button" data-title="Chọn tập tin">' +
              '<span class="ace-file-name" data-type="label" data-title="{2}">' +
              '<i data-type="icon" class="ace-icon fa fa-upload"></i>' +
              '</span>' +
              '</span>' +
              '<a class="remove" href="javascript:;" data-action="remove"><i class="ace-icon fa fa-times"></i></a>' +
              '</label>' +
              '</li>', v[0][__idField], v[0][__nameField], v[0][__displayField], __acceptFile);
        }
      }
      this.setEl($(String.format('<span>{0}</ul></span>', __html)));
      this.getEl().on('click', '[data-action="delete"]', function () {
        var $parent = $(this).parent();
        _this.getGrid().fireAction(_this.getEvent(this), {uuid: $parent.data('code'), name: $parent.data('name')});
      });
      this.getEl().on('click', '[data-action="remove"]', function () {
        var $inputFileUpload = this.getEl().find('#input-file-upload');
        _this.getEl().find('.ace-file-container').attr('data-title', 'Chọn tập tin');
        _this.getEl().find('[data-type="icon"]').removeClass('fa-file').addClass('fa-upload');
        $inputFileUpload.replaceWith($inputFileUpload = $inputFileUpload.clone(true));
      });
      this.getEl().find('#input-file-upload').on('change', function () {
        //_this.isChange = true;
        _this.getEl().find('.ace-file-container').attr('data-title', 'Thay đổi tập tin');
        _this.getEl().find('[data-type="icon"]').removeClass('fa-upload').addClass('fa-file');
        _this.setFiles(this.files);
        __onChange.call(_this, this.files);
      });
    },
    setFiles: function (files) {
      this.files = files;
    },
    getFiles: function () {
      return this.files;
    },
    getEvent: function (el) {
      var $el = $(el);
      return String.format('{0}_{1}', $el.data('action'), $el.data('type'));
    },
    getValue: function () {
      //this.getEl().find('li[data-type="input"]').remove();
      return this.getFiles();
    },
    setValue: function () {},
    applyUI: function () {},
    focus: function () {}
  });
  UI.grid.ColumnManager.registerType('fileUpload', UI.grid.column.InputFileUpload);
});
