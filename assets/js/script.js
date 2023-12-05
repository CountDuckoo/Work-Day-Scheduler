// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // get the containers for all elements that need to be written to
  var dayEl = $('#currentDay');
  var hourContainerEl = $('#hours');
  var displayEl = $('#messageDisplay')
  // sets the start and end times for the calendar to easily change the time range
  var minHour=9;
  var maxHour=17;

  //gets the current hour as a number
  var currentHour=+(dayjs().format("H"));
  //gets the day from storage, to be compared to the current day in getTime later
  var currentDate=localStorage.getItem("date");

  //displays the current day
  dayEl.text(currentDate);

  //gets the current time, so we know if we have moved to a new hour or day
  function getTime(){
    var tempHour=+dayjs().format("H");
    if (currentHour!=tempHour){
      currentHour=tempHour;
      updateHour();
    }
    //gets the current day as a string, formatted how we want to display it
    var tempDay=dayjs().format("dddd[,] MMMM D[th]");
    if (currentDate!=tempDay){
      currentDate=tempDay;
      updateDay();
    }
  }
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

  function updateHour(){
    // if the current hour is after the max hour, apply past to all of them
    if(currentHour>maxHour){
      // applies it to all direct children of the table of hours, so each row
      hourContainerEl.children().children(".description").addClass("past");
      return;
    }
    // if the current hour is before the starting hour, apply future to all of them 
    if(currentHour<minHour){
      hourContainerEl.children().children(".description").addClass("future");
      return;
    }
    // the current hour is in the range, so loop over the before and the after, and apply present to the current
    // if the current hour is the first or last hour in the range, it doesn't enter that for loop, which is fine
    for(let i=minHour; i<currentHour; i++){
      //creates the id to get using the current index
      let currentId="#hour-"+i;
      hourContainerEl.children(currentId).children(".description").addClass("past");
    }
    hourContainerEl.children("#hour-"+currentHour).children(".description").addClass("present");
    for(let j=currentHour+1; j<=maxHour; j++){
      let currentId="#hour-"+j;
      hourContainerEl.children(currentId).children(".description").addClass("future");
    }
  }

  function getEvents(){
    // loops over all the hours
    for(let i=minHour; i<=maxHour; i++){
      // the key uses the same format as the id for the rows for convenience
      let currentKey="#hour-"+i;
      let currentText=localStorage.getItem(currentKey);
      // doesn't enter if there was no event stored, as currentText would be null
      if(currentText){
        // finds the proper row, and the textfield within that row, and puts the text of the event there
        hourContainerEl.children(currentKey).children(".description").val(currentText.trim());
      }
    }
  }

  //called if a day has passed, so let the user know if they need to clear or change any events in the calendar
  function updateDay(){
    //updates the date
    dayEl.text(currentDate);
    //puts the current day in local storage
    localStorage.setItem("date", currentDate);
    //alerts the user that the day has changed
    displayEl.text("Day has changed, so you may want to update some events.");
  }

  function buttonClick(event){
    // gets the current row, the parent of the button that was clicked
    let currentRow = $(event.target).parent();
    //if the icon was clicked, we need to go up another parent
    if(currentRow.hasClass("saveBtn")){
      currentRow=currentRow.parent();
    }
    // gets the id of the current row to store the text
    let currentId = "#"+currentRow.attr("id");
    // gets the text in the textarea
    let eventText = currentRow.children(".description").val().trim();
    // gets the old text to determine what message to display
    let oldText=localStorage.getItem(currentId);
    // saves the event to local storage with key equal to the id
    localStorage.setItem(currentId, eventText);
    // displays a message based on whether the new event is empty or not
    if(eventText!=""){
      if(!oldText || oldText!=eventText){
        // the previously stored event did not exist or had different text, so the event was changed
        displayEl.text("Saved the event to local storage!");
      } else {
        // the event is identical to what was already there
        displayEl.text("The event was already saved.");
      }
    } else {
      // the new event is empty, so if there was a saved event, say it was removed
      if(oldText && oldText!=""){
        displayEl.text("Removed the event!");
      }
    }
    // update times in case the hour or day has changed
    getTime();
  }

  addHours();
  updateHour();
  getEvents();
  getTime();
  hourContainerEl.on("click", ".saveBtn", buttonClick);
});
