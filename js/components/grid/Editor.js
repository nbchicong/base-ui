// #PACKAGE: grid
// #MODULE: Editor
$(function () {
  /**
   * Base class for grid column
   * This class provides an abstract grid editing plugin on selected columns.
   * @class UI.grid.Editor
   * @extends UI.Component
   * @param config
   * @constructor
   */
//~=================EDITOR COLUMN=============================
  UI.grid.Editor = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
  };
  BaseUI.extend(UI.grid.Editor, UI.Component, {
    getData: function () {
    },
    isLoaded: function () {
      return this.getEl().data('loaded');
    },
    setLoaded: function (loaded) {
      this.getEl().data('loaded', loaded);
    },
    setDisabled: function (disabled) {
      this.getEl().prop('disabled', disabled);
    },
    getDisabled: function(){
      return this.getEl().prop('disabled');
    },
    setValue: function (v) {
    },
    getValue: function () {
      return null;
    },
    getColumn: function(){
      return this.column;
    },
    render: function(v){
    },
    edit: function(v){
    },
    insert: function(v){
      return this.edit(v);
    },
    focus: function(){
      this.getEl().focus();
    },
    setEl: function ($el) {
      var $cell = this.getCell();
      if (this.getCell()) {
        $cell.empty();
        this.$cell = $cell.append($el);
        this.$el = $el;
        return this.$cell;
      }
    },
    getEl: function () {
      return this.$el;
    },
    getCell: function () {
      return (this.$cell.length > 0) ? this.$cell : $(this.getEl().get(0)).parent();
    },
    getRow: function(){
      var $cell = this.getCell();
      var $row = $cell.parent();
      return $row;
    },
    getRecordId: function(){
      return this.getRow().attr('data-id');
    },
    getRecord: function(){
      return this.getGrid().getById(this.getRecordId());
    },
    getGrid: function(){
      return this.grid;
    },
    /**
     *
     * @returns {boolean}- control is validate
     */
    isValid: function(data){
      var __data  = data || this.getValue();
      var __column = this.getColumn();
      var __fn = __column.validate || BaseUI.emptyFn;
      var __msg = __fn(__data);
      var __isValid= BaseUI.isEmpty(__msg);
      if(__isValid) {
        this.clearError();
      } else {
        this.setError(__msg);
      }
      return __isValid;
    },
    setError: function(msg){
      var $el = this.getEl();
      $el.addClass('tooltip-error error').attr('title', msg);
      $el.tooltip();
    },
    clearError: function(){
      var $el = this.getEl();
      $el.removeClass('tooltip-error error').attr('title', '');
      $el.tooltip('destroy');
    },
    setIndexOfRow: function(rowIndex){
      this.rowIndex = rowIndex;
    },
    getIndexOfRow: function(){
      return this.rowIndex;
    }
  });
});