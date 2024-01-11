!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).SecureDfu=e()}}(function(){return function o(s,a,c){function u(t,e){if(!a[t]){if(!s[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(f)return f(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var i=a[t]={exports:{}};s[t][0].call(i.exports,function(e){return u(s[t][1][e]||e)},i,i.exports,o,s,a,c)}return a[t].exports}for(var f="function"==typeof require&&require,e=0;e<c.length;e++)u(c[e]);return u}({1:[function(e,t,n){"use strict";var r,i=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(n,"__esModule",{value:!0});var o,s=e("events"),a=(o=s.EventEmitter,i(c,o),c.prototype.addEventListener=function(e,t){return o.prototype.addListener.call(this,e,t)},c.prototype.removeEventListener=function(e,t){return o.prototype.removeListener.call(this,e,t)},c.prototype.dispatchEvent=function(e,t){return o.prototype.emit.call(this,e,t)},c);function c(){return null!==o&&o.apply(this,arguments)||this}n.EventDispatcher=a},{events:4}],2:[function(e,t,n){"use strict";var r,i=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),a=this&&this.__assign||function(){return(a=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var o,s=e("./dispatcher"),c="8ec90001-f315-4f60-9fb8-838830daea50",u="8ec90002-f315-4f60-9fb8-838830daea50",f=!0,h={BUTTON_COMMAND:[1],CREATE_COMMAND:[1,1],CREATE_DATA:[1,2],RECEIPT_NOTIFICATIONS:[2],CACULATE_CHECKSUM:[3],EXECUTE:[4],SELECT_COMMAND:[6,1],SELECT_DATA:[6,2],RESPONSE:[96,32]},l={0:"Invalid opcode",1:"Operation successful",2:"Opcode not supported",3:"Missing or invalid parameter value",4:"Not enough memory for the data object",5:"Data object does not match the firmware and hardware requirements, the signature is wrong, or parsing the command failed",7:"Not a valid object type for a Create request",8:"The state of the DFU process does not allow this operation",10:"Operation failed",11:"Extended error"},p={0:"No extended error code has been set. This error indicates an implementation problem",1:"Invalid error code. This error code should never be used outside of development",2:"The format of the command was incorrect",3:"The command was successfully parsed, but it is not supported or unknown",4:"The init command is invalid. The init packet either has an invalid update type or it is missing required fields for the update type",5:"The firmware version is too low. For an application, the version must be greater than the current application. For a bootloader, it must be greater than or equal to the current version",6:"The hardware version of the device does not match the required hardware version for the update",7:"The array of supported SoftDevices for the update does not contain the FWID of the current SoftDevice",8:"The init packet does not contain a signature",9:"The hash type that is specified by the init packet is not supported by the DFU bootloader",10:"The hash of the firmware image cannot be calculated",11:"The type of the signature is unknown or not supported by the DFU bootloader",12:"The hash of the received firmware image does not match the hash in the init packet",13:"The available space on the device is insufficient to hold the firmware"},d=(o=s.EventDispatcher,i(v,o),v.prototype.log=function(e){this.dispatchEvent(v.EVENT_LOG,{message:e})},v.prototype.progress=function(e){this.dispatchEvent(v.EVENT_PROGRESS,{object:"unknown",totalBytes:0,currentBytes:e})},v.prototype.connect=function(e){var t=this;return e.addEventListener("gattserverdisconnected",function(){t.notifyFns={},t.controlChar=null,t.packetChar=null}),this.gattConnect(e).then(function(e){if(t.log("found "+e.length+" characteristic(s)"),t.packetChar=e.find(function(e){return e.uuid===u}),!t.packetChar)throw new Error("Unable to find packet characteristic");if(t.log("found packet characteristic"),t.controlChar=e.find(function(e){return e.uuid===c}),!t.controlChar)throw new Error("Unable to find control characteristic");if(t.log("found control characteristic"),!t.controlChar.properties.notify&&!t.controlChar.properties.indicate)throw new Error("Control characteristic does not allow notifications");return t.controlChar.startNotifications()}).then(function(){return t.controlChar.addEventListener("characteristicvaluechanged",t.handleNotification.bind(t)),t.log("enabled control notifications"),e})},v.prototype.gattConnect=function(e,t){var n=this;return void 0===t&&(t=v.SERVICE_UUID),Promise.resolve().then(function(){return e.gatt.connected?e.gatt:e.gatt.connect()}).then(function(e){return n.log("connected to gatt server"),e.getPrimaryService(t).catch(function(){throw new Error("Unable to find DFU service")})}).then(function(e){return n.log("found DFU service"),e.getCharacteristics()})},v.prototype.handleNotification=function(e){var t=e.target.value;if(h.RESPONSE.indexOf(t.getUint8(0))<0)throw new Error("Unrecognised control characteristic response notification");var n=t.getUint8(1);if(this.notifyFns[n]){var r=t.getUint8(2),i=null;if(1===r){var o=new DataView(t.buffer,3);this.notifyFns[n].resolve(o)}else if(11===r){var s=t.getUint8(3);i="Error: "+p[s]}else i="Error: "+l[r];i&&(this.log("notify: "+i),this.notifyFns[n].reject(i)),delete this.notifyFns[n]}},v.prototype.sendOperation=function(o,s,a){var c=this;return new Promise(function(e,t){var n=s.length;a&&(n+=a.byteLength);var r=new Uint8Array(n);if(r.set(s),a){var i=new Uint8Array(a);r.set(i,s.length)}c.notifyFns[s[0]]={resolve:e,reject:t},o.writeValue(r).catch(function(e){return c.log(e),Promise.resolve().then(function(){return c.delayPromise(500)}).then(function(){return o.writeValue(r)})})})},v.prototype.sendControl=function(e,r){var i=this;return new Promise(function(t,n){i.sendOperation(i.controlChar,e,r).then(function(e){setTimeout(function(){return t(e)},i.delay)}).catch(function(e){n(e)})})},v.prototype.transferInit=function(e){return this.transfer(e,"init",h.SELECT_COMMAND,h.CREATE_COMMAND)},v.prototype.transferFirmware=function(e){return this.transfer(e,"firmware",h.SELECT_DATA,h.CREATE_DATA)},v.prototype.transfer=function(i,o,e,s){var a=this;return this.sendControl(e).then(function(e){var t=e.getUint32(0,f),n=e.getUint32(4,f),r=e.getInt32(8,f);if("init"!==o||n!==i.byteLength||!a.checkCrc(i,r))return a.progress=function(e){a.dispatchEvent(v.EVENT_PROGRESS,{object:o,totalBytes:i.byteLength,currentBytes:e})},a.progress(0),a.transferObject(i,s,t,n);a.log("init packet already available, skipping transfer")})},v.prototype.transferObject=function(i,e,t,o){var s=this,n=o-o%t,r=Math.min(n+t,i.byteLength),a=new DataView(new ArrayBuffer(4));return a.setUint32(0,r-n,f),this.sendControl(e,a.buffer).then(function(){var e=i.slice(n,r);return s.transferData(e,n)}).then(function(){return s.sendControl(h.CACULATE_CHECKSUM)}).then(function(e){var t=e.getInt32(4,f),n=e.getUint32(0,f),r=i.slice(0,n);if(s.checkCrc(r,t))return s.log("written "+n+" bytes"),o=n,s.sendControl(h.EXECUTE);s.log("object failed to validate")}).then(function(){if(r<i.byteLength)return s.transferObject(i,e,t,o);s.log("transfer complete")})},v.prototype.transferData=function(e,t,n){var r=this;n=n||0;var i=Math.min(n+20,e.byteLength),o=e.slice(n,i);return this.packetChar.writeValue(o).then(function(){return r.delayPromise(r.delay)}).then(function(){if(r.progress(t+i),i<e.byteLength)return r.transferData(e,t,i)})},v.prototype.checkCrc=function(e,t){return this.crc32?t===this.crc32(new Uint8Array(e)):(this.log("crc32 not found, skipping CRC check"),!0)},v.prototype.delayPromise=function(t){return new Promise(function(e){setTimeout(e,t)})},v.prototype.requestDevice=function(t,e,n){var r=this;void 0===n&&(n=this.DEFAULT_UUIDS),n=a(a({},this.DEFAULT_UUIDS),n),t||e||(e=[{services:[n.service]}]);var i={optionalServices:[n.service]};return e?i.filters=e:i.acceptAllDevices=!0,this.bluetooth.requestDevice(i).then(function(e){return t?r.setDfuMode(e,n):e})},v.prototype.setDfuMode=function(i,o){var s=this;return void 0===o&&(o=this.DEFAULT_UUIDS),o=a(a({},this.DEFAULT_UUIDS),o),this.gattConnect(i,o.service).then(function(e){s.log("found "+e.length+" characteristic(s)");var t=e.find(function(e){return e.uuid===o.control}),n=e.find(function(e){return e.uuid===o.packet});if(t&&n)return i;var r=e.find(function(e){return e.uuid===o.button});if(!r)throw new Error("Unsupported device");if(s.log("found buttonless characteristic"),!r.properties.notify&&!r.properties.indicate)throw new Error("Buttonless characteristic does not allow notifications");return new Promise(function(e,t){function n(){this.notifyFns={},e(null)}r.startNotifications().then(function(){return s.log("enabled buttonless notifications"),i.addEventListener("gattserverdisconnected",n.bind(s)),r.addEventListener("characteristicvaluechanged",s.handleNotification.bind(s)),s.sendOperation(r,h.BUTTON_COMMAND)}).then(function(){s.log("sent DFU mode"),n.call(s)})})})},v.prototype.update=function(n,r,i){var o=this;return new Promise(function(e,t){return n?r?i?void o.connect(n).then(function(){return o.log("transferring init"),o.transferInit(r)}).then(function(){return o.log("transferring firmware"),o.transferFirmware(i)}).then(function(){o.log("complete, disconnecting..."),n.addEventListener("gattserverdisconnected",function(){o.log("disconnected"),e(n)})}).catch(function(e){if(0===o.delay)return o.log("DFU update failed, but delay=0. Trying again with delay=10..."),o.delay=10,o.update(n,r,i);t(e)}):t("Firmware not specified"):t("Init not specified"):t("Device not specified")})},v.SERVICE_UUID=65113,v.EVENT_LOG="log",v.EVENT_PROGRESS="progress",v);function v(e,t,n){void 0===n&&(n=0);var r=o.call(this)||this;return r.crc32=e,r.bluetooth=t,r.delay=n,r.DEFAULT_UUIDS={service:v.SERVICE_UUID,button:"8ec90003-f315-4f60-9fb8-838830daea50",control:c,packet:u},r.notifyFns={},r.controlChar=null,r.packetChar=null,!r.bluetooth&&window&&window.navigator&&window.navigator.bluetooth&&(r.bluetooth=navigator.bluetooth),r}n.SecureDfu=d},{"./dispatcher":1}],3:[function(e,t,n){"use strict";var r=e("./secure-dfu");t.exports=r.SecureDfu},{"./secure-dfu":2}],4:[function(e,t,n){var c=Object.create||function(e){function t(){}return t.prototype=e,new t},s=Object.keys||function(e){var t=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.push(n);return n},o=Function.prototype.bind||function(e){var t=this;return function(){return t.apply(e,arguments)}};function r(){this._events&&Object.prototype.hasOwnProperty.call(this,"_events")||(this._events=c(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0}((t.exports=r).EventEmitter=r).prototype._events=void 0,r.prototype._maxListeners=void 0;var i,a=10;try{var u={};Object.defineProperty&&Object.defineProperty(u,"x",{value:0}),i=0===u.x}catch(e){i=!1}function f(e){return void 0===e._maxListeners?r.defaultMaxListeners:e._maxListeners}function h(e,t,n,r){var i,o,s;if("function"!=typeof n)throw new TypeError('"listener" argument must be a function');if((o=e._events)?(o.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),o=e._events),s=o[t]):(o=e._events=c(null),e._eventsCount=0),s){if("function"==typeof s?s=o[t]=r?[n,s]:[s,n]:r?s.unshift(n):s.push(n),!s.warned&&(i=f(e))&&0<i&&s.length>i){s.warned=!0;var a=new Error("Possible EventEmitter memory leak detected. "+s.length+' "'+String(t)+'" listeners added. Use emitter.setMaxListeners() to increase limit.');a.name="MaxListenersExceededWarning",a.emitter=e,a.type=t,a.count=s.length,"object"==typeof console&&console.warn&&console.warn("%s: %s",a.name,a.message)}}else s=o[t]=n,++e._eventsCount;return e}function l(){if(!this.fired)switch(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length){case 0:return this.listener.call(this.target);case 1:return this.listener.call(this.target,arguments[0]);case 2:return this.listener.call(this.target,arguments[0],arguments[1]);case 3:return this.listener.call(this.target,arguments[0],arguments[1],arguments[2]);default:for(var e=new Array(arguments.length),t=0;t<e.length;++t)e[t]=arguments[t];this.listener.apply(this.target,e)}}function p(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=o.call(l,r);return i.listener=n,r.wrapFn=i}function d(e,t,n){var r=e._events;if(!r)return[];var i=r[t];return i?"function"==typeof i?n?[i.listener||i]:[i]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(i):y(i,i.length):[]}function v(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function y(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}i?Object.defineProperty(r,"defaultMaxListeners",{enumerable:!0,get:function(){return a},set:function(e){if("number"!=typeof e||e<0||e!=e)throw new TypeError('"defaultMaxListeners" must be a positive number');a=e}}):r.defaultMaxListeners=a,r.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=e,this},r.prototype.getMaxListeners=function(){return f(this)},r.prototype.emit=function(e){var t,n,r,i,o,s,a="error"===e;if(s=this._events)a=a&&null==s.error;else if(!a)return!1;if(a){if(1<arguments.length&&(t=arguments[1]),t instanceof Error)throw t;var c=new Error('Unhandled "error" event. ('+t+")");throw c.context=t,c}if(!(n=s[e]))return!1;var u="function"==typeof n;switch(r=arguments.length){case 1:!function(e,t,n){if(t)e.call(n);else for(var r=e.length,i=y(e,r),o=0;o<r;++o)i[o].call(n)}(n,u,this);break;case 2:!function(e,t,n,r){if(t)e.call(n,r);else for(var i=e.length,o=y(e,i),s=0;s<i;++s)o[s].call(n,r)}(n,u,this,arguments[1]);break;case 3:!function(e,t,n,r,i){if(t)e.call(n,r,i);else for(var o=e.length,s=y(e,o),a=0;a<o;++a)s[a].call(n,r,i)}(n,u,this,arguments[1],arguments[2]);break;case 4:!function(e,t,n,r,i,o){if(t)e.call(n,r,i,o);else for(var s=e.length,a=y(e,s),c=0;c<s;++c)a[c].call(n,r,i,o)}(n,u,this,arguments[1],arguments[2],arguments[3]);break;default:for(i=new Array(r-1),o=1;o<r;o++)i[o-1]=arguments[o];!function(e,t,n,r){if(t)e.apply(n,r);else for(var i=e.length,o=y(e,i),s=0;s<i;++s)o[s].apply(n,r)}(n,u,this,i)}return!0},r.prototype.on=r.prototype.addListener=function(e,t){return h(this,e,t,!1)},r.prototype.prependListener=function(e,t){return h(this,e,t,!0)},r.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.on(e,p(this,e,t)),this},r.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.prependListener(e,p(this,e,t)),this},r.prototype.removeListener=function(e,t){var n,r,i,o,s;if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');if(!(r=this._events))return this;if(!(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=c(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,o=n.length-1;0<=o;o--)if(n[o]===t||n[o].listener===t){s=n[o].listener,i=o;break}if(i<0)return this;0===i?n.shift():function(e,t){for(var n=t,r=n+1,i=e.length;r<i;n+=1,r+=1)e[n]=e[r];e.pop()}(n,i),1===n.length&&(r[e]=n[0]),r.removeListener&&this.emit("removeListener",e,s||t)}return this},r.prototype.removeAllListeners=function(e){var t,n,r;if(!(n=this._events))return this;if(!n.removeListener)return 0===arguments.length?(this._events=c(null),this._eventsCount=0):n[e]&&(0==--this._eventsCount?this._events=c(null):delete n[e]),this;if(0===arguments.length){var i,o=s(n);for(r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=c(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(t)for(r=t.length-1;0<=r;r--)this.removeListener(e,t[r]);return this},r.prototype.listeners=function(e){return d(this,e,!0)},r.prototype.rawListeners=function(e){return d(this,e,!1)},r.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):v.call(e,t)},r.prototype.listenerCount=v,r.prototype.eventNames=function(){return 0<this._eventsCount?Reflect.ownKeys(this._events):[]}},{}]},{},[3])(3)});
//# sourceMappingURL=secure-dfu.js.map
