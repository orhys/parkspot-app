$(document).ready(function () {
  // This file just does a GET request to figure out which parking spots are reserved
  // and updates the HTML on the page
  // $.get("/api/user_reservations").then(function (data) {


  $(document).on("click", "#make-res", insertTodo);
  $(document).on("click", "button.delete", deleteTodo);


  // console.log("hi you hit me")
  // console.log(data)

  var $todoContainer = $(".spot-reserved");

  var todos = [];

  getTodos();

  function getTodos() {
    // console.log("i should be logged twice")

    $.get("/api/user_reservations", function (data) {
      todos = data;
      initializeRows();
    });
  }


  function deleteTodo(event) {
    event.stopPropagation();

    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/reservations/" + id
    }).then(getTodos);
  }


  function initializeRows() {

    $todoContainer.empty();
    var rowsToAdd = [];

    for (var i = 0; i < todos.length; i++) {
      rowsToAdd.push(createNewRow(todos[i]));
      console.log("i am element: " + todos[i])
    }
    $todoContainer.prepend(rowsToAdd);
  }


  function insertTodo(event) {
    // Getting references to our form and inputs
    console.log("1")

    var reserveForm = $("form.reserve");
    var ownerInput = $("input#owner-input");
    var carInput = $("input#car-input");
    var licenseInput = $("input#plate-input");

    console.log("2")


    // When the form is submitted, we validate there's an owner, car and license plate entered
    reserveForm.on("submit", function (event) {

      console.log("submitted")

      event.preventDefault();
      var resData = {
        owner: ownerInput.val().trim(),
        car: carInput.val().trim(),
        license: licenseInput.val().trim()
      };

      if (!resData.owner || !resData.car || !resData.license) {
        return;
      }

      // If we have an owner, car and license we run the makeReserve function and clear the form
      makeReserve(resData.owner, resData.car, resData.license);

      console.log("clean fields")

      getTodos()
      setTimeout("location.reload(true);", 5)

      ownerInput.val("");
      carInput.val("");
      licenseInput.val("");
    });

    // makeReserve does a post to our "api/login" route and if successful, redirects us the the members page
    function makeReserve(owner, car, license) {

      event.preventDefault();

      console.log("inside makeReserve")

      var ressy = {
        owner: owner,
        car: car,
        license: license,
      }

      $.post("/api/reserve", ressy)
        .then(function () {

          console.log("insidde make reserve.then")

          window.location.replace("/members");
          // If there's an error, log the error
        })
        .catch(handleLoginErr);
    }

    function handleLoginErr(err) {
      $("#alert .msg").text(err.responseJSON);
      $("#alert").fadeIn(500);
    }
  }


  function createNewRow(todo) {
    var $newInputRow = $(
      [
        "<li class='list-group-item todo-item'>",
        "<span>",
        "Spot [" + todo.id + "] " + "Model: " + todo.car +"<br />",
        "Owner: " + todo.owner + "<br />", 
        "Plate: " + todo.license + "<br />", 
        "<div>",
        "<input type='text' class='edit' style='display: none;'>",
        "<button class='delete btn btn-primary'>x</button>",
        "</div>",
        "</li>",
        "</span>",
      ].join("")
    );

    $newInputRow.find("button.delete").data("id", todo.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("todo", todo);
    if (todo.complete) {
      $newInputRow.find("span").css("text-decoration", "line-through");
    }
    return $newInputRow;
  }

});
// });