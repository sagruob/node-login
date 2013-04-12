
$(document).ready(function(){
	
	var LV = new LoginValidator();
	var LC = new LoginController();

// main login form //

	$('#login-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (LV.validateForm() == false){
				return false;
			} 	else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value:$("input:checkbox:checked").length == 1})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/home';
		},
		error : function(e){
            LV.showLoginError('Login Failure', 'Please check your username and/or password');
		}
	}); 
	$('#user-tf').focus();
	
// login retrieval form via email //
	
	var EV = new EmailValidator();
	
	$('#get-credentials-form').ajaxForm({
		url: '/lost-password',
		beforeSubmit : function(formData, jqForm, options){
			if (EV.validateEmail($('#email-tf').val())){
				EV.hideEmailAlert();
				return true;
			}	else{
				EV.showEmailAlert("<b> Error!</b> Please enter a valid email address");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			EV.showEmailSuccess("Check your email on how to reset your password.");
		},
		error : function(){
			EV.showEmailAlert("Sorry. There was a problem, please try again later.");
		}
	});
	
})
