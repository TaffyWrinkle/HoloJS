function CustomEvent(type, dictionary) {
    this.type = type;
    this.dictionary = dictionary;
    this.detail = dictionary.detail;
}

function EventTarget() {
    this.addEventListener = function (eventType, eventHandler) {
        navigator.holojs.nativeInterface.eventRegistration.addEventListener(this.native, eventType, eventHandler.bind(this));
    };

    this.removeEventListener = function (eventType, eventHandler) {
        navigator.holojs.nativeInterface.eventRegistration.removeEventListener(this.native, eventType, eventHandler.bind(this));
    };

    this.dispatchEvent = function (event) {
        navigator.holojs.nativeInterface.eventRegistration.dispatchEvent(this.native, event.type, event);
    };
}

function Window() {
    EventTarget.call(this);

    // The actual width and height properties are managed by the native code
    Object.defineProperty(this, 'innerWidth', {
        get: function () {
            return navigator.holojs.nativeInterface.window.width;
        }
    });

    Object.defineProperty(this, 'innerHeight', {
        get: function () {
            return navigator.holojs.nativeInterface.window.height;
        }
    });

    // The actual width and height properties are managed by the native code
    Object.defineProperty(this, 'clientWidth', {
        get: function () {
            return navigator.holojs.nativeInterface.window.width;
        }
    });

    Object.defineProperty(this, 'clientHeight', {
        get: function () {
            return navigator.holojs.nativeInterface.window.height;
        }
    });

    this.animationFrameRequests = [];

    this.vSyncCallback = function () {
        // Capture and clear the callbacks, then call them in sequence
        let capturedRequests = this.animationFrameRequests.slice();
        this.animationFrameRequests.length = 0;
        for (let i = 0; i < capturedRequests.length; i++) {
            capturedRequests[i]();
        }
    };

    this.focus = function () { };

    // Grab a reference to the native window object
    this.native = navigator.holojs.nativeInterface.window.native;

    //Register for vsync, size changes, etc.
    navigator.holojs.nativeInterface.window.register(this, this.vSyncCallback);

    this.requestAnimationFrame = function (callback) {
        return this.animationFrameRequests.push(callback);
    };

    this.cancelAnimationFrame = function (handle) {
        this.animationFrameRequests.splice(handle, 1);
    };

    this.btoa = navigator.holojs.nativeInterface.window.btoa;
    this.atob = navigator.holojs.nativeInterface.window.atob;

    this.getVRDisplays = function () {
        if (navigator.holojs.nativeInterface.headsetPresent === true) {
            let promise = new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve([new VRDisplay()]);
                }, 250);
            });
            return promise;
        } else {
            return Promise.resolve([]);
        }
    };

    Object.defineProperty(this, 'ongamepadconnected', {
        get: function () {
            return this.ongamepadconnectedEvent;
        },
        set: function (value) {
            if (this.ongamepadconnectedEvent) {
                this.removeEventListener('gamepadconnected', this.ongamepadconnectedEvent);
            }

            if (value) {
                this.addEventListener('gamepadconnected', value);
            }

            this.ongamepadconnectedEvent = value;
        }
    });

    Object.defineProperty(this, 'ongamepaddisconnected', {
        get: function () {
            return this.ongamepaddisconnectedEvent;
        },
        set: function (value) {
            if (this.ongamepadconnectedEvent) {
                this.removeEventListener('gamepaddisconnected', this.ongamepaddisconnectedEvent);
            }

            if (value) {
                this.addEventListener('gamepaddisconnected', value);
            }

            this.ongamepaddisconnectedEvent = value;
        }
    });

    Object.defineProperty(this, 'onvrdisplayconnect', {
        get: function () {
            return this.onvrdisplayconnectEvent;
        },
        set: function (value) {
            if (this.onvrdisplayconnectEvent) {
                this.removeEventListener('vrdisplayconnect', this.onvrdisplayconnectEvent);
            }

            if (value) {
                this.addEventListener('vrdisplayconnect', value);
            }

            this.onvrdisplayconnectEvent = value;
        }
    });

    Object.defineProperty(this, 'onvrdisplaydisconnect', {
        get: function () {
            return this.onvrdisplaydisconnectEvent;
        },
        set: function (value) {
            if (this.onvrdisplaydisconnectEvent) {
                this.removeEventListener('vrdisplaydisconnect', this.onvrdisplaydisconnectEvent);
            }

            if (value) {
                this.addEventListener('vrdisplaydisconnect', value);
            }

            this.onvrdisplaydisconnectEvent = value;
        }
    });

    this.devicePixelRatio = 1; 

    this.releasePointerCapture = function () { };
    this.setPointerCapture = function () { };
}

function makePerformance() {
    var start = Date.now();
    this.now = function () {
        return Date.now() - start;
    };
}

var performance = new makePerformance();
var window = new Window();
window.navigator = navigator;
navigator.getVRDisplays = window.getVRDisplays;
var requestAnimationFrame = window.requestAnimationFrame.bind(window);

window.setTimeout = navigator.holojs.nativeInterface.timers.setTimeout;
window.clearTimeout = navigator.holojs.nativeInterface.timers.clearTimer;
window.setInterval = navigator.holojs.nativeInterface.timers.setInterval;
window.clearInterval = navigator.holojs.nativeInterface.timers.clearTimer;