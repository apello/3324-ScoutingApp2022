document.addEventListener("DOMContentLoaded", function (event) {


  // filters duplicates
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  var teamList = [];
  // parses db info, loops through, and appends to teamList 
  for (var j = 0; j < JSON.parse(data.match).length; j++) {
    teamList[j] = JSON.parse(data.match)[j][0]
  }
  // sets array
  teamList = teamList.filter(onlyUnique);

  document.getElementById("chartContainer").style.visibility = "hidden"; // hide container until submit

  // loop through teams in db
  if (teamList.length > 0) {

    // grab input about team name
    const teamNumberForm = document.querySelector("#teamNumberForm"); // grab form
    teamNumberForm.addEventListener("submit", formSubmit); // when form is submitted 

    function formSubmit(event) {
      event.preventDefault(); // stops form from submitting
      const teamNumberInput = teamNumberForm.querySelector("input[name='teamNumberInput']");
      teamNumberValue = teamNumberInput.value; // grab user input
      document.getElementById("chartContainer").style.visibility = "visible"; // show container after submit

      document.getElementById("teamNotFound").innerHTML = ""; // clear error

      // init variables
      var teamIndexNum = 0;
      var teamInArray = false;

      // loop through list of teams in db
      for (var i = 0; i < teamList.length; i++) {

        var matches = JSON.parse(data.match).filter(function (x) {
          return x[0] == teamList[i];
        });

        // if user number is equal to number in array
        if (teamList[i] === teamNumberValue) {
          teamIndexNum = i; // team index number
          teamInArray = true;
          break; // from for loop
        }
      }


      // if team is in db
      if (teamInArray) {

        // grab team graph data
        for (var j = 0; j < constants.graphCalculationHeaders.length; j++) {
          switch (j) {
            case 0:
              var teamNumber = teamList[teamIndexNum]; // FIXME: Not working for some reason, using teamNumberValue instead
              break;
            case 1://GETTING MATCHES OBSERVED 0
              var matchesObserved = matches.length;
              break;
            case 3: //GETTING OVERALL SHOOTING PERCENTAGE
              var shootingPct = shootingPercentage(matches, [3, 4, 5, 6, 7, 8, 9, 10]);
              break;
            case 4: //GETTING AUTO SHOOTING PERCENTAGE
              var autoShootingPct = shootingPercentage(matches, [3, 4, 5, 6]);
              break;

            case 5: //GETTING TELEOP SHOOTING PERCENTAGE
              var teleopShootingPct = shootingPercentage(matches, [7, 8, 9, 10]);
              break;

            case 6: //GETTING AVERAGE CLIMB LEVEL
              climbLevelArray = [];
              for (var index = 0; index < matches.length; index++) { climbLevelArray.push(matches[index][12]); }
              var climbLvlAvg = (arraySum(climbLevelArray) / climbLevelArray.length) * 25; // 0 : no climb, 25 : low, 50 : medium, 75 : high, 100 : transversal
              break;

            case 7: //GETTING AVERAGE CLIMB FREQUENCY
              climbFreqAvg = (parseInt(arraySum(getColData(matches, [11]))) / matchesObserved) * 100; // attemped climbs / matches observed
              break;
            case 8: //GETTING AVERAGE DEFENSIVE RATING
              defRatingLength = getColData(matches, [13]).length;
              defRatingAvg = (parseInt(arraySum(getColData(matches, [13]))) / defRatingLength) * 10; // defensive / matches observed
              break;
          }
        }

        // CHART INFO

        // output team number
        var teamNumber = document.getElementById("teamNumber");
        teamNumber.innerHTML = "Stats for Team " + teamNumberValue;

        //output matches observed
        var numMatchesObserved = document.getElementById("numMatchesObserved");
        numMatchesObserved.innerHTML = "Matches Observed: " + matchesObserved;


        // SETUP CHART

        // remove active chart
        document.getElementById("chartGraph").remove();
        // create new chart 
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'chartGraph');
        canvas.setAttribute('aria-label', 'Graph Data Visualizer');
        canvas.setAttribute('role', 'img');
        // add to container
        document.querySelector('#chartContainer').appendChild(canvas);

        // DISPLAY GRAPH
        // FIXME: create function for rendering graphs for alliance charts

        // setup block  
        let graphData = {
          labels: [
            "Overall Shot Accuracy",
            "Auto Shooting %",
            "TO Shooting %",
            "Average Climb Level (x25)",
            "Climb Frequency",
            "Defensive Rating Avg. (x10)"
          ],
          datasets: [{
            label: teamNumberValue,
            data: [shootingPct, autoShootingPct, teleopShootingPct, climbLvlAvg, climbFreqAvg, defRatingAvg], // from switch
            fill: true,
            backgroundColor: 'rgba(177, 0, 3, 0.2)',
            borderColor: 'rgb(177, 0, 3)',
            pointBackgroundColor: 'rgb(177, 0, 3)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(177, 0, 3)'
          }]
        };

        // config block
        const config = {
          type: 'radar',
          data: graphData,
          options: {
            elements: {
              line: {
                borderWidth: 3
              }
            },
            scale: {

              ticks: {
                suggestedMin: 0,
                suggestedMax: 100,
                stepSize: 25, // 25 - 50 - 75 - 100 
                maxTicksLimit: 11, // Or use maximum number of ticks and gridlines to show 
                display: false, // remove label text only,
              }
            },
            aspectRatio: 2 // overrides html [width, height]
          },
        };

        // init block
        let chartGraph = new Chart(
          document.getElementById('chartGraph').getContext('2d'),  // chart div
          config
        );


      } else {
        // team not found
        document.getElementById("teamNotFound").innerHTML = "Team Not Found in Database, Sorry";
        document.getElementById("chartContainer").style.visibility = "hidden"; // hide container if no team found

      }
    }
  } else {
    // no data found
    p = document.createElement("p");
    h5 = document.createElement("h5")
    h5.className = "noDataIcon";
    h5.innerHTML = "&#xe002;";
    p.innerHTML = "No Data Found";
    p.style.marginTop = "2px";
    document.getElementById('averagesTable').parentNode.appendChild(h5);
    document.getElementById('averagesTable').parentNode.appendChild(p);

    // hide chart
    document.getElementById("graphDataTable").style.display = "none";
    document.getElementById("graphDataTable").style.margin = "0";

  }

});

