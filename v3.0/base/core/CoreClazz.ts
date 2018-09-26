import {$, getConfig, isDefined, isEmpty, isFunction, toArray} from "./CoreFunction";

export interface Component {
    name: string;
    initial();
    on(e, fn);
    un(e);
}

export class BaseComponent implements Component {
    name: string;

    private events: object = {};

    constructor() {
        this.initial();
    }

    initial() {
        window[this.name] = this;
        this.initComponent();
    }

    /**
     * @abstract
     */
    initComponent(){}

    on(e, fn) {
        this.events = this.events || {};
        if (!isEmpty(e, null) && isFunction(fn)) {
            this.events[e] = (fn || function () {});
        }
        return true;
    }

    un(e) {
        this.events = this.events || {};
        if (!isEmpty(e, null)) {
            delete this.events[e];
        }
        return true;
    }

    /**
     * Checks to see if this object has any event name for a specified event
     * @param {String} eventName The name of the event to check for
     * @return {Boolean} True if the event is being listened for, else false
     */
    hasEvent(eventName) {
        return isFunction(this.events[eventName]);
    }
    /**
     *
     Fires the specified event with the passed parameters (minus the event name).
     */
    fireEvent() {
        let args = toArray(arguments);
        if (args.length < 1)
            return;

        let eventName = args[0].toLowerCase();
        let fn = this.events[eventName] || function () {};
        args.shift();
        fn.apply(this, args);
    }
}


export class BaseClazz {
    id: string = null;
    idKey: string = 'id';

    init() {
        if (!this.id) {
            throw new Error('Class id is missing!');
        }

    }

    getId() {
        return this.id;
    }

    getIdKey() {
        return this.idKey;
    }

    getEl() {
        return $('#' + this.getId());
    }
}

export class Requests {
    static getUrl(path, timeStamp) {
        if (getConfig('context') !== undefined) {
            let url = getConfig('context') + '/' + path;
            url += (!isEmpty(getConfig('ext'), false) && isDefined(getConfig('ext'))) ? getConfig('ext') : '';
            url += timeStamp ? '?_t=' + timeStamp : '';
            return url;
        }
        return path + (timeStamp ? '?_t=' + timeStamp : '');
    }

    static toFormData(data) {
        if (toString.apply(data) === '[object Object]') {
            let fd = new FormData();
            for (let key in data)
                if (data.hasOwnProperty(key))
                    fd.append(key, data[key]);

            // fd.append(ID_TK, ID_TK_VL);
            return fd;
        }
        if (toString.apply(data) === '[object FormData]') {
            // data.append(ID_TK, ID_TK_VL);
        }

        return data;
    }
}

export class Responses {
    static handler (response, callback) {
        if (response.success || response.id || response === true)
            callback && callback(response);
    }
}