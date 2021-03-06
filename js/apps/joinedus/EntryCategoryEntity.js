/**
 * #PACKAGE: joinedus
 * #MODULE: entry-category-entity
 */
/**
 * @license Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * ---------------------------------------------------
 */
/**
 * Project: laravel
 * @name: EntryCategoryEntity
 * @package: ${NAMESPACE}
 * @author: nbchicong
 */
$(function () {
  /**
   * @class UI.EntryCategoryEntity
   * @extends UI.Entity
   */
  UI.EntryCategoryEntity = function () {
    var _this = this;
    var parentCate = listCate || [];
    this.id = 'entry-category';
    this.submitType = 'JSON';
    this.$toolbar = {
      CREATE: $('#btn-add')
    };
    this.url = {
      list: ('category/list'),
      create: ('category/create'),
      update: ('category/update'),
      remove: ('category/remove')
    };
    this.$listItem = $('#list-items');
    this.dataSource = new UI.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'name',
        label: 'Tên thể loại',
        sortable : true,
        type: 'text',
        align: 'left'
      }, {
        property: 'parentId',
        label: 'Thể loại cha',
        sortable: true,
        type: 'select',
        editData: parentCate,
        valueField: 'id',
        displayField: 'name',
        value: '',
        width: 300
      }, {
        label: '',
        type: 'action',
        separate: '&nbsp;',
        align: 'center',
        buttons: [{
          text: 'Sửa',
          icon: 'fa fa-pencil',
          labelCls: 'label label-info',
          fn: function (record) {
            _this.grid.edit(record[_this.getIdProperties()]);
          }
        }, {
          text: 'Xóa',
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var r = confirm('Bạn có đồng ý xóa?');
            if (r) {
              _this.setEntity(record);
              _this['removeRow'].call(_this, record);
            }
          }/*,
           visibled: function(record){
           var __data= record || {};
           if(__data.status=='approved' || __data.status=='completed') {
           return false;
           }
           return true;
           }*/
        }]
      }],
      delay: 100
    });
    this.grid = new UI.Grid({
      id: this.$listItem.prop('id'),
      url: this.url.list,
      dataSource: this.dataSource,
      idProperty: 'id',
      pageSize: 10,
      remotePaging: true
    });
    UI.EntryCategoryEntity.superclass.constructor.call(this);
    this.$toolbar.CREATE.on('click', function () {
      _this.clear();
      _this.grid.newRecord();
    });
    this.grid.on('save', function (data) {
      _this.setEntityId(null);
      _this.setEntity(data);
      _this['save'].call(_this);
    });
    this.grid.on('update', function (data) {
      _this.setEntityId(data[_this.getIdProperties()]);
      _this.setEntity(data);
      _this['save'].call(_this);
    });
  };
  BaseUI.extend(UI.EntryCategoryEntity, UI.Entity, {
    clear: function () {
      this.setEntityId(null);
    },
    setEntity: function (data) {
      this.entity = data;
    },
    getEntity: function () {
      return this.entity;
    },
    save: function () {
      var _this = this;
      var __data = this.getEntity();
      if (!BaseUI.isEmpty(this.getEntityId())) {
        __data.id = this.getEntityId();
        this.setParams(__data);
        this.update(function (data) {
          _this.responseHandle(data, function (response) {
            _this.grid.reload();
            _this.notify('Update success', 'success');
            console.log('%cUpdate success', 'color: #00FF00');
          });
        })
      } else {
        this.setParams(__data);
        this.create(function (data) {
          _this.responseHandle(data, function (response) {
            _this.grid.reload();
            _this.notify('Create success', 'success');
            console.log('%cCreate success', 'color: #00FF00');
          });
        });
      }
    },
    removeRow: function (row) {
      var _this = this;
      this.setEntityId(row[this.getIdProperties()]);
      this.setParams(this.getEntity());
      this.remove(function (data) {
        _this.responseHandle(data, function () {
          _this.grid.remove(row[_this.getIdProperties()]);
        });
      });
    }
  });
  new UI.EntryCategoryEntity();
});
