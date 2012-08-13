(function($){

    //----------------------------------------------------------------------
    //
    // Carousel Class
    //
    // This class contains methods for interfacing with a carousel library.
    //
    //----------------------------------------------------------------------

    function Class_Carousel () {

        //----------------------------------------------------------------------
        // Event Name Constants
        //----------------------------------------------------------------------

        var EVENT_RESIZE    = "viewportResize";

        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------

        var self       = this,
            parent     = window[ourNamespace],
            util       = parent.Util,
            event      = parent.Event,
            _current   = {
                panel:          {},
                panels:         {},
                carouselObj:    {}
            },
            _viewport  = {
                width: 0,
                height: 0
            },
            _elements  = {},
            _settings  = {},
            _defaults  = {

                panelData: {
                    title:          false,
                    titleHeight:    35,
                    borderSize:     15,
                    titleColor:     "#000",
                    background:     "#bdbdbd",
                    borderColor:    "#FFF"
                },

                isMobile:       false,
                initialPanels:  [],

                dimensions: {
                    percentH:   96,
                    percentW:   96
                },

                durations: {
                    reset:      300,
                    slideOn:    600,
                    slideOff:   600
                },

                easing: {
                    slideOn:    "linear",
                    slideOff:   "linear"
                },

                templates: {
                    panel:      "#tmplPanel"
                },

                elements: {
                    panelContainer: "#panelContainer",
                    panelWrapper:   ".panelWrapper",
                    panelImage:     ".panelImg",
                    panelCenter:    ".panelCenter",
                    panelFrame:     ".panelFrame",
                    panelTitle:     ".panelTitle",
                    panelFront:     ".panelFront",
                    panelBack:      ".panelBack"

                }
            };

        //----------------------------------------------------------------------
        // Public Constructor
        //----------------------------------------------------------------------

        this.init = function(config) {

            _settings = util.extend(_defaults, config);
            _elements = util.select(_settings.elements);

            util.log("Carousel settings: ", _settings);
            util.log("Carousel elements: ", _elements);

            _settings.initialPanels = parent.getSetting('panels');
            _current.carouselObj = parent.getElement('carousel');

            _setupViewport();

            if (_settings.isMobile) {

                _settings.dimensions = {
                    percentH:   100,
                    percentW:   100
                };

            }

            // Bind the window resize event to reset the viewport
            // sizes stored here locally, and then also trigger
            // our own custom event.

            $(window).bind("resize", self.onWindowResize);

            _buildPanels(_settings.initialPanels);

            _current.panels = _elements.panelContainer.children();

            _current.carouselObj.carousel()
                                .bind("beforeSlide", self.onBeforeSlide)
                                .bind("afterSlide", self.onAfterSlide)
                                .bind("animationStart", self.onAnimationStart)
                                .bind("transitionend", self.onAnimationEnd)
                                .bind("oTransitionEnd", self.onAnimationEnd)
                                .bind("MSTransitionEnd", self.onAnimationEnd)
                                .bind("webkitTransitionEnd", self.onAnimationEnd);


            _setCurrentPanel(0);
            _loadHighQualityImage(_current.panel);
            _setPanelBackground(_current.panel);

            return self;

        }


        function _buildPanels(panelsArray) {

            if (!util.isarray(panelsArray)) { return false; }
            var i = 0, panel = {};
            for (i in panelsArray) {
                if (panelsArray.hasOwnProperty(i)) {
                    panel = panelsArray[i];
                    self.create(panel);
                }
            }

        }

        function _setCurrentPanel(index) {

            var i = (util.isint(index)) ? index : 0;
            _current.panel = _current.panels.eq(i);
            util.log("Setting current panel: ", _current.panel);

        }

        function _setupViewport() {

            _viewport = {
                width: $(window).width(),
                height: $(window).height()
            };

            util.log("Current viewport size: ", _viewport);
            return _viewport;

        }

        //----------------------------------------------------------------------
        // Public Getters
        //----------------------------------------------------------------------

        this.getCurrentPanel = function() {
            return _current.panel;
        }

        this.getViewport = function() {
            return _viewport;
        }

        //----------------------------------------------------------------------
        // Event Handlers
        //----------------------------------------------------------------------

        this.onWindowResize = function() {

            if (_settings.isMobile) { return true; }

            util.debounce(function(){

                var viewport = _setupViewport();
                event.trigger(EVENT_RESIZE, viewport);

                _current.panels.each(function(){
                    var panel = $(this);
                    self.setBorder(panel);
                    self.setPanelSize(panel);
                });

                _current.carouselObj.carousel('move', _current.panel.index() + 1);

            }, 100);

        }

        this.onAnimationEnd = function(e) {
            util.log("animation end");
            _loadHighQualityImage(_current.panel);
            _setPanelBackground(_current.panel);
        }

        this.onAnimationStart = function(e) {

            util.log("animation start");
            //_loadLowQualityImage(_current.panel);

        }

        this.onBeforeSlide = function(e, prevIndex, newIndex) {
            //_loadLowQualityImage(_current.panel);
        }

        this.onAfterSlide = function(e, prevIndex, newIndex) {
            _setCurrentPanel(newIndex - 1);
        }

        this.onPanelClick = function(e) {

            e.preventDefault();
            var panel = $(this);

            if (panel.data("showing") === "front") {
                self.showBackOfPanel(panel);
            } else {
                self.showFrontOfPanel(panel);
            }

            return;

        }

        this.showFrontOfPanel = function(panel) {

            panel = panel || _current.panel;
            panel.find(_settings.elements.panelFront).show();
            panel.find(_settings.elements.panelBack).hide();
            panel.data("showing", "front");

        }

        this.showBackOfPanel = function(panel) {

            panel = panel || _current.panel;
            panel.find(_settings.elements.panelFront).hide();
            panel.find(_settings.elements.panelBack).show();
            panel.data("showing", "back");

        }


        this.nextPanel = function() {

            if (_current.panel.index() !== _current.panels.length - 1) {
                _current.carouselObj.carousel('next');
            }

        }

        this.prevPanel = function() {

            if (_current.panel.index() !== 0 ) {
                _current.carouselObj.carousel('prev');
            }

        }






        //----------------------------------------------------------------------
        // Public Methods
        //----------------------------------------------------------------------

        // Create a set of markup using a jQuery template and using the data
        // that is passed in through the params object.  Return a reference
        // to the newly created panel.

        this.create = function(data) {

            var data = util.extend(_settings.panelData, data);
            var source = $(_settings.templates.panel).html();
            var template = Handlebars.compile(source);
            var panel = $(template(data));

            panel.appendTo(_elements.panelContainer);
            panel.data("settings", data);

            self.bind(panel);
            self.setTitle(panel);
            self.setBorder(panel);
            self.setPanelSize(panel);
            self.showFrontOfPanel(panel);
            _loadLowQualityImage(panel);

        }

        this.bind = function(panel) {

            panel.bind("dblclick", self.onPanelClick);

        }

        this.setTitle = function(panel) {

            var panel = panel || _current.panel;
            var title = panel.find(_settings.elements.panelTitle);
            var s = panel.data("settings");

            if (s.title) {

                title.css("height", util.toint(s.titleHeight) + "px")
                     .css("color", s.titleColor);

            }

        }

        this.setBorder = function(panel) {

            var panel = panel || _current.panel;
            var frame = panel.find(_settings.elements.panelFrame);
            var s = panel.data("settings");

            // adjust border size based on the reduction ratio
            // of the image as a whole.

            var bs = util.toint(s.borderSize * s.reductionRatio);
            s.borderSizeReduced = bs;

            if (bs >= 0) {
                frame.css("padding", bs + "px");
            }

            if (util.defined(s.borderColor)) {
                frame.css("backgroundColor", s.borderColor);
            }

        }

        this.setPanelSize = function(panel) {

            if (!util.defined(panel)) { return false; }

            var els = _settings.elements;
            var panel = panel || _current.panel;

            var front = panel.find(els.panelFront);
            var back = panel.find(els.panelBack);
            var img = panel.find(els.panelImage);
            var s = panel.data("settings");

            var bs = (util.toint(s.borderSize) * 2); // border size
            var th = (s.title) ? (util.toint(s.titleHeight)) : 0; // title height

            var iw = s.width;
            var ih = s.height;
            var ir = iw / ih;

            var vh = _viewport.height - bs - th;
            var vw = _viewport.width - bs;
            var vr = vw / vh;

            var ph = _settings.dimensions.percentH;
            var pw = _settings.dimensions.percentW;

            if (vr > ir) { // viewport ratio is larger than image ratio

                if (ir < 1) { // and image is portait
                    var nh = vh * (ph/100);
                    var nw = nh * ir;
                } else { // and image is landscape
                    var nh = vh * (ph/100);
                    var nw = nh * ir;
                }

            } else { // image ratio is larger than viewport ratio

                if (ir < 1) { // and image is portait
                    var nw = vw * (pw/100);
                    var nh = nw / ir;
                } else { // and image is landscape
                    var nw = vw * (pw/100);
                    var nh = nw / ir;
                }

            }

            s.originalWidth = s.width;
            s.originalHeight = s.height;
            s.reductionRatio = nw / s.width;

            s.width = nw;
            s.height = nh;

            panel.data("settings", s);

            front.height(nh).width(nw);
            back.height(nh).width(nw);

            self.setBorder(panel);
            self.centerPanel(panel);

        }

        this.centerPanel = function(panel) {

            var panel = panel || _current.panel;
            var center = panel.find(_settings.elements.panelFrame);
            var s = panel.data("settings");

            var t = (s.title) ? (util.toint(s.titleHeight)) : 0; // title height
            var b = (util.toint(s.borderSizeReduced) * 2); // border size
            var h = s.height + b + t;
            var w = s.width + b;

            var pw = Math.floor((_viewport.width - w) / 2);
            var ph = Math.floor((_viewport.height - h) / 2);

            center.css({
                marginLeft: pw,
                marginRight: pw,
                marginTop: ph
            });

        }


        //----------------------------------------------------------------------
        // Private Methods
        //----------------------------------------------------------------------

        function _loadHighQualityImage(panel) {

            var img = panel.find("img.high");
            var url = panel.data("highimage");
            var other = panel.find("img.low");

            if (img.hasClass("loaded")) {

                img.show();
                other.hide();

            } else {

                img.bind('load', function(){

                   img.addClass("loaded").show();
                   other.hide();

                }).attr("src", url);

            }

        }

        function _loadLowQualityImage(panel) {

            var img = panel.find("img.low");
            var url = panel.data("lowimage");
            var other = panel.find("img.high");

            if (img.hasClass("loaded")) {

                img.show();
                other.hide();

            } else {

                img.bind('load', function(){

                   img.addClass("loaded").show();
                   other.hide();

                }).attr("src", url);

            }

        }

        function _setPanelBackground(panel) {

            var settings = panel.data("settings");
            var bgcolor = settings.background;
            _setBackgroundColor(bgcolor);

        }

        function _setBackgroundColor(color) {

            util.log("set background color: ", color);

            animate = true;

            color = (color[0] === "#") ? color : _settings.panelData.background;

            if (animate) {

                $("body").animate({'backgroundColor': color},
                            _settings.durations.slideOn,
                            _settings.easing.slideOn,
                            function() {
                                // util.vlog("done bg anim");
                            });

            } else {

                $("body").css({'backgroundColor': color});

            }

            return true;

        }


    }

    //----------------------------------------------------------------------
    // Insert the class into the global window application scope
    //----------------------------------------------------------------------

    window[ourNamespace]["Carousel"] = new Class_Carousel();

}(ourFramework));