(function () {


  $(document).ready(function () {
    //rewrite tihs pls!
    const id = $('#account').attr('student');
    $(':button.add-accounts').click((e) => {
      $('#account').val((index, value) => {
        $.ajax({
          method: 'POST',
          url: `http://localhost:8000/students/${id}/payment`,
          data: { value }
        })
        .done(function (student) {
          $('#myModal').modal('toggle');
          const htmlString = $('h4.account').html().replace(/\d+/, student.account);
          $('h4.account').html(htmlString);
        });
      })
    })

  })

  $('.present').click(function() {
    const id = $(this).data('student');
    const collaboration = window.location.pathname.split('lessons/')[0];
    console.log(collaboration);
    console.log('student', id)

    const value = $(this).prop('checked');

    $.ajax({
      method: 'PATCH',
      url: `http://localhost:8000/collaborations/${collaboration}`,
      data: { student: id, value }
    })
    .done(function (student) {
      console.log('super')
    });
  })
  $(".clickable-row").click(function () {
    window.location = $(this).data("href");
  });
})()