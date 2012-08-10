(function($){
    
    //----------------------------------------------------------------------
    //
    // Panel Class
    // 
    // This sub-class contains some helper methods for working with buttons.
    //
    //----------------------------------------------------------------------
    
    function Class_Panel (parent) {
        
        //----------------------------------------------------------------------
        // Event Name Constants
        //----------------------------------------------------------------------
        
        var EVENT_CLICK         = "click touchstart",
            EVENT_MOVE_LEFT     = "panelMoveLeft",
            EVENT_MOVE_RIGHT    = "panelMoveRight";
            EVENT_RESIZE        = "viewportResize";
        
        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        
        var eventDataObject = {
	
			start:	{x:0, y:0, time: 0}, 		// Starting touchpoint [x pos, y pos, milliseconds]
			
			delta: 	{
					
						prevPos:  {x:0, y:0},	// Previous touchpoint
						dist: 	  {x:0, y:0}, 	// Distance relative to original touchpoint
						dir:	  {x:0, y:0} 	// Direction of touch [-1 left/up, +1 right/down, 0 no movement]
					
					}, 
					
			end: 	{ 
			
						duration: 0, 			// Duration of touch in milliseconds
						speed:	  {x:0, y:0},   // Speed of movement along x and y axis
						flick: 	  {x:0, y:0} 	// +1/-1 if the touch was deemed to be a flick left/right up/down
					
					}
	
		};
        
        var self       = this,
            util       = parent.Util,
            event      = parent.Event,
            eventData  = eventDataObject,
            _current   = {
                busy:   false,
                panel:  false,
                moving: false
            },
            _viewport  = {},
            _elements  = {},
            _settings  = {},
            _defaults  = {
                
                panelData: {
                    title:          false,
                    titleHeight:    75,
                    borderSize:     15,
                    titleColor:     "#000",
                    background:     "#bdbdbd",
                    borderColor:    "#FFF"
                },
                
                isMobile:       false,
                initialPanels:  [],
                
                dimensions: {
                    percentH:   95,
                    percentW:   95
                },
                
                durations: {
                    reset:      300,
                    slideOn:    600,
                    slideOff:   600
                },
                
                easing: {
                    reset:      "ease-out",
                    slideOn:    "ease-out", 
                    slideOff:   "ease-out"
                    //slideOn:    "linear", 
                    //slideOff:   "linear"
                },
                
                templates: {
                    panel:      "#tmplPanel"
                },
                
                elements: {
                    panelContainer: "#panels",
                    
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
            
            util.log("Dream.Panel settings: ", _settings);
            util.log("Dream.Panel elements: ", _elements);
            
            _setupViewport();
            
            // Bind the window resize event to reset the viewport
            // sizes stored here locally, and then also trigger 
            // our own custom event.
            
            $(window).bind("resize", function(){
                var viewport = _setupViewport();
                event.trigger(EVENT_RESIZE, viewport);
                self.setPanelSize();
            });

            // Disable the drag event on the images inside the 
            // panels, this way they can be dragged to trigger
            // the slideOnStage actions.  Default behavior was
            // that the browser would try to copy the image.
            
            $(_settings.elements.panelImage).live("dragstart", function(e){
                e.preventDefault();
            })
            
            _buildPanels(_settings.initialPanels);
                        
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
            _current.panel = _elements.panelContainer.children().eq(i);
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
        
        this.onPanelClick = function(e) {
                                    
            e.preventDefault();
            var panel = $(this);
            
            if (_settings.isMobile) {
                
                if (panel.data("showing") === "front") {
                    self.showBackOfPanel(panel);
                } else {
                    self.showFrontOfPanel(panel);
                }
                
                return;
            }
                                    
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
        
        
        this.slideLeft = function() {
            
            if (!_current.panel) { _setCurrentPanel(); }
            
            var currPanel = _current.panel;
            var nextPanel = _nextPanel(currPanel);
            if (!nextPanel || _isbusy()) { return false; }
                        
            _busy();
            
            self.slideOffLeft(currPanel);
            self.slideOnStage(nextPanel, function(){
                _done();
            });
                        
        }
        
        this.slideRight = function() {
            
            if (!_current.panel) { _setCurrentPanel(); }
            
            var currPanel = _current.panel;
            var prevPanel = _prevPanel(currPanel);
            if (!prevPanel || _isbusy()) { return false; }
            
            _busy();
            
            self.slideOffRight(currPanel);
            self.slideOnStage(prevPanel, function(){
                _done();
            });
                        
        }
            
        
        
        
        //----------------------------------------------------------------------
        // Touch Event Handlers
        //----------------------------------------------------------------------
        
        this.touchStart = function(params) {
            _resetEventData(params[0]);
        }
        
        this.touchMove = function(params) {
            _updateDelta(params[0]);
        }
        
        this.touchEnd = function(params) {
            _endTouch(params[0]);
        }
        
        //----------------------------------------------------------------------
        // Mouse Event Handlers
        //----------------------------------------------------------------------
        
        this.mouseStart = function(e) {
            _resetEventData(e);
        }
        
        this.mouseMove = function(e) {
            _updateDelta(e);
        }
        
        this.mouseEnd = function(e) {
            _endTouch(e);
        }

        
        //----------------------------------------------------------------------
        // Private Touch Related Gesture Math (taken from Flickable.js)
        //----------------------------------------------------------------------
        
        	
    	function _resetEventData(e) {
    	    
    	    if (_isbusy()) { return true; }
    	    
    	    _current.moving = true;
    
    		var pageX, pageY;
    
    		// Android and iOS structure event data differently
    		pageX = (typeof e.touches != 'undefined') ? e.touches[0].pageX : e.pageX; 
    		pageY = (typeof e.touches != 'undefined') ? e.touches[0].pageY : e.pageY;
    
    		eventData = eventDataObject;
    		eventData.start = {x:pageX, y:pageY, time: e.timeStamp};
    		eventData.delta.prevPos = {x:pageX,  y:pageY};
    
    		_updateDelta(e);
    		        		
    
    	}
    	
    	
    	function _updateDelta(e) {
    	        		
    	    if (_isbusy() || !_current.moving) { return true; }
    	    
    		var pageX, pageY;
    		
    		// Android and iOS structure event data differently
    		pageX = (typeof e.touches != 'undefined') ? e.touches[0].pageX : e.pageX; 
    		pageY = (typeof e.touches != 'undefined') ? e.touches[0].pageY : e.pageY;
    		
    		var dirX, dirY,
    			prevX 	= pageX, 
    			prevY 	= pageY, 
    			distX 	= pageX - eventData.start.x, 
    			distY 	= pageY - eventData.start.y;
    
    
    			if(pageX > eventData.delta.prevPos.x) {
    				dirX = 1;
    			} else if(pageX < eventData.delta.prevPos.x) {
    				dirX = -1;
    			} else {
    				dirX = 0;
    			}
    			
    			
    			if(pageY > eventData.delta.prevPos.y) {
    				dirY = 1;
    			} else if(pageY < eventData.delta.prevPos.y) {
    				dirY = -1;
    			} else {
    				dirY = 0;
    			}    		
    		
    		eventData.delta.prevPos	= {x:prevX,  y:prevY};
    		eventData.delta.dist 	= {x:distX,  y:distY};
    		eventData.delta.dir		= {x:dirX,   y:dirY};
    		    		
    		_moveCurrentPanel();
    		    		         
    	}
    	
    	
    	function _moveCurrentPanel() {
    	    
    	    if (_isbusy()) { return true; }
    	        	    
    	    var el = _current.panel.get(0);
    	    
    	    var pos = eventData.delta.dist.x;
    	    
    	    var style = '('+pos+'px,0,0)';
    	    var style_attr = pos+'px,0,0';
			
			// Zepto does not currently support setting translate3d 
			// via .css() so we have to do it manually
			
			_current.panel.animate({translate3d: style_attr}, 0);
			
			return;
			
			if (typeof el.style.webkitTransform != 'undefined') {
			    
			    // util.vlog("webkit");
			    
				el.style.webkitTransform = 'translate3d'+style;				
				
			} else if (typeof el.style.mozTransform != 'undefined') {
			    
			    util.vlog("moz");
			    
				el.style.mozTransform = 'translate3d'+style; 
				
			} else {
			    
			    util.vlog("reg");
			    
				el.style.transform = 'translate3d'+style; 
				
			}
    	    
    	}
    	
    	
    	
    	function _endTouch(e) {
    	    
    	    if (_isbusy()) { return true; }
    	    
    	    _current.moving = false;
    	        	    
    	    var flickThreshold = 0.7;
    	    var minTravelDistance = 5;
    
    		var duration  = (e.timeStamp - eventData.start.time);
    	    var speedX    = Math.abs(Math.round( eventData.delta.dist.x / duration * 100)/100);
            var speedY    = Math.abs(Math.round( eventData.delta.dist.y / duration * 100)/100); 
    		var dirX      = eventData.delta.dir.x;
    		var dirY      = eventData.delta.dir.y;
    		var flickX    = 0;
    		var flickY    = 0;
    		    
            if ((speedX > flickThreshold)) {
                                
            	flickX = (Math.abs(eventData.delta.dist.x) >= minTravelDistance) ? dirX : 0;
            	
            } else if((speedY > flickThreshold)) {
                                
            	flickY = (Math.abs(eventData.delta.dist.y) >= minTravelDistance) ? dirY : 0;
            	            	
            }			
    
    		eventData.end.duration	= duration;
    		eventData.end.speed		= {x:speedX, y:speedY};
    		eventData.end.flick		= {x:flickX, y:flickY};
    		    		
    		var hasNext = (_nextPanel(_current.panel) !== false);
    		var hasPrev = (_prevPanel(_current.panel) !== false);
    		    		
    		if (flickX === -1) {
    		    
    		    if (!hasNext) { _resetCurrentPanel(); return; }
    		    event.trigger("flickLeft");
    		    return;
    		    
    		} else if (flickX === 1) {
    		    
    		    if (!hasPrev) { _resetCurrentPanel(); return; }
    		    event.trigger("flickRight");
    		    return;
    		    
    		} else {
    		    
                _resetCurrentPanel();
		      
    		}
        
    	}
    	
    	function _resetCurrentPanel() {
    	        	    
    	    _current.panel.animate({translate3d: '0,0,0'}, 
    	                           _settings.durations.reset, 
    	                           _settings.easing.reset);
    	    
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
                        
        }
        
        this.bind = function(panel) {
            
            // panel.bind("click", self.onPanelClick);
            
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
                        
            if (util.toint(s.borderSize) >= 0) {
                frame.css("padding", s.borderSize + "px");
            }
            
            if (util.defined(s.borderColor)) {
                frame.css("backgroundColor", s.borderColor);
            }
            
        }
        
        this.setPanelSize = function(panel) {
            
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
            
            s.width = nw;
            s.height = nh;
            panel.data("settings", s);
                        
            front.height(nh).width(nw);
            back.height(nh).width(nw);
            self.centerPanel(panel);
            
        }
        
        
        
        
        this.centerPanel = function(panel) {
            
            var panel = panel || _current.panel;
            var center = panel.find(_settings.elements.panelCenter);
            var s = panel.data("settings");            
            
            var t = (s.title) ? (util.toint(s.titleHeight)) : 0; // title height
            var b = (util.toint(s.borderSize) * 2); // border size
            var h = s.height + b + t;
            var w = s.width + b;
            
            center.css("margin-top", -h / 2);
            center.css("margin-left", -w / 2);
            
        }
        
        
        this.slideOnStage = function(panel, callback) {
                        
            if (!_current.panel) { _setCurrentPanel(); }
            var panel = panel || _current.panel;
            var settings = panel.data("settings");
            var bgcolor = settings.background;
                        
            self.setPanelSize(panel);
            
            _loadLowQualityImage(panel);
                                           
            if (!_settings.isMobile) { _setBackgroundColor(bgcolor); }
                                    
            panel.show().animate({translate3d: "0,0,0"}, {
                
                duration: _settings.durations.slideOff,
                easing: _settings.easing.slideOff,                
                complete: function() {
                    
                    _loadHighQualityImage(panel);
                    util.call(callback, {panel: panel});                    
                    panel.removeClass("offRight").removeClass("offLeft");
                    _current.panel = panel;                                        
                    panel.show(); // this is just in case
                    
                    if (_settings.isMobile) { _setBackgroundColor(bgcolor); }
                                        
                }
                
            });
            
        }
            
        this.slideOffLeft = function(panel, callback) {
                        
            panel = $(panel);
            
            var left = "-" + _viewport.width + "px";
            
            panel.animate({translate3d: left+",0,0"},
                          _settings.durations.slideOff, 
                          _settings.easing.slideOff, 
                          function(){ 
                              
                              panel.hide();
                              _loadLowQualityImage(panel);
                              util.call(callback, {panel: panel});
                                
                          });                                            
            
        }
                
        this.slideOffRight = function(panel, callback) {
            
            panel = $(panel);
            
            var left = _viewport.width + "px";
                        
            panel.animate({translate3d: left+",0,0"}, 
                          _settings.durations.slideOff, 
                          _settings.easing.slideOff, 
                          function(){
                              
                              panel.hide();
                              _loadLowQualityImage(panel);
                              util.call(callback, {panel: panel});                              
                    
                          });
                          
        }
        
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

        
        //----------------------------------------------------------------------
        // Private Methods
        //----------------------------------------------------------------------
        
        function _done() {
            _current.busy = false;
        }
        
        function _busy() {
            _current.busy = true;
        }
        
        function _isbusy() {
            // util.vlog(_current.busy ? "isbusy" : "notbusy");
            return _current.busy;
        }
        
        function _nextPanel(elem) {
            var next = elem.next(_settings.elements.panels);
            return (next.length === 1) ? next : false;
        }
        
        function _prevPanel(elem) {
            var prev = elem.prev(_settings.elements.panels);
            return (prev.length === 1) ? prev : false;
        }
        
        function _setBackgroundColor(color) {
                                    
            animate = true;
            
            color = (color[0] === "#") ? color : _settings.panelData.background;
            
            if (animate) {
                
                $("body").animate({'background-color': color}, 
                            _settings.durations.slideOn,
                            _settings.easing.slideOn, 
                            function() {
                                // util.vlog("done bg anim");
                            });
                
            } else {
                
                $("body").css({'background-color': color});
                
                
                
            }
                            
            return true;               
            
        }
                
               
    }
    
    //----------------------------------------------------------------------
    // Insert the class into the global window application scope
    //----------------------------------------------------------------------
    
    window.Dream.Panel = new Class_Panel(window.Dream);

}(Framework));