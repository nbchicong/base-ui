// #PACKAGE: components
// #MODULE: grid
/**
 * @class GridColumn
 * @extends Component
 * @param config
 * @constructor
   */
var GridColumn = function (config) {
  config = config || {};
  this.config = {};
  CT.apply(this, config);//apply configuration
};
CT.extend(GridColumn, Component, {
  getGrid: function(){
    return this.grid;
  },
  getCellEditor: function (rowIndex, isAdd) {
    if(isEmpty(rowIndex))
      throw new Error('rowIndex number must not be null');

    var __isAdd = !isEmpty(isAdd) ? isAdd : false;
    var grid = this.getGrid();
    var controls;
    if (__isAdd) {
      controls = grid.getAddControl() || {};
      return controls[this.getColIndex()];
    } else {
      var cells = grid.getRowItems();
      var cell = cells.values()[rowIndex] || {};
      controls = cell.controls || [];
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
    var _this = this;
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
      control.column.editData = _this.editData ;
    });
    this.grid.columns[this.getColIndex()].editData =  items || [];
  }
});