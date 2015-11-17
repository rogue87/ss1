(function (W, events) {
    'use strict';
    
    var WorkspaceController  = require('./controllers/workspace'),
        TransIndexController = require('./controllers/transactions/index'),
        SendMoneyController  = require('./controllers/sendmoney/index'),
        Topup1Controller     = require('./controllers/topup/topup1/index'),
        Topup2Controller     = require('./controllers/topup/topup2/index'),
        Ftue1Controller      = require('./controllers/ftue/ftuestep1/index'),
        Ftue2Controller      = require('./controllers/ftue/ftuestep2/index'),
        Ftue3Controller      = require('./controllers/ftue/ftuestep3/index'),
        Ftue4Controller      = require('./controllers/ftue/ftuestep4/index'),
        FtueTourController   = require('./controllers/ftue/ftuetour/index'),
        Router               = require('./util/router'),
        utils                = require('./util/utils'),
        PaymentServices      = require('./util/paymentServices'),
        TopupServices        = require('./util/topupServices'),
        Keyboard             = require('./util/keyboard'),
        Store                = require('./util/store');

    var loader = document.getElementById('loader');
    var loadObject = events.subscribe('update.loader', function(params){
        loader.toggleClass('loading', params.show);
    });

    var Application = function (options) {
        this.container            = options.container;
        this.routeIntent          = options.route;
        this.store                = new Store();
        this.router               = new Router();
        this.workspaceController  = new WorkspaceController();
        this.transIndexController = new TransIndexController();
        this.topup1Controller     = new Topup1Controller();
        this.topup2Controller     = new Topup2Controller();
        this.sendMoneyController  = new SendMoneyController();
        this.ftuestep1Controller  = new Ftue1Controller();
        this.ftuestep2Controller  = new Ftue2Controller();
        this.ftuestep3Controller  = new Ftue3Controller();
        this.ftuestep4Controller  = new Ftue4Controller();
        this.ftuetourController   = new FtueTourController();
        this.PaymentService       = new PaymentServices();
        this.TopupService         = new TopupServices(); 
    };
    
    Application.prototype = {

        backPressTrigger: function() {
            this.router.back();            
        },

        getRoute: function(){
            var that = this;

            if (this.routeIntent !== undefined){
                
            } else {
                events.publish('app.store.get', {
                    key: '_routerCache',
                    ctx: this,
                    cb: function(r){
                        if (r.status === 1){
                            try {
                                that.router.navigateTo(r.results.route, r.results.data);
                            } catch(e){
                                that.router.navigateTo('/');    
                            }
                        } else {
                            that.router.navigateTo('/');
                        }
                    }
                });    
            }
        },

        start: function () {

            var self = this;
            self.$el = $(this.container);
        
            utils.toggleBackNavigation(false);
            platformSdk.events.subscribe('onBackPressed', self.backPressTrigger.bind(self));
            platformSdk.events.subscribe('onUpPressed', self.backPressTrigger.bind(self));

            $('body').on('click', 'a[data-path]', function (e) {
                var path = $(e.currentTarget).attr('data-path');
                if (path === '<<'){
                    self.router.back();
                } else {
                    utils.toggleBackNavigation(true);
                    self.router.navigateTo(path);
                }
            });

            this.router.route('/', function(data){
                self.container.innerHTML = "";
                self.workspaceController.render(self.container, self, data);
            });

            this.router.route('/transactions', function(data){
                self.container.innerHTML = "";
                self.transIndexController.render(self.container, data);
                //self.$el.html(self.transIndexController.render(self.container).el);
            });

            this.router.route('/topup1', function(){
                self.container.innerHTML = "";
                self.topup1Controller.render(self);
                // self.$el.html(self.topup1Controller.render().el);
            });

            this.router.route('/topup2', function(data){
                self.container.innerHTML = "";
                self.topup2Controller.render(self, data);
                // self.$el.html(self.topup2Controller.render().el);
            });

            this.router.route('/sendmoney', function(){
                self.container.innerHTML = "";
                self.sendMoneyController.render(self.container, self);
                // self.$el.html(self.sendMoneyController.render().el);
            });

            this.router.route('/ftue_step_1', function(){
                self.$el.html(self.ftuestep1Controller.render().el);
            });

            this.router.route('/ftue_step_2', function(){
                self.$el.html(self.ftuestep2Controller.render().el);
            });

            this.router.route('/ftue_step_3', function(){
                self.$el.html(self.ftuestep3Controller.render().el);
            });

            this.router.route('/ftue_step_4', function(){
                self.$el.html(self.ftuestep4Controller.render().el);
            });

            this.router.route('/ftue_tour', function(){
                self.$el.html(self.ftuetourController.render().el);
            });

            this.getRoute();

            // To Navigate TO FTUE DEPENDING ON HELPER DATA :: HELPER DATA NOT AVAILABLE AT DEV

            // Here The Activate Wallet Needs To Be Run As Well

            if(platformSdk && platformSdk.isDevice){
                setTimeout(function(){
                    // Existing User
                    // if(platformSdk.helperData.ftueDone && platformSdk.helperData.ftueDone == 1){
                    //     utils.toggleBackNavigation(true);
                    //     self.router.navigateTo('/');
                    // }
                    // New User :: Activate Wallet For The New User
                    // else{
                    //     this.PaymentService.activateWallet(function(res){
                    //         utils.toggleBackNavigation(true);           // Set To False :: Later
                    //         self.router.navigateTo('/ftue_step_1');     // FTUE STEP
                    //     }, this);
                    //     // Updates The Helper Data
                    //     platformSdk.helperData = {'ftueDone': 1};
                    //     platformSdk.updateHelperData(platformSdk.helperData);
                    // }
                }, 0);
            }
        }
    };

    // Global Function Wirtten To Handle The Return From The Contact Chooser 
    // TODO. Remove this and use platformSdk.nativeReq fn.
    
    window.onContactChooserResult = function(resultCode,contacts) {
    
        console.log("Repsonse Received From Contacts Chooser");
        if(resultCode === 0){
            console.log("Failed::Add Exception");
        } else {
            console.log("Success Response:: Routing To p2p ,Transfer");
            console.log(contacts);
        }
            // Data In Response
            //[{"platformUid":"VgOlRuSwFYYsYe9i","thumbnail":"file:////data/data/com.bsb.hike/cache/+919643474249.jpg","name":"+919643474249"}]
    };

    module.exports = Application;

})(window, platformSdk.events);