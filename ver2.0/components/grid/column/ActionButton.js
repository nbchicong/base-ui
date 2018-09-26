// #PACKAGE: components
// #MODULE: grid-columns
/**
 * @class GridButton
 * @extends Component
 * @param config
 * @constructor
 */
var GridButton = function (config) {
  CT.apply(this, config || {});
};
CT.extend(GridButton, Component, {
  getEl: function () {
    return $(this.$el);
  },
  hide: function () {
    this.getEl().hide();
  },
  show: function () {
    this.getEl().show();
  },
  setVisible: function (v) {
    if (v) {
      this.getEl().show();
    } else {
      this.getEl().hide();
    }
  }
});
/**
 * @class ColumnAction
 * @extends GridEditor
 * @param config
 * @constructor
 */
var ColumnAction = function (config) {
  CT.apply(this, config || {});
  ColumnAction.superclass.constructor.call(this);
};
CT.extend(ColumnAction, GridEditor, {
  render: function (v, data) {
    var __column = this.getColumn();
    if (!isObject(__column))
      return;

    var __separate = __column.separate || '&nbsp;';
    var __buttons = __column.buttons || [];
    var __data = data || {};
    var $el = $('<div></div>');
    if (isArray(__buttons)) {
      for (var i = 0; i < __buttons.length; i++) {
        var __button = __buttons[i];
        __button.id = 'btn-' + CT.generateId();
        var __fnVisibled = __button.visibled || function () {
              return true;
            };
        var __isVisibled = __fnVisibled(__data);
        var __cls = (__button.labelCls != undefined) ? __button.labelCls : 'label label-info';
        if (!__isVisibled)
          __cls = __cls + ' hide';

        var $button = $(String.format('<span title="{1}" class="{2}"><i class="{0} icon-white"/></span>', __button.icon, __button.text, __cls));
        $el.append($button);
        $button.on('click', function () {
          __buttons[$(this).index()].fn(__data);
        });

        if (!isEmpty(__separate) && i != __buttons.length - 1)
          $el.append(__separate);
      }
    }
    this.getCell().attr('data-action', 'click').width('auto');
    this.setEl($el);
    return this.getEl();
  },
  insert: function () {
    var _this = this;
    var __column = this.getColumn();
    var __separate = __column.separate || '&nbsp;';
    var $el = $('<div></div>');
    var $btnOk = $(String.format('<span title="Add" class="label label-success" style="cursor: pointer"><i class="fa fa-plus icon-white"/></span>'));
    var $btnCancel = $(String.format('<span title="Cancel" class="label label-important" style="cursor: pointer"><i class="fa fa-remove"/></span>'));
    $el.append($btnOk).append(__separate).append($btnCancel);

    $btnOk.on('click', function () {
      _this.getGrid().save();
    });

    $btnCancel.on('click', function () {
      _this.getGrid().cancel();
    });

    this.getCell().width(65);
    this.setEl($el);
    return this.getEl();
  },
  edit: function (v) {
    var _this = this;
    var __column = this.getColumn();
    var __separate = __column.separate || '&nbsp;';
    var $el = $('<div></div>');
    var $btnOk = $(String.format('<span title="Update" class="label label-success"><i class="fa fa-check icon-white"/></span>'));
    var $btnCancel = $(String.format('<span title="Cancel" class="label label-important"><i class="fa fa-remove"/></span>'));
    $el.append($btnOk).append(__separate).append($btnCancel);

    $btnOk.on('click', function () {
      _this.getGrid().save(_this.getRecordId());
    });

    $btnCancel.on('click', function () {
      _this.getGrid().cancel(_this.getRecordId());
    });

    this.getCell().width(65);
    this.setEl($el);
    return this.getEl();
  },
  get: function (index) {
    var name = 'action-column-id' + index;
    if (!this[name]) {
      this[name] = new GridButton({$el: this.getEl().find('span').get(index)});
    }
    return this[name];
  }
});

ColumnManager.registerType('action', ColumnAction);