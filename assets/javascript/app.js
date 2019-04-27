$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBvGxiBI8MmbSonDBK5f3Kn-kW8ipCebg0",
        authDomain: "i-am-a-robot-7387b.firebaseapp.com",
        databaseURL: "https://i-am-a-robot-7387b.firebaseio.com",
        projectId: "i-am-a-robot-7387b",
        storageBucket: "i-am-a-robot-7387b.appspot.com",
        messagingSenderId: "1022338586581"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // Store the input values
    $("#add-train").on("click", function () {
        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var firstTime = $("#time-input").val().trim();
        var frequency = $("#frequency-input").val().trim();

        // Push the objects to the database
        database.ref().push({
            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        });

        // Confirm inputs are complete
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");

        return false;
    });

    // When a child is added log the new values
    database.ref().on("child_added", function (snapshot) {

        // Create new variables
        var firstTime = snapshot.val().firstTime;
        var frequency = snapshot.val().frequency;

        // Current time
        var currentTime = moment();

        // Convert first time to hh:mm and make sure it is before current time
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

        // Calculate difference in time from current time
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Calculate the time remaining 
        var tRemainder = diffTime % frequency;

        // Calculate minutes until train arrives
        var minutesAway = frequency - tRemainder;

        // Calculate next arrival time
        var nextTime = moment().add(minutesAway, "minutes");

        // Conver to am/pm time
        var nextTrainTime = moment(nextTime).format("hh:mm a");

        // Display the newe values in the table
        $("#new-train").append("<tr><td>" + snapshot.val().name + "<td>" + snapshot.val().destination + "<td>" + frequency + "min" + "<td>" + nextTrainTime + "<td>" + minutesAway + "<td>");
    });
});