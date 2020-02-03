// feature detection for drag&drop upload
var isAdvancedUpload = (function() {
  var div = document.createElement("div");
  return (
    ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
    "FormData" in window &&
    "FileReader" in window
  );
})();

window.addEventListener("load", function() {
  // applying the effect for every form
  var forms = document.querySelectorAll(".box");
  Array.prototype.forEach.call(forms, function(form) {
    var input = form.querySelector('input[type="file"]');
    var label = form.querySelector("label");
    var countError = form.querySelector(".box__input .count-error");
    var restart = form.querySelectorAll(".box__restart");
    var submitButton = form.querySelector(".box__button");
    var filesUploaded = false;
    var droppedFiles = false;
    showFiles = function(files) {
      if (files.length !== 0) {
        filesUploaded = true;
      }

      label.textContent =
        files.length > 1
          ? (input.getAttribute("data-multiple-caption") || "").replace(
              "{count}",
              files.length
            )
          : files[0].name;
    };
    triggerFormSubmit = function() {
      if (filesUploaded) {
        countError.classList.remove("show");
        // Use hidden submit button so that event listener is triggered
        var button = form.ownerDocument.createElement("input");
        button.style.display = "none";
        button.type = "submit";
        form.appendChild(button).click();
        form.removeChild(button);
      } else {
        countError.classList.add("show");
      }
    };

    // Show either file name for a single file or number of files for multiple
    input.addEventListener("change", function(e) {
      showFiles(e.target.files);
    });

    // Ensure we have files uploaded before form submission
    submitButton.addEventListener("click", triggerFormSubmit, false);

    // drag&drop files if the feature is available
    if (isAdvancedUpload) {
      form.classList.add("has-advanced-upload"); // letting the CSS part to know drag&drop is supported by the browser

      [
        "drag",
        "dragstart",
        "dragend",
        "dragover",
        "dragenter",
        "dragleave",
        "drop"
      ].forEach(function(event) {
        form.addEventListener(event, function(e) {
          // preventing the unwanted behaviours
          e.preventDefault();
          e.stopPropagation();
        });
      });
      ["dragover", "dragenter"].forEach(function(event) {
        form.addEventListener(event, function() {
          form.classList.add("is-dragover");
        });
      });
      ["dragleave", "dragend", "drop"].forEach(function(event) {
        form.addEventListener(event, function() {
          form.classList.remove("is-dragover");
        });
      });
      form.addEventListener("drop", function(e) {
        droppedFiles = e.dataTransfer.files; // the files that were dropped
        showFiles(droppedFiles);
      });
    }

    // if the form was submitted
    form.addEventListener("submit", function(e) {
      // preventing the duplicate submissions if the current one is in progress
      if (form.classList.contains("is-uploading")) return false;

      form.classList.add("is-uploading");
      form.classList.remove("is-error");

      if (isAdvancedUpload) {
        // ajax file upload for modern browsers
        e.preventDefault();

        // gathering the form data
        var ajaxData = new FormData(form);
        if (droppedFiles) {
          Array.prototype.forEach.call(droppedFiles, function(file) {
            ajaxData.append(input.getAttribute("name"), file);
          });
        }

        // ajax request
        var ajax = new XMLHttpRequest();
        ajax.open(
          form.getAttribute("method"),
          form.getAttribute("action"),
          true
        );

        ajax.onload = function() {
          form.classList.remove("is-uploading");
          if (ajax.status >= 200 && ajax.status < 400) {
            form.classList.add("is-success");
          } else {
            form.classList.add("is-error");
          }
        };

        ajax.onerror = function() {
          form.classList.remove("is-uploading");
          form.classList.add("is-error");
        };

        ajax.send(ajaxData);
      } // fallback Ajax solution upload for older browsers
      else {
        var iframeName = "uploadiframe" + new Date().getTime(),
          iframe = document.createElement("iframe");

        $iframe = $(
          '<iframe name="' + iframeName + '" style="display: none;"></iframe>'
        );

        iframe.setAttribute("name", iframeName);
        iframe.style.display = "none";

        document.body.appendChild(iframe);
        form.setAttribute("target", iframeName);

        iframe.addEventListener("load", function() {
          var data = JSON.parse(iframe.contentDocument.body.innerHTML);
          form.classList.remove("is-uploading");
          form.classList.add(data.success == true ? "is-success" : "is-error");
          form.removeAttribute("target");
          iframe.parentNode.removeChild(iframe);
        });
      }
    });

    // restart the form if has a state of error/success
    Array.prototype.forEach.call(restart, function(entry) {
      entry.addEventListener("click", function(e) {
        e.preventDefault();
        form.classList.remove("is-error", "is-success");
        input.click();
      });
    });

    // Firefox focus bug fix for file input
    input.addEventListener("focus", function() {
      input.classList.add("has-focus");
    });
    input.addEventListener("blur", function() {
      input.classList.remove("has-focus");
    });
  });
});
