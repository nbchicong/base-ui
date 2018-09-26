// #PACKAGE: components
// #MODULE: grid
//~=================COLUMN MODEL===============================
/**
 * @class GridColumnModel
 * @extends Component
 * @param config
 * @constructor
 */
GridColumnModel = function (config) {
  config = config || {};
  CT.apply(this, config);//apply configuration
  this.columns = CT.clone(this.grid.columns) || [];
};
CT.extend(GridColumnModel, Component, {
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
  setColumns: function (columns) {
    this.columns = columns;
  },
  getColumns: function () {
    return this.columns;//source column
  },
  getGrid: function () {
    return this.grid;
  }
});