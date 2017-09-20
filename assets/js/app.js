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
    var trainCount;

    database.ref().on("value", addToList);
    $("#addNewTrainInfo").click(addNewTrainInfo);

    // When submitted adds fields to database.
    function addNewTrainInfo(event) {
        event.preventDefault();

        var trainName = $("#addTrainName").val().trim();
        var destination = $("#addDestination").val().trim();
        var firstTrainTime = $("#addFirstTrainTime").val().trim();
        var frequency = $("#addFrequency").val().trim();

        database.ref("Train-" + trainCount).push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

        trainCount++;
    }
    // When database is updated add new values to current train list
    function addToList(snapshot) {
        if (snapshot.exists()) {
            console.log("Exists");
            console.log(snapshot.val().trainName); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! snapshot not working

            var trainName = snapshot.val().trainName;
            var destination = snapshot.val().destination;
            var frequency = snapshot.val().frequency;
            var firstTrainTime = snapshot.val().firstTrainTime;

            $("#currentTrainList").append(
                '<hr>' +
                '<div class="row">' +
                '<div class="col-3">' + trainName + '</div>' +
                '<div class="col-3">' + destination + '</div>' +
                '<div class="col-2">' + frequency + '</div>' +
                '<div class="col-2">' + firstTrainTime + '</div>' +
                '<div class="col-2">Ex. Minutes Away</div>' +
                '</div>'
            );
        } else {
            console.log("Doesn't Exist")

            trainCount = 0;
        }
    }
});