(function(){


  $(document).ready(function () {
    $(':button.add-accounts').click((e) => {
      $('#account').val((index, value) => {
        console.log(index, value)
      })
      // $.ajax({
      //   method: "PUT",
      //   url: "http://localhost:8000/students/",
      //   data: { name: "John", location: "Boston" }
      // })
      //   .done(function (msg) {
      //     alert("Data Saved: " + msg);
      //   });
    })
  })
})()