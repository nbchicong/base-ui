// #PACKAGE: grid-columns
// #MODULE: Textbox
$(function () {
  BaseUI.ns("UI.grid.column.ActionButton");
  //~=================ActionButton COLUMN====================================
  /**
   * @class UI.grid.Button
   * @extends UI.Component
   * @param config
   * @constructor
     */
  UI.grid.Button = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
  };
  BaseUI.extend(UI.grid.Button, UI.Component, {
    getEl: function(){
      return $(this.$el);
    },
    hide: function(){
      this.getEl().hide();
    },
    show: function(){
      this.getEl().show();
    },
    setVisible: function(v) {
      if(v) {
        this.getEl().show();
      } else {
        this.getEl().hide();
      }
    }
  });
  /**
   * @class UI.grid.column.ActionButton
   * @extends UI.grid.Editor
   * @param config
   * @constructor
     */
  UI.grid.column.ActionButton = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
    UI.grid.column.ActionButton.superclass.constructor.call(this);
  };
  BaseUI.extend(UI.grid.column.ActionButton, UI.grid.Editor, {
    render: function (v, data) {
      var __column = this.getColumn();
      if (!BaseUI.isObject(__column)) {
        return;
      }
      var __separate = __column.separate || '&nbsp;';
      var __buttons = __column.buttons || [];
      var __data = data || {};
      var $el = $('<div></div>');
      if (BaseUI.isArray(__buttons)) {
        for (var i = 0; i < __buttons.length; i++) {
          var __button = __buttons[i];
          __button.id = 'btn-' +  BaseUI.generateId();
          var __fnVisibled = __button.visibled || function () {
            return true;
          };
          var __isVisibled = __fnVisibled(__data);
          var __cls = (__button.labelCls != undefined) ? __button.labelCls : 'label label-info';
          if (!__isVisibled) {
            __cls = __cls + ' hide';
          }
          var $button= $(String.format('<span title="{1}" class="{2}"><i class="{0} icon-white"/></span>',__button.icon, __button.text, __cls));
          $el.append($button);
          $button.on('click', function(){
            __buttons[$(this).index()].fn(__data);
          });

          if (!BaseUI.isEmpty(__separate) && i != __buttons.length - 1) {
            $el.append(__separate);
          }
        }
      }
      this.getCell().attr('data-action', 'click').width('auto');
      this.setEl($el);
      return this.getEl();
    },
    insert: function () {
      var __column = this.getColumn();
      var __separate = __column.separate || '&nbsp;';
      var $el = $('<div></div>');
      var $btnOk= $(String.format('<span title="Add" class="label label-success" style="cursor: pointer"><i class="fa fa-plus icon-white"/></span>'));
      var $btnCancel= $(String.format('<span title="Cancel" class="label label-important" style="cursor: pointer"><i class="fa fa-remove"/></span>'));
      $el.append($btnOk).append(__separate).append($btnCancel);

      $btnOk.on('click',function(){
        this.getGrid().save();
      }.createDelegate(this));

      $btnCancel.on('click',function(){
        this.getGrid().cancel();
      }.createDelegate(this));

      this.getCell().width(65);
      this.setEl($el);
      return this.getEl();
    },
    edit: function (v) {
      var __column = this.getColumn();
      var __separate = __column.separate || '&nbsp;';
      var $el = $('<div></div>');
      var $btnOk= $(String.format('<span title="Update" class="label label-success"><i class="fa fa-check icon-white"/></span>'));
      var $btnCancel= $(String.format('<span title="Cancel" class="label label-important"><i class="fa fa-remove"/></span>'));
      $el.append($btnOk).append(__separate).append($btnCancel);

      $btnOk.on('click',function(){
        this.getGrid().save(this.getRecordId());
      }.createDelegate(this));

      $btnCancel.on('click',function(){
        this.getGrid().cancel(this.getRecordId());
      }.createDelegate(this));

      this.getCell().width(65);
      this.setEl($el);
      return this.getEl();
    },
    get: function(index){
      var name = 'action-column-id'+ index;
      if(!this[name]) {
        this[name] = new UI.grid.Button({$el:  this.getEl().find('span').get(index)});
      }
      return this[name];
    }
  });

  UI.grid.ColumnManager.registerType('action', UI.grid.column.ActionButton);


});