// #PACKAGE: grid-columns
// #MODULE: Select
$(function () {
  BaseUI.ns("UI.grid.column.Select");
  //~=================SELECT COLUMN====================================
  /**
   * @class UI.grid.column.Select
   * @extends UI.grid.Editor
   * @param config
   * @constructor
     */
  UI.grid.column.Select = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
    UI.grid.column.Select.superclass.constructor.call(this) ;
  };
  BaseUI.extend(UI.grid.column.Select, UI.grid.Editor, {
    render: function(v){
      var __column = this.getColumn();
      var sources = __column.editData || [];
      var valueField = __column.valueField || 'value';
      var displayField = __column.displayField || 'text';
      var __text = BaseUI.isObject(v) ? v[displayField] : '';
      v = BaseUI.isObject(v) ? v[valueField] : v;
      for (var j = 0; j < sources.length; j++) {
        var __data = sources[j] || {};
        if (__data[valueField] == v) {
          __text = __data[displayField];
          break;
        }
      }
      this.setEl($(String.format('<span>{0}</span>',__text || v)));
      return this.getEl();
    },
    edit: function(v) {
      var __column = this.getColumn();
      var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
      var sources = __column.editData || [];
      var __options = [];
      var valueField = __column.valueField || 'value';
      var displayField = __column.displayField || 'text';
      var emptyString = __column.emptyString || '----------';
      var forceSelection = !BaseUI.isEmpty(__column.forceSelection) ? __column.forceSelection : true;
      var __text = BaseUI.isObject(v) ? v[displayField] : '';
      v = BaseUI.isObject(v) ? v[valueField] : v;
      var $el = null;
      var grid = this.getGrid();
      var isDefault = false;
      if (!forceSelection) {
        __options.push(String.format('<option value="">{0}</option>', emptyString));
      }
      for (var k = 0; k < sources.length; k++) {
        var __data = sources[k] || {};
        if (__data[valueField] == v) {
          __options.push(String.format('<option selected value="{0}">{1}</option>', __data[valueField], __data[displayField]));
          isDefault = true;
        } else {
          __options.push(String.format('<option value="{0}">{1}</option>', __data[valueField], __data[displayField]));
        }
      }
      if (!isDefault && !BaseUI.isEmpty(v)) { // value is not exist
        __options.splice(0, 0, String.format('<option selected value="{0}">{1}</option>', v, __text || v));
      }
      if (__column.type == 'select2') {
        $el = $(String.format('<select {0} data-type="select2" style="width:100%">', __disabled) + __options.join() + '<select/>');
      } else {
        $el = $(String.format('<select data-type="select" {0}>', __disabled) + __options.join() + '<select/>');

      }
      $el.on('change', function (e) {
        grid.changeCell(this);
      }.createDelegate(this));
      if(__column.type == 'select') {
        $el.on('click', function (e) {
          grid.clickCell(this);
        }.createDelegate(this));
      }
      this.setEl($el);
      var control = this.applyUI();
      if (__column.type == 'select2' && control){
        if (control) {
          control.on('select2-opening', function (e) {
            grid.clickCell(this);
          }.createDelegate(this));
        }
      }
      return this.getEl();
    },
    applyUI: function(){
      var __column = this.getColumn() || {};
      if (__column.type == 'select2') {
        if (!this.getEl()) {
          throw new Error('$cell must not be null');
        }
        try {
          if(!$.fn.select2){
            console.error('select2 plugin could not be found');
            return ;
          }
          return this.getEl().select2(__column.getConfig() || {});
        } catch (err) {
          throw new Error(err.message);
        }
      }
    },
    getValue: function(){
     var __column= this.getColumn();
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
    setValue: function(v){
      var __column= this.getColumn();
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
    focus: function(){
      this.getEl().select2('focus');
    }
  });
  UI.grid.ColumnManager.registerType('select', UI.grid.column.Select);
  UI.grid.ColumnManager.registerType('select2', UI.grid.column.Select);

});