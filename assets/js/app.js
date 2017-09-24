// Code this app to calculate when the next train will arrive; this should be relative to the current time. 

// Users from many different machines must be able to view same train times. 

// Styling and theme are completely up to you. Get Creative! 

$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAFZKkWrKTVfsx9nTmDF3bTjB3ElnxvmIs",
        authDomain: "train-time-d90c4.firebaseapp.com",
        databaseURL: "https://train-time-d90c4.firebaseio.com",
        projectId: "train-time-d90c4",
        storageBucket: "",
        messagingSenderId: "996336674556"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var rightMeow = moment(); // now
    var keyList = [];

    database.ref().on("value", addToList);
    $("#addNewTrainInfo").click(addNewTrainInfo);
    $("#clearTrains").click(function (event) { 
        event.preventDefault();       
        database.ref().remove();
    });

    console.log(moment().format("HHmm"));

    // When submitted adds fields to database.
    function addNewTrainInfo(event) {
        event.preventDefault();

        // Assign values from inputs to variables
        var trainName = $("#addTrainName").val().trim();
        var destination = $("#addDestination").val().trim();
        var firstTrainTime = $("#addFirstTrainTime").val().trim();
        var frequency = $("#addFrequency").val().trim();

        //Validate inputs
        if (firstTrainTime === "" || firstTrainTime.length !== 4 || (firstTrainTime % 100) - 59 > 0 || firstTrainTime - 2359 > 0) {
            alert("Please enter a valid First train time.")

        } else {
            // Push the data to the database (inside a variable so as to be able to get the key later)
            childKey = database.ref().push({
                trainName: trainName,
                destination: destination,
                firstTrainTime: firstTrainTime,
                frequency: frequency
            }).key;

        }
    }
    // When database is updated add new values to current train list
    function addToList(snapshot) {
        if (snapshot.exists()) {
            console.log("Exists");

            console.log(snapshot.val());

            // Clear then rebuild the train list labels every 60 seconds 
            rePaint();

            function rePaint() {
                console.log("Updated " + moment().format("HHmm ss"));

                $("#currentTrainList").empty();
                $("#currentTrainList").append(
                    '<div class="row">' +
                    '<div class="col-3"><strong>Train Name</strong></div>' +
                    '<div class="col-3"><strong>Destination</strong></div>' +
                    '<div class="col-2"><strong>Frequency (min)</strong></div>' +
                    '<div class="col-2"><strong>Next Arrival</strong></div>' +
                    '<div class="col-2"><strong>Minutes Away</strong></div>' +
                    '</div>'
                );

                // Run a function for every child in the root
                snapshot.forEach(function(childSnapshot) {

                    var trainName = "";
                    var destination = "";
                    var frequency = "";
                    var firstTrainTime = "";
                    var minutesAway = "";

                    trainName = childSnapshot.val().trainName;
                    destination = childSnapshot.val().destination;
                    frequency = childSnapshot.val().frequency;
                    firstTrainTime = childSnapshot.val().firstTrainTime;
                    minutesAway = moment(firstTrainTime, "HHmm").diff(rightMeow, "minutes");

                    // if (moment(firstTrainTime, "HHmm").diff(rightMeow, "minutes") < 0) {
                    //     console.log("First time: " + firstTrainTime);    
                    //     firstTrainTime = moment(firstTrainTime, "HHmm").add(frequency, "minutes").format("HHmm");
                    //     console.log("Second time: " + firstTrainTime);
                    //     database.ref().set({
                    //         trainName: trainName,
                    //         destination: destination,
                    //         firstTrainTime: firstTrainTime, // Overwriting all database
                    //         frequency: frequency
                    //     });
                    // }

                    $("#currentTrainList").append(
                        '<hr>' +
                        '<div class="row">' +
                        '<div class="col-3">' + trainName + '</div>' +
                        '<div class="col-3">' + destination + '</div>' +
                        '<div class="col-2">' + frequency + '</div>' +
                        '<div class="col-2">' + firstTrainTime + '</div>' +
                        '<div class="col-2">' + minutesAway + '</div>' +
                        '</div>'
                    );
                });
            }
        } else {
            console.log("Doesn't Exist")

            $("#currentTrainList").html(
                '<div class="row">' +
                '<div class="col-3"><strong>Train Name</strong></div>' +
                '<div class="col-3"><strong>Destination</strong></div>' +
                '<div class="col-2"><strong>Frequency (min)</strong></div>' +
                '<div class="col-2"><strong>Next Arrival</strong></div>' +
                '<div class="col-2"><strong>Minutes Away</strong></div>' +
                '</div>' +
                '<hr>' +
                '<div class="row">' +
                '<div class="col-3">None</div>' +
                '<div class="col-3"></div>' +
                '<div class="col-2"></div>' +
                '<div class="col-2"></div>' +
                '<div class="col-2"></div>' +
                '</div>'
            );
        }
    }
});