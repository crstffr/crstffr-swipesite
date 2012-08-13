(function($){
    
    //----------------------------------------------------------------------
    //
    // Utility Class
    // 
    // Some helper functions used throughout the application.
    //
    //----------------------------------------------------------------------
    
    function Class_Util() {

        var parent = window[ourNamespace];
                      
        //----------------------------------------------------------------------
        // Public Methods
        //----------------------------------------------------------------------
        
        this.log = function(s, v) {
            if (parent.getSetting("debug") !== true) { return false; }
            if (parent.getSetting("isMobile") === true) { this.vlog(s, v); }
            if (typeof(console) === "undefined") { return false; }
            
            if (this.defined(v)) {
                console.log(s, v);
            } else {
                console.log(s);
            }
        }
        
        // Viewport logging, used for console logging to the viewport,
        // good for debugging on mobile devices, or others without 
        // a console.
        
        this.vlog = function(s, v) {
            s = s || "";
            v = v || "";
            var id = "vlogger";            
            if ($("#"+id).length === 0) { $("<div id='"+id+"'/>").appendTo("body"); }
            var vlog = $("#"+id).append("<p><span class='s'>"+s+"</span> <span class='v'>"+v+"</span></p>");
            
            while(vlog.height() > $('body').height()) {
                vlog.children().eq(0).remove();
            }
        }
        
        // Helper for cleanly dealing with undefined variables. If the passed in 
        // value is defined, it returns that passed in value.  Otherwise, if the 
        // value is not defined, then it returns the fallback, or false if no
        // fallback is defined. Usage: 
        //
        // a.) settings = defined(settings, {});
        // b.) if (!defined(settings)) { something(); }
        
        this.defined = function(val, fallback) {
            fallback = (typeof(fallback) !== "undefined") ? fallback : false;
            return (typeof(val) !== "undefined") ? val : fallback;
        }
        
        this.extend = function(obj_1, obj_2) {
            return $.extend({}, obj_1, obj_2);
        }
        
        this.isodd = function(val) {
            return (val%2 != 0);
        }
        
        this.istrue = function(val) {
            return (this.defined(val) && val === true);
        }
        
        this.isarray = function(item) {
            return (this.type(item) === "array");
        }
        
        this.isobject = function(item) {
            return (this.type(item) === "object");
        }
        
        this.isstring = function(item) {
            return (this.type(item) === "string");
        }
        
        this.isfunc = function(item) {
            return (this.type(item) === "function");
        }
        
        this.isint = function(item) {
            return (this.type(item) === "number");
        }
        
        this.toint = function(val) {
            return parseInt(val, 10);
        }
        
        this.type = function(item) {
            var type = typeof(item);
            return (type === "object" && item.length) ? "array" : type;
        }
        
        this.obj = function(key, data) {
            var obj = {};
            obj[key] = data;
            return obj;
        }
        
        this.inarray = function(val, arr) {
            for(var key in arr) {
                if (arr.hasOwnProperty(key)) {
                    if (arr[key] === val) {
                        return true;
                    }
                }
            }
            return false;
        }
        
        this.secstostring = function(secs) {
            
            var t = new Date(secs * 1000);
            var h = this.padtime(t.getUTCHours());
            var m = this.padtime(t.getUTCMinutes());
            var s = this.padtime(t.getUTCSeconds());
            return h + ":" + m + ":" + s;            
            
        }

        this.padtime = function(val) {
            return (val < 10 ? '0' : '') + val;
        }
        
        this.ucwords = function(content) {
            regex = new RegExp("[^A-Za-z0-9]", "gi");
            content = content.replace(regex, " ");
            return content.replace(/\w+/g, function(a){
                return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
            });
        }
        
        this.ucfirst = function(content) {
            var f = content.charAt(0).toUpperCase();
            return f + content.substr(1);            
        }
               
        // Helper for calling callback methods that are user defined.  And since
        // they are user defined, we need to make sure that it's actually a 
        // function at all.  Then return TRUE or whatever the callback returns.
        
        this.call = function(callback, params) {
            if (typeof(callback) === "function") {
                return this.defined(callback(this.defined(params)), true);
            }
        }
                
        // Helper for looping over a set of selectors from a config object
        // and selecting them into jQuery objects, and then returning them
        // out as one nice big happy set of jQuery objects.
        
        this.select = function(elementsObj) {
            var i = 0, elems = {}, sel = elementsObj;
            for (i in sel) { 
                if (sel.hasOwnProperty(i)) {
                    elems[i] = $(sel[i]);
                }
            }
            return elems;
        }

        // Take a bunch of events triggered rapidly and wait for a specified
        // amount of time before actually firing the callback.  Debouncing
        // is sort of like a throttle, but slightly different since it only
        // fires once per interval.

        // Use it as such:
        //
        // $(window).resize(function(){
        //      util.debounce(function(){
        //          console.log("I will run once every 500ms");
        //      }, 500);
        // });
        //

        this.debounce = (function () {
            var timers = {};
            return function (callback, ms, uniqueId) {
                if (!uniqueId) { uniqueId = 0; }
                if (timers[uniqueId]) {
                    clearTimeout(timers[uniqueId]);
                }
                timers[uniqueId] = setTimeout(callback, ms);
            };
        })();

        this.sanitize = function(type, content) {
            
            var regex   = {},
                content = this.defined(content);
            
            if (!content) { return ""; }
                
            switch (type) {
                
                case "integer":
                
                    content = parseInt(content, 10);
                    content = (isNaN(content)) ? 0 : content;
                    break;
                    
                case "alpha":
                    regex = new RegExp("[^A-Za-z]", "gi");
                    content = content.replace(regex, "");
                    break;
                    
                case "alphanumeric":
                    
                    regex = new RegExp("[^A-Za-z0-9 ]", "gi");
                    content = content.replace(regex, "");
                    break;
                    
                case "striphtml":
                    regex = new RegExp("<[^>]*>?", "g");
                    content = content.replace(regex, "");
                    break;
                    
                case "url":
                
                    regex = new RegExp('(http|https):\\/\\/[\\w\\-_]+' +
                                       '(\\.[\\w\\-_]+)+([\\w\\-\\.,@' +
                                       '?^=%&amp;:/~\\+#]*[\\w\\-\\@?' +
                                       '^=%&amp;/~\\+#])?');
                                       
                    content = (regex.test(content)) ? content : "";
                    break;
                    
                default: 
                    content = "";
                    break;
                
            }
            
            return content;
        }
        
        this.errorCode = function(response) {
            
            var json   = {}, 
                status = {}, 
                code   = "";
            
            if (json = this.defined(response.json)) {
                if (status = this.defined(json.status)) {
                    if (code = this.defined(status.errorCode)) {                        
                        return code;
                    }
                }
            }
            
            if (status = this.defined(response.status)) {
                if (code = this.defined(status.errorCode)) {
                    return code;
                }
            }
            
            if (code = this.defined(response.errorCode)) {
                return code;                
            }
            
            return false;
            
        }
    
    }
    
    //----------------------------------------------------------------------
    // Insert the sub-class into the global window application scope
    //----------------------------------------------------------------------
    
    window[ourNamespace]["Util"] = new Class_Util();

}(ourFramework));