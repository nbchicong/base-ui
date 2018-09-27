import {BaseComponent} from "../../core/CoreClazz";

export class Notify extends BaseComponent {
    name = 'Notify';
    element: JQuery<Document> = $(document);
    private options = {};
    private defaultOptions = {
        globalPosition: 'top right',
        style: 'bootstrap2'
    };

    initComponent () {
        $.notify.addStyle('bootstrap2', {
            html: '<div>\n<span data-notify-text></span>\n</div>',
            classes: {
                base: {
                    'font-weight': 'bold',
                    'padding': '8px 15px 8px 14px',
                    'text-shadow': '0 1px 0 rgba(255, 255, 255, 0.5)',
                    'background-color': '#fcf8e3',
                    'border': '1px solid #fbeed5',
                    'border-radius': '4px',
                    'white-space': 'nowrap'
                },
                error: {
                    'color': '#B94A48',
                    'background-color': '#F2DEDE',
                    'border-color': '#EED3D7'
                },
                success: {
                    'color': '#468847',
                    'background-color': '#DFF0D8',
                    'border-color': '#D6E9C6'
                },
                info: {
                    'color': '#3A87AD',
                    'background-color': '#D9EDF7',
                    'border-color': '#BCE8F1'
                },
                warn: {
                    'color': '#C09853',
                    'background-color': '#FCF8E3',
                    'border-color': '#FBEED5'
                }
            }
        });
        $.notify.defaults($.extend({}, this.defaultOptions, this.options));
        this.eventsFx();
    }
    getEl () {
        return this.element;
    }

    private eventsFx () {
        this.getEl().on('notify', function (e, msg, type) {
            $.notify(msg, type);
        });
    }
}