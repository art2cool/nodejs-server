"use strict";$(document).ready(function(){var a=$("#account").attr("student");$(":button.add-accounts").click(function(t){$("#account").val(function(t,o){$.ajax({method:"POST",url:"http://localhost:8000/students/"+a+"/payment",data:{value:o}}).done(function(t){$("#myModal").modal("toggle");var o=$("h4.account").html().replace(/\d+/,t.account);$("h4.account").html(o)})})})}),$("#save").click(function(){var t=window.location.pathname.split("/lessons/").pop(),o=window.location.pathname.split("/lessons/").shift(),c=[];$(".present").each(function(t,o){var a=$(o).prop("checked"),n=$(o).data("student");c.push({id:n,present:a})}),$.ajax({method:"PATCH",url:"http://localhost:8000/collaborations/"+t,data:{students:JSON.stringify(c)}}).done(function(t){window.location.href=o})}),$("#remove").click(function(){if(confirm("Do you realy what to remove this lesson?")){var t=$(this).data("info");$.ajax({method:"DELETE",url:"http://localhost:8000/"+t}).done(function(t){var o=t.coll.class;window.location.href="http://localhost:8000/classes/"+o})}}),$(".clickable-row").click(function(){window.location.href=$(this).data("href")});