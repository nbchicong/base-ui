// #PACKAGE: components
// #MODULE: file-upload
// 
/**
 * Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 *         on 12/10/2016.
 * -------------------------------------------
 * @project base-ui
 * @file FileUpload
 * @author nbchicong

 /**
 * @class FileUpload
 * @extends Component
 */

var listFileUploaded = new Hashtable(),
    imgItemCls = '.ad-image-item',
    btnAddCls = '.btn-add';
var $fileContainer = $('.list-image-container'),
    $fileInput = $('<input type="file" name="File" multiple style="display:none" />'),
    $template = $('#image-template');

function upload(files, callback) {
  var __files = files || [];
  var __fn = callback || function () {
      };
  for (var i = 0; i < __files.length; i++) {
    var __file = __files[i];
    var __fd = new FormData();
    __fd.append('name', __file.name);
    __fd.append('file', __file);
    $.ajax({
      url: InFashion.utils.getUrl('uploadFile'),
      method: 'POST',
      data: __fd,
      dataType: 'JSON',
      processData: false,
      contentType: false,
      cache: false,
      success: function (response) {
        __fn(response);
      }
    });
  }
}

var FileUpload = function () {
  var _this = this;
  this.name = 'FileUpload';
  FileUpload.superclass.constructor.call(this);
  this.initComponent();
  $fileContainer.on('click', '[data-action]', function () {
    var action = this.getAttribute('data-action');
    if (CiCo.isFunction(_this[action]))
      _this[action].call(_this, this);
  });
  $fileInput.on('change', function () {
    upload(this.files, function (result) {
      listFileUploaded.put(result.fileName, result.uri);
      $fileContainer.append(String.format($template.html(), result.fileName, result.uri, result.fileName));
    });
  });
};

CT.extend(FileUpload, Component, {
  initComponent: function () {
    $fileContainer.append($fileInput);
  },
  addFile: function (el) {
    $fileInput.trigger('click');
  },
  removeFile: function (el) {
    var $el = $(el);
    var dataEl = $el.data();
    console.log('remove data', dataEl);
    // TODO: Delete file from server

    // After delete file from server
    if (listFileUploaded.containsKey(dataEl.value)) {
      listFileUploaded.remove(dataEl.value);
      $el.remove();
    }
  },
  /**
   * @param {Array} filesUri
   */
  setFiles: function (filesUri) {
    (filesUri || []).forEach(function (item) {
      $fileContainer.append(String.format($template.html(), item, item, item));
    });
  },
  /**
   * @returns {Array}
   */
  getFiles: function () {
    return listFileUploaded.values();
  },
  /**
   * @param fileName
   * @returns {String|null}
   */
  getFilePath: function (fileName) {
    return listFileUploaded.get(fileName);
  },
  clear: function () {
    listFileUploaded.clear();
    $(imgItemCls + ':not("' + btnAddCls + '")').remove();
  }
});
