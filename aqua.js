fetch("http://aquatrackapi.ir.lan/aqr/")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error(error));