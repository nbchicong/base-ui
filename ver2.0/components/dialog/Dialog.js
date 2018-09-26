// #PACKAGE: components
// #MODULE: dialog
/**
 * @class Dialog
 * @extends Component
 * @param config
 * @constructor
 */
var Dialog = function (config) {
  config = config || {};
  this.prefix = (config.prefix) ? config.prefix : config.id;
  this.id = 'modal-dialog';
  CT.apply(this, config);//apply configuration
  this.prefix = (this.prefix) ? (this.prefix + '-') : '';
  this.name = 'Dialog';
  this.dialogId = String.format('#{0}', this.id);
  this.buttons = this.buttons ? this.buttons : [];
  this.title = this.title || '';
  this.content = this.content || '';

  if (this.getEl().length === 0) {
    $('body').append(String.format('<div id="{0}" class="modal fade in" style="display: none"></div>', this.id));
  } else {
    this.content = this.getEl().html();
  }
};
CT.extend(Dialog, Component, {
  initComponent: function () {
    var __html = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
    __html += '<a class="close" data-dismiss="modal">&times;</a>';
    __html += String.format('<h4>{0}</h4>', this.getTitle());
    __html += '</div>';
    __html += String.format('<div class="modal-body">{0}</div>', this.getContent());
    __html += '<div class="modal-footer">';
    __html += this.generateButtons();
    __html += '</div></div></div>';
    this.getEl().html(__html);
  },
  generateButtons: function () {
    var __html = '';
    if (isArray(this.buttons)) {
      for (var i = 0; i < this.buttons.length; i++) {
        var __button = this.buttons[i];
        __button.id = (__button.id) ? __button.id : this.prefix + CT.generateId();
        __html += String.format('<button id="{0}" class="btn btn-sm {1}"><span class="{2}"></span> {3}</button>', __button.id, __button.cls || '', __button.icon, __button.text);
        this.getEl().off('click', '#' + __button.id).on('click', '#' + __button.id, __button.fn.createDelegate(this));
      }
    }
    return __html;
  },
  getEl: function () {
    return $(this.dialogId);
  },
  show: function () {
    if (this.getEl().length < 1) {
      return;
    }
    this.getEl().modal('show');
    var __buttons = this.getButtons() || [];
    if (__buttons.length > 0) {
      $(__buttons[0]).focus();
    }
    return this;
  },
  hide: function () {
    this.getEl().modal('hide');
    return this;
  },
  getContent: function () {
    return this.content;
  },
  setContent: function (content) {
    this.content = content;
    this.getEl().find('.modal-body').html(this.content);
  },
  setTitle: function (title) {
    this.title = title;
    this.getEl().find('.modal-header h4').html(this.title);
  },
  getTitle: function () {
    return this.title;
  },
  getMask: function () {
    return this.getEl();
  },
  getButtons: function () {
    return this.getEl().find('.modal-footer button');
  },
  setOptions: function (options) {
    this.options = options || {};
  },
  getOptions: function () {
    return this.options;
  },
  setData: function (data) {
    this.data = data;
  },
  getData: function () {
    return this.data;
  },
  destroy: function () {
    this.getEl().remove();
    delete this;
  }
});