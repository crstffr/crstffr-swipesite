(function($){
    
    //----------------------------------------------------------------------
    //
    // Keyboard Class
    // 
    // Keyboard key binding, trigger global events
    //
    //----------------------------------------------------------------------
    
    function Class_Keyboard(parent) {
                      
        //----------------------------------------------------------------------
        // Constants
        //----------------------------------------------------------------------
        
        var EVENT_PREFIX = "keyPress",
            BIND_TRIGGER = "keydown";
               
        var CODE_DEFINITIONS = {
            
            enter:      13,
            spaceBar:   32,
            leftArrow:  37,
            upArrow:    38,
            rightArrow: 39,
            downArrow:  40
            
        }
        
        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        
        var self = this,
            util = parent.Util,
            event = parent.Event,
            _current  = {
                keys:  [],
                codes: []
            },
            _settings = {},
            _defaults = {
                bind:  [],
                scope: document
            };
        
        //----------------------------------------------------------------------
        // Public Constructor
        //----------------------------------------------------------------------
                        
        this.init = function(config) { 
            
            _settings = util.extend(_defaults, config);
            util.log("Dream.Keyboard settings: ", _settings);
            
            self.bind(_settings.bind);
            
            return self;
            
        }
        
        this.bind = function(keys, scope) {

            var key  = "",
                code = 0;
            
            keys  = (util.isarray(keys)) ? keys : [];
            scope = util.defined(scope, _settings.scope);
            
            $.each(keys, function(i, key){
                code = self.getCode(key);
                _current.codes[key] = code;
                _current.keys[code] = key;
            });
                                    
            $(scope).bind(BIND_TRIGGER, function(e){
                
                code = e.charCode || e.keyCode;                                
                
                if (util.inarray(code, _current.codes)) {
                    key = _current.keys[code];
                    event.trigger(EVENT_PREFIX + util.ucfirst(key));                    
                }
                
            });
            
        }
        
        
        
        this.getCode = function(key) {
            
            return util.defined(CODE_DEFINITIONS[key]);
            
        }
                
    
    }
    
    //----------------------------------------------------------------------
    // Insert the class into the global window application scope
    //----------------------------------------------------------------------
    
    window.Dream.Keyboard = new Class_Keyboard(window.Dream);

}(Framework));