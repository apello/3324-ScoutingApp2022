var cookieCheck = false;
let jsonarray = [];


function increase(ele) {
  // input = button.parentNode(div).children[2](input)
  var input = ele.parentNode.children[2];
  // parseint turns string to int, increment value
  input.value = parseInt(input.value) + 1;

  // if the input value equals the set max, disable add button
  if (parseInt(input.value) == parseInt(input.max)) {
    ele.parentNode.children[1].disabled = true;
  }

  // if the downbutton is disabled and the upbutton is press, reable the downbutton
  if (ele.parentNode.children[3].disabled) {
    ele.parentNode.children[3].disabled = false;
  }

  
}

// same thing in reverse
function decrease(ele) {
  var input = ele.parentNode.children[2];
  input.value = parseInt(input.value) - 1;
  if (parseInt(input.value) == parseInt(input.min)) {
    ele.parentNode.children[3].disabled = true;
  }
  if (ele.parentNode.children[1].disabled) {
    ele.parentNode.children[1].disabled = false;
  }
}

// make a cookie if this is the first input this page, then set currentCookie to true and update data
function bakeCookies() {
    var conString = "currentCookie=";
    // loop through jsonArray
    for (i = 0; i <= jsonarray; i++) {
      // do sum idk
      if (!jsonarray.length == i){
      
        conString = conString + jsonarray[i] + ",";
      } else {
        conString = conString + jsonarray[i];
      }
    }
	}

// set currentCookie to false so that a new one will be created, and reset page to default values
function newPage() {
    
}

// sets variables values equal to html values in JSON
function htmlToVar(input, index) {

  // what's variablesName
  var jformat = variablesName(input) + ": " + input;

  // was missing brackets
  if (jsonarray.length <= index) {
    jsonarray.length = index;
  }

  jsonarray[index] = jformat;
}
