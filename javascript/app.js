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

        // event.preventDefault();

        var form = $('#train-form');

        if (form[0].checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          } else {

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

          }
          
          form.addClass('was-validated');

    });

    // Firebase event to add a train and then write the data to the train schedule section

    database.ref().on("child_added", function(childSnapshot){
        
        console.log(childSnapshot.val());

        // Store database values in variables
        var trainName = childSnapshot.val().train;
        var trainDestination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().trainFequency;
        var firstTrainTime = childSnapshot.val().firstTime;
        
        // Log everything to confirm data
        console.log(trainName);
        console.log(trainDestination);
        console.log(frequency);
        console.log(firstTrainTime)

        // Convert first train time 
        var firstTimeConverted = moment(firstTrainTime, 'HH:mm').subtract(1, 'years');
        console.log(firstTimeConverted);

        // Get the time difference from now to the first train time
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        // Calculate how long until the next train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log(tMinutesTillTrain);

        // Calculate the next train arrival
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log(moment(nextTrain).format("hh:mm"));

        // Create a new row in the train schedule table
        var newRow =$('<tr>').append(
            $('<td>').text(trainName),
            $('<td>').text(trainDestination),
            $('<td>').text(frequency),
            $('<td>').text(moment(nextTrain).format("hh:mm")),
            $('<td>').text(tMinutesTillTrain),
        );
        
        // Append each new train entry
        $("#train-table > tbody").prepend(newRow);
    });

});