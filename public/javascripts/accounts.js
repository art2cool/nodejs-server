(function(){


  $(document).ready(function () {
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

  $(".clickable-row").click(function () {
    window.location = $(this).data("href");
  });
})()