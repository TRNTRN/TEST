$(document).ready(function() {
    $("#submit").click(function(){
		if ($("#username").val() == "") {
            alert("Please enter username");
            return false;
        }
        if ($("#password").val() == "") {
            alert("Please enter password");
            return false;
		}
	});
});