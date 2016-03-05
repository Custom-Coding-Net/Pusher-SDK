var Api = require('./api');
var SignalR = require('./signalR');

/**
 * Initialize the Pusher SDK with the given keys.
 * @param {string} receiveKey
 * @param {string} [sendKey]
 */
exports.init = function (receiveKey, sendKey) {
    this.sendKey = sendKey;
    this.receiveKey = receiveKey;
};

/**
 * Get the send key of the current application.
 * @returns {string} 
 */
exports.getSendKey = function () {
    return this.sendKey;
};

/**
 * Get the receive key of the current application.
 * @returns {string} 
 */
exports.getReceiveKey = function () {
    return this.receiveKey;
};

exports.SignalR = SignalR;