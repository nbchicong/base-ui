// #PACKAGE: grid-columns
// #MODULE: Textbox
$(function () {
  BaseUI.ns("UI.grid.column.Selectx");
  //~=================Selectx COLUMN====================================
  /**
   * @class UI.grid.column.Selectx
   * @extends UI.grid.Editor
   * @param config
   * @constructor
     */
  UI.grid.column.Selectx = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
    UI.grid.column.Selectx.superclass.constructor.call(this) ;
  };
  BaseUI.extend(UI.grid.column.Selectx, UI.grid.Editor, {
    render: function(v){
      var __column = this.getColumn();
      var __displayField = __column.displayField || 'text';
      if (BaseUI.isObject(v) && !BaseUI.isArray(v)) {
        v = v[__displayField] || '';
        this.setEl($(String.format('<span>{0}</span>',v)));
      } else if (BaseUI.isArray(v)) {
        var values = [];
        for (var x = 0; x < v.length; x++) {
          var __data = v[x] || {};
          values.push(__data[__displayField]);
        }
        this.setEl($(String.format('<span>{0}</span>',values.join(','))));
      } else {
        this.setEl($(String.format('<span>{0}</span>',v)));
      }
      return this.getEl();
    },
    edit: function(v) {
      var __column = this.getColumn();
      var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
      var valueField = __column.valueField || 'value';
      if (BaseUI.isObject(v) && !BaseUI.isArray(v)) {
        v = v[valueField] || '';
      } else if (BaseUI.isArray(v)) {
        var values = [];
        for (var x = 0; x < v.length; x++) {
          var __data = v[x] || {};
          values.push(__data[valueField]);
        }
        v = values.join(',');
      } else {
        v = v || '';
      }
      var $el = $(String.format('<input value="{0}" style="width:100%" data-type="selectx" {1} />', v, __disabled));
      var grid = this.getGrid();

      $el.on('change', function (e) {
        grid.changeCell(this);
      }.createDelegate(this));


      this.setEl($el);
      var control = this.applyUI();
      if (control) {
        control.on('select2-opening', function (e) {
          grid.clickCell(this);
        }.createDelegate(this));
      }

      return this.getEl();
    },
    applyUI: function(){
      if (!this.getEl()) {
        throw new Error('$cell must not be null');
      }
      var __config = this.getColumn().getConfig() || {};
      try {
        if(!$.fn.select2){
          console.error('select2 plugin could not be found');
          return;
        }
        return this.getEl().select2(__config);
      } catch (err) {
        throw new Error(err.message);
      }
    },
    getValue: function(){
      var $input= this.getEl();
      return ($input.length>0) ? $input.select2("val") : null;
    },
    setValue: function(v){
      var $input= this.getEl();
      var __column = this.getColumn();
      var valueField = __column.valueField || 'value';
      if (BaseUI.isObject(v) && !BaseUI.isArray(v)) {
        v = v[valueField] || '';
      } else if (BaseUI.isArray(v)) {
        var values = [];
        for (var x = 0; x < v.length; x++) {
          var __data = v[x] || {};
          values.push(__data[valueField]);
        }
        v = values.join(',');
      } else {
        v = v || '';
      }
      $input.select2('val', v);
    },
    focus: function(){
      this.getEl().select2('focus');
    }
  });
  UI.grid.ColumnManager.registerType('selectx', UI.grid.column.Selectx);

});