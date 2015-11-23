$(function() {

  var options = [];
  var hasLocalStorage = window.localStorage;
  var validationModal = $("#validationModal");
  var option = $("#option");
  var optionsList = $("#optionsList");
  var add = $("#add");
  var pick = $("#pick");

  function renderOptionsList() {
    optionsList.empty();

    $.each(options, function(index, value) {
      var option = $(document.createElement("li"));
      var remove = $(document.createElement("span"));
      remove.addClass("remove");
      remove.text("Remove");
      option.text(value);
      option.append(remove);

      // add class that exposes hover selector if not already there
      if (!optionsList.hasClass("list")) {
        optionsList.addClass("list");
      }

      remove.click(function() {
        options = $.grep(options, function(v) {
          return v != value;
        });
        if (options.length <= 1) {
          pick.attr("disabled", true);
        }
        renderOptionsList();
        saveState(-1);
      });

      optionsList.append(option);
    });
  }

  function optionAlreadyExists(val) {
    return $.inArray(val, options) != -1;
  }

  function selectListItem(index) {
    var listItems = $("#optionsList li");
    listItems.eq(index).addClass("selected");
    $("#optionsList li span").addClass("hide");
    // remove click bindings
    listItems.unbind("click");

    // disable buttons
    add.attr("disabled", true);
    pick.attr("disabled", true);
  }

  function loadState() {
    if (hasLocalStorage) {
      var data = localStorage.getItem("data");
      if (data != null) {
        var obj = JSON.parse(data);
        options = obj.options;

        // can pick after 2 options added
        if (options.length > 1) {
          pick.removeAttr("disabled");
        }

        renderOptionsList();

        // select existing picked option
        if (obj.selectedIndex != -1) {
          selectListItem(obj.selectedIndex);
        }
      }
    }
  }

  function saveState(selectedIndex) {
    if (hasLocalStorage) {
      var object = {
        options: options,
        selectedIndex: selectedIndex,
      };
      localStorage.setItem("data", JSON.stringify(object));
    }
  }

  function clearState() {
    if (hasLocalStorage) {
      localStorage.removeItem("data");
    }
  }

  add.click(function() {
    var val = option.val();

    // add new option if it doesn't already exist
    if (val.length && !optionAlreadyExists(val)) {
      options.push(val);

      // can pick after two options added
      if (options.length > 1) {
        pick.removeAttr("disabled");
      }

      renderOptionsList();
      saveState(-1);

      $('#option').val("");
    } else {
      $('#validationModal').modal("show");
    }
  });

  pick.click(function() {
    if (options.length > 1) {
      // pick an option at random
      var random = Math.floor(Math.random() * options.length);
      selectListItem(random);
      saveState(random);
    }
  });

  $("#reset").click(function() {
    // clear modal, list and re-enable 'Add' button
    options = [];
    optionsList.empty();
    option.val("");

    add.removeAttr("disabled");

    clearState();
  });

  option.keypress(function(e) {
    // handle enter key
    if (e.which == 13) {
      add.trigger("click");
    }
  });

  validationModal.keypress(function(e) {
    // handle enter key
    if (e.which == 13) {
      validationModal.modal("hide");
    }
  });

  // focus on input field after return from modal dialog
  validationModal.on('hidden.bs.modal', function (e) {
    option.focus();
  })

  loadState();

});
