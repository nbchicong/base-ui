/**
 * #PACKAGE: joinedus
 * #MODULE: site-config-entity
 */
/**
 * @license Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * ---------------------------------------------------
 */
/**
 * Project: laravel
 * @name: SiteConfigEntity
 * @package: ${NAMESPACE}
 * @author: nbchicong
 */
$(function () {
  /**
   * @class UI.SiteConfigEntity
   * @extends UI.Entity
   */
  UI.SiteConfigEntity = function () {
    var _this = this;
    this.id = 'site-config';
    this.submitType = 'JSON';
    this.$toolbar = {
      SAVE: $('#btn-save')
    };
    this.url = {
      update: ('config/update')
    };
    this.$content = $('#item-content');
    UI.SiteConfigEntity.superclass.constructor.call(this);
    this.$toolbar.SAVE.on('click', function () {
      _this.save(_this);
    });
  };
  BaseUI.extend(UI.SiteConfigEntity, UI.Entity, {
    setEntity: function (data) {
      this.entity = data;
    },
    getEntity: function () {
      return this.entity;
    },
    setData: function (data) {
      this.setEntity(data);
      for (var key in data)
        if (data.hasOwnProperty(key))
          this.getForm().find('[name="' + key + '"]').val(data[key]);
    },
    getData: function () {
      var __data = {};
      console.log(this.getForm());
      console.log(this.getForm().serializeArray());
      this.getForm().serializeArray().forEach(function (item) {
        __data[item.name] = item.value;
      });
      return __data;
    },
    getForm: function () {
      return this.$content.find('[role="form"]');
    },
    save: function () {
      var _this = this;
      var __data = this.getData();
      if (!BaseUI.isEmpty(__data)) {
        this.setParams(__data);
        this.update(function (data) {
          _this.responseHandle(data, function () {
            _this.notify('Update success', 'success');
            console.log('%cUpdate success', 'color: #00FF00');
          });
        });
      }
    }
  });
  new UI.SiteConfigEntity();
});