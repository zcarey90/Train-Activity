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

  function hourNow() {
    var hour = today.getHours();
  }

  $(".form-field").on("keyup", function() {
    var traintemp = $("#train-name")
      .val()
      .trim();
    var citytemp = $("#destination")
      .val()
      .trim();
    var timetemp = $("#first-train")
      .val()
      .trim();
    var freqtemp = $("#frequency")
      .val()
      .trim();

    localStorage.setItem("train", traintemp);
    localStorage.setItem("city", citytemp);
    localStorage.setItem("time", timetemp);
    localStorage.setItem("freq", freqtemp);
  });

  $("#train-name").val(localStorage.getItem("train"));
  $("#destination").val(localStorage.getItem("city"));
  $("#first-train").val(localStorage.getItem("time"));
  $("#frequency").val(localStorage.getItem("freq"));

  $("#submit").on("click", function(event) {
    event.preventDefault();

    if (
      $("#train-name")
        .val()
        .trim() == "" ||
      $("#destination")
        .val()
        .trim() == "" ||
      $("#first-train")
        .val()
        .trim() == "" ||
      $("#frequency")
        .val()
        .trim() == ""
    ) {
      alert(TIMESTAMP);
    } else {
      trainName = $("#train-name")
        .val()
        .trim();
      destination = $("#destination")
        .val()
        .trim();
      startTime = $("#first-train")
        .val()
        .trim();
      frequency = $("#frequency")
        .val()
        .trim();

      $(".form-field").val("");

      database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        startTime: startTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      localStorage.clear();
    }
  });

  database.ref().on("child_added", function(snapshot) {
    var startTimeConverted = moment(snapshot.val().startTime, "hh:mm").subtract(
      1,
      "years"
    );
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = timeDiff % snapshot.val().frequency;
    var minToArrival = snapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var key = snapshot.key;

    var newrow = $("<tr>");
    newrow.append($("<td>" + snapshot.val().trainName + "</td>"));
    newrow.append($("<td>" + snapshot.val().destination + "</td>"));
    newrow.append(
      $("<td class='text-center'>" + snapshot.val().frequency + "</td>")
    );
    newrow.append(
      $("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>")
    );
    newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
    newrow.append(
      $(
        "<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" +
          key +
          "'>X</button></td>"
      )
    );

    if (minToArrival < 6) {
      newrow.addClass("info");
    }

    $("#train-table-rows").append(newrow);
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

  var elName = document.getElementById("name");
  elName.textContent = username;
  var elNote = document.getElementById("note");
  elNote.textContent = message;
});
