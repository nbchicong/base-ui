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
  var __contentEditor = null;
  var __editorInstalled = false;
  function __renderListFontSize(begin, end) {
    var __font = '';
    for (var i = begin; i <= end; i++) {
      __font += i + 'px ';
    }
    return __font.slice(0, -1);
  }
  function __installTinyMCE() {
    tinymce.init({
      selector: '#txt-content',
      height: 400,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code'
      ],
      toolbar: 'undo redo | styleselect fontselect fontsizeselect | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      content_css: [
        '../../../css/bootstrap.min.css',
        '../../../css/main.css',
        '../../../css/responsive.css'
      ],
      fontsize_formats: __renderListFontSize(9, 36),
      init_instance_callback: function (editor) {
        __contentEditor = editor;
        __editorInstalled = true;
      }
    });
  }
  UI.ProductEntity = function () {
    var _this = this;
    this.id = 'product-entity';
    this.submitType = 'JSON';
    this.$toolbar = {
      BACK: $('#btn-back'),
      CREATE: $('#btn-add'),
      SAVE: $('#btn-save')
    };
    this.url = {
      list: ('product/list'),
      load: ('product/load'),
      create: ('product/create'),
      update: ('product/update'),
      remove: ('product/remove')
    };
    this.$listItem = $('#list-items');
    this.$content = $('#item-content');
    this.$form = {
      id: $('#txt-id'),
      name: $('#txt-name'),
      code: $('#txt-code'),
      category: $('#cbb-category'),
      brand: $('#cbb-brand'),
      price: $('#txt-price'),
      quantity: $('#txt-quantity'),
      availability: $('#cbx-availability'),
      promotions: $('#cbx-promotions'),
      discount: $('#txt-discount'),
      tags: $('#txt-tags'),
      details: $('#txt-content')
    };
    this.dataSource = new UI.grid.DataSource({
      columns: [/*{
        type: 'selection',
        align: 'center',
        width: 30
      }, */{
        property: 'name',
        label: 'Tên sản phẩm',
        sortable : true,
        type: 'text',
        align: 'left'
      }, {
        property: 'categoryId',
        label: 'Loại',
        sortable : true,
        type: 'text',
        align: 'left',
        width: 100
      }, {
        property: 'brandId',
        label: 'Nhà sản xuất',
        sortable : true,
        type: 'text',
        align: 'left',
        width: 150
      }, {
        property: 'price',
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
    __installTinyMCE.call(this);
    this.$toolbar.CREATE.on('click', function () {
      _this.clear();
      _this.next();
    });
    this.$toolbar.BACK.on('click', function () {
      _this.clear();
      _this.prev();
    });
    this.$toolbar.SAVE.on('click', function () {
      _this.save(_this);
    });
  };
  BaseUI.extend(UI.ProductEntity, UI.Entity, {
    clear: function () {
      this.setEntityId(null);
      this.getForm().find('input,textarea').val('');
    },
    setEntity: function (data) {
      this.entity = data;
    },
    getEntity: function () {
      return this.entity;
    },
    setEditorContent: function (content) {
      if (__editorInstalled)
        __contentEditor.setContent(content);
      else
        this.setEditorContent(content);
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
      this.setEditorContent(BaseUI.isEmpty(data.details)?'':data.details);
    },
    getData: function () {
      var __fd = new FormData();
      this.setParams(this.getForm().serializeArray());
      this.getParams().forEach(function (item) {
        __fd.append(item.name, item.value);
      });
      __fd.append('details', __contentEditor.getContent());
      if (!BaseUI.isEmpty(this.getEntityId())) {
        __fd.append(this.getIdProperties(), this.getEntityId());
      }
      return __fd;
    },
    getForm: function () {
      return this.$content.find('form');
    },
    create: function (callback) {
      var _this = this;
      var __fn = callback || BaseUI.emptyFn;
      var __options = {
        url: this.url.create,
        clearForm: false,
        beforeSerialize: function () {
          _this.$form.details.val(__contentEditor.getContent());
        },
        uploadProgress: function (event, position, total, percentComplete) {
          console.log('upload progress', position, total, percentComplete);
        },
        success: function (responseText, statusText, xhr) {
          __fn(responseText, statusText, xhr);
        },
        error: function (error) {
          console.log('create error', error);
        },
        type: 'POST'
      };
      this.getForm().ajaxSubmit(__options);
      // if (!BaseUI.isEmpty(this.getParams())) {
      //   this.sendAjax(__options, __fn);
      // } else {
      //   console.log('%cParams can not empty when change data', 'color: #FF0000');
      // }
    },
    update: function (callback) {
      var _this = this;
      var __fn = callback || BaseUI.emptyFn;
      var __options = {
        url: this.url.update,
        clearForm: false,
        beforeSerialize: function () {
          _this.$form.details.val(__contentEditor.getContent());
        },
        uploadProgress: function (event, position, total, percentComplete) {
          console.log('upload progress', position, total, percentComplete);
        },
        success: function (responseText, statusText, xhr) {
          __fn(responseText, statusText, xhr);
        },
        error: function (error) {
          console.log('update error', error);
        },
        type: 'POST'
      };
      this.$form.id.val(this.getEntityId());
      this.getForm().ajaxSubmit(__options);
      // if (!BaseUI.isEmpty(this.getParams())) {
      //   this.sendAjax(__options, __fn);
      // } else {
      //   console.log('%cParams can not empty when change data', 'color: #FF0000');
      // }
    },
    save: function () {
      var _this = this;
      console.log('save product', this.getForm());
      // this.getForm().ajaxSubmit();
      // this.getForm().submit(function () {
      //   $(this).ajaxSubmit();
      //   return false;
      // });
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
    load: function (callback) {
      var __params = {id: this.getEntityId()};
      var __fn = callback || BaseUI.emptyFn;
      this.sendAjax({
        url: this.url.load,
        method: 'GET',
        data: (this.getSubmitType()=='JSON_STRING'?JSON.stringify(__params):__params),
        dataType: 'JSON',
        contentType: 'application/json'
      }, __fn);
    },
    editRow: function (row) {
      var _this = this;
      this.setEntity(row);
      this.setEntityId(row[this.getIdProperties()]);
      this.load(function (data) {
        _this.responseHandle(data, function () {
          _this.setData(data);
          _this.next();
        });
      });
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
    },
    prev: function () {
      this.$listItem.show();
      this.$content.hide();
      this.$toolbar.BACK.hide();
      this.$toolbar.SAVE.hide();
    },
    next: function () {
      this.$listItem.hide();
      this.$content.show();
      this.$toolbar.BACK.show();
      this.$toolbar.SAVE.show();
    }
  });
  new UI.ProductEntity();
//  http://123.20.207.23/html/xem-chi-tiet-minhthanh11-10.html
});
