function isNumberKey(evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}

function validateDate{
    var today = new Date().toISOString().split('T')[o];
    document.getElementById("date-input").setAttribute("max",today);
}