$(document).ready(function (){

    var firstTrainTime;
  
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "",
        authDomain: "trainscheduler-1afa8.firebaseapp.com",
        databaseURL: "https://trainscheduler-1afa8.firebaseio.com",
        projectId: "trainscheduler-1afa8",
        storageBucket: "",
        messagingSenderId: "1078358319975",
        appId: "1:1078358319975:web:8352a5edd43b22f43145c2"
    };
   
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    var database = firebase.database();

    // Button for adding trains
    $("#add-train-btn").on('click', function(event){
        
        event.preventDefault();

        // Grab Train input
        var trainName = $('#trainName-input').val().trim();
        var trainDestination = $('#trainDestination-input').val().trim();
        var firstTrainTime = $('#firstTrainTime-input').val();
        var frequency = $('#frequency-input').val();

        // Console log to check inputs
        // console.log(trainName);
        // console.log(trainDestination);
        // console.log(firstTrainTime);
        // console.log(frequency);

        // Create a local object for each train entry
        var newTrain = {
            train: trainName,
            destination: trainDestination,
            firstTime: firstTrainTime,
            trainFequency: frequency
        }

        // Uploads train data to the database
        database.ref().push(newTrain);
        
        // Log everything to the console
        // console.log(newTrain.train);
        // console.log(newTrain.destination);
        // console.log(newTrain.firstTime);
        // console.log(newTrain.trainFequency);

        alert("Train successfully added");

        // Clears all of the text-boxes
        $("#trainName-input").val("");
        $("#trainDestination-input").val("");
        $("#firstTrainTime-input").val("");
        $("#frequency-input").val("");
    });

    
    database.ref().on("child_added", function(childSnapshot){
        
        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().train;
        var trainDestination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().trainFequency;
        var firstTrainTime = childSnapshot.val().firstTime;
        
        console.log(trainName);
        console.log(trainDestination);
        console.log(frequency);
        console.log(firstTrainTime)

        var firstTimeConverted = moment(firstTrainTime, 'HH:mm').subtract(1, 'years');
        console.log(firstTimeConverted);

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


        var newRow =$('<tr>').append(
            $('<td>').text(trainName),
            $('<td>').text(trainDestination),
            $('<td>').text(frequency),
            $('<td>').text(moment(nextTrain).format("hh:mm")),
            $('<td>').text(tMinutesTillTrain),
        );

        $("#train-table > tbody").prepend(newRow);
    });
});