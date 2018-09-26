/**
 * @license Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 *         on 10/04/2016.
 * -------------------------------------------
 * @project base-ui
 * @file Controls
 * @author nbchicong
 */
$(function () {
  /**
   * @class UI.Controls
   * @extends UI.Component
   */
  CiCo.Controls = function () {
    window.UIControls = this;
  };
  CiCo.extend(CiCo.Controls, CiCo.Component, {
    /**
     * @param {String} id control element id
     * @param {String} name Control element name
     * @param {String} value Control element value
     * @param {String} cls Control element css class
     * @returns {*|String} Control html
     */
    createInputText: function (id, name, value, cls) {
      var __id = !CiCo.isEmpty(id)?id:String.format('new-{0}-{1}', name, new Date().getTime());
      return String.format('<input type="text" id="{0}" name="{1}" value="{2}" class="{3}" role="control" />', __id, name, value, cls||'');
    },

    /**
     * @param {String} id control element id
     * @param {String} name Control element name
     * @param {Number} value Control element value
     * @param {String} cls Control element css class
     * @returns {*|String} Control html
     */
    createInputNumber: function (id, name, value, cls) {
      var __id = id!=''?id:String.format('new-{0}-{1}', name, new Date().getTime());
      return String.format('<input type="number" id="{0}" name="{1}" value="{2}" class="{3}" role="control" />', __id, name, value, cls||'');
    },

    /**
     * @param {String} id control element id
     * @param {String} name Control element name
     * @param {Array} data List data
     * @param {String} value Control element value selected
     * @param {String} cls Control element css class
     * @returns {*|String} Control html
     */
    createSelector: function (id, name, data, value, cls) {
      var __id = id!=''?id:String.format('new-{0}-{1}', name, new Date().getTime());
      var __html = String.format('<select id="{0}" name="{1}" class="{2}" role="control">', __id, name, cls||'');
      if (CiCo.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          var __item = data[i];
          __html += String.format('<option class="{1}" value="{0}" {3}>{2}</option>', __item.value, __item.cls||'', __item.name, __item.value==value?'selected':'');
        }
      } else {
      }
      __html += '</select>';
      return __html;
    }
  });
});