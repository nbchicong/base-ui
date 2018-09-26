import {BaseComponent} from "../../core/CoreClazz";
import {$, isArray, generateId} from "../../core/CoreFunction";

export class Dialog extends BaseComponent {
    id: string = 'modal-dialog';
    name: string = 'dialog';
    dialogId: string = '#' + this.id;
    buttons = [];
    title: string;
    content: string;
    data: object = {};

    initComponent() {
        let __html = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
        __html += '<a class="close" data-dismiss="modal">&times;</a>';
        __html += '<h4>' + this.getTitle() + '</h4>';
        __html += '</div>';
        __html += '<div class="modal-body">' + this.getContent() + '</div>';
        __html += '<div class="modal-footer">';
        __html += this.generateButtons();
        __html += '</div></div></div>';
        this.getEl().html(__html);
    }

    getEl() {
        return $(this.dialogId);
    }

    getButtons() {
        return this.getEl().find('.modal-footer button');
    }


    show() {
        if (this.getEl().length < 1) {
            return;
        }
        this.getEl().modal('show');
        let __buttons = this.getButtons() || [];
        if (__buttons.length > 0) {
            $(__buttons[0]).focus();
        }
        return this;
    }

    hide() {
        this.getEl().modal('hide');
        return this;
    }

    setTitle(title: string) {
        this.title = title;
        this.getEl().find('.modal-header h4').html(this.title);
    }

    getTitle() {
        return this.title;
    }

    setContent(content: string) {
        this.content = content;
        this.getEl().find('.modal-body').html(this.content);
    }

    getContent() {
        return this.content;
    }

    generateButtons() {
        let __html = '';
        if (isArray(this.buttons)) {
            for (let i = 0; i < this.buttons.length ; i++) {
                let __button = this.buttons[i];
                __button.id = (__button.id) ? __button.id : 'btn-' + generateId();
                __html += '<button id="' + __button.id + '" class="btn btn-sm ' + (__button.cls || '') + '"><span class="' + __button.icon + '"></span> ' + __button.text + '</button>';
                this.getEl().off('click', '#' + __button.id).on('click', '#' + __button.id, __button.fn.createDelegate(this));
            }
        }
        return __html;
    }

    setData (data) {
        this.data = data;
    }

    getData () {
        return this.data;
    }
}