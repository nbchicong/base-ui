// #PACKAGE: components
// #MODULE: grid-columns
/**
 * @class ColumnSelection
 * @extends GridEditor
 * @param config
 * @constructor
 */
var ColumnSelection = function (config) {
  CT.apply(this, config || {});
  ColumnSelection.superclass.constructor.call(this);
};
CT.extend(ColumnSelection, GridEditor, {
  render: function (v) {
    var __column = this.getColumn();
    var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
    this.setEl($(String.format('<label><input {0} type="checkbox" class="ace"/><span class="lbl"></span></label></td>', __disabled)));
    this.getCell().addClass(__column.cls).attr('data-action', 'select').css('text-align', __column.align || 'center');
    return this.getEl();
  },
  edit: function (v) {
    var $el = $('<i class="icon-certificate"></i>');
    this.setEl($el);
    return this.getEl();
  }
});

ColumnManager.registerType('selection', ColumnSelection);