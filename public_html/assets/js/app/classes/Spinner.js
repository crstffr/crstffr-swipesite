(function($){
    
    //----------------------------------------------------------------------
    //
    // Spinner Class
    // 
    // Spinner is the spinner animation used when making an Ajax call.
    //
    // Requires:
    // spin.js (http://fgnass.github.com/spin.js/)
    //
    //----------------------------------------------------------------------
    
    function Class_Spinner(parent) {
                      
        //----------------------------------------------------------------------
        // Constants
        //----------------------------------------------------------------------
        
        var SPINNER_TEXT = "patience";
        
        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        
        var self = this,
            util = parent.Util,
            event = parent.Event,

            _current  = {
                spinner: false
            },
            _settings = {},
            _defaults = {
                lines:  5,     // The number of lines to draw
                length: 0,     // The length of each line
                width:  60,     // The line thickness
                radius: 40,     // The radius of the inner circle
                color:  '#A3BCCC', // #rgb or #rrggbb
                speed:  .75,    // Rounds per second
                trail:  50,     // Afterglow percentage
                shadow: false,  // Whether to render a shadow
                
                target:  "",    // Selector where to insert spinner  
                wrapper: ""     // Selector for entire spinner wrapper
                
            };
        
        //----------------------------------------------------------------------
        // Public Constructor
        //----------------------------------------------------------------------
                        
        this.init = function(config) { 
            
            _settings = $.extend(true, {}, _defaults, config);
            util.log("Dream.Spinner settings: ", _settings);

            _current.spinner = new Spinner(_settings);
                        
            return self;
                        
        }
        
        this.show = function() {
            
            _current.spinner.spin();
            $(_settings.target).append(_current.spinner.el);
            $(_settings.wrapper).show();
            
        }
        
        this.fadeOut = function(callback) {
            
            $(_settings.wrapper).fadeOut(function(){
                _current.spinner.stop();
                util.call(callback);
            });
            
        }
        
        this.hide = function() {
            
            $(_settings.wrapper).hide();
            _current.spinner.stop();
            
        }
        
        this.get = function() {
            
            return _current.spinner;
            
        }
    
    }
    
    //----------------------------------------------------------------------
    // Insert the class into the global window application scope
    //----------------------------------------------------------------------
    
    window.Dream.Spinner = new Class_Spinner(window.Dream);

}(jQuery));