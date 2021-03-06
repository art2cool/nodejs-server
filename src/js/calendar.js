$(function() {
  const events = $('#calendar').data('events')
  const resources = $("#calendar").data("resources");
  const host = window.location.origin;

  $("#calendar").fullCalendar({
    header: {
      left: "today prev,next",
      center: "title",
      right: "listWeek,agendaDay,agendaDay2 month,week,day"
    },
    defaultView: "agendaDay",
    views: {
      listWeek: {
        buttonText: "List View",
        type: "listWeek"
      },
      agendaDay: {
        nowIndicator: true,
        buttonText: "Schedule",
        type: "listWeek"
      },
      agendaDay2: {
        nowIndicator: true,
        duration: { days: 2 },
        buttonText: "Schedule2",
        type: "agenda",
        groupByDateAndResource: true,
      }
    },
    resourceLabelText: "Rooms",
    schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
    resources,
    events,
    eventDrop: function (event, delta, revertFunc) {
      const id = event._id;
      const s = new Date(event.start);
      const e = new Date(event.end);
      const room = event.resourceId;
      $.ajax({
        method: 'PUT',
        contentType: 'application/json',
        url: `${host}/collaborations/${id}`,
        data: JSON.stringify({ since: s, until: e, room })
      }).done(function () {
        $(this).addClass("done");
      }).fail( function() {
        revertFunc()
      })
     },
     
    eventResize: function (event, delta, revertFunc) {
      // connect this two functions
      const id = event._id;
      const s = new Date(event.start);
      const e = new Date(event.end);
      const room = event.resourceId;
      $.ajax({
        method: 'PUT',
        contentType: 'application/json',
        url: `${host}/collaborations/${id}`,
        data: JSON.stringify({ since: s, until: e, room })
      }).done(function () {
        $(this).addClass("done");
      }).fail(function () {
        revertFunc()
      })

    },
    eventClick: function(event, element) {
      event.title = "CLICKED!";
      console.log(event)
   //   $("#calendar").fullCalendar("updateEvent", event);
    },
  });

})
