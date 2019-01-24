  $(function() {
    const events = $('#calendar').data('events')
    const resources = $("#calendar").data("resources");
    console.log(events);
    $("#calendar").fullCalendar({
      header: {
        left: "today prev,next",
        center: "title",
        right: "listWeek,agendaDay month,week,day"
      },
      defaultView: "agendaDay",
      views: {
        listWeek: {
          buttonText: "List View",
          type: "listWeek"
        },
        agendaDay: {
          buttonText: "Schedule",
          type: "listWeek"
        }
      },
      resourceLabelText: "Rooms",
      schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      resources,
      events,
      eventClick: function(event, element) {
        event.title = "CLICKED!";

        $("#calendar").fullCalendar("updateEvent", event);
      }
    });

  })