(function (W) {
    'use strict';

    var utils = require('../util/utils');
    var PaymentServices = require('../util/paymentServices');

    var WorkspaceController = function (options) {
        this.template = require('raw!../../templates/workspace.html');
    };

    WorkspaceController.prototype.bind = function(){
        var El = $(this.el);
        var card = document.getElementsByClassName('cardImage')[0];

        El.on('click', '.sendMoney', function(){
            if (PlatformBridge) {
                // Toggle Back and Up Press 
                utils.toggleBackNavigation(true);
                // Start The Contact Chooser Screen
                PlatformBridge.startContactChooser();
            }
        });

        card.addEventListener('click', function(ev){
            ev.preventDefault();
            this.classList.toggle('flip');
        });
    };

    WorkspaceController.prototype.render = function(ctr) {

        var that = this;
        var paymentService = new PaymentServices();
        paymentService.fetchBalance(function(res){
            that.el = document.createElement('div');
            that.el.className = "walletContainer";
            that.el.innerHTML = Mustache.render(that.template, {
                cardbalance: res.payload.walletBalance,
                cardexpiry:'10/19'
            });
            
            ctr.appendChild(that.el);
            that.bind();
        }, this);

        var self = this;
        
        // Send Money Contact Chooser Trigger 
        

        return this;
    };

    module.exports = WorkspaceController;

})(window);