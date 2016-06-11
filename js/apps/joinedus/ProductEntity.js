/**
 * #PACKAGE: joinedus
 * #MODULE: product-entity
 */
/**
 * @license Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * ---------------------------------------------------
 */
/**
 * Project: laravel
 * @name: ProductEntity
 * @package: ${NAMESPACE}
 * @author: nbchicong
 */
$(function () {
  /**
   * @class UI.ProductEntity
   * @extends UI.Entity
   */
  UI.ProductEntity = function () {
    var _this = this;
    this.id = 'product-entity';
    this.submitType = 'JSON';
    this.$toolbar = {
      BACK: $('$btn-back'),
      CREATE: $('#btn-add'),
      SAVE: $('#btn-save')
    };
    this.url = {
      list: ('product/list'),
      create: ('product/create'),
      update: ('product/update'),
      remove: ('product/remove')
    };
    this.$listItem = $('#list-items');
    this.$content = $('#item-content');
    this.$form = {
      name: $('#txt-name'),
      code: $('#txt-code'),
      category: $('#cbb-category'),
      brand: $('#cbb-brand'),
      price: $('#txt-price'),
      quantity: $('#txt-quantity'),
      availability: $('#cbx-availability'),
      promotions: $('#cbx-promotions'),
      discount: $('#txt-discount'),
      tags: $('#txt-tags')
    };
    this.dataSource = new UI.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'name',
        label: 'Tên sản phẩm',
        sortable : true,
        type: 'text',
        align: 'left'
      }, {
        property: 'name',
        label: 'Loại',
        sortable : true,
        type: 'text',
        align: 'left',
        width: 100
      }, {
        property: 'name',
        label: 'Nhà sản xuất',
        sortable : true,
        type: 'text',
        align: 'left',
        width: 150
      }, {
        property: 'name',
        label: 'Giá',
        sortable : true,
        type: 'text',
        align: 'left',
        width: 100
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
            _this.setEntity(record);
            _this['editRow'].call(_this, record);
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
    UI.ProductEntity.superclass.constructor.call(this);
    this.$toolbar.CREATE.on('click', function () {
      _this.clear();
      _this.grid.newRecord();
    });
  };
  BaseUI.extend(UI.ProductEntity, UI.Entity, {
    clear: function () {
      this.setEntityId(null);
    },
    setEntity: function (data) {
      this.entity = data;
    },
    getEntity: function () {
      return this.entity;
    },
    setData: function (data) {
      this.setEntity(data);
      this.$form.name.val(data.name);
      this.$form.code.val(data.code);
      this.$form.category.val(data.categoryId);
      this.$form.brand.val(data.brandId);
      this.$form.quantity.val(data.quantity);
      this.$form.price.val(data.price);
      this.$form.availability[0].checked = data.availability;
      this.$form.promotions[0].checked = data.promotions;
      this.$form.discount.val(data.discount);
      this.$form.tags.val(data.tags);
    },
    getData: function () {
      var __fd = new FormData();
      this.setParams(this.getForm().serializeArray());
      this.getParams().forEach(function (item) {
        __fd.append(item.name, item.value);
      });
      if (!BaseUI.isEmpty(this.getEntityId())) {
        __fd.append('id', this.getEntityId());
      }
      return __fd;
    },
    getForm: function () {
      return this.$content.find('form');
    },
    create: function (callback) {
      var __options = {
        url: this.url.create,
        data: this.getData(),
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST'
      };
      var __fn = callback || BaseUI.emptyFn;
      if (!BaseUI.isEmpty(this.getParams())) {
        this.sendAjax(__options, __fn);
      } else {
        console.log('%cParams can not empty when change data', 'color: #FF0000');
      }
    },
    update: function (callback) {
      var __options = {
        url: this.url.update,
        data: this.getData(),
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST'
      };
      var __fn = callback || BaseUI.emptyFn;
      if (!BaseUI.isEmpty(this.getParams())) {
        this.sendAjax(__options, __fn);
      } else {
        console.log('%cParams can not empty when change data', 'color: #FF0000');
      }
    },
    save: function () {
      var _this = this;
      if (!BaseUI.isEmpty(this.getEntityId())) {
        this.update(function (data) {
          _this.responseHandle(data, function () {
            _this.grid.reload();
            _this.notify('Update success', 'success');
            console.log('%cUpdate success', 'color: #00FF00');
          });
        });
      } else {
        this.create(function (data) {
          _this.responseHandle(data, function () {
            _this.grid.reload();
            _this.notify('Create success', 'success');
            console.log('%cCreate success', 'color: #00FF00');
          });
        });
      }
    },
    load: function () {
      
    },
    editRow: function (row) {
      
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
  new UI.ProductEntity();
//  http://123.20.207.23/html/xem-chi-tiet-minhthanh11-10.html
});
