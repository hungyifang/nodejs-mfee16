$.ajax({
  method: "GET",
  url: "/api/stocks",
//   dataType: "json",
})
  .done(function (data) {
    console.log(data);
  })
  .fail(function () {
    alert("error");
  })
  .always(function () {});
