(function($){
    
    //----------------------------------------------------------------------
    //
    // Mobile Class
    // 
    // Mobile key binding, trigger global events
    //
    //----------------------------------------------------------------------
    
    function Class_Mobile() {
                      
        //----------------------------------------------------------------------
        // Constants
        //----------------------------------------------------------------------
        
        var EVENT_PREFIX = "mobile";
               
        var MOBILE_EVENTS = [
                "tap",
                "doubleTap",
                "swipe",
                "swipeLeft",
                "swipeRight",
                "swipeUp",
                "swipeDown",
                "pinchIn",
                "pinchOut",
                "touchstart",
                "touchmove",
                "touchend"
        ];
        
        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        
        var self    = this,
            parent  = window[ourNamespace],
            util    = parent.Util,
            event   = parent.Event,

            _settings = {},
            _defaults = {
                bind:  [],
                scope: document,
                disableScrolling: false
            };
        
        //----------------------------------------------------------------------
        // Public Constructor
        //----------------------------------------------------------------------
                        
        this.init = function(config) { 
            
            _settings = util.extend(_defaults, config);
            util.log("Mobile settings: ", _settings);
            self.bind(_settings.bind);
            
            window.scrollTo(0, 1);

            if (_settings.disableScrolling) {
                $(_settings.scope).bind("touchstart", function(e){
                    e.preventDefault();
                });
            }

        }
        
        this.bind = function(events, scope) {
            
            scope = util.defined(scope, _settings.scope);
            events = (util.isarray(events)) ? events : [];
            
            $.each(events, function(i, mobileEvent){
                if (util.inarray(mobileEvent, MOBILE_EVENTS)) {
                    $(scope).bind(mobileEvent, function(e){
                        event.trigger(EVENT_PREFIX + util.ucfirst(mobileEvent), arguments);
                    });
                }
            });
            
        }
    
    }
    
    //----------------------------------------------------------------------
    // Insert the class into the global window application scope
    //----------------------------------------------------------------------
    
    window[ourNamespace]["Mobile"] = new Class_Mobile();

}(ourFramework));