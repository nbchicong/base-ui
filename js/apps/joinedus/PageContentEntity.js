/**
 * #PACKAGE: joinedus
 * #MODULE: page-content-entity
 */
/**
 * @license Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * ---------------------------------------------------
 */
/**
 * Project: laravel
 * @name: PageContentEntity
 * @package: ${NAMESPACE}
 * @author: nbchicong
 */
$(function () {
  /**
   * @class UI.PageContentEntity
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
  UI.PageContentEntity = function () {
    var _this = this;
    this.id = 'page-content';
    this.submitType = 'JSON';
    this.$toolbar = {
      BACK: $('#btn-back'),
      CREATE: $('#btn-create'),
      SAVE: $('#btn-save')
    };
    this.url = {
      list: ('page/list'),
      load: ('page/load'),
      create: ('page/create'),
      update: ('page/update'),
      remove: ('page/remove')
    };
    this.$listItem = $('#list-items');
    this.$content = $('#item-content');
    this.$form = {
      id: $('#txt-id'),
      title: $('#txt-title'),
      content: $('#txt-content'),
      tags: $('#txt-tags')
    };
    this.dataSource = new UI.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'title',
        label: 'Tiêu đề',
        sortable: true,
        type: 'text',
        align: 'left'
      }, {
        property: 'author',
        label: 'Người viết',
        sortable: true,
        type: 'text',
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
            _this.setEntity(record);
            _this.editRow(record);
          }
        }, {
          text: 'Xóa',
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var r = confirm('Bạn có đồng ý xóa?');
            if (r) {
              _this.setEntity(record);
              _this.removeRow(record);
            }
          }
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
    UI.PageContentEntity.superclass.constructor.call(this);
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
  BaseUI.extend(UI.PageContentEntity, UI.Entity, {
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
      this.$form.title.val(data.title);
      this.$form.tags.val(data.tags);
      this.setEditorContent(BaseUI.isEmpty(data.content)?'':data.content);
    },
    getData: function () {
      return {
        title: this.$form.title.val(),
        content: __contentEditor.getContent(),
        tags: this.$form.tags.val()
      };
    },
    getForm: function () {
      return this.$content.find('[role="form"]');
    },
    save: function () {
      var _this = this;
      var __data = this.getData();
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
    editRow: function (row) {
      var _this = this;
      this.setEntity(row);
      this.setEntityId(row[this.getIdProperties()]);
      _this.setData(row);
      _this.next();
      // this.load(function (data) {
      //   _this.responseHandle(data, function () {
      //     _this.setData(data);
      //     _this.next();
      //   });
      // });
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
  new UI.PageContentEntity();
});