// #PACKAGE: grid-columns
// #MODULE: Checkbox
$(function () {
  BaseUI.ns("UI.grid.column.Checkbox");
  //~=================CHECKBOX COLUMN====================================
  /**
   * @class UI.grid.column.Checkbox
   * @extends UI.grid.Editor
   * @param config
   * @constructor
     */
  UI.grid.column.Checkbox = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
    UI.grid.column.Checkbox.superclass.constructor.call(this) ;
  };
  BaseUI.extend(UI.grid.column.Checkbox, UI.grid.Editor, {
    render: function(v){
      var checked = (BaseUI.isBoolean(v) ? v : false ) || (v == '1');
      if (checked) {
        this.setEl($('<label><input style="width:auto;display: inline;" class="ace" type="checkbox" checked="checked" disabled="disabled"/><span class="lbl"></span></label>'));
      } else {
        this.setEl($('<label><input style="width:auto;display: inline;" class="ace" type="checkbox" disabled="disabled"/><span class="lbl"></span></label>'));
      }

      return this.getEl();
    },
    edit: function(v){
      var __column = this.getColumn();
      var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
      var checked = (BaseUI.isBoolean(v) ? v : false ) || (v == '1');
      var $el= null;
      if (checked) {
        $el =$(String.format('<label><input {0} style="width:auto;display: inline;" class="ace"type="checkbox" checked="checked"/><span class="lbl"></span></label>', __disabled));
      } else {
        $el = $(String.format('<label><input {0} style="width:auto;display: inline;" class="ace" type="checkbox"/><span class="lbl"></span></label>', __disabled));
      }

      var grid= this.getGrid();
      $el.on('change', function (e) {
        grid.changeCell(this);
      }.createDelegate(this));

      this.setEl($el);
      return this.getEl();
    },
    getValue: function(){
      var $input = this.getEl().find('input');
      return ($input.length>0) ? $input.is(':checked') : null;
    },
    setValue: function(v){
      var $input = this.getEl().find('input');
      var __checked = (BaseUI.isBoolean(v) ? v : false ) || (v == '1');
      $input.prop('disabled', false).prop('checked', __checked);
    },
    focus: function(){
      var $input = this.getEl().find('input');
      $input.focus();
    }
  });

  UI.grid.ColumnManager.registerType('checkbox', UI.grid.column.Checkbox);


});