// #PACKAGE: grid
// #MODULE: Selection
$(function () {
//~================CheckBox Selection============================
  /**
   * @class UI.grid.CheckboxSelection
   * @extends UI.Component
   * @param config
   * @constructor
     */
  UI.grid.CheckboxSelection = function (config) {
    config = config || {};
    this.prefix = '';
    BaseUI.apply(this, config);//apply configuration
    this.store = this.grid.getStore(); //store data
    var checkQuery = 'td[data-action=select] input[type=checkbox]';
    this.query = function () {
      this.$rowSelector = this.grid.$tbody.find('tr[data-id]');
      this.$checkboxSelector = this.grid.$tbody.find(checkQuery);
      this.$checkAll = this.grid.$thead.find('input[type=checkbox]:first');
      this.$columnCheck = this.grid.$tbody.find('td[data-action=select]');
    };
    this.query();
    var me = this;
    var fireSelectEvent = function (selector, checked, checkall) {
      var $row = $(selector);
      if (checked) {
        $row.addClass('selected');
      } else {
        $row.removeClass('selected');
      }
      if (!checkall) {
        var selectedCount = me.$rowSelector.find(me.$checkboxSelector).parent().find('input[type=checkbox]:checked').length;
        me.$checkAll.prop('checked', (me.getCount() > 0) && (me.getCount() == selectedCount));
        me.fireEvent('selectionchange', me, me.getSelected());
      } else {
        me.fireEvent('selectionchange', me, me.getSelection());
      }
    };
    this.grid.$tbody.off('click', checkQuery).on('click', checkQuery, function (e) {
      e.stopPropagation();
      var isChecked = $(this).is(':checked');
      var $row = $($(this).parent().parent().parent().get(0));
      fireSelectEvent($row, isChecked);
    });
    this.$checkAll.off('click').on('click', function () {
      var isChecked = $(this).is(':checked');
      me.$rowSelector.find(me.$checkboxSelector).prop('checked', isChecked);
      fireSelectEvent(me.$rowSelector, isChecked, true);
    });
    this.$columnCheck.off('click').on('click', function (e) {
      var chk = $(this).closest("tr").find("input:checkbox").get(0);
      if (e.target != chk) {
        $(chk).prop('checked', !$(chk).is(':checked'));
        fireSelectEvent($(this).parent(), !!$(chk).is(':checked'));
        e.stopPropagation();
      }
    });
    this.$rowSelector.find(this.$checkboxSelector).parent().find('input[type=checkbox]:checked').parent().parent().parent().addClass('selected');
    this.$checkAll.prop('checked', false); //default checked
  };
  BaseUI.extend(UI.grid.CheckboxSelection, UI.Component, {
    getCount: function () {
      return this.$rowSelector.find(this.$checkboxSelector).length;
    },
    /**
     * Returns the first selected record
     */
    getSelected: function () {
      var $selects = this.$rowSelector.find(this.$checkboxSelector).parent().find('input[type=checkbox]:checked');
      if ($selects.length > 0) {
        var id = $($selects[0]).parent().parent().parent().data('id');
        if (!BaseUI.isEmpty(id)) {
          return this.store.get(id.toString());
        }
      }
      return null;
    },
    /**
     * Returns the selected records
     */
    getSelection: function () {
      var __selections = [];
      var $selects = this.$rowSelector.find(this.$checkboxSelector).parent().find('input[type=checkbox]:checked');
      for (var i = 0; i < $selects.length; i++) {
        var id = $($selects[i]).parent().parent().parent().data('id');
        if (!BaseUI.isEmpty(id)) {
          __selections.push(this.store.get(id.toString())); // push data row
        }
      }
      return __selections;
    },
    clearSelected: function () {
      this.$rowSelector.find(this.$checkboxSelector).prop('checked', false);
      this.$rowSelector.removeClass('selected');
      this.$checkAll.prop('checked', false); //default checked
      this.fireEvent('selectionchange', this, []);
    },
    checkAll: function () {
      this.$checkAll.prop('checked', true);
      this.$rowSelector.find(this.$checkboxSelector).prop('checked', true);
      this.$rowSelector.addClass('selected');
    },
    checkedRow: function ($row, clear) {
      if (!!clear) {
        this.$rowSelector.find(this.$checkboxSelector).prop('checked', false);
        this.$rowSelector.removeClass('selected');
        this.$checkAll.prop('checked', false); //default checked
      }
      $row.find(this.$checkboxSelector).prop('checked', true);
      $row.addClass('selected');
      this.fireEvent('selectionchange', this, this.getSelected());
    },
    refresh: function () {
      this.$rowSelector.find(this.$checkboxSelector).prop('checked', false);
      this.$rowSelector.removeClass('selected');
      this.$checkAll.prop('checked', false); //default checked
      this.query();
    }
  });

  //~================Click Selection============================
  /**
   * @class UI.grid.ClickSelection
   * @extends UI.Component
   * @param config
   * @constructor
     */
  UI.grid.ClickSelection = function (config) {
    var __config = config || {};
    this.selections = __config.selections || [];
  };
  BaseUI.extend(UI.grid.ClickSelection, UI.Component, {
    getSelection: function () {
      return this.selections;
    },
    setSelection: function (selections) {
      this.selections = selections;
    },
    getSelected: function () {
      if (BaseUI.isArray(this.selections)) {
        return this.selections[this.selections.length - 1];
      }
      return null;
    },
    clearSelection: function () {
      this.selections = [];
    },
    clearSelected: function(){
      this.clearSelection();
    },
    refresh: function () {
      this.clearSelection();
    }
  });
});