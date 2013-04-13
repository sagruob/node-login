
$(document).ready(function(){
	
	var AV = new AccountValidator();
	var SC = new SignupController();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return AV.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
      console.log("success");
			if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
      console.log("failure");
			if (e.responseText == 'email-taken'){
			    AV.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    AV.showInvalidUserName();
			}
		}
	});
	$('#name-tf').focus();
	
// customize the account signup form //
	
	$('#account-form h1').text('Signup');
	$('#account-form #sub1').text('Please tell us a little about yourself');
	$('#account-form #sub2').text('Please tell us if you self-define into any of the following liberation groups.');
  $('#account-form #sub3').text('Choose your username & password');
	$('#account-form-btn1').html('Cancel');
	$('#account-form-btn2').html('Submit');
	$('#account-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your account has been created.</br>Click OK to return to the login page.');

})
