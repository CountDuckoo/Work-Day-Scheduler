// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // get the containers for all elements that need to be written to
  var dayEl = $('#currentDay');
  var hourContainerEl = $('#hours');
  // sets the start and end times for the calendar to easily change the time range
  var minHour=9;
  var maxHour=17;

  // creates the divs for each hour
  function addHours(){
    for(let i=minHour; i<=maxHour; i++){
      // adds the row div, with an id based on the hour
      var hourDiv = $('<div>').addClass("row time-block").attr("id", ("hour-" + i));
      // adds the time column on the left
      var timeDiv = $('<div>').addClass("col-2 col-md-1 hour text-center py-3");
      if(i>12){
        // if it is after 12, converts from military time to a PM time
        timeDiv.text((i-12)+"PM");
      } else{ 
        // otherwise, uses the AM time
        timeDiv.text(i+"AM");
      }
      // adds the input field/display for events
      var textField = $('<textarea>').addClass("col-8 col-md-10 description").attr("rows", "3");
      // adds the save button
      var saveBtn = $('<button>').addClass("btn saveBtn col-2 col-md-1").attr("aria-label", "save");
      // adds the save icon and appends it to the button
      var saveExtra = $('<i>').addClass("fas fa-save").attr("aria-hidden", "true").appendTo(saveBtn);
      // appends the time column, input field, and save button to the row div
      hourDiv.append(timeDiv, textField, saveBtn);
      // appends the row div to the table
      hourContainerEl.append(hourDiv);
    }
  }

  addHours();
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});
