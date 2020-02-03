// Function to serialize form data to a JSON object, suitable for POSTing to the API:
import $ from 'Jquery';

$(function() {
  $.fn.serializeObject = function() {
    var objSeparator = "__";
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      var separatorPos = this.name.indexOf(objSeparator);
      if (separatorPos !== -1) {
        // Object
        var objName = this.name.substring(0, separatorPos);
        var propName = this.name.substring(separatorPos + objSeparator.length);
        // Check if object should be entry in array
        var indexMatch = objName.match(/(.*)\[([0-9]*)\]$/);
        if (indexMatch !== null) {
          var arrayName = indexMatch[1];
          var index = indexMatch[2];
          // Create array if it doesn't exist
          if (o[arrayName] === undefined) {
            o[arrayName] = [];
          }
          // Create object at position in array if it doesn't exist
          if (o[arrayName][index] === undefined) {
            o[arrayName][index] = {};
          }
          // Create prop on object in array
          o[arrayName][index][propName] = this.value || "";
        } else {
          // Object at root level
          if (o[objName] === undefined) {
            o[objName] = {};
          }
          o[objName][propName] = this.value || "";
        }
      } else if (o[this.name] !== undefined) {
        // Array
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || "");
      } else {
        o[this.name] = this.value || "";
      }
    });
    return o;
  };
});
