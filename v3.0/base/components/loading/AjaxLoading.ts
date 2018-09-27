import {BaseComponent} from "../../core/CoreClazz";
import {generateId} from "../../core/CoreFunction";

let GLOBAL_LOADING_ATTR = 'js-loading';

export class AjaxLoading extends BaseComponent {

    private docEl: JQuery<Document> = $(document);
    private bodyEl: JQuery<HTMLElement> = $('body');
    private element: JQuery<HTMLElement> = null;

    name = 'AjaxLoading';

    private id = null;
    private message = 'Đang tải dữ liệu ...';

    constructor() {
        super();
        this.docEl.ajaxStart(() => {
            if (!this.isExisted()) {
                this.initComponent();
            }
            this.show();
        });
        this.docEl.ajaxStop(() => {
            if (this.isExisted()) {
                this.hide();
            }
        });
    }

    initComponent () {
        this.id = generateId();
        var html = '<div id="' + this.id + '" style="display:none">' +
            '<div class="mask-loading"></div>' +
            '<div class="loading-container">' +
            '<div class="box box-solid box-loading">' +
            '<div class="box-body">' +
            '<div class="progress active">' +
            '<div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar">' +
            '<span class="text-loading"></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        this.element = $(html);
        this.bodyEl.attr(GLOBAL_LOADING_ATTR, this.id)
            .append(this.element);
    }

    getEl () {
        return this.element || null;
    }

    isExisted() {
        return this.bodyEl[0].hasAttribute(GLOBAL_LOADING_ATTR);
    }

    setText (message) {
        this.getEl().find('.text-loading').html(message || this.message);
    }

    destroy () {
        this.bodyEl.removeAttr(GLOBAL_LOADING_ATTR);
        if (this.getEl())
            this.getEl().remove();
    }

    show (message?: string) {
        if (this.getEl()) {
            this.setText(message);
            this.getEl().show();
            // @ts-ignore
            this.fireEvent('shown', this);
        }
    }

    hide () {
        if (this.getEl()) {
            this.getEl().hide();
            // @ts-ignore
            this.fireEvent('hidden', this);
        }
    }
}