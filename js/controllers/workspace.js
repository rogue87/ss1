(function (W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils');

    // var _hikeBalance = null; 
    // var _store = {};

    var WorkspaceController = function (options) {
        this.template = require('raw!../../templates/workspace.html');
    };

    WorkspaceController.prototype.bind = function (App) {
        var $el = $(this.el);
        var btn_santaIn = this.el.getElementsByClassName('santaSubscribe')[0];
        var termsAndConditions = this.el.getElementsByClassName('termsAndConditions')[0];

        btn_santaIn.addEventListener('click', function (ev) {
            events.publish('update.loader', {show: true});

            if (platformSdk.bridgeEnabled) {
                App.SantaService.subscribeToSecretSanta(function (res) {
                    if (res.stat == "success") {
                        platformSdk.appData.helperData.SecretSantaActive = true;
                        platformSdk.updateHelperData(platformSdk.appData.helperData);
                        App.router.navigateTo('/faq', res);
                    }
                    else if(res.stat == "fail"){
                        events.publish('update.loader', {show: false});
                        platformSdk.ui.showToast("Something Went Wrong. Please try after some time");
                    }
                    else {
                        events.publish('update.loader', {show: false});
                        platformSdk.ui.showToast("Something Went Wrong. Please try after some time");
                    }
                });
            }
            else {
                App.router.navigateTo('/', {santa: true, santi: false});
            }
        });

        termsAndConditions.addEventListener('click', function(ev){
            var url = 'https://hike.in/secretsanta/terms/';
            if(platformSdk.bridgeEnabled){
                platformSdk.bridge.openFullPage('Terms and Conditions', url);
            }else{
                console.log(url);
            }
        });

    };

    WorkspaceController.prototype.render = function (ctr, App, data) {

        var that = this;

        that.el = document.createElement('div');
        that.el.className = "christmasContainer animation_fadein noselect";

        that.el.innerHTML = Mustache.render(that.template, {});
        ctr.appendChild(that.el);
        events.publish('update.loader', {show: false});
        that.bind(App);
    };

    WorkspaceController.prototype.destroy = function () {

    };

    module.exports = WorkspaceController;

})(window, platformSdk, platformSdk.events);