// #PACKAGE: components
// #MODULE: grid

/**
 * @class AbstractColumnManager
 * @extends Component
 * @param config
 * @constructor
 */
var AbstractColumnManager = function (config) {
  CT.apply(this, config || {});//apply configuration
  this.types = {};
};
CT.extend(AbstractColumnManager, Component, {
  constructor: AbstractColumnManager,
  typeName: 'type',
  /**
   * <p>Registers a new item constructor, keyed by a type key.
   * @param {String} type The mnemonic string by which the class may be looked up.
   * @param {Constructor} cls The new instance class.
   */
  registerType: function (type, cls) {
    this.types[type] = cls;
    cls[this.typeName] = type;
  },
  /**
   * Checks if an item type is registered.
   * @param {String} type The mnemonic string by which the class may be looked up
   * @return {Boolean} Whether the type is registered.
   */
  isRegistered: function (type) {
    return this.types[type] !== undefined;
  },
  get: function (type) {
    return this.types[type];
  }
});

var ColumnManager = new AbstractColumnManager();

