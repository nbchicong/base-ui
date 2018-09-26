// #PACKAGE: grid
// #MODULE: Grid
/**
 *
 * Depends: BaseUI.js
 *
 * @param {Object} config - the given configuration
 */
$(function () {
  /**
   * @class UI.Grid
   * @extends UI.Component
   * @param config
   * @constructor
     */
  UI.Grid = function (config) {
    config = config || {};
    this.prefix = (config.prefix) ? config.prefix : config.id;
    this.id = this.id || 'grid';
    var resources = {
      displayMsg: this.displayMsg || 'Displaying <b>{0}</b> - <b>{1}</b> of <b>{2}</b>',
      emptyMsg: this.emptyMsg || 'No data to display',
      beforePageText: this.beforePageText || 'Page',
      afterPageText: this.afterPageText || 'of {0}',
      firstText: this.firstText || 'First Page',
      prevText: this.prevText || 'Previous Page',
      nextText: this.nextText || 'Next Page',
      lastText: this.lastText || 'Last Page',
      refreshText: this.refreshText || 'Refresh',
      searchText: this.searchText || 'Search',
      searchPlaceholder: this.searchPlaceholder || 'Keyword',
      downloadText: this.downloadText || 'Download'
    };
    BaseUI.apply(this, resources);
    BaseUI.apply(this, config);//apply configuration
    this.prefix = (this.prefix) ? (this.prefix + '-') : '';
    this.containerId = String.format('#{0}', this.id);
    this.gridId = String.format('#{0}-table-main', this.id);
    this.options = config;
    this.options.dataOptions = {
      pageIndex: this.pageIndex || 0,
      pageSize: (this.pageSize || BaseUI.pageSize) || 10,
      count: this.total,
      sortDirection: this.sortDirection,
      sortProperty: this.sortProperty
    };
    this.options.addable = (BaseUI.isBoolean(this.options.addable)) ? this.options.addable : false;
    this.options.editable = (BaseUI.isBoolean(this.options.editable)) ? this.options.editable : false;
    this.options.offFocus = (BaseUI.isBoolean(this.options.offFocus)) ? this.options.offFocus : false;
    this.options.loadingHTML = '<div class="progress progress-striped active" style="width:50%;margin:auto;"><div class="bar progress-bar progress-bar-success" style="width:100%;"></div></div>';
    this.options.itemsText = this.itemsText;
    this.options.itemText = this.itemText;
    this.element = this.gridId;
    this.store = new Hashtable();
    this.onSave = this.onSave || BaseUI.emptyFn;
    this.onUpdate = this.onUpdate || BaseUI.emptyFn;
    this.firstLoad = !BaseUI.isEmpty(this.firstLoad) ? this.firstLoad : true;
    this.disabled = !BaseUI.isEmpty(this.disabled) ? this.disabled : false;
    this.hidden = !BaseUI.isEmpty(this.hidden) ? this.hidden : false;
    this.height = !BaseUI.isEmpty(this.height) ? this.height + 'px' : 'auto';
    this.enableSelection = !BaseUI.isEmpty(this.enableSelection) ? this.enableSelection : false;
    this.remotePaging = !BaseUI.isEmpty(this.remotePaging) ? this.remotePaging : false;
    this.hideSearch = !BaseUI.isEmpty(this.hideSearch) ? this.hideSearch : false;
    this.hideHeader = !BaseUI.isEmpty(this.hideHeader) ? this.hideHeader : false;
    this.autoHideAdv = !BaseUI.isEmpty(this.autoHideAdv) ? this.autoHideAdv : false;
    this.allowSave = false;
    this.allowUpdate = false;
    this.submitType = !BaseUI.isEmpty(this.submitType) ? this.submitType : 'get';
    this.allowDownload = !BaseUI.isEmpty(this.allowDownload) ? this.allowDownload : false;
    this.stretchHeight = !BaseUI.isEmpty(this.stretchHeight) ? this.stretchHeight : false;
    this.basicSearch = this.basicSearch ? this.basicSearch : null;
    this.advanceSearch = this.advanceSearch ? this.advanceSearch : null;
    this.rowClass = BaseUI.isFunction(this.rowClass) ? this.rowClass : null;
    this.moveLastOnInsert = !BaseUI.isEmpty(this.moveLastOnInsert) ? this.moveLastOnInsert : false;
    this.rowItems= new Hashtable();  //Creates the row items
    this.listUpdate = [];
    this.pageProperty = this.pageProperty || 'pageNumber';
    this.version = '2.0'; //grid version
    var that = this;
    var $container = this.getEl();
    $container.addClass('fuelux');

    this.$basicSearch = [];
    this.$advanceSearch = [];

    if (this.basicSearch && BaseUI.isFunction(this.basicSearch)) {
      this.quickSearch = new this.basicSearch();
      this.quickSearch.keydownEnabled = !BaseUI.isEmpty(this.quickSearch.keydownEnabled) ? this.quickSearch.keydownEnabled : true;
      this.quickSearch.search = BaseUI.isFunction(this.search) ? this.search  : function(){
        that.setParams(that.quickSearch.getData());
        that.setUrl(that.quickSearch.getUrl() || that.quickSearch.url);
        that.reload();
      };
      this.$basicSearch = $('#' + this.quickSearch.getId() || this.quickSearch.id);
      this.$basicSearch.find('div:first').prop('id', this.quickSearch.getId());
    }
    if (this.advanceSearch && BaseUI.isFunction(this.advanceSearch)) {
      this.advSearch = new this.advanceSearch();
      this.advSearch.keydownEnabled = !BaseUI.isEmpty(this.advSearch.keydownEnabled) ? this.advSearch.keydownEnabled : true;
      this.$advanceSearch = $('#' + this.advSearch.getId() || this.advSearch.id);
      this.advSearch.search = this.search && BaseUI.isFunction(this.search) ? this.search  : function(){
        that.setParams(that.advSearch.getData());
        that.setUrl(that.advSearch.getUrl() || that.advSearch.url);
        that.reload();
      };
    }
    var initComponent = function () {
      var __paging = String.format('<table id="{0}-grid-header" class="table datagrid grid-header hidden-480 {1}">', that.id, that.hideHeader ? 'xhide' : '');
      __paging += '<thead><tr><th><div class="col-xs-12 col-md-12 row-fluid nopadding">';
      if(!that.hideSearch) {
        __paging += '<div class="datagrid-header-left nopadding col-md-7 col-xs-7 span6">';
        if (that.$basicSearch.length > 0) {
          __paging += that.$basicSearch.html();
          that.$basicSearch.remove();
        } else {
          __paging += '<div class="col-xs-6 col-md-6 span6 nopadding" style="max-height: 30px;"><span class="input-group search" style="margin-left:0px;width: 250px">';
          __paging += '<span class="input-group-btn">';
          __paging += String.format('<input type="text" class="grid-search-input form-control" placeholder="{0}">', that.searchPlaceholder);
          __paging += '<button type="button" class="btn btn-default grid-search-btn"><i class="fa fa-search"></i></button></span></span></div>';
        }
        __paging += '</div>'; //end header left
      }
      var __clsPage = that.hideSearch ? 'col-xs-12 col-md-12 span12': 'col-md-5 col-xs-5 span6';
      var __clsDisplay = that.hideSearch ? 'hidden-320': 'hidden-767';
      __paging += String.format('<div class="datagrid-header-right hidden-320 nopadding {0}">', __clsPage);
      __paging += String.format('<span class="paging {0}">', __clsDisplay);
      __paging += String.format(that.displayMsg, '<span class="grid-start">0</span>', '<span class="grid-end">0</span>', '<span class="grid-count">0</span>&nbsp;</span>');
      __paging += String.format('<button type="button" class="btn grid-firstpage first" title="{0}"><i class="fa fa-step-backward"></i></button>', that.firstText);
      __paging += String.format('<button type="button" class="btn grid-prevpage" title="{0}"><i class="fa fa-chevron-left"></i></button>', that.prevText);
      __paging += String.format('<input class="grid-page" type="text" />');
      __paging += String.format('<button type="button" class="btn grid-nextpage" title="{0}"><i class="fa fa-chevron-right"></i></button>', that.nextText);
      __paging += String.format('<button type="button" class="btn grid-lastpage" title="{0}"><i class="fa fa-step-forward"></i></button>', that.lastText);
      if (!!that.allowDownload) {
        __paging += String.format('<button type="button" class="btn grid-download" title="{0}"><i class="fa fa-download-alt"></i></button>', that.downloadText);
      }
      __paging += String.format('<button type="button" class="btn grid-refresh last" title="{0}"><i class="fa fa-refresh"></i></button>', that.refreshText);
      __paging += '</div>';//end header right
      __paging += '</div></th></tr></thead></table>'; //end header

      var __html = String.format('<div style="height: {1}; width: 100%;background-color: #F9F9F9;">', that.id, that.height);
      __html += String.format('<table id="{0}-table-main" class="table table-bordered datagrid grid table-striped">', that.id);
      __html += '<colgroup></colgroup><thead></thead></table></div>';
      $container.html(__paging + __html);
    };
    initComponent(); //Initialize the HTML instance
    //=========================SEARCH ===========
    if (this.quickSearch) {
      this.quickSearch.intComponent(this);
      var $quick = $container.find('#' + this.quickSearch.getId());
      var $hideAdvSearchElement = $quick.find('[data-expand-hide=true]');

      $quick.find('[data-action-search]').click(function () {
        var action = $(this).attr('data-action-search');
        switch (action) {
          case 'expand':
            $hideAdvSearchElement.hide();
            that.$advanceSearch.show(0, function(){
              that.fireEvent("expandadvance", that.advSearch, that.quickSearch)
            });
            break;
          case 'search':
            that.quickSearch.search();
        }
      });
      if(this.quickSearch.keydownEnabled) {
        $quick.off('keydown', 'input').on('keydown', 'input', function (e) {
          var code = e.keyCode ? e.keyCode : e.which;
          if (code == 13) {
            that.quickSearch.search();
          }
        });
      }
    }
    if (this.advSearch) {
      this.advSearch.intComponent(this);
      this.$advanceSearch.find('[data-action-search]').click(function () {
        var action = $(this).attr('data-action-search');
        switch (action) {
          case 'close':
            $hideAdvSearchElement.show();
            that.$advanceSearch.hide(0, function(){
              that.fireEvent("closeadvance", that.advSearch, that.quickSearch)
            });
            break;
          case 'search':
            that.advSearch.search();
            if(that.autoHideAdv) {
              $hideAdvSearchElement.show();
              that.$advanceSearch.hide(0, function(){
                that.fireEvent("closeadvance", that.advSearch, that.quickSearch)
              });
              break;
            }
        }
      });
      if(this.advSearch.keydownEnabled) {
        this.$advanceSearch.off('keydown', 'input').on('keydown', 'input', function (e) {
          var code = e.keyCode ? e.keyCode : e.which;
          if (code == 13) {
            that.search();
          }
        });
      }
    }
    //===========================================================
    this.$element = $(this.element);
    this.$colgroup = this.$element.find('colgroup');
    this.$thead = this.$element.find('thead');
    this.$topheader = this.$element.find('thead th');
    this.$pagingContent = $(String.format('#{0}-grid-header', this.id));
    this.$searchcontrol = this.$pagingContent.find('.search');
    this.$filtercontrol = this.$pagingContent.find('.filtering');
    this.$prevpagebtn = this.$pagingContent.find('.grid-prevpage');
    this.$nextpagebtn = this.$pagingContent.find('.grid-nextpage');
    this.$pageinput = this.$pagingContent.find('input.grid-page');
    this.$firstpagebtn = this.$pagingContent.find('.grid-firstpage');
    this.$lastpagebtn = this.$pagingContent.find('.grid-lastpage');
    this.$refreshbtn = this.$pagingContent.find('.grid-refresh');
    this.$downloadbtn = this.$pagingContent.find('.grid-download');
    this.$pageslabel = this.$pagingContent.find('.grid-pages');
    this.$countlabel = this.$pagingContent.find('.grid-count');
    this.$startlabel = this.$pagingContent.find('.grid-start');
    this.$endlabel = this.$pagingContent.find('.grid-end');
    this.$tbody = $('<tbody>').insertAfter(this.getHeader());
    this.$colheader = $('<tr>').appendTo(this.getHeader());
    if(this.dataSource) {
      this.dataSource.setIdProperty(this.getIdProperty());
    }
    this.columns = (this.dataSource) ? this.dataSource.columns() : [];
    this.sm = null;
    this.resized = false;
    //~===================EVENT==============================
    this.$pageinput.height(18);
    this.$pageinput.on('change', $.proxy(this.pageChanged, this));
    this.$nextpagebtn.on('click', $.proxy(this.next, this));
    this.$prevpagebtn.on('click', $.proxy(this.previous, this));
    this.$firstpagebtn.on('click', $.proxy(this.first, this));
    this.$lastpagebtn.on('click', $.proxy(this.last, this));
    this.$refreshbtn.on('click', $.proxy(this.load, this));
    this.$downloadbtn.on('click', $.proxy(this.download, this));
    this.$searchcontrol.on('searched cleared', $.proxy(this.searchChanged, this));
    this.$filtercontrol.on('changed', $.proxy(this.filterChanged, this));
    this.$colheader.on('click', 'th', $.proxy(this.headerClicked, this));
    this.$element.on('loaded', function (e) {
      if (that.isEdit()) {//edit all record
        that.editAll();
      }
      if (that.isAdd()) {//add new record
        that.newRecord();
      }
      if (that.enableSelection) {
        that.sm = new UI.grid.CheckboxSelection({
          grid: that
        });
        that.sm.on('selectionchange', function (sm, data) {
          that.fireEvent('selectionchange', sm, data);
        });
      } else {
        that.sm = new UI.grid.ClickSelection();
      }
      if (!that.resized) {
        that.fireEvent('resize', that);
        that.resized = true;
      }
      that.fireEvent('loaded', that.getStore());
    });

    this.renderColumns();
    /*
    $container.on('click', function(event){
      var $target = $(event.target);
      that.fireEvent('focus', $target, that);
    });

    $container.bind('clickoutside', function(event){
      var $target = $(event.target);
      console.log('clickoutside>>',  $target);
      that.fireEvent('blur', null, that);
    });

    $container.bind('focusoutside', function(event){
      var $target = $(event.target);
      console.log('clickoutside>>',  $target);
      that.fireEvent('blur', null, that);
    });
    */

    //============Grid Stretch========
    if (this.stretchHeight) {
      this.initStretchHeight();
      $(window).resize(function () {
        that.fireEvent('resize', that);
      });
    }
    //=============First Load===========
    if (this.firstLoad) {
      if (this.quickSearch) {
        this.setParams(this.quickSearch.getData());
        this.setUrl(this.quickSearch.getUrl() || this.quickSearch.url);
        this.load();
      } else {
        if (BaseUI.isEmpty(this.url)) {
          throw Error("Missing url");
        }
        this.load();
      }
    } else {
      if(!BaseUI.isEmpty(this.url) || !BaseUI.isEmpty(this.data)){
        this.loadData(BaseUI.isFunction(this.data)? this.data() : this.data || []);
      }
      if (this.isAdd()) {
        this.newRecord(); //default is Add record
      }
    }
    if (this.hidden) {
      this.hide();
    }

  };
  BaseUI.extend(UI.Grid, UI.Component, {
    constructor: UI.Grid,
    version: '2.1',
    setDataSource: function (dataSource) {
      this.dataSource = dataSource;
      this.dataSource.setIdProperty(this.getIdProperty());
      this.columns = this.dataSource.columns();
      this.getColumnModel().setColumns(this.columns);
      this.renderColumns();
      this.renderData();
    },
    loadData: function (items) {
      var __items = items || [];
      if (this.dataSource != null) {
        this.dataSource.setData(__items);
        this.renderData();
      }
    },
    clearData: function () {
      if (this.dataSource != null) {
        this.options.dataOptions.count = null;
        this.dataSource.setData([]);
        this.renderData();
      }
      return true;
    },
    _initHeader : function () {
      var colGroup = '';
      var colHTML = '';
      var $tr = $('<tr onclick="javascript:;" data-action="new" style="display:none"></tr>');
      var sm= this.getColumnModel();
      var columns = sm.getColumns();
      this.$topheader.attr('colspan', columns.length);
      this.addControls = [];
      for (var index = 0; index < columns.length; index++) {
        var column = columns[index] || {};
        var __cls = column.cls || '';
        var __width = BaseUI.isNumber(column.width) ? column.width + 'px' : 'auto';
        if (column.type == 'action') {
          var __buttons = column.buttons || [];
          var __minWidth = (__buttons.length * 40) + "px";
          colGroup += String.format('<col style="width:{0}" class="{1}"/>', __minWidth, __cls);
        } else {
          colGroup += String.format('<col style="width:{0}" class="{1}" />', __width, __cls);
        }
        if (column.type == 'selection') {
          this.enableSelection = true;
          colHTML += String.format('<th style="text-align:center;vertical-align:middle" class="{0}"><label><input style="width:auto;display: inline;" type="checkbox" class="ace"/><span class="lbl"></span></label></th>', __cls);
        } else {
          colHTML += String.format('<th data-property="{0}" class="{1} {2}" style="max-width: {3}"', (column.property || ''), column.sortable? 'sortable': '',__cls, __width);
          colHTML += '>' + (column.label || '') + '</th>';
        }
        var __align = column.align || 'left';
        var $td = $(String.format('<td class="newrecord {1}" style="text-align:{0};vertical-align:middle;"></td>', __align,__cls));
        var editor =null;
        var col = BaseUI.clone(column);
        col.grid= this;
        col.colIndex = index;
        var config = {grid: this, column: new UI.grid.Column(col), $cell: $td};
        if(column.editor) {
          editor = new column.editor(config);
          editor.insert();
        } else { //old version -  automatic detect plugins by type
          var control= null;
          if (!UI.grid.ColumnManager.isRegistered(column.type)) {
            control = UI.grid.ColumnManager.get('label');
          } else {
            control = UI.grid.ColumnManager.get(column.type);
          }
          if (control) {
            editor = new control(config);
            editor.insert();
          }
        }
        this.addControls.push(editor);
        $tr.append($td);
      }
      return {$thead: $tr, colHTML: colHTML, colGroup: colGroup};
    },
    _switchView: function (data) {
      var __record = data || {};
      var sm = this.getColumnModel();
      var __columns = sm.getColumns();
      var __id = __record[this.getIdProperty()].toString();
      var $row = this.findRowById(__id);
      var cells = this.getRowItems();
      var cell = cells.get(__id);
      //this.temp= this.temp || 0;console.log(this.temp++, __id, new Date());
      if (cell) { //cell is exist
        var controls = cell.controls || [];
        for (var i = 0; i < controls.length; i++) {
          var control = controls[i];
          if (BaseUI.isObject(control)) {
            var __column = control.getColumn();
            if (__column) {
              var v = __record[__column.getProperty()];
              v = !BaseUI.isEmpty(v) ? v : __column.value;
              var $cell = control.getCell();
              $cell.removeClass('editable');
              var __value = !BaseUI.isEmpty(v) ? v : '';
              if(!BaseUI.isEmpty(__column.renderer) && BaseUI.isFunction(__column.renderer)) {
                v = __column.renderer(__value, __record, i);
              }
              control.render(v, __record);
              var __class = this.rowClass ? this.rowClass(__record) : '';

              control.setIndexOfRow($row.index());
              control.getRow().attr('class', __class);
            }
          }
        }
      } else {
        $row.empty();
        var __controls = [];
        var $tds= [];
        for (var i = 0; i < __columns.length; i++) {
          var column = __columns[i];
          var __align = column.align || 'left';
          var __valign = column.valign || 'top';
          var __cls = column.cls || '';
          var $td = $(String.format('<td style="text-align:{0};vertical-align:{1}" class="{2}">', __align,__valign, __cls));
          var v = __record[column.property];
          var col = BaseUI.clone(column);
          col.grid= this;
          col.colIndex = i;
          var editor = null;
          var config = {grid: this, column: new UI.grid.Column(col), $cell: $td};

          if (column.editor) {
            editor = new column.editor(config);
            editor.setIndexOfRow($row.index() || i);
            editor.render(v);
          } else { //old version -  automatic detect plugins by type
            var __value = !BaseUI.isEmpty(v) ? v : '';
            if(!BaseUI.isEmpty(column.renderer) && BaseUI.isFunction(column.renderer)) {
              v = column.renderer(__value, __record, i);
            }
            var control= null;
            if (!UI.grid.ColumnManager.isRegistered(column.type)) {
              control = UI.grid.ColumnManager.get('label');
            } else {
              control = UI.grid.ColumnManager.get(column.type);
            }
            if (control) {
              editor = new control(config);
              editor.setIndexOfRow($row.index());
              editor.render(v, __record);
            }
          }
          if(editor) {
            __controls.push(editor);
          }

          var __class = this.rowClass ? this.rowClass(__record) : '';
          $row.attr('class', __class);
          $tds.push($td);
        }
        $row.append($tds);
        this.rowItems.put(__id.toString(), {rowIndex: $row.index(), controls: __controls});
      }
      this.removeListenerOutsideEvent($row);
    },
    _switchEdit: function (data) {
      var __record = data || {};
      var __id = __record[this.getIdProperty()].toString();
      var $row = this.findRowById(__id);
      var cells = this.getRowItems();
      var cell = cells.get(__id) || {};
      var controls = cell.controls || [];
      var isFocused = false;
      for (var i = 0; i < controls.length; i++) {
        var control = controls[i];
        if (BaseUI.isObject(control)) {
          var __column = control.getColumn();
          if (__column) {
            var v = __record[__column.getProperty()];
            v = !BaseUI.isEmpty(v) ? v : __column.value;
            if(!BaseUI.isEmpty(__column.renderer) && BaseUI.isFunction(__column.renderer)) {
              v = __column.renderer(v, __record, i);
            }
            var $cell = control.getCell();
            $cell.empty();
            $cell.addClass('editable');
            $cell.append(control.edit(v)); //control edit
            if (!isFocused && __column.type!='selection') {
              control.focus();
              isFocused = true;
            }
          }
        }
      }
      this.fireEvent('beforeedit', __record, $row.index());
      this.listenerOutsideEvent($row);
    },
    getAddControl: function(){
      return this.addControls;
    },
    getRowItems: function(){
      return this.rowItems;
    },
    renderColumns: function () {
      var header = this._initHeader();
      var $thead = header.$thead;
      this.$colgroup.html(header.colGroup);
      this.getHeader().parent().find('colgroup').html(header.colGroup);
      this.$colheader.html(header.colHTML);
      this.getHeader().find('tr:gt(0)').remove();
      this.getHeader().append($thead);
      if(!BaseUI.isEmpty(this.options.dataOptions.sortProperty)) {
        var $target = this.getHeader().find(String.format('th[data-property="{0}"]:last', this.options.dataOptions.sortProperty));
        this.updateColumns($target, this.options.dataOptions.sortDirection);
      }
    },
    addEvent: function () {
      var self = this;
      this.$element.trigger('loaded');
      self.$tbody.off('click', 'tr[data-id] td:not([data-action])').on('click', 'tr[data-id] td:not([data-action])', function () {
        var $row = $($(this).parent());
        var __rid = $row.attr('data-id');
        var __editable = $(this).hasClass('editable');
        if (BaseUI.isEmpty(__rid)) {
          return;
        }
        var __record = self.store.get(__rid) || {};
        var sm = self.getSelectionModel();
        if (self.enableSelection) {
          if (!$row.hasClass('selected')) {
            sm.checkedRow($row, true); //only checked row
          }
        } else {
          if (!$row.hasClass('selected')) {
            self.$tbody.find('tr[data-id]').removeClass('selected');
            $row.addClass('selected');
            sm.setSelection([__record]);
          } else {
            $row.removeClass('selected');
            sm.clearSelection();
          }
          self.fireEvent('selectionchange', sm, __record);
        }
        if (self.hasEvent('click')) {
          self.fireEvent('click', __record, __editable, $(this));
        }
      });
    },
    updateColumns: function ($target, direction) {
      var className = (direction === 'asc') ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
      this.$colheader.find('i').remove();
      this.$colheader.find('th').removeClass('sorted');
      $('<i>').addClass(className).appendTo($target);
      $target.addClass('sorted');
    },
    updatePageButtons: function (data) {
      this.paging = data || {};
      var __hasNotPrev = (data.page <= 1);
      var __hasNotNext = (data.page >= data.pages || data.count < 1);
      this.$prevpagebtn.prop('disabled', __hasNotPrev);
      this.$nextpagebtn.prop('disabled', __hasNotNext);
      this.$firstpagebtn.prop('disabled', __hasNotPrev);
      this.$lastpagebtn.prop('disabled', __hasNotNext);
      this.$downloadbtn.prop('disabled', data.count < 1);
    },
    _switchEditAll: function () {
      var me = this;
      var __store = this.getStore();
      __store.each(function (key, record) {
        me._switchEdit(record);
      });
      this.refreshSelection();
    },
    _switchViewAll: function () {
      var me = this;
      this.rowItems.clear();
      var __store = this.getStore();
      __store.each(function (key, record) {
        me._switchView(record);
      });
      this.refreshSelection();
    },
    refreshSelection: function () {
      var sm = this.getSelectionModel();
      if (sm && this.enableSelection) {
        sm.clearSelected();
      }
    },
    renderData: function (callback) {
      this.fireEvent('beforeload', this);
      var self = this;
      var __callback = callback || BaseUI.emptyFn;
      this._setAllowUpdate(false);
      this.store.clear();
      this.getBody().html(this.placeholderRowHTML(this.options.loadingHTML));
      var rowHTML = '';
      this.dataSource.data(this.options.dataOptions, function (data) {
        if(self.options.dataOptions.pageIndex>data.page) {
          self.options.dataOptions.pageIndex= 0;
        }
        self.$pageslabel.text(data.pages);
        self.$countlabel.text(data.count);
        if (data.count < 1) {
          self.$startlabel.text(0);
          self.$pageinput.val(0).prop('disabled', true);
        } else {
          self.$startlabel.text(data.start);
          self.$pageinput.val(self.options.dataOptions.pageIndex + 1).prop('disabled', false);
        }
        self.$endlabel.text(data.end);
        self.updatePageButtons(data);
        var __records = data.data || [];
        for (var i = 0; i < __records.length; i++) {
          var __record = __records[i] || {};
          var __id = __record[self.getIdProperty()];
          self.store.put(__id.toString(), __record);
          __record[self.getIdProperty()] = __id;
          rowHTML += String.format('<tr onclick="javascript:;" data-id="{0}"></tr>', __id);
        }
        if (!rowHTML) {
          rowHTML = self.placeholderRowHTML(self.emptyMsg);
        }
        self.$tbody.html(rowHTML);
        self._switchViewAll(); //render all
        self.stretchHeightFn();
        self.addEvent();
        __callback();
      });
    },
    placeholderRowHTML: function (content) {
      var colNumber = 0;
      if(!this.isVisible()) {
        colNumber = this.columns.length;
      } else {
        colNumber = this.getHeader().find('tr:first').find('th:visible').length
      }
      colNumber = (colNumber<1) ? this.columns.length: colNumber;
      return String.format('<tr><td style="padding:10px;border-bottom:none;" colspan="{0}"><i>{1}</i></td></tr>', colNumber, content);
    },
    headerClicked: function (e) {
      var $target = $(e.target);
      if (!$target.hasClass('sortable')){
        return;
      }
      var direction = this.options.dataOptions.sortDirection;
      var sort = this.options.dataOptions.sortProperty;
      var property = $target.data('property');

      if (sort === property) {
        this.options.dataOptions.sortDirection = (direction === 'asc') ? 'desc' : 'asc';
      } else {
        this.options.dataOptions.sortDirection = 'asc';
        this.options.dataOptions.sortProperty = property;
      }
      if (!this.remotePaging) {
        this.options.dataOptions.pageIndex = 0;
      }
      this.updateColumns($target, this.options.dataOptions.sortDirection);
      this.renderData();
    },
    sort: function(property, direction){
      this.options.dataOptions.sortProperty = property;
      this.options.dataOptions.sortDirection = direction || 'asc';
      var $target = this.getHeader().find(String.format('th[data-property="{0}"]:last', property));
      this.updateColumns($target, this.options.dataOptions.sortDirection);
      this.renderData();
    },
    pagesizeChanged: function (e, pageSize) {
      if (pageSize) {
        this.options.dataOptions.pageSize = parseInt(pageSize.value, 10);
      } else {
        this.options.dataOptions.pageSize = parseInt($(e.target).val(), 10);
      }
      this.options.dataOptions.pageIndex = 0;
      this.renderData();
    },
    pageChanged: function (e) {
      var $input = $(e.target);
      var pageRequested = parseInt($input.val(), 10) || 1;
      pageRequested = (BaseUI.isEmpty(pageRequested)) ? 1 : pageRequested;
      var maxPages = this.paging.pages;
      this.options.dataOptions.pageIndex = (pageRequested > maxPages) ? maxPages - 1 : pageRequested - 1;
      $input.val(this.options.dataOptions.pageIndex + 1);
      if (this.remotePaging) {
        var __params = this.getParams();
        __params[this.getPageProperty()] = this.options.dataOptions.pageIndex;
        this.setParams(__params);
        this.load();
      } else {
        this.renderData();
      }
    },
    searchChanged: function (e, search) {
      this.options.dataOptions.search = search;
      this.options.dataOptions.pageIndex = 0;
      this.renderData();
    },
    filterChanged: function (e, filter) {
      this.options.dataOptions.filter = filter;
      this.renderData();
    },
    goPage: function (page) {
      var __page = page || 0;
      this.options.dataOptions.pageIndex = __page;
      if (this.remotePaging) {
        var __params = this.getParams();
        __params[this.getPageProperty()] = this.options.dataOptions.pageIndex;
        this.setParams(__params);
        this.load();
      } else {
        this.renderData();
      }
    },
    previous: function () {
      if (this.paging.page <= 1) {
        return;
      }
      this.options.dataOptions.pageIndex--;
      this.goPage(this.options.dataOptions.pageIndex);
    },
    next: function () {
      if (this.paging.page >= this.paging.pages) {
        return;
      }
      this.options.dataOptions.pageIndex++;
      this.goPage(this.options.dataOptions.pageIndex);
    },
    first: function () {
      this.goPage(0);
    },
    last: function () {
      this.goPage(this.paging.pages - 1);
    },
    reload: function () {
      this.options.dataOptions.pageIndex = 0;
      this.load();
    },
    initStretchHeight: function () {
      this.$gridContainer = this.$element.parent();
      //var hasWraper = this.$gridContainer.hasClass('datagrid-stretch-wrapper');
      var __border = 'border-left: 0px;border-right: 0px;border-bottom:0px;';
      if (BaseUI.isGecko) {
        __border = 'border-left-color: transparent;border-right-color: transparent;border-bottom-color:transparent;';
      }
      this.$element.wrap(String.format('<div class="datagrid-stretch-wrapper" style="overflow-x:auto;overflow-y:scroll;{0}">', __border));
      this.$stretchWrapper = this.$element.parent();

      this.$headerTable = $('<table>').attr('class', this.$element.attr('class'));
      this.$headerTable.append(this.$colgroup.clone());
      this.$headerTable.prependTo(this.$gridContainer).addClass('datagrid-stretch-header');

      this.getHeader().detach().appendTo(this.$headerTable);
      $(this.$headerTable).wrap(String.format('<div style="margin-right:{0}px;overflow: hidden;border-right: 1px solid transparent;" />', $.getScrollBarWidth()));

      var wpx = this.$pagingContent.width() + 'px';
      if (BaseUI.isGecko) {
        this.$headerTable.css({'width': wpx, 'table-layout': 'fixed', 'border-color': 'transparent'});
        this.$headerTable.find('th:first,td:first').css({'border-left-color': 'transparent'});
        this.$headerTable.find('th:last').css({'border-right-color': 'transparent'});
      } else {
        this.$headerTable.css({'width': wpx, 'table-layout': 'fixed', 'border': '0px'});
        this.$headerTable.find('th:first,td:first').css({'border-left-color': 'transparent'});
      }
      this.$element.css({'width': wpx, 'table-layout': 'fixed'});
      this.$pagingContent.css({'border-bottom': '1px solid #DDD'});
      this.getEl().attr("style", "border:1px solid #DDD;");

      this.$sizingHeader = this.getHeader().clone();
      this.$sizingHeader.find('tr:first').remove();

      this.$stretchWrapper.scroll(function () {
        $((this.$headerTable).parent()).get(0).scrollLeft = this.$stretchWrapper.get(0).scrollLeft;
      }.createDelegate(this));

      $((this.$headerTable).parent()).scroll(function () {
        $((this.$headerTable).parent()).get(0).scrollLeft = this.$stretchWrapper.get(0).scrollLeft;
      }.createDelegate(this));
    },
    stretchHeightFn: function () {
      if (!this.$gridContainer){
        return;
      }
      var targetHeight = this.$gridContainer.height();
      var headerHeight = this.$headerTable.outerHeight();
      this.$stretchWrapper.height(targetHeight - headerHeight - (this.isAdd() ? 20 : 0));
    },
    disable: function () {
      this.setDisabled(true);
    },
    enable: function () {
      this.setDisabled(false);
    },
    /**
     * Convenience function for setting disabled/enabled by boolean.
     */
    setDisabled: function(v){
      this.disabled = !!v;
      this.getEl().find('input,select,button').prop("disabled", this.disabled);
    },
    isDisabled: function () {
      return this.disabled;
    },
    hide: function () {
      this.setVisible(false);
    },
    show: function () {
      this.setVisible(true);
    },
    /**
     * True to show, false to hide
     */
    setVisible: function(v){
      this.hidden = !v;
      if(this.hidden) {
        this.getEl().hide();
      } else {
        this.getEl().show();
      }
    },
    isVisible: function () {
      return !this.hidden && this.getEl().is(':visible');
    },
    save: function (id) {
      var __record = {};
      var __id = (id || '').toString();
      if (!BaseUI.isEmpty(__id)) { //update data
        var cells = this.getRowItems();
        var obj = cells.get(__id);
        var controls = obj.controls;
        for (var i = 0; i < controls.length; i++) {
          var control = controls[i];
          if (!BaseUI.isEmpty(control)) {
            var __column = control.getColumn();
            if (!BaseUI.isEmpty(__column.getProperty())) {
              var __value = control.getValue();
              if (control.isValid(__value)) {
                __record[__column.getProperty()] = __value;
              } else {
                control.focus();
                return;
              }
            }
          }
        }
        var __oldRecord = this.getById(__id);
        __record[this.getIdProperty()] = __oldRecord[this.getIdProperty()];
        if (this.hasEvent('update')) {
          this.fireEvent('update', __record, __oldRecord);
        } else {
          this.onUpdate(__record, __oldRecord);
        }
        this._setAllowUpdate(false);
      } else {
        var controls = this.getAddControl();
        var __data = {};
        for (var i = 0; i < controls.length; i++) {
          var control = controls[i];
          if (!BaseUI.isEmpty(control.column)) {
            var __column = control.getColumn();
            if (!BaseUI.isEmpty(__column.getProperty())) {
              var __value = control.getValue();
              if (control.isValid(__value)) {
                __data[__column.getProperty()] = __value;
              } else {
                control.focus();
                return;
              }
            }
          }
        }
        if (this.hasEvent('save')) {
          this.fireEvent('save', __data);
        } else {
          this.onSave(__data);
        }
        this._setAllowSave(false);
      }
    },
    findRowById: function (ids) {
      if (BaseUI.isEmpty(ids)) {
        return;
      }
      var __ids = ids.toString().split(';');
      var __query = [];
      for (var i = 0; i < __ids.length; i++) {
        __query.push(String.format('tr[data-id="{0}"]', __ids[i]));
      }
      return this.getBody().find(__query.join(','));
    },
    selectById: function (id, clear) {
      var $row = this.findRowById(id);
      var sm = this.getSelectionModel();
      if (this.enableSelection) {
        sm.checkedRow($row, clear);
      } else {
        var __record = this.getById(id);
        if (!$row.hasClass('selected')) {
          this.getBody().find('tr[data-id]').removeClass('selected');
          $row.addClass('selected');
        }
        sm.setSelection([__record]);
        this.fireEvent('selectionchange', sm, __record);
      }
    },
    /**
     * Fires change this when Editor is changed
     * @param editor
     */
    changeCell: function (editor) {
      if(!editor) {
        throw new Error('Editor must not be null');
        return ;
      }
      var __id = editor.getRecordId();
      var __record = {}, __oldRecord = {};
      this._setAllowUpdate(!BaseUI.isEmpty(__id));
      if (BaseUI.isEmpty(__id)) { //add new record
        var controls= this.getAddControl();
        for(var i=0;i<controls.length;i++) {
          var control = controls[i];
          if(!BaseUI.isEmpty(control.column)) {
            var __column = control.getColumn();
            if(!BaseUI.isEmpty(__column.getProperty())) {
              var __value = control.getValue();
              if(control.isValid(__value)) {
                __record[__column.getProperty()] = __value;
              } else {
                control.focus();
                return;
              }
            }
          }
        }
      } else {
        var cells = this.getRowItems();
        var obj = cells.get(__id.toString());
        var controls = obj.controls;
        for (var i = 0; i < controls.length; i++) {
          var control = controls[i];
          if (!BaseUI.isEmpty(control)) {
            var __column = control.getColumn();
            if (!BaseUI.isEmpty(__column.getProperty())) {
              var __value = control.getValue();
              if (control.isValid(__value)) {
                __record[__column.getProperty()] =__value;
              } else {
                control.focus();
                return;
              }
            }
          }
        }
        var __oldRecord = this.getById(__id);
        __record[this.getIdProperty()] = __oldRecord[this.getIdProperty()];
      }
      this.fireEvent('change', __oldRecord, __record, editor.getColumn().getColIndex(), editor.getRow().index());

    },
    /**
     * Fires controlclick this when Editor is clicked
     */
    clickCell: function(editor){
      if(editor){
        this.fireEvent('controlclick', editor.getRecord(),editor.getColumn().getColIndex(), editor.getRow().index());
      }
    },
    endEdit: function () {
      if(!BaseUI.isEmpty(this.currentEditId)) {
        this.save(this.currentEditId);
      }
    },
    cancelEdit: function () {
      if(!BaseUI.isEmpty(this.currentEditId)) {
        this.cancel(this.currentEditId);
      }
    },
    getHeader: function(){
      return this.$thead;
    },
    getNewRow: function () {
      return this.getHeader().find('tr[data-action="new"]');
    },
    newRecord: function (data) {
      var __data = data || {};
      this.setAddable(true);
      this._setAllowSave(true);
      var controls= this.getAddControl();
      var $row = this.getNewRow();
      $row.show();
      var isFocused= false;
      for(var i=0;i<controls.length;i++) {
        var control = controls[i];
        if(!BaseUI.isEmpty(control.column)) {
          var __column = control.getColumn();
          var v= __data[__column.getProperty()];
          v = !BaseUI.isEmpty(v) ? v : __column.value;
          control.setValue(!BaseUI.isEmpty(v)? v: '');
          control.clearError();
          if(!isFocused && __column.type!='selection') {
            control.focus();
            isFocused= true;
          }
        }
      }
      if (this.disabled) {
        this.disable();
      }
      this.listenerOutsideEvent($row);
      this.stretchHeightFn();
    },
    hideNewRecord: function () {
      var $row = this.getNewRow();
      $row.hide();
      this.setAddable(false);
      this._setAllowSave(false);
      this.stretchHeightFn();
    },
    isValid: function () {
     return true; //old version
    },
    insert: function (data) {
      var __data = data || {};
      var me= this;
      var __record = this.getById(__data[this.getIdProperty()]);
      if (!__record) {
        this.dataSource.insert(__data);
        if (this.remotePaging) {
          if(!BaseUI.isEmpty(this.getTotal())) {
            this.setTotal((this.getTotal() || 0) + 1);
          } else {
            this.setTotal(null);
          }
        } else if(!this.remotePaging) {
          this.setTotal(null);
        }
        if(this.moveLastOnInsert){
          this.renderData(function(){
            me.fireEvent('insert', __record);
            me.last();
          });
        } else {
          this.renderData(function(){
            me.fireEvent('insert', __record);
          });
        }
        return true;
      }
      return false;
    },
    update: function (item) {
      var __item = item || {};
      var __obj = this.dataSource.update(__item);
      if(__obj) {
        this.getStore().put(__item[this.getIdProperty()].toString(), __item);
        this.listUpdate.push(__item);
        return true;
      }
      return false;
    },
    commit: function () {
      var __selectIds= [];
      for(var i=0;i<this.listUpdate.length; i++) {
        var __record = this.listUpdate[i] || {};
        this._switchView(__record);
        this.refreshSelection();
        __selectIds.push(__record[this.getIdProperty()]);
      }
      this.getSelectionModel().refresh();
      if(__selectIds.length>0) {
        this.selectById(__selectIds.join(';'), false);
      }

      this.listUpdate= [];
    },
    getById: function (id) {
      var __id = id || '';
      if (BaseUI.isEmpty(__id)) {
        return;
      }
      return this.store.get(__id.toString());
    },
    getStore: function () {
      return this.store;
    },
    remove: function (ids) {
      var __ids = ids || '';
      var me= this;
      var __isSuccess = false;
      if (BaseUI.isEmpty(__ids)) {
        return __isSuccess;
      }
      var __removeNumber = this.dataSource.remove(__ids);
      if (this.remotePaging) {
        this.setTotal(this.dataSource.count());
      }
      this.renderData(function(){
        me.getSelectionModel().clearSelected();
      });
      return !!__removeNumber;
    },
    clear: function () {
      this.clearData();
    },
    edit: function (id) {
      var __id = id || '';
      if (BaseUI.isEmpty(__id)) {
        return;
      }
      this.currentEditId = __id;
      this._switchEdit(this.getById(__id));
      this.refreshSelection();
      var $row = this.findRowById(__id);
      if (this.disabled) {
        this.disable();
      }
      this.selectById(id, true);
      return $row;
    },
    cancel: function (id) {
      var __id = id || '';
      if (BaseUI.isEmpty(__id)) {
        this.hideNewRecord();
        return;
      }
      this._setAllowUpdate(false);
      this._switchView(this.getById(__id));
      this.refreshSelection();
      return true;
    },
    load: function () {
      var self = this;
      var __params = this.getParams() || {};
      this.getBody().html(this.placeholderRowHTML(this.options.loadingHTML));
      if (!this.dataSource) {
        this.getBody().html(self.placeholderRowHTML(self.emptyMsg));
        this.$pagingContent.hide();
        return;
      }
      this.$pagingContent.show();
      self.fireEvent("beforesubmit", __params);
      if (!BaseUI.isEmpty(self.url)) {
        if (self.submitType == 'post') {
          $.postJSON(self.url, __params, function (result) {
            var __result = result || {};
            var __items = BaseUI.isFunction(self.convertData) ? self.convertData(__result) : __result.data;
            self.dataSource.setData(__items || []);
            self.renderData();
          });
        } else if (self.submitType == 'get') {
          $.getJSON(self.url, __params, function (result) {
            var __result = result || {};
            var __items = BaseUI.isFunction(self.convertData) ? self.convertData(__result) : __result.data;
            self.dataSource.setData(__items || []);
            self.renderData();
          });
        }
      } else {
        self.renderData();
      }
    },
    download: function () {
      this.fireEvent('download', this.getParams(), this);
    },
    setPageIndex: function(pageIndex){
      this.options.dataOptions.pageIndex = pageIndex || 0;
    },
    getPageIndex: function(){
      return this.options.dataOptions.pageIndex;
    },
    getPageSize: function(){
      return this.options.dataOptions.pageSize;
    },
    setTotal: function (total) {
      this.options.dataOptions.count = total;
    },
    getTotal: function () {
      return this.options.dataOptions.count;
    },
    setParams: function (params) {
      this.params = params || {};
    },
    getParams: function () {
      return this.params || {};
    },
    setUrl: function (url) {
      this.url = url || '';
    },
    getUrl: function () {
      return this.url;
    },
    getBody: function(){
      return this.$tbody;
    },
    /**
     * Returns true if grid is edit all records
     */
    isEdit: function () {
      return this.options.editable;
    },
    /**
     * Returns true if the grid contains a record editing
     */
    hasEdit: function() {
      return this.getBody().find('td').hasClass('editable');
    },
    setEditable: function (status) {
      this.options.editable = status;
    },
    /**
     * Returns true if grid is new record
     */
    isAdd: function () {
      return this.options.addable;
    },
    setAddable: function (status) {
      this.options.addable = status;
    },
    editAll: function () {
      this.setEditable(true);
      this._switchEditAll();
      if (this.disabled) {
        this.enable();
      }
      return true;
    },
    cancelEditAll: function () {
      this.setEditable(false);
      this._switchViewAll();
      return true;
    },
    setHeight: function (h) {
      if (this.$gridContainer) {
        this.$gridContainer.height(h);
        this.stretchHeightFn();
      }
    },
    getSelectionModel: function () {
      return this.sm;
    },
    getColumnModel: function () {
      if(!this._cm) {
        this._cm = new UI.grid.ColumnModel({
          grid: this
        });
      }
      return this._cm;
    },
    getEl: function(){
      return $(this.containerId);
    },
    getMask: function () {
      return this.getEl();
    },
    getIdProperty: function(){
      return this.options.idProperty || 'uuid';
    },
    getQuickSearch:function(){
      return this.quickSearch;
    },
    getAdvanceSearch:function(){
      return this.advSearch;
    },
    getPageProperty: function(){
      return this.pageProperty;
    },
    _checkSaveRecord: function () {
      var $row = this.getNewRow();
      if (this.isAdd() && this.isAllowSave()) {
        $row.data('allowSave',  false);
        this.fireEvent('blur', 'save', this);
      } else {
        $row.data('allowSave',  true);
      }
      this.removeListenerOutsideEvent($row);
      this.hideNewRecord();
    },
    _checkUpdateRecord: function () {
      if (this.isAllowUpdate()) {
        this.fireEvent('blur', 'update', this);
      }
      this._setAllowUpdate(false);
    },
    _setAllowSave: function(v){
      this.allowSave = !!v;
      var $row = this.getNewRow();
      $row.data('allowSave',  this.allowSave);
    },
    isAllowSave: function(){
      return this.allowSave;
    },
    _setAllowUpdate: function(v){
      this.allowUpdate = !!v;
    },
    isAllowUpdate: function(){
      return this.allowUpdate;
    },
    removeListenerOutsideEvent: function($row){
      return $row.unbind('clickoutside focusoutside');
    },
    listenerOutsideEvent: function($row){
      var me= this;
      var isSave = !BaseUI.isEmpty($row.data('allowSave'));
      var listener = function(){
        $row.unbind('clickoutside').bind('clickoutside', function(event){
          if($row.index()<0){
            $row.unbind('clickoutside');
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          //console.log('clickoutside>>',$row.index(),$row.length, $row);
          if(isSave) {
            me._checkSaveRecord();
          } else {
            me._checkUpdateRecord();
          }
        });
        $row.unbind('focusoutside').bind('focusoutside', function(event){
          if($row.index()<0){
            $row.unbind('focusoutside');
            return;
          }
          //console.log('focusoutside>>',$row.index(),$row.length, $row);
          event.preventDefault();
          event.stopPropagation();
          if(isSave) {
            me._checkSaveRecord();
          } else {
            me._checkUpdateRecord();
          }
        });
        return $row;
      };
      return listener.defer(250);
    },
    fireAction: function(action, data){
        this.fireEvent('event', action, data);
    }
  });
  // BaseUI.applyIf(UI.Grid.prototype, UI.resources.grid);//Apply Resource
});