// #PACKAGE: grid-columns
// #MODULE: CheckboxGroup
$(function () {
  BaseUI.ns("UI.grid.column.checkboxgroup");
  //~=================CheckboxGroup COLUMN====================================
  /**
   * @class UI.grid.column.CheckboxGroup
   * @extends UI.grid.Editor
   * @param config
   * @constructor
     */
  UI.grid.column.CheckboxGroup = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
    UI.grid.column.CheckboxGroup.superclass.constructor.call(this) ;
  };
  BaseUI.extend(UI.grid.column.CheckboxGroup, UI.grid.Editor, {
    render: function(v){
      var __column = this.getColumn();
      var sources = __column.editData || [];
      var valueField = __column.valueField || 'value';
      var displayField = __column.displayField || 'text';
      var __v = v || [];
      var __html = "";
      for(var i = 0 ; i < sources.length ; i++) {
        if( __v.indexOf(sources[i][valueField]) > -1) {
          __html += String.format('<li><i class="ace icon-ok blue"></i> {0}</li>', sources[i][displayField]);
        } else
          __html += String.format('<li style="text-decoration: line-through;  color: #8090A0;"><i class="ace icon-remove red"></i> {0}</li>', sources[i][displayField]);
      }
      var $el= $(String.format('<ul style=" margin-left: 0px ;padding-left: 0;   list-style: none;">{0}</ul>', __html));
      //console.log("++++++ render: ", $el);
      this.setEl($el);
   /*   var checked = (BaseUI.isBoolean(v) ? v : false ) || (v == '1');
      if (checked) {
        this.setEl($('<label><input style="width:auto;display: inline;" class="ace" type="checkbox" checked="checked"/><span class="lbl"></span></label>'));
      } else {
        this.setEl($('<label><input style="width:auto;display: inline;" class="ace" type="checkbox" disabled="disabled"/><span class="lbl"></span></label>'));
      }*/
      return this.getEl();
    },
    __renderChbx: function(value, text, checked, disabled){

      return String.format('<label><input value = "{0}" {1} {2} type="checkbox" class="ace"><span class="lbl"> {3}</span></label>', value, !!checked ? "checked" : "", !!disabled ? "disabled" : "", text);
    },
    edit: function(v){
      var __column = this.getColumn();
      var sources = __column.editData || [];
      var valueField = __column.valueField || 'value';
      var displayField = __column.displayField || 'text';
      var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
      var __v = v || [];
      var __html = "";
      for(var i = 0 ; i < sources.length ; i++) {
        __html += this.__renderChbx(sources[i][valueField], sources[i][displayField], __v.indexOf(sources[i][valueField]) > -1,__disabled);
      }
      var $el= $(String.format("<div class='checked'>{0}</div>", __html));
      //console.log("++++++ render: ", $el);
      var grid= this.getGrid();
      $el.on('change', function (e) {
        grid.changeCell(this);
      }.createDelegate(this));
      this.setEl($el);
      return this.getEl();
    },
    getValue: function(){
      var $cbs = this.getEl().find('input');
      var __values = [];
      for(var i = 0 ; i < $cbs.length ; i++) {
        if( $($cbs[i]).is(':checked')) __values.push($($cbs[i]).val())
      }
      return __values;
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

  UI.grid.ColumnManager.registerType('checkboxgroup', UI.grid.column.CheckboxGroup);


});