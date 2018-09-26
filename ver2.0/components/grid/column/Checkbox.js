// #PACKAGE: components
// #MODULE: grid-columns
/**
 * @class ColumnCheckbox
 * @extends GridEditor
 * @param config
 * @constructor
 */
ColumnCheckbox = function (config) {
  CT.apply(this, config || {});
  ColumnCheckbox.superclass.constructor.call(this);
};
CT.extend(ColumnCheckbox, GridEditor, {
  render: function (v) {
    var checked = (isBoolean(v) ? v : false ) || (v == '1');
    if (checked) {
      this.setEl($('<label><input style="width:auto;display: inline;" class="ace" type="checkbox" checked="checked" disabled="disabled"/><span class="lbl"></span></label>'));
    } else {
      this.setEl($('<label><input style="width:auto;display: inline;" class="ace" type="checkbox" disabled="disabled"/><span class="lbl"></span></label>'));
    }

    return this.getEl();
  },
  edit: function (v) {
    var _this = this;
    var __column = this.getColumn();
    var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
    var checked = (isBoolean(v) ? v : false ) || (v == '1');
    var $el = null;
    if (checked) {
      $el = $(String.format('<label><input {0} style="width:auto;display: inline;" class="ace"type="checkbox" checked="checked"/><span class="lbl"></span></label>', __disabled));
    } else {
      $el = $(String.format('<label><input {0} style="width:auto;display: inline;" class="ace" type="checkbox"/><span class="lbl"></span></label>', __disabled));
    }

    $el.on('change', function (e) {
      _this.getGrid().changeCell(_this);
    });

    this.setEl($el);
    return this.getEl();
  },
  getValue: function () {
    var $input = this.getEl().find('input');
    return ($input.length > 0) ? $input.is(':checked') : null;
  },
  setValue: function (v) {
    var $input = this.getEl().find('input');
    var __checked = (isBoolean(v) ? v : false ) || (v == '1');
    $input.prop('disabled', false).prop('checked', __checked);
  },
  focus: function () {
    var $input = this.getEl().find('input');
    $input.focus();
  }
});

ColumnManager.registerType('checkbox', ColumnCheckbox);