// #PACKAGE: grid
// #MODULE: Column
$(function () {
  //~=================COLUMN====================================
  /**
   * @class UI.grid.Column
   * @extends UI.Component
   * @param config
   * @constructor
     */
  UI.grid.Column = function (config) {
    config = config || {};
    this.config = {};
    BaseUI.apply(this, config);//apply configuration
  };
  BaseUI.extend(UI.grid.Column, UI.Component, {
    getGrid: function(){
      return this.grid;
    },
    getCellEditor: function (rowIndex, isAdd) {
      if(BaseUI.isEmpty(rowIndex)) {
        throw new Error('rowIndex number must not be null');
      }
      var __isAdd = !BaseUI.isEmpty(isAdd) ? isAdd : false;
      var grid = this.getGrid();
      if (__isAdd) {
        var controls = grid.getAddControl() || {};
        return controls[this.getColIndex()];
      } else {
        var cells = grid.getRowItems();
        var cell = cells.values()[rowIndex] || {};
        var controls = cell.controls || [];
        return controls[this.getColIndex()];
      }
    },
    getCellAdd: function (rowIndex) {
      return this.getCellEditor(rowIndex, true);
    },
    getAction: function(rowIndex, isAdd){
      return this.getCellEditor(rowIndex, isAdd);
    },
    setDisabled: function (status) {
      var grid = this.getGrid();
      var controls = grid.getAddControl() || {};
      var control = controls[this.getColIndex()];
      control.setDisabled(status);
      var cells = grid.getRowItems();
      var colIndex = this.getColIndex();
      cells.each(function(key,v) {
        controls = v.controls || [];
        control = controls[colIndex];
        control.setDisabled(status);
      });
      this.disabled = status;
      this.grid.columns[colIndex].disabled = status;
    },
    enable: function () {
      this.setDisabled(false);
    },
    disable: function () {
      this.setDisabled(true);
    },
    hide: function () {
      this.hidden = true;
      this.grid.columns[this.getColIndex()].hidden = true;
    },
    getColIndex: function(){
      return this.colIndex;
    },
    getType: function(){
      return this.type;
    },
    getProperty:function(){
      return this.property;
    },
    getConfig: function(){
      return this.config;
    },
    setEditData: function(items){
      this.editData = items || [];
      var grid = this.getGrid();
      var controls = grid.getAddControl() || {};
      var control = controls[this.getColIndex()];
      control.column.editData = this.editData ;
      control.edit();

      var cells = grid.getRowItems();
      var colIndex = this.getColIndex();
      cells.each(function(key,v) {
        controls = v.controls || [];
        control = controls[colIndex];
        control.column.editData = this.editData ;
      });
      this.grid.columns[this.getColIndex()].editData =  items || [];
    }
  });
});