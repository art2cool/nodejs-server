(function () {
  const host = window.location.host;
  console.log(host)
  $(document).ready(function () {
    //rewrite tihs pls!
    const id = $('#account').attr('student');
    $(':button.add-accounts').click((e) => {
      $('#account').val((index, value) => {
        $.ajax({
          method: 'POST',
          url: `http://${host}/students/${id}/payment`,
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

  $('#save').click(function () {
    const collaboration = window.location.pathname.split('/lessons/').pop();
    const clas = window.location.pathname.split('/lessons/').shift();
    const body = [];
    $('.present').each((i, val) => {
      const present = $(val).prop('checked');
      const id = $(val).data('student');
     body.push({id, present});
    })
    $.ajax({
      method: 'PATCH',
      url: `http://${host}/collaborations/${collaboration}`,
      data: { students: JSON.stringify(body) }
    })
      .done(function (student) {
        window.location.href = clas;
      });
  })

  $('#remove').click(function () {
    const conf = confirm('Do you realy what to remove this lesson?');
    if (!conf) return;
    const link = $(this).data('info');

    $.ajax({
      method: 'DELETE',
      url: `http://${host}/${link}`,
    })
      .done(function (respose) {
        const clas = respose.coll.class;
        window.location.href = `http://${host}/classes/${clas}`;
      });
  })

  $(".clickable-row").click(function () {
    window.location.href = $(this).data("href");
  });

})();