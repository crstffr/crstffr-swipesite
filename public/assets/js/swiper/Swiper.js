
// Specify which framework you'd like to use,
// typically jQuery, but could also use Zepto.

// Few global variables for defining the
// framework and namespace of our class

var ourFramework = jQuery;
var ourNamespace = "Swiper";

(function($) {

    //--------------------------------------------------------------------------
    //
    // Swiper Class
    //
    // Date:    8/12/2012
    // Author:  Chris Mason
    // Email:   crstffr@gmail.com
    // Profile: http://www.crstffr.com
    //
    // *** Need some high level description of this file ***
    //
    // When initializing, an object of configuration settings can be passed into
    // the constructor.  This allows for changing configuration, or hooking into
    // callbacks without modifying any source code.  See the defaults object
    // definition for a list of all of the configuration settings and callbacks.
    //
    // Initialize:
    // var mySwipe = Swiper.init({debug: true});
    //
    // Dependencies:
    // - jQuery 1.6x (http://jquery.com/)
    //--------------------------------------------------------------------------

    var Class_Swiper = function() {

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
                panels:     {},      // the initial set of panels
                elements: {
                    carousel: ""
                }
            };

        //----------------------------------------------------------------------
        // Initialization
        //----------------------------------------------------------------------

        this.init = function(config) {

            util  = self.Util;
            event = self.Event;

            _settings = util.extend(_defaults, config);
            _elements = util.select(_settings.elements);

            if (_settings.isMobile) {
                _settings.debug = false;
            }

            util.log("Swiper init settings: ", _settings);

            _initChildren();
            _bindControls();

            return this;

        }

        function _initChildren() {

            self.Keyboard.init({
                bind: [
                    //'upArrow',
                    //'downArrow',
                    'leftArrow',
                    'rightArrow'
                ]
            });

            self.Carousel.init();

        }

        function _bindControls() {

            event.bind("keyPressRightArrow", self.Carousel.nextPanel);
            event.bind("keyPressLeftArrow", self.Carousel.prevPanel);

        }

        //----------------------------------------------------------------------
        // Public Getters
        //----------------------------------------------------------------------

        this.getSetting = function(key) {

            return (util.defined(_settings[key]));

        }

        this.getElement = function(key) {

            return $(_settings.elements[key]);

        }

        //----------------------------------------------------------------------
        // Private Methods
        //----------------------------------------------------------------------


    }

    //----------------------------------------------------------------------
    // Insert the main class instance into the global scope
    //----------------------------------------------------------------------

    window[ourNamespace] = new Class_Swiper();

}(ourFramework));