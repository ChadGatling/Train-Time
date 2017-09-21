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
    var childKey = "default";
    var now = moment();
    var keyList = [];
    var trainCount;

    database.ref().on("value", addToList);
    $("#addNewTrainInfo").click(addNewTrainInfo);

    console.log(moment().add(5, "minutes").format("HHmm"));

    // When submitted adds fields to database.
    function addNewTrainInfo(event) {
        event.preventDefault();

        var trainName = $("#addTrainName").val().trim();
        var destination = $("#addDestination").val().trim();
        var firstTrainTime = $("#addFirstTrainTime").val().trim();
        var frequency = $("#addFrequency").val().trim();

        childKey = database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        }).key;

        keyList.push(childKey);
    }
    // When database is updated add new values to current train list
    function addToList(snapshot) {
        if (snapshot.exists()) {
            console.log("Exists");

            trainCount = snapshot.numChildren();

            console.log("Train count: " + trainCount);
            console.log(snapshot.val());

            // Clear then rebuild the train list labels every 60 seconds
            clearInterval(timerID); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Timer Not working as intended.
            var timerID = setInterval(function() {   
                $("#currentTrainList").empty();
                $("#currentTrainList").append(
                    '<div class="row">' +
                        '<div class="col-3"><strong>Train Name</strong></div>'+
                        '<div class="col-3"><strong>Destination</strong></div>' +
                        '<div class="col-2"><strong>Frequency (min)</strong></div>' +
                        '<div class="col-2"><strong>Next Arrival</strong></div>' +
                        '<div class="col-2"><strong>Minutes Away</strong></div>' +
                    '</div>' 
                    );

                // Run a function for every child in the root
                snapshot.forEach(function(childSnapshot) {

                    var trainName = childSnapshot.val().trainName;
                    var destination = childSnapshot.val().destination;
                    var frequency = childSnapshot.val().frequency;
                    var firstTrainTime = childSnapshot.val().firstTrainTime;
                    var minutesAway = firstTrainTime - moment().format("HHmm");

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
                console.log("Updated: " + moment().format("HHmm ss"));
            }, 5*1000);
        } else {
            console.log("Doesn't Exist")

            trainCount = 0;

            $("#currentTrainList").append(
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