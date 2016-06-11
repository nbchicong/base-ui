// #PACKAGE: grid-columns
// #MODULE: Textbox
$(function () {
  BaseUI.ns("UI.grid.column.Textbox");
  //~=================TEXTBOX COLUMN====================================
  /**
   * @class UI.grid.column.Textbox
   * @extends UI.grid.Editor
   * @param config
   * @constructor
     */
  UI.grid.column.Textbox = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
    UI.grid.column.Textbox.superclass.constructor.call(this) ;
  };
  BaseUI.extend(UI.grid.column.Textbox, UI.grid.Editor, {
    render: function(v){
      this.setEl($(String.format('<span>{0}</span>',!BaseUI.isEmpty(v) ? v : '')));
      return this.getEl();
    },
    edit: function(v){
      v = !BaseUI.isEmpty(v) ? v : '';
      var __column = this.getColumn();
      var __align = __column.align || 'left';
      var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
      var $el = $(String.format('<input value="{0}" {1} style="text-align:{2}"/>', v, __disabled, __align));
      var grid= this.getGrid();

      $el.on('keydown', function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        var __id = this.getRecordId();
        if (code == 13) {
          grid.save(__id);
        } else if (code == 27) {
          grid.cancel(__id);
        }
      }.createDelegate(this));

      $el.on('change', function (e) {
        grid.changeCell(this);
      }.createDelegate(this));

      this.setEl($el);
      return this.getEl();
    },
    getValue: function(){
      var $input = this.getEl();
      return ($input.length>0) ? $input.val() : null;
    },
    setValue: function(v){
      var $input = this.getEl();
      $input.val(!BaseUI.isEmpty(v)? v: '');
    }
  });

  UI.grid.ColumnManager.registerType('text', UI.grid.column.Textbox);

});