function HTMLImageElement() { }

function Image() {
    var self = this;

    this.native = navigator.holojs.nativeInterface.image.create();

    this.addEventListener = function (eventType, eventHandler) {
        navigator.holojs.nativeInterface.eventRegistration.addEventListener(this.native, eventType, eventHandler.bind(self));
    };

    this.removeEventListener = function (eventType, eventHandler) {
        navigator.holojs.nativeInterface.eventRegistration.removeEventListener(this.native, eventType, eventHandler.bind(self));
    };

    Object.defineProperty(this, 'src', {
        get: function() {
            return this.srcInternal;
        },
        set: function (value) {
            this.srcInternal = value;

            let isDataUrl = false;
            for (var index = 0; index < URL.objects.length; index++) {
                if (value === URL.objects[index].key) {
                    navigator.holojs.nativeInterface.image.setSourceFromDataUrl(this.native, this, window.URL.objects[index].data);
                    isDataUrl = true;
                    break;
                }
            }

            if (!isDataUrl) {
                navigator.holojs.nativeInterface.image.setSource(this.native, this, this.srcInternal);
            }
        }
    });

    Object.defineProperty(this, 'onload', {
        get: function () {
            return this.onloadEvent;
        },
        set: function (value) {
            if (this.onloadEvent) {
                this.removeEventListener('load', this.onloadEvent);
            }

            if (value) {
                this.addEventListener('load', value);
            }

            this.onloadEvent = value;
        }
    });

    Object.defineProperty(this, 'onerror', {
        get: function () {
            return this.onerrorEvent;
        },
        set: function (value) {
            if (this.onerrorEvent) {
                this.removeEventListener('error', this.onerrorEvent);
            }

            if (value) {
                this.addEventListener('error', value);
            }

            this.onerrorEvent = value;
        }
    });
}

Image.prototype = new HTMLImageElement();