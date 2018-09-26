/**
 * Copyright (c) 2017 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * Date: 15/02/2017
 * Time: 9:58 PM
 * ---------------------------------------------------
 * Project: market-mini
 * @name: App
 * @author: nbchicong
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Market requires jQuery');
}

var configKey = 'Config';
function applyConfig(config) {
  globalDeclare(configKey, config || {});
}
function setConfig(name, value) {
  getVariable(configKey)[name] = value;
}
function getConfig(name) {
  return getVariable(configKey)[name];
}

applyConfig();
