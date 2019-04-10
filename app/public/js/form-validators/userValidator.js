
function UserValidator()
{
// bind a simple alert window to this controller to display any errors //
	this.loginErrors = $('.modal-alert');
	
	this.showLoginError = function(t, m)
	{
		$('.modal-alert .modal-header h4').text(t);
		$('.modal-alert .modal-body').html(m);
		this.loginErrors.modal('show');
	}
}

UserValidator.prototype.validateForm = function()
{
	if ($('#edit-email-tf').val() == ''){
		this.showLoginError('Whoops!', 'Please enter a valid email');
		return false;
	}	else if ($('#edit-name-tf').val() == ''){
		this.showLoginError('Whoops!', 'Please enter a valid name');
		return false;
	}	else{
		return true;
	}
}