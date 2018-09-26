/**
 * #PACKAGE: utils
 * #MODULE: request
 */
/**
 * Copyright (c) 2017 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * Date: 15/03/2017
 * Time: 10:57 PM
 * ---------------------------------------------------
 * Project: market-mini
 * @name: RequestUtils
 * @author: nbchicong
 */

var RequestUtils = {
  getUrl: function (path, timeStamp) {
    if (getConfig('context') !== undefined) {
      var url = getConfig('context') + '/' + path;
      url += (!isEmpty(getConfig('ext')) && isDefined(getConfig('ext'))) ? getConfig('ext') : '';
      url += timeStamp ? '?_t=' + timeStamp : '';
      return url;
    }
    return path + (timeStamp ? '?_t=' + timeStamp : '');
  },
  parseFormData: function (data) {
    if (toString.apply(data) === '[object Object]') {
      var fd = new FormData();
      for (var key in data)
        if (data.hasOwnProperty(key))
          fd.append(key, data[key]);

      return fd;
    }
    return data;
  },
  responseHandler: function (response, callback) {
    if (response.success || response.id || response === true)
      callback && callback(response);
  }
};