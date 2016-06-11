// #PACKAGE: grid
// #MODULE: ColumnModel
$(function () {
//~=================COLUMN MODEL===============================
  /**
   * @class UI.grid.ColumnModel
   * @extends UI.Component
   * @param config
   * @constructor
     */
  UI.grid.ColumnModel = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
    this.columns = BaseUI.clone(this.grid.columns) || [];
  };
  BaseUI.extend(UI.grid.ColumnModel, UI.Component, {
    getColumnById: function (colIndex) {
      var controls = this.getGrid().getAddControl() || [];
      var control = controls[colIndex];
      return control.getColumn();
    },
    getColumnByName: function (name) {
      for (var i in this.columns) {
        var __column = this.columns[i];
        if (__column.property == name) {
          var controls = this.getGrid().getAddControl() || [];
          var control = controls[i];
          return control.getColumn();
        }
      }
      return null;
    },
    setColumns: function(columns){
      this.columns = columns;
    },
    getColumns: function(){
      return this.columns;//source column
    },
    getGrid: function(){
      return this.grid;
    }
  });

});