// functions

// shooting percentage f


function shootingPercentage(matches, array) {
  var totalHitsArray = []; // holds total hits for all matches
  var totalShotsArray = []; // holds total attempts (hits and misses) for all matches

  var totalHits;
  var totalShots;

  for (var index = 0; index < array.length; index++) { // loop through array
    if (array[index] === 4 || array[index] === 6 || array[index] === 8 || array[index] === 10) { // if number is "auto_low_hit", "auto_high_hit", "tele_high_hit", "tele_low_hit" index
      totalHitsArray.push(arraySum(getColData(matches, [array[index]]))); // add to hit array
      totalShotsArray.push(arraySum(getColData(matches, [array[index]]))); // add to total array
    } else { // else add to total array
      totalShotsArray.push(arraySum(getColData(matches, [array[index]])));
    }
  }

  totalHits = arraySum(totalHitsArray); // sum of total hits
  totalShots = arraySum(totalShotsArray); // sum of total shots

  return (totalHits / (totalShots)) * 100; // return percentage 
}


// column data
function getColData(array, colArray) {
  var colData = []
  if (colArray.length == 1) {
    for (var c = 0; c < array.length; c++) {
      colData.push(parseFloat(array[c][colArray[0]]))
    }
    return colData;
  } else {
    for (var c = 0; c < array.length; c++) {
      colData.push(parseFloat(arraySum(array[c].slice(Math.min(...colArray), Math.max(...colArray) + 1))))
    }
    return colData;
  }
}


// collapse for graph div
function collapse(ele) {
  if (ele.parentNode.children[2].style.display !== "none") { //Closing
    ele.parentNode.children[0].style.margin = "0";
    ele.parentNode.children[2].style.display = "none";
    ele.innerHTML = "&#xe5c5;";
  } else { //Opening
    ele.parentNode.children[0].style.margin = "";
    ele.parentNode.children[2].style.display = "block";
    ele.innerHTML = "&#xe5c7;";
  }
}

// returns sum of array
function arraySum(array) {
  return array.reduce(function (a, b) {
    return a + parseFloat(b)
  }, 0);
}
