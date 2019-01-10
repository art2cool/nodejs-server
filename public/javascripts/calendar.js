  $(function() {
    const events = $('#calendar').data('events')
    const resources = $("#calendar").data("resources");
    console.log(events);
    $("#calendar").fullCalendar({
      header: {
        left: "today prev,next",
        center: "title",
        right: "timelineDay,timelineTenDay,timelineMonth"
      },
      defaultView: "timelineTenDay",
      views: {
        timelineDay: {
          buttonText: ":30 slots",
          slotDuration: "00:30"
        },
        timelineTenDay: {
          type: "timeline",
          duration: { days: 10 }
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