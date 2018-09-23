  $(function() {
    const events = $('#calendar').data('events')
    console.log(events);
    $('#calendar').fullCalendar({
      header: {
        left: 'title',
        center: '',
        right: 'today week month day list prev,next'
      },
      buttonText: {
        today: 'today',
        month: 'month',
        week: 'week',
        day: 'day',
        list: 'list'
      },
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      events,
      eventClick: function (event, element) {

        event.title = "CLICKED!";

        $('#calendar').fullCalendar('updateEvent', event);

      }
    });

  })