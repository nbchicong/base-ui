// #PACKAGE: components
// #MODULE: grid-columns
/**
 * @class ColumnTypeAhead
 * @extends GridEditor
 * @param config
 * @constructor
 */
ColumnTypeAhead = function (config) {
  CT.apply(this, config || {});//apply configuration
  ColumnTypeAhead.superclass.constructor.call(this);
};
CT.extend(ColumnTypeAhead, GridEditor, {
  render: function (v) {
    this.setEl($(String.format('<span>{0}</span>', !isEmpty(v) ? v : '')));
    return this.getEl();
  },
  edit: function (v) {
    v = !isEmpty(v) ? v : '';
    var _this = this;
    var __column = this.getColumn();
    var __align = __column.align || 'left';
    var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
    var $el = $(String.format('<input value="{0}" {1} style="text-align:{2}"/>', v, __disabled, __align));
    var grid = this.getGrid();

    $el.on('keydown', function (e) {
      var code = e.keyCode ? e.keyCode : e.which;
      var __id = _this.getRecordId();
      if (code == 13 && !$el.data('typeahead').shown) {
        grid.save(__id);
      } else if (code == 27) {
        grid.cancel(__id);
      }
    });

    $el.on('change', function (e) {
      grid.changeCell(_this);
    });

    this.setEl($el);
    this.applyUI();
    return this.getEl();
  },
  applyUI: function () {
    var __column = this.getColumn() || {};
    if (__column.type == 'typeahead') {
      if (!this.getEl()) {
        throw new Error('$cell must not be null');
      }
      try {
        if (!$.fn.typeahead) {
          console.error('Typeahead plugin could not be found');
          return;
        }
        return this.getEl().typeahead({source: __column.editData} || {});
      } catch (err) {
        throw new Error(err.message);
      }
    }
  },
  getValue: function () {
    var $input = this.getEl();
    return ($input.length > 0) ? $input.val() : null;
  },
  setValue: function (v) {
    var $input = this.getEl();
    $input.val(!isEmpty(v) ? v : '');
  }
});
ColumnManager.registerType('typeahead', ColumnTypeAhead);