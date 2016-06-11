// #PACKAGE: grid-columns
// #MODULE: Selection
$(function () {
  BaseUI.ns("UI.grid.column.Selection");
  //~=================CHECKBOX COLUMN====================================
  /**
   * @class UI.grid.column.Selection
   * @extends UI.grid.Editor
   * @param config
   * @constructor
     */
  UI.grid.column.Selection = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
    UI.grid.column.Selection.superclass.constructor.call(this) ;
  };
  BaseUI.extend(UI.grid.column.Selection, UI.grid.Editor, {
    render: function(v){
      var __column = this.getColumn();
      var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
      this.setEl($(String.format('<label><input {0} type="checkbox" class="ace"/><span class="lbl"></span></label></td>', __disabled)));
      this.getCell().addClass(__column.cls).attr('data-action', 'select').css('text-align', __column.align || 'center');
      return this.getEl();
    },
    edit: function(v){
      var $el = $('<i class="icon-certificate"></i>');
      this.setEl($el);
      return this.getEl();
    }
  });

  UI.grid.ColumnManager.registerType('selection', UI.grid.column.Selection);


});