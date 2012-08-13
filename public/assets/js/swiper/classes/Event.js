(function($){
    
    //----------------------------------------------------------------------
    //
    // Event Class
    // 
    // Event binding, triggering, publish/subscribe.
    //
    //----------------------------------------------------------------------
    
    function Class_Event() {
                      
        //----------------------------------------------------------------------
        // Constants
        //----------------------------------------------------------------------
               
        var EVENT_PREFIX = "";
        
        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        
        var self    = this,
            parent  = window[ourNamespace],
            util    = parent.Util,
            
            _events   = {},
            _current  = {
                events:     [],     // bound events ready to be triggered
                queue:      []      // unbound events, ready to be bound
            },
            _settings = {},
            _defaults = {
                eventPrefix:    "",
                useQueue:       false
            };
        
        //----------------------------------------------------------------------
        // Constructor
        //----------------------------------------------------------------------
        
        function _init(config) {
            
            _settings = util.extend(_defaults, config);
                                    
        }
        
        //----------------------------------------------------------------------
        // Public Methods
        //----------------------------------------------------------------------       
        
        // this isn't fully functional yet.
        
        this.queue = function(eventName, method_or_object) {
            
            _settings.useQueue = true;
            self.appendToQueue(eventName, method_or_object);
          
        }
        
        this.getQueue = function() {
            
            return _getQueue();
        
        }
        
        //----------------------------------------------------------------------
        // Add a callback to the stack of other callbacks.
        //----------------------------------------------------------------------
        
        this.appendToQueue = function(eventName, method_or_object) {
                        
            _setupCurrentEvent(eventName);
            _current.queue[eventName].push({event: eventName, arguments: arguments});
            
        }
        
        
        //----------------------------------------------------------------------
        // Add a callback to the beginning of the stack of callbacks.
        //----------------------------------------------------------------------
        this.prependToQueue = function(eventName, method_or_object) {
            
            _setupCurrentEvent(eventName);
            // add the event object to the beginning of the array
            // _current.queue[eventName].??????????({event: eventName, arguments: arguments});
           
        }
        
        
        
                        
        this.bind = function(eventName, method_or_object) {
            
            if (util.isobject(method_or_object)) {
                
                self.bindGroup(eventName, method_or_object);
                
            } else if (util.isfunc(method_or_object)) {
            
                eventName = EVENT_PREFIX + eventName;
                //$(document).bind(eventName, method_or_object);
                radio(eventName).subscribe(method_or_object);                
                util.log("Binding event: " + eventName);
                
            }
            
        }
        
        this.bindGroup = function(eventName, eventMap) {
            
            var key, str;
            for(key in eventMap) {
                if (eventMap.hasOwnProperty(key)) {
                    str = key.charAt(0).toUpperCase() + key.substr(1);
                    self.bind(eventName + str, eventMap[key]);
                }
            }
            
        }
        
        this.bindDefaults = function(eventName, eventMap) {
            
            util.log("bindDefaults, eventMap: ", eventMap);
            
        }
                
        this.trigger = function(eventName, paramsObj) {
            
            var returnEvent;
            eventName = EVENT_PREFIX + eventName;
            paramsObj = util.defined(paramsObj, {});
            
            if (_settings.useQueue === true) {
                
                util.log("triggering event via queue - not fully functional");
                self.triggerEventQueue(eventName, paramsObj);
                
            } else {
                
                self.triggerSingleEvent(eventName, paramsObj);
                
            }
            
            return returnEvent;
            
        }
        
        
        this.triggerSingleEvent = function(eventName, paramsObj) {
            
            /*
            if (!util.defined(_events[eventName])) {
                returnEvent = jQuery.Event(eventName);
                _events[eventName] = eventName;
            } else {
                returnEvent = _events[eventName];                
            }
            */
                           
            util.log("Triggered: " + eventName);
            // $(document).trigger(returnEvent, paramsObj);
            radio(eventName).broadcast(paramsObj);
            
        }
        
        this.triggerEventQueue = function(eventName, paramsObj) {
            
            var eventName = "";
            
            for(eventName in _current.queue) {
                
                
                
            }
            
            
        }
        
        function _setupCurrentEvent(eventName) {
            // set the array for this eventName if it's not set already
            if (!util.isarray(_current.queue[eventName])) {
                _current.queue[eventName] = [];
            }
        }
        
        function _getQueue() {
            
            return _current.events;
            
        }
        
        
        
        
        //----------------------------------------------------------------------
        // Initialization
        //----------------------------------------------------------------------
        
        _init();
    
    }
    
    //----------------------------------------------------------------------
    // Insert the class into the global window application scope
    //----------------------------------------------------------------------
    
    window[ourNamespace]["Event"] = new Class_Event();

}(ourFramework));