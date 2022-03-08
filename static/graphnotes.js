// switch for calcTeamAvg
switch (j) {
    case 0:
        var teamName = teamList[i] // team name
        break;
    case 1://GETTING MATCHES OBSERVED 0
        var matchesObserved = matches.length;
        break;
    // case 2://GETTING AVG START POINT
    //case 3://GETTING AVG CARGO HIGH
    //case 4://GETTING AVG CARGO MID
    //case 5://GETTING AVG CARGO LOW
    // item.innerHTML = arraySum(getColData(matches, [j])) / getColData(matches, [j]).length
    // break; 
    case 6: //GETTING LEAST CARGO CYCLES
        var leastCargo = Math.min(...getColData(matches, [3, 5]));
        break;
    case 7://GETTING MOST CARGO CYCLES
        var mostCargo = Math.max(...getColData(matches, [3, 5]));
        break;
    case 8://GETTING AVG CARGO PLACED
        var avgCargo = arraySum(getColData(matches, [3, 5])) / getColData(matches, [3, 5]).length
        break;
    case 9://GETTING STD DEV CARGO
        var stndrdDev = stdDev(getColData(matches, [3, 5]))
        break;
    //case 10://GETTING AVG HATCH HIGH
    //case 11://GETTING AVG HATCH MID
    //case 12://GETTING AVG HATCH LOW
    //item.innerHTML = arraySum(getColData(matches, [j-4])) / getColData(matches, [j-4]).length
    //break; 
    case 13://GETTING LEAST HATCH CYCLES
        var leastHatch = Math.min(...getColData(matches, [6, 8]));
        break;
    case 14://GETTING MOST HATCH CYCLES
        var mostHatch = Math.max(...getColData(matches, [6, 8]));
        break;
    case 15://GETTING AVG HATCH PLACED
        var avgHatch = arraySum(getColData(matches, [6, 8])) / getColData(matches, [6, 8]).length
        break;
    case 16://GETTING STD DEV HATCH
        var stdDevHatch = stdDev(getColData(matches, [6, 8]))
        break;
    case 17://GETTING LEAST CYCLES
        var leastCycle = Math.min(...getColData(matches, [3, 8]));
        break;
    case 18://GETTING MOST CYCLES
        var mostCycle = Math.max(...getColData(matches, [3, 8]));
        break;
    case 19://GETTING AVERAGE CYCLES
        var avgCycle = arraySum(getColData(matches, [3, 8])) / getColData(matches, [3, 8]).length
        break;
    case 20://GETTING STD DEV CYCLES
        var stdDevCycle = stdDev(getColData(matches, [3, 8]))
        break;
    case 21://GETTING BEST CLIMB
        var bestClimb = Math.max(...getColData(matches, [11]));
        break;
    case 22://GETTING % OF MATCHES BEST CLIMB ACHIEVED
        var bestClimbMatches = String(getColData(matches, [11]).reduce(function (a, b) {
            return a + (b === Math.max(...getColData(matches, [11])));
        }, 0) / getColData(matches, [11]).length * 100) + "%";

        break;
}


// OG graph
const graphData = {
    labels: [
        'Standard Dev',
        'Most Hatch ',
        'Most Cargo',
        'Best Climb',
        'Most Hatch'
    ],
    datasets: [{
        label: teamName,
        data: [stndrdDev, mostHatch, mostCargo, bestClimb, mostHatch],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
};

const ctx = document.getElementById('chart').getContext('2d');

const config = new Chart(ctx, {
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
                // https://www.chartjs.org/docs/latest/axes/styling.html#tick-configuration 
                // suggestedMax and suggestedMin settings only change the data values that are used to scale the axis 
                suggestedMin: 0,
                suggestedMax: 100,
                stepSize: 25, // 25 - 50 - 75 - 100 
                maxTicksLimit: 11, // Or use maximum number of ticks and gridlines to show 
                display: false, // remove label text only,
            }
        },
        aspectRatio: 2 // overrides html [width, height]
    },
});



// lab - shooting percentage function

console.log("teamNumber: " + teamNumberValue);

console.log("Matches Observed: " + matchesObserved);

for (var index = 0; index < matches.length; index++) {
    console.log("matches[" + index + "]: " + matches[index]);
    console.log("matches[" + index + "][" + index + "]: " + matches[index][index]);
}

// auto shooting percentage

console.log("Auto Shooting Percentage for " + teamNumberValue + ":");

var autoShootingHit = [];
var autoShootingTotal = [];


for (var index = 0; index < matches.length; index++) {
    autoShootingHit.push(parseInt(matches[index][4]), parseInt(matches[index][6])); //  "match": [4] : "auto_low_hit", [6] : "auto_high_hit",
    autoShootingTotal.push(parseInt(matches[index][4]), parseInt(matches[index][6]), parseInt(matches[index][3]), parseInt(matches[index][5]));//  "match": [3] : "auto_low_miss", [5] : "auto_high_miss",
}

autoHit = arraySum(autoShootingHit);
autoTotal = arraySum(autoShootingTotal);
autoPercentage = (autoHit / (autoTotal)) * 100;

console.log("Auto Shooting Hits: " + autoHit);
console.log("Auto Shooting Percentage: " + autoPercentage + "%");


// output team number
var teamNumber = document.getElementById("teamNumber");
teamNumber.innerHTML = "Stats for Team " + teamNumberValue;

var numMatchesObserved = document.getElementById("numMatchesObserved");
numMatchesObserved.innerHTML = "Matches Observed: " + matchesObserved;

function shootingPercentage(array) {
    var totalHitsArray = []; // holds total hits for all matches
    var totalShotsArray = []; // holds total attempts (hits and misses) for all matches

    var totalHits;
    var totalShots;

    for (var index = 0; index < array.length; index++) { // loop through array
        //console.log("index: "+index);
        for (var matchNumber = 0; matchNumber < matches.length; matchNumber++) { // loop through matches
            //console.log("matchNumber: "+matchNumber);
            if (array[index] === 4 || array[index] === 6 || array[index] === 8 || array[index] === 10) { // if number is "auto_low_hit", "auto_high_hit", "tele_high_hit", "tele_low_hit" index
                //console.log("arrayA["+index+"] == "+array[index]);
                totalHitsArray.push(parseInt(matches[matchNumber][array[index]])); // add to hit array
                //console.log("totalHits => array["+index+"] = "+array[index]);
                totalShotsArray.push(parseInt(matches[matchNumber][array[index]])); // add to total array
            } else { // else add to total array
                //console.log("arrayB["+index+"] == "+array[index]);
                totalShotsArray.push(parseInt(matches[matchNumber][array[index]]));
                //console.log("totalShots(miss) => array["+index+"] = "+array[index]);

            }
        }
    }

    //console.log(totalHitsArray);
    //console.log(totalShotsArray);

    totalHits = arraySum(totalHitsArray); // sum of total hits
    //console.log("totalHits: "+totalHits);
    totalShots = arraySum(totalShotsArray); // sum of total shots
    //console.log("totalShots: "+totalShots);  

    return (totalHits / (totalShots)) * 100; // return percentage

}

console.log(shootingPercentage([7, 8, 9, 10]));


