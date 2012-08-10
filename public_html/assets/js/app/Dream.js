
// Specify which framework you'd like to use,
// typically jQuery, but could also use Zepto.

var Framework = Zepto;

(function($) {
    
    //--------------------------------------------------------------------------
    //
    // Dream Class
    //
    // Date:    11/06/2011
    // Author:  Chris Mason 
    // Email:   chris.mason@nerdery.com
    // Profile: http://www.nerdery.com/Ch
    //  
    // *** Need some high level description of this file ***
    //
    // When initializing, an object of configuration settings can be passed into
    // the constructor.  This allows for changing configuration, or hooking into
    // callbacks without modifying any source code.  See the defaults object 
    // definition for a list of all of the configuration settings and callbacks.
    //
    // Initialize:
    // var Life = Dream.init({debug: true});
    //
    // Dependencies: 
    // - jQuery 1.6x (http://jquery.com/)
    //--------------------------------------------------------------------------
    
    var Class_Dream = function() {
             
        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        
        var i          = 0,
            self       = this,
            util       = {},
            event      = {},
            _elements  = {},
            _settings  = {},
            _defaults  = {
                debug:      false,
                isMobile:   Modernizr.touch,
                baseUrl:    "",
                panels:     {}      // the initial set of panels
            };
        
        //----------------------------------------------------------------------
        // Initialization
        //----------------------------------------------------------------------
        
        this.init = function(config) {
            
            util  = self.Util;
            event = self.Event;
            
            _settings = util.extend(_defaults, config);
                        
            util.log("Dream init settings: ", _settings);
            
            _initChildren();
            _bindControls();
            _kickOff();

            return this;
            
        }
        
        function _initChildren() {
            
            self.Panel.init({
                isMobile:       _settings.isMobile,
                initialPanels:  _settings.panels
            });
            
            self.Keyboard.init({
                bind: [
                    'upArrow',
                    'downArrow',
                    'leftArrow',
                    'rightArrow'                    
                ]
            });
            
            self.Mobile.init({
                bind: [
                    'touchstart',
                    'touchmove',
                    'touchend'
                ]
            });
                                               
        }
                
        function _bindControls() {
                                        
            event.bind("keyPressLeftArrow", self.Panel.slideRight);
            event.bind("keyPressRightArrow", self.Panel.slideLeft);
            
            event.bind("flickLeft", self.Panel.slideLeft);
            event.bind("flickRight", self.Panel.slideRight);
            
            event.bind("mobileTouchstart", self.Panel.touchStart);
            event.bind("mobileTouchmove", self.Panel.touchMove);
            event.bind("mobileTouchend", self.Panel.touchEnd);
            
            $(document).bind("mousedown", self.Panel.mouseStart);
            $(document).bind("mousemove", self.Panel.mouseMove);
            $(document).bind("mouseup", self.Panel.mouseEnd);
                        
        }
        
        //----------------------------------------------------------------------
        // Public Getters
        //----------------------------------------------------------------------
        
        this.getSetting = function(key) {
            
            return (util.defined(_settings[key]));
            
        }
        
        //----------------------------------------------------------------------
        // Private Methods
        //----------------------------------------------------------------------
        
        function _kickOff() {

            self.Panel.slideOnStage();                
            
        }
        
                
    }
    
    //----------------------------------------------------------------------
    // Insert the Dream class instance into the global scope
    //----------------------------------------------------------------------
    
    window.Dream = new Class_Dream();
        
}(Framework));