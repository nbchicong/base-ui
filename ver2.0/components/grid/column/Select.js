// #PACKAGE: components
// #MODULE: grid-columns
/**
 * @class ColumnSelect
 * @extends GridEditor
 * @param config
 * @constructor
 */
var ColumnSelect = function (config) {
  CT.apply(this, config || {});
  ColumnSelect.superclass.constructor.call(this);
};
CT.extend(ColumnSelect, GridEditor, {
  render: function (v) {
    var __column = this.getColumn();
    var sources = __column.editData || [];
    var valueField = __column.valueField || 'value';
    var displayField = __column.displayField || 'text';
    var __text = isObject(v) ? v[displayField] : '';
    v = isObject(v) ? v[valueField] : v;
    for (var j = 0; j < sources.length; j++) {
      var __data = sources[j] || {};
      if (__data[valueField] == v) {
        __text = __data[displayField];
        break;
      }
    }
    this.setEl($(String.format('<span>{0}</span>', __text || v)));
    return this.getEl();
  },
  edit: function (v) {
    var _this = this;
    var __column = this.getColumn();
    var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
    var sources = __column.editData || [];
    var __options = [];
    var valueField = __column.valueField || 'value';
    var displayField = __column.displayField || 'text';
    var emptyString = __column.emptyString || '----------';
    var forceSelection = !isEmpty(__column.forceSelection) ? __column.forceSelection : true;
    var __text = isObject(v) ? v[displayField] : '';
    v = isObject(v) ? v[valueField] : v;
    var $el = null;
    var grid = this.getGrid();
    var isDefault = false;
    if (!forceSelection)
      __options.push(String.format('<option value="">{0}</option>', emptyString));

    for (var k = 0; k < sources.length; k++) {
      var __data = sources[k] || {};
      if (__data[valueField] == v) {
        __options.push(String.format('<option selected value="{0}">{1}</option>', __data[valueField], __data[displayField]));
        isDefault = true;
      } else {
        __options.push(String.format('<option value="{0}">{1}</option>', __data[valueField], __data[displayField]));
      }
    }
    if (!isDefault && !isEmpty(v)) { // value is not exist
      __options.splice(0, 0, String.format('<option selected value="{0}">{1}</option>', v, __text || v));
    }
    if (__column.type == 'select2') {
      $el = $(String.format('<select {0} data-type="select2" style="width:100%">', __disabled) + __options.join() + '<select/>');
    } else {
      $el = $(String.format('<select data-type="select" {0}>', __disabled) + __options.join() + '<select/>');

    }
    $el.on('change', function (e) {
      grid.changeCell(_this);
    });
    if (__column.type == 'select') {
      $el.on('click', function (e) {
        grid.clickCell(_this);
      });
    }
    this.setEl($el);
    var control = this.applyUI();
    if (__column.type == 'select2' && control) {
      if (control) {
        control.on('select2-opening', function (e) {
          grid.clickCell(_this);
        });
      }
    }
    return this.getEl();
  },
  applyUI: function () {
    var __column = this.getColumn() || {};
    if (__column.type == 'select2') {
      if (!this.getEl()) {
        throw new Error('$cell must not be null');
      }
      try {
        if (!$.fn.select2) {
          console.error('select2 plugin could not be found');
          return;
        }
        return this.getEl().select2(__column.getConfig() || {});
      } catch (err) {
        throw new Error(err.message);
      }
    }
  },
  getValue: function () {
    var __column = this.getColumn();
    var $input = this.getEl();
    switch (__column.type) {
      case 'select':
        var valueField = __column.valueField || 'value';
        var v = $input.val();
        if (__column.dataType == 'object') {
          var sources = __column.editData || [];
          for (var i = 0; i < sources.length; i++) {
            var __dt = sources[i];
            if (__dt[valueField] == v) {
              v = __dt;
            }
          }
        }
        return v;
      case 'select2':
        if ($input.length > 0) {
          try {
            return $input.select2("val");
          } catch (err) {
            throw new Error(err.message);
          }
        }
        return null;
    }
  },
  setValue: function (v) {
    var __column = this.getColumn();
    var $input = this.getEl();
    switch (__column.type) {
      case 'select':
        $input.find('select').val(v);
        break;
      case 'select2':
        $input.select2('val', v);
        break;
    }
  },
  focus: function () {
    this.getEl().select2('focus');
  }
});
ColumnManager.registerType('select', ColumnSelect);
ColumnManager.registerType('select2', ColumnSelect);