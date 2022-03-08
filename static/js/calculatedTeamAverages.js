document.addEventListener("DOMContentLoaded", function (event) {
  var teamAverages = {};

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

  if (teamList.length > 0) {
    var least = 0;
    var most = 0;

    // loop through teamList from -1 (why from -1)
    for (var i = -1; i < teamList.length; i++) {

      // idk what this does
      var matches = JSON.parse(data.match).filter(function (x) {
        return x[0] == teamList[i];
      });
      // table creation => row
      var row = document.createElement('tr')
      // loop through constants dataCalculationHeaders 
      for (var j = 0; j < constants.dataCalculationHeaders.length; j++) {
        // at the beginning of the loop
        if (i == -1) {
          // create the table title
          var item = document.createElement("th");
          // enter dataCalculationHeaders into th html
          item.innerHTML = constants.dataCalculationHeaders[j];

          // set table title equal to loop var j 
          item.id = j;
          // make it clickable
          item.addEventListener('click', function () { sort(this); });
          // red color
          row.style.backgroundColor = "#b10003";
          row.style.cursor = "pointer";
          // if the loop is past the beginning
        } else {
          // create the table elements
          var item = document.createElement('td');
          // switch between j, which is set to the item.id
          switch (j) {
            case 0:
              item.innerHTML = teamList[i] // team name
              break;
            case 1://GETTING MATCHES OBSERVED 0
              item.innerHTML = matches.length;
              break;
            case 2://GETTING AVG START POINT
            case 3://GETTING AVG CARGO HIGH
            case 4://GETTING AVG CARGO LOW
              item.innerHTML = arraySum(getColData(matches, [j])) / getColData(matches, [j]).length
              break;
            case 5: //GETTING LEAST CARGO CYCLES
              item.innerHTML = Math.min(...getColData(matches, [3, 5]));
              break;
            case 6://GETTING MOST CARGO CYCLES
              item.innerHTML = Math.max(...getColData(matches, [3, 5]));
              break;
            case 7://GETTING AVG CARGO PLACED
              item.innerHTML = arraySum(getColData(matches, [3, 5])) / getColData(matches, [3, 5]).length
              break;
            case 8://GETTING STD DEV CARGO
              item.innerHTML = stdDev(getColData(matches, [3, 5]))
              break;
            case 9://GETTING LEAST CYCLES
              item.innerHTML = Math.min(...getColData(matches, [3, 8]));
              break;
            case 10://GETTING MOST CYCLES
              item.innerHTML = Math.max(...getColData(matches, [3, 8]));
              break;
            case 11://GETTING AVERAGE CYCLES
              item.innerHTML = arraySum(getColData(matches, [3, 8])) / getColData(matches, [3, 8]).length
              break;
            case 12://GETTING STD DEV CYCLES
              item.innerHTML = stdDev(getColData(matches, [3, 8]))
              break;
            case 13://GETTING BEST CLIMB
              item.innerHTML = Math.max(...getColData(matches, [11]));
              break;
            case 14://GETTING % OF MATCHES BEST CLIMB ACHIEVED
              item.innerHTML = String(getColData(matches, [11]).reduce(function (a, b) {
                return a + (b === Math.max(...getColData(matches, [11])));
              }, 0) / getColData(matches, [11]).length * 100) + "%";

              break;
            case 15: //GETTING AVERAGE DEFENSIVE RATING
              defRatingLength = getColData(matches, [13]).length;
              item.innerHTML = (parseInt(arraySum(getColData(matches, [13]))) / defRatingLength); // defensive / matches observed
              break;
            case 16: //TOTAL SCORE FOR ALLIANCE
              item.innerHTML = totalPoints(matches);
              break;

          } // end switch


          if (item.innerHTML.length > 4) {
            item.innerHTML = Math.round(100 * parseFloat(item.innerHTML)) / 100;
          }
        }
        // put the item => table content, into row => table
        row.appendChild(item)
      }

      // put the table into the div element
      document.getElementById('averagesTable').appendChild(row)
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
  }

});

// functions

function totalPoints(matches) {

  /* 
    points per: 
    -- 
    - init: 2
    - auto-low: 2
    - auto-high: 4
    - tele-low: 1
    - tele-high: 2
    - climb-1: 4
    - climb-2: 6
    - climb-3: 10
    - climb-4: 15
  */

  totalScore = [];
  totalScore.push(parseInt(arraySum(getColData(matches, [2]))) * 2); // move from intitation 
  totalScore.push(parseInt(arraySum(getColData(matches, [4]))) * 2); // auto low points
  totalScore.push(parseInt(arraySum(getColData(matches, [6]))) * 4); // auto high points
  totalScore.push(parseInt(arraySum(getColData(matches, [8])))); // teleop low score
  totalScore.push(parseInt(arraySum(getColData(matches, [10]))) * 2); // teleop high score

  for (var index = 0; index < matches.length; index++) {
    if (parseInt(matches[index][12]) > 0) {
      if (parseInt(matches[index][12]) == 1) {
        totalScore.push(4); // climb 1
      } else if (parseInt(matches[index][12]) == 2) {
        totalScore.push(6); // climb 2
      } else if (parseInt(matches[index][12]) == 3) {
        totalScore.push(10); // climb 3
      } else if (parseInt(matches[index][12]) == 4) {
        totalScore.push(15); // climb 4
      }
    }
  }

  return arraySum(totalScore);
}

function arraySum(array) {
  return array.reduce(function (a, b) {
    return a + parseFloat(b)
  }, 0);
}

function stdDev(array) {
  var mean = arraySum(array) / array.length;
  var devArray = []
  array.forEach(function (item) {
    devArray.push(Math.pow(item - mean, 2));
  });
  return Math.sqrt(arraySum(devArray) / devArray.length);
}

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

function sort(ele) {
  debugger;
  var i;
  var col = ele.id
  var switching = true;
  var dir = 1;
  var makeSwitch = false;
  var switchCount = 0;
  var table = document.getElementsByTagName('table')[0]
  while (switching) {
    switching = false;
    for (i = 1; i < (table.rows.length - 1); i++) {
      if (dir == 1) {
        if (parseInt(table.rows[i].children[col].innerHTML) < parseInt(table.rows[i + 1].children[col].innerHTML)) {
          makeSwitch = true;
          break;
        }
      } else if (dir == 0) {
        if (parseInt(table.rows[i].children[col].innerHTML) > parseInt(table.rows[i + 1].children[col].innerHTML)) {
          makeSwitch = true;
          break;
        }
      }

    }
    if (makeSwitch) {
      table.rows[i].parentNode.insertBefore(table.rows[i + 1], table.rows[i]);
      switching = true;
      switchCount++;
    } else {
      if (switchCount == 0 && dir == 1) {
        dir = 0;
        switching = true;
      }
    }
  }
}
