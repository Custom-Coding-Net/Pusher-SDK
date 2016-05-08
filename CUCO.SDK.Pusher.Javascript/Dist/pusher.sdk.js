(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Pusher = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const PUSHER_API_URL = 'https://pusher.custom-coding.net/Realtime';

/**
 * Get the url of the pusher api.
 * @returns {string} 
 */
exports.getApiUrl = function () {
    return PUSHER_API_URL;
};
},{}],2:[function(require,module,exports){
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
},{"./api":1,"./signalR":3}],3:[function(require,module,exports){
exports.Receiver = require('./signalR/receiver');
exports.Sender = require('./signalR/sender');
},{"./signalR/receiver":5,"./signalR/sender":6}],4:[function(require,module,exports){
const DEFAULT_CONNECTION_SETTINGS = { transport: ["webSockets", "longPolling"] };

var Api = require('../api');

/**
 * Connection for sending or receiving messages.
 */
function Connection() {
    this.connection = null;
    this.hubs = {
        MessageHub: null
    };
};

/**
 * Connect to the Pusher server with the given query string.
 * @param {object} [queryString]
 */
Connection.prototype.connect = function (queryString) {
    this.connection = $.hubConnection(Api.getApiUrl(), { useDefaultPath: false });
    this.connection.qs = queryString;

    this.hubs.MessageHub = this.connection.createHubProxy("MessageHub");
    this.hubs.MessageHub.on('Receive', function () {}); // this is a fake subscription for correct connecting. 
    
    return this.connection.start(DEFAULT_CONNECTION_SETTINGS);
};

/**
 * Disconnect the current connection.
 */
Connection.prototype.disconnect = function () {
    this.connection.stop();
};

/**
 * Set callback for receiving the incomming messages. 
 * @param {type} callback
 */
Connection.prototype.on = function (callback) {
    if (this.hubs.MessageHub == null) {
        return;
    }

    this.hubs.MessageHub.on('Receive', callback);
}

/**
 * Send a message to the clients with the given informations.
 * @param {string} sendkey
 * @param {string} title
 * @param {object} content
 * @param {string} [group]
 */
Connection.prototype.send = function (sendkey, title, content, group) {
    if (group == undefined) {
        this.hubs.MessageHub.invoke('Send', sendkey, title, content);
    } else {
        console.log("Group", group);
        this.hubs.MessageHub.invoke('GroupSend', sendkey, group, title, content);
    }
};

module.exports = Connection;
},{"../api":1}],5:[function(require,module,exports){
var Connection = require('./connection');

/**
 * Connection for receiving messages.
 * @param {string} group
 */
function Receiver(group) {
    this.group = group;
    this.con = new Connection();
};

/**
 * Connect to the Pusher server for receiving messages.
 */
Receiver.prototype.connect = function () {
    this.con.connect({
        Key: Pusher.getReceiveKey(),
        Group: this.group
    });
};

/**
 * Disconnect the current connection.
 */
Receiver.prototype.disconnect = function () {
    return this.con.disconnect();
};

/**
 * Set callback for receiving the incomming messages. 
 * @param {function} callback
 */
Receiver.prototype.on = function (callback) {
    this.con.on(callback);
};

module.exports = Receiver;
},{"./connection":4}],6:[function(require,module,exports){
var Connection = require('./connection');

/**
 * Connection for sending messages to clients.
 */
function Sender() {
    this.con = new Connection();
};

/**
 * Connect to the Pusher server.
 */
Sender.prototype.connect = function () {
    return this.con.connect();
}

/**
 * Disconnect the current connection.
 */
Sender.prototype.disconnect = function () {
    this.con.disconnect();
};

/**
 * Send a message to the clients with the given informations.
 * @param {string} title
 * @param {object} content
 * @params {string} [group]
 */
Sender.prototype.send = function (title, content, group) {
    this.con.send(Pusher.getSendKey(), title, content, group);
};

module.exports = Sender;
},{"./connection":4}]},{},[2])(2)
});