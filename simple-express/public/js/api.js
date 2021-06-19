//AJAX
$.ajax({
  method: "GET",
  url: "/api/stocks",
  dataType: "json",
})
  .done(function (data) {
    console.log("AJAX");
    console.log(data);
  })
  .fail(function () {
    alert("error");
  })
  .always(function () {});

//AXIOS

(async function () {
  let get = await axios.get("/api/stocks");
    console.log("Axios");
    console.log(get.data);
})();

//FETCH

(async function () {
  let get = await fetch("/api/stocks");
  let json = await get.json();
  console.log("fetch");
  console.log(json);
})();