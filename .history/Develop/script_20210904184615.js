$(function () {

    // Local storage key
    const saved_calendar_key = "work-day-scheduler";

    let calendar = {
      savedData : "",
      timeSlots : []
    };

    // Current Day and Time
    let currentDay = moment().format('MMM Do YYYY, h:mm a');
    calendar.savedData = currentDay;

    $("#currentDay").text(currentDay);

    // Save event to local storage
    let savedCalendar = localStorage.getItem(saved_calendar_key);


    if (savedCalendar) {
      let tempCalendar = JSON.parse(savedCalendar);
      if(currentDay === tempCalendar.savedData)
        calendar = tempCalendar;
    }

    // Current Time
    let currentHour = moment().hour();
    
    for (let i = 0; i < 10; i ++) {
        let index = i + 8;
        let timeTense;

        //Time Tense
        //Past Grayed 
        if (moment(index).isBefore(currentHour))
          timeTense = "past";
        //Current Red
        else if (moment(index).isSame(currentHour))
          timeTense = "present";
        //Future Green
        else if (moment(index).isAfter(currentHour))
          timeTense = "future";

        let textContent = "";
        let textIndex = -1;

        //Current Time Text
        if (calendar.timeSlots)
          textIndex= calendar.timeSlots.findIndex(timeSlot => timeSlot.id == index);

        
        if (textIndex >= 0)
          textContent = calendar.timeSlots[textIndex].text;

        // Format Time 
        let time = moment(index, ["HH.mm"]).format("h:mmA");

        // Create Rows
        createDayRow(index, time, timeTense, textContent);
    }

    function createDayRow(index, time, state, textContent)
    {
      let row = $(`<div class="row time">`);
      $(row).append(`<div class="col-1">`);
      $(row).append(`<div class="col-1 hour">${time}</div>`);
      let textField = $(`<textarea class="col-8 ${state} description" id="text-${index}"></textarea>`);
      textField.val(textContent);
      $(row).append(textField);
      $(row).append(`<button class="col-1 btn saveBtn fas fa-save" data-hour="${index}"></button>`);

      $(".container").append(row);
    }

    // Save Button 
    $(".saveBtn").on("click", function(event){
      let hourId = $(this).attr("data-hour");
      let textContents = $(`#text-${hourId}`).val();
      let hourEntry = {
        id : hourId,
        text : textContents
      }

      let located = calendar.timeSlots.findIndex(timeSlot => timeSlot.id == hourId);
    
      if(located >= 0)
        calendar.timeSlots.splice(located, 1);
      
    calendar.timeSlots.push(hourEntry);

      localStorage.setItem(saved_calendar_key, JSON.stringify(calendar));
    });
  });