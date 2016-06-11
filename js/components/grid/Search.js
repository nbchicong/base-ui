// #PACKAGE: grid
// #MODULE: Search
!function ($) {
    // SEARCH CONSTRUCTOR AND PROTOTYPE
    var Search = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.search.defaults, options);
        this.$button = this.$element.find('button')
            .on('click', $.proxy(this.buttonclicked, this));

        this.$input = this.$element.find('input')
            .on('keydown', $.proxy(this.keypress, this))
            .on('keyup', $.proxy(this.keypressed, this));

        this.$icon = this.$element.find('i');
        this.activeSearch = '';
    };

    Search.prototype = {
        constructor: Search,
        search: function (searchText) {
            this.$icon.attr('class', 'fa fa-remove');
            this.activeSearch = searchText;
            this.$element.trigger('searched', searchText);
        },
        clear: function () {
            this.$icon.attr('class', 'fa fa-search');
            this.activeSearch = '';
            this.$input.val('');
            this.$element.trigger('cleared');
        },

        action: function () {
            var val = this.$input.val();
            var inputEmptyOrUnchanged = val === '' || val === this.activeSearch;

            if (this.activeSearch && inputEmptyOrUnchanged) {
                this.clear();
            } else if (val) {
                this.search(val);
            }
        },
        buttonclicked: function (e) {
            e.preventDefault();
            if ($(e.currentTarget).is('.disabled, :disabled')) return;
            this.action();
        },
        keypress: function (e) {
            if (e.which === 13) {
                e.preventDefault();
            }
        },
        keypressed: function (e) {
            var val, inputPresentAndUnchanged;
            if (e.which === 13) {
                e.preventDefault();
                this.action();
            } else {
                val = this.$input.val();
                inputPresentAndUnchanged = val && (val === this.activeSearch);
                this.$icon.attr('class', inputPresentAndUnchanged ? 'fa fa-remove' : 'fa fa-search');
            }
        },
        disable: function () {
            this.$input.attr('disabled', 'disabled');
            this.$button.addClass('disabled');
        },
        enable: function () {
            this.$input.removeAttr('disabled');
            this.$button.removeClass('disabled');
        }
    };
    // SEARCH PLUGIN DEFINITION
    $.fn.search = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('search');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('search', (data = new Search(this, options)));
            if (typeof option === 'string') data[option]();
        });
    };
    $.fn.search.defaults = {};
    $.fn.search.Constructor = Search;
    // SEARCH DATA-API
    $(function () {
        $('body').on('mousedown.search.data-api', '.search', function () {
            var $this = $(this);
            if ($this.data('search')) return;
            $this.search($this.data());
        });
    });
    /**
     * @class UI.grid.Search
     * @extends UI.Component
     * @param config
     * @constructor
     */

    UI.grid.Search = function (config) {
        config = config || {};
        BaseUI.apply(this, config);//apply configuration
    };
    BaseUI.extend(UI.grid.Search, UI.Component, {
        intComponent: function () {
        },
        getUrl: function () {
            return this.url;
        },
        getId: function () {
            return this.id;
        },
        getEl: function () {
            return $.getCmp(this.getId());
        },
        hide: function () {
            this.getEl().hide();
        },
        show: function () {
            this.getEl().show();
        },
        getData: function () {
            return {};
        }
    });


}(window.jQuery);