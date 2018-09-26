// #PACKAGE: components
// #MODULE: grid-columns
/**
 * @class ColumnLabel
 * @extends GridEditor
 * @param config
 * @constructor
 */
var ColumnLabel = function (config) {
  CT.apply(this, config || {});
  ColumnLabel.superclass.constructor.call(this);
};
CT.extend(ColumnLabel, GridEditor, {
  render: function (v) {
    this.setEl($(String.format('<span>{0}</span>', !isEmpty(v) ? v : '')));
    return this.getEl();
  },
  edit: function (v) {
    return this.render(v);
  },
  getValue: function () {
    return (this.getEl().length > 0) ? this.getEl().html() : null;
  },
  setValue: function (v) {
    this.getEl().html(!isEmpty(v) ? v : '');
  },
  focus: function () {
    this.getRow().find('input:first').focus();
  }
});
ColumnManager.registerType('label', ColumnLabel);