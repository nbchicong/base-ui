/**
 * #PACKAGE: utils
 * #MODULE: currency-utils
 */
/**
 * Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 *         on 07/05/2016.
 * -------------------------------------------
 * @project base-ui
 * @file CurrencyUtils
 * @author nbchicong
 */

/**
 * @class CurrencyUtils
 * @constructor
 */
var CurrencyUtils = function () {
  this.spliter = ',';
  this.inputMaskAttr = "'alias': 'numeric', 'groupSeparator': '" + this.spliter + "', 'autoGroup': true, 'digits': 0, 'digitsOptional': false, 'placeholder': '0'";
};
CurrencyUtils.prototype = {
  formatBySeparator: function (currencyNum, separator) {
    var __separator = separator || this.spliter;
    var __currency = currencyNum.toString();
    if (__currency.indexOf(__separator) != -1)
      return __currency;

    var __dest = '';
    var __tmp = '';
    var __length = __currency.length;
    for (var i = 0; i < __length; i++) {
      __tmp = '' + __currency[__length - i - 1].toString() + '' + __tmp.toString();
      __dest = ((i < __length - 1 && (__tmp.length == 3)) ? __separator : '') + __currency[__length - i - 1].toString() + __dest;
      if (__tmp.length == 3)
        __tmp = '';

    }
    if (__dest.charAt(0) == __separator)
      __dest.slice(1);

    return __dest;
  },
  mask: function (elsQuery) {
    $(elsQuery).attr('data-inputmask', this.inputMaskAttr).inputmask().css('text-align', 'left');
  },
  getFieldValue: function (field) {
    var $field = $(field);
    if ($field.inputmask('hasMaskedValue')) {
      return $field.inputmask('unmaskedvalue');
    }
    return $field.val();
  }
};
new CurrencyUtils();