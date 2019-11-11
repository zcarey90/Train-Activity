var firebaseConfig = {
  apiKey: "AIzaSyD--OSTfEjke4qbWAnOGQViO__CX0_gGVc",
  authDomain: "testtrain-e1554.firebaseapp.com",
  databaseURL: "https://testtrain-e1554.firebaseio.com",
  projectId: "testtrain-e1554",
  messagingSenderId: "687743634168",
  appId: "1:687743634168:web:c5c03a77b49ac0a3"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
$(document).ready(function() {
  var trainName = "";
  var destination = "";
  var startTime = "";
  var frequency = 0;

  function currentTime() {
    var current = moment().format("PE");
    $("#currentTime").html(current);
    setTimeout(currentTime, 2000);
  }

  function hour() {
    var hour = today.getHours();
  }

  $("#submit").on("click", finalResults);

  function finalResults(event) {
    event.preventDefault();
    var trainName = $("#train-name")
      .val()
      .trim();
    var destination = $("#destination")
      .val()
      .trim();
    var frequency = $("#frequency")
      .val()
      .trim();
    var startTime = $("#first-train")
      .val()
      .trim();

    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      startTime: startTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  }
  database.ref().on("child_added", function(snapshot) {
    var startTimeConverted = moment(snapshot.val().startTime, "hh:mm").subtract(
      1,
      "years"
    );
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = timeDiff % snapshot.val().frequency;
    var minToArrival = snapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;

    var tablerow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(minToArrival),
      $("<td>").text(nextTrain)
    );

    $("#train-schedule-rows").append(tablerow);
  });

  $(document).on("click", ".arrival", function() {
    keyref = $(this).attr("data-key");
    database
      .ref()
      .child(keyref)
      .remove();
    window.location.reload();
  });

  currentTime();

  setInterval(function() {
    window.location.reload();
  }, 50000);

  var username;
  var message;
  username = "Passenger";
  message = "See our new destinations";

  var Name = document.getElementById("name");
  Name.textContent = username;
  var Note = document.getElementById("note");
  Note.textContent = message;
});
