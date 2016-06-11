// #PACKAGE: grid
// #MODULE: DataSource
/*
 * BaseUI Grid Data source
 */
BaseUI.ns("UI.grid.DataSource");
( function (root, factory) {
  root.DataSource = factory();
  root.UI.grid.DataSource = root.DataSource;
}(this, function () {
  var DataSource = function (options) {
    this._formatter = options.formatter;
    this._columns = options.columns || [];
    this._delay = options.delay || 0;
    this._filterProp = options.filterProperty;
    this._idProp = options.idProperty;
    this._store = new Hashtable();
  };
  DataSource.prototype = {
    setIdProperty: function(v){
      this._idProp = v;
    },
    getIdProperty: function(){
      return this._idProp;
    },
    columns: function () {
      return this._columns;
    },
    getStore: function(){
      return this._store;
    },
    setData: function (datas) {
      datas = datas || [];
      var me =this;
      var store = me.getStore();
      store.clear();
      _.filter(datas, function (item) {
        if(BaseUI.isEmpty(item[me.getIdProperty()])) {
          item[me.getIdProperty()] = BaseUI.generateId().toString();
        }
        store.put(item[me.getIdProperty()].toString(), item);
      });
    },
    getData: function () {
      return this.getStore().values();
    },
    insert: function (item) {
      var __item =item || {};
      if(BaseUI.isEmpty(__item[this.getIdProperty()])) {
        __item[this.getIdProperty()] = BaseUI.generateId().toString();
      }
      this.getStore().put(__item[this.getIdProperty()].toString(), __item);
    },
    remove: function(ids){ //string id: 1;2;36
      var __deleteIds = ids.toString().split(';');
      var store= this.getStore();
      var count=0;
      for(var i=0;i<__deleteIds.length;i++){
        if(store.remove(__deleteIds[i])) {//remove success
          count+=1;
        }
      }
      return count;
    },
    update: function(item){
      var store= this.getStore();
      var __item = item || {};
      return store.put(__item[this.getIdProperty()].toString(), __item);
    },
    count: function(){
      return this.getStore().size();
    },
    data: function (options, callback) {
      var self = this;
      var isRemote = !BaseUI.isEmpty(options.count);
      options.pageSize = options.pageSize || 10;
      setTimeout(function () {
        var data = $.extend(true, [], self.getData());
        // SEARCHING
        if (options.search) {
          data = _.filter(data, function (item) {
            var match = false;
            _.each(item, function (prop) {
              if (_.isString(prop) || _.isFinite(prop)) {
                if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
              }
            });
            return match;
          });
        }

        // FILTERING
        if(options.filter){
          data = _.filter(data, function(item){
            if(options.filter.value == item[self._filterProp]){
              return true;
            }else if(options.filter.value == ''){
              return true;
            }
            return false;
          });
        }

        var count = isRemote ? options.count : data.length;
        // SORTING
        if (options.sortProperty) {
          data = _.sortBy(data, options.sortProperty);
          if (options.sortDirection === 'desc')
            data.reverse();
        }
        // PAGING
        var startIndex = options.pageIndex * options.pageSize;
        var endIndex = startIndex + options.pageSize;
        var end = (endIndex > count) ? count : endIndex;
        var pages = Math.ceil(count / options.pageSize);
        var page = options.pageIndex + 1;
        var start = startIndex + 1;
        if (!isRemote) {
          data = data.slice(startIndex, endIndex);
          if (self._formatter) {
            self._formatter(data);
          }
        }
        callback({
          data: data,
          start: start,
          end: end,
          count: count,
          pages: pages,
          page: page
        });
      }, this._delay);
    }
  };
  return DataSource;
}));