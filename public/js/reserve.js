// Use to create parking reservations
$(document).ready(function () {
    // Getting references to our form and inputs
    var reserveForm = $("form.reserve");
    var ownerInput = $("input#owner-input");
    var carInput = $("input#car-input");
    var licenseInput = $("input#plate-input");

    // When the form is submitted, we validate there's an owner, car and license plate entered
    reserveForm.on("submit", function (event) {
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
        ownerInput.val("");
        carInput.val("");
        licenseInput.val("");
    });

    // makeReserve does a post to our "api/login" route and if successful, redirects us the the members page
    function makeReserve(owner, car, license) {
        $.post("/api/reserve", {
            owner: owner,
            car: car,
            license: license,
            current: true
        })
            .then(function () {
                window.location.replace("/");
                // If there's an error, log the error
            })
            .catch(handleLoginErr);
    }

    function handleLoginErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
    }
});