
$(document).ready(function(){
	
	var RV = new ResetValidator();
	
	$('#set-password-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){;
			RV.hideAlert();
			if (RV.validatePassword($('#pass-tf').val()) == false){
				return false;
			} 	else{
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			RV.showSuccess("Your password has been reset.");
			setTimeout(function(){ window.location.href = '/'; }, 3000);
		},
		error : function(){
			RV.showAlert("I'm sorry something went wrong, please try again.");
		}
	});

	$('#set-password').modal('show');
	$('#set-password').on('shown', function(){ $('#pass-tf').focus(); })

});
