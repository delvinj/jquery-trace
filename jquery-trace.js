// :noTabs=true:mode=javascript:tabSize=2:indentSize=2:folding=indent:

(function() {
  
  var patchKey = "jquery-event-trace";
  var savedKey = "jquery-event-trace-saved";
  
  var dataKey = "_tracedata";
  
  // Check if we're already patched...
  if (window[patchKey] !== undefined) {
    // Toggle out
    jQuery.event.trigger = window[savedKey];
    
    window[patchKey] = window[savedKey] = window[dataKey] = undefined;
  } else {
    // Toggle in
    var jqTrigger = jQuery.event.trigger;
    
    var nativeSlice = Array.prototype.slice;
    
    window[patchKey] = 1;
    window[savedKey] = jqTrigger;
    window[dataKey] = [];
    
    var count = 0;
    
    jQuery.event.trigger = function trigger(ev) {
      ++count;
      
      var pos = 1;
      
      // Try and find the event type
      if (ev instanceof jQuery.Event) {
        var type = ev.type || "jQuery.Event";
      } else if (ev && ev.constructor === String) {
        var type = ev;
      } else if (ev) {
        var type = String(ev.constructor);
        pos = 0;
      } else {
        var type = "Unknown";
        pos = 0;
      }
      
      var mine = nativeSlice.call(arguments, pos);
      (window.console && console.debug && console.debug(count, type, mine));
      
      if (pos != 0) {
        mine.unshift(arguments[0]);
      }
      window[dataKey].unshift({num:count, type:type, args:mine});
      
      // XXX: breaks in strict mode
      return jqTrigger.apply(arguments.callee.caller, arguments);
    };
  }
})();

