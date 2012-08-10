(function($){
    
    //----------------------------------------------------------------------
    //
    // Ajax Class
    // 
    // Global Ajax handling.
    //
    //----------------------------------------------------------------------
    
    function Class_Ajax(parent) {
        
        //----------------------------------------------------------------------
        // Event Name Constants
        //----------------------------------------------------------------------
        
        var AJAX_ERROR         = "globalAjaxError",
            AJAX_COMPLETE      = "globalAjaxComplete",
            AJAX_SUCCESS       = "globalAjaxSuccess",
            AJAX_BEFORE_SEND   = "globalAjaxBeforeSend";
        
        //----------------------------------------------------------------------
        // Private Properties
        //----------------------------------------------------------------------
        
        var self = this,
            util = parent.Util,
            
            _current  = {},
            _settings = {},
            _defaults = {
                events: {
                    // These aren't used anywhere
                    // globalError: function(){},
                    // globalSuccess: function(){},
                    // globalComplete: function(){}
                }
            };
            
        //----------------------------------------------------------------------
        // Initialize
        //----------------------------------------------------------------------

        _init();
            
        //----------------------------------------------------------------------
        // Constructor
        //----------------------------------------------------------------------
        
        function _init() {
            
            // _settings = $.extend(true, {}, _defaults, config);
            
            // Set global Ajax settings to always make GET requests
            // and expect the data type to by JSON.  Also populate
            // the xhrFields with some content, so we don't always
            // have to validate it.
                
            $.ajaxSetup({
                type: "GET",
                dataType: "json",
                data: {
                    format: "json"
                },
                xhrFields: {
                    custom: true
                },
                beforeSend: _globalAjaxBeforeSend
            });
                        
            // Set global Ajax Handlers
            
            $(document).ajaxError(_globalAjaxError)
                       .ajaxSuccess(_globalAjaxSuccess)
                       .ajaxComplete(_globalAjaxComplete);
            
        }
                
        //----------------------------------------------------------------------
        // Global Ajax Event Handlers
        //----------------------------------------------------------------------
        
        function _globalAjaxBeforeSend(jqxhr, settings) {
                        
            var global  = {},
                result  = {}, 
                reqName = "";
            
            // Trigger global event, checking for halted propagation    
            global = util.trigger(AJAX_BEFORE_SEND, arguments);
            if (global.isPropagationStopped()) { return false; }

            // Trigger request specific event, check for halted propagation
            if (reqName = util.defined(settings.xhrFields.requestName)) { 
                result = util.trigger(reqName + "BeforeSend", arguments);
                if (result.isPropagationStopped()) { return false; }
            }
            
            return true;
            
        }
            
        function _globalAjaxError(event, jqxhr, settings, error) {
                        
            var str     = "", 
                errStr  = "", 
                reqName = "",
                global  = {},
                params  = {};
                
            // Trigger global event, checking for halted propagation    
            global = util.trigger(AJAX_ERROR, arguments);
            if (global.isPropagationStopped()) { return false; }
            
            // Trigger request specific action, alerting error messages
            if (reqName = util.defined(settings.xhrFields.requestName)) { 
                
                if (util.isobject(error)) { 
                    errStr = util.defined(error.message, "");
                } else if (util.isstring(error)) {
                    errStr = error;
                }
                                                            
                if (errStr !== "abort") {
                    str = "An error occurred while requesting data from the server:";                    
                    params = {event:event, jqxhr:jqxhr, settings:settings, error:error};
                    util.trigger(reqName + "AjaxError", params);
                    alert(str + "\n\n" + errStr);                    
                }
            
            }
            
            return true;
            
        }
        
        function _globalAjaxComplete(event, xhr, settings) {
                        
            var reqName = "", 
                global  = {},
                params  = {};
                
            // Trigger global event, checking for halted propagation    
            global = util.trigger(AJAX_COMPLETE, arguments);
            if (global.isPropagationStopped()) { return false; }
            
            if (reqName = util.defined(settings.xhrFields.requestName)) { 
                params = {event:event, xhr:xhr, settings:settings};
                util.trigger(reqName + "Complete", params);               
            }
            
            return true;
            
        }
        
        function _globalAjaxSuccess(event, xhr, settings) {
            
            var reqName   = "",
                reqStatus = "",
                errorCode = "",
                jsonData  = {},
                reqParams = {},
                global    = {};

            // Trigger global event, checking for halted propagation    
            global = util.trigger(AJAX_SUCCESSS, arguments);
            if (global.isPropagationStopped()) { return false; }
                
            // Check to see if there are preset xhrField data in the 
            // settings.  If there are, then it was populated by one
            // of our ajax calls, which means we wish to have it do
            // some default success/error checking on the data.

            reqName = util.defined(settings.xhrFields.requestName);
            if (!reqName) { return; }
            
            jsonData  = $.parseJSON(xhr.responseText);
            reqStatus = util.defined(jsonData.status);
            reqParams = {json:jsonData, event:event, xhr:xhr};
            
            // All of our responses should have a "status" object 
            // that contains a success = true or error = true.  If
            // the status object is not set, then our response was
            // malformed, and we need to throw an error.
            
            if (!reqStatus) {
                
                util.log("Response is not properly formatted:", jsonData);
                util.trigger(reqName + "Error", reqParams);
                return; 
                
            }
            
            // Response is formatted properly, so now to determine
            // whether or not the request was a success or an error.
            
            if (util.istrue(reqStatus.success)) {
            
                // Success, so trigger the request success event.
                util.trigger(reqName + "Success", reqParams);
                return;
            
            } else if (util.istrue(reqStatus.error) || reqStatus.success === false) {
                
                // Error, so trigger the request error event.
                util.trigger(reqName + "Error", reqParams);
                
                // If an error code is set, then trigger the error code event.
                if (errorCode = util.errorCode(reqStatus)) {
                    util.trigger("ErrorCode" + util.ucfirst(errorCode), reqParams);
                }
                                
                return;
                
            }
            
            util.trigger(reqName + "UnknownSuccess", reqParams);
            
            return true;
                
        }
        
        
        
               
    }
    
    //----------------------------------------------------------------------
    // Insert the sub-class into the global window application scope
    //----------------------------------------------------------------------
    
    window.Dream.Ajax = new Class_Ajax(window.Dream);

}(Framework));