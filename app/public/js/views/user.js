$(document).ready(function() {
	$('#datatables').DataTable({
		// "pagingType": "full_numbers",
		// "lengthMenu": [
		// 	[10, 25, 50, -1],
		// 	[10, 25, 50, "All"]
		// ],
		responsive: true,
		// language: {
		// 	search: "_INPUT_",
		// 	searchPlaceholder: "Search records",
		// },
		"paging":   false,
		"ordering": false,
		"info":     false,
		'columnDefs' : [     // see https://datatables.net/reference/option/columns.searchable
			{
				'searchable'    : false,
				'targets'       : [1,2,3,4]
			},
		]

	});

	var lv = new LoginValidator();
	// var av = new AccountValidator();
	//var lc = new LoginController();

// main login form //

	$('#userform').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (lv.validateForm() == false){
				return false;
			} 	else{
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/usermanage';
		},
		error : function(e){
			lv.showLoginError('Failure', 'Please check email');
		}
	});

	$("input:text:visible:first").focus();

	// $('#editform').ajaxForm({
	//
	// 	beforeSubmit : function(formData, jqForm, options){
	// 		if ($('#editUserFrm').isValid() ) {
	// 			return false;
	// 		}
	// 	},
	// 	success	: function(responseText, status, xhr, $form){
	// 		if (status == 'success') window.location.href = '/usermanage';
	// 	},
	// 	error : function(e){
	// 		if (e.responseText == 'email-taken'){
	// 			lv.showLoginError('Failure', 'Please check email');
	// 		}
	// 	}
	// });

	//
	$('#editBtn').on('click', function (e) {
		var scrollX = window.scrollX;
		var scrollY = window.scrollY;
		if ($('#editUserFrm').isValid() ) {
			$.ajax({
				method: "POST",
				url: "/updateuser",
				data: {id: $('#userId').val(), email:  $('#edit-email-tf').val(),name:  $('#edit-name-tf').val(), },
				success: function (data, status, xhr) {
					if (data != null) {
						$('#loginResult').html(data.message);
						$('#loginResult').addClass('form-validate-result-success');
						$('#loginResult').removeClass('form-validate-result-error');
						setTimeout(gotoMainPage, 500);
					} else {
						$('#loginResult').html(data.message);
						$('#loginResult').removeClass('form-validate-result-success');
						$('#loginResult').addClass('form-validate-result-error');
					}
					$('#loginResult').show();
				},
				error: function (xhr, status, error) {
					$('#loginResult').html('Error occured, Internal server error!');
					$('#loginResult').removeClass('form-validate-result-success');
					$('#loginResult').addClass('form-validate-result-error');
					$('#loginResult').show();
				}
			});

		}
		e.preventDefault();
		window.scrollTo(scrollX, scrollY);
	});
	$('#email-tf').focus();

	$('.card .material-datatables label').addClass('form-group');

});

function setEditUser(obj){
	var id = $(obj).data('id');
	$.ajax({
		method: "GET",
		url: "/fetchdata",
		data: { id:  id },
	}).done(function( data ) {
		$('#userId').val(id);
		$('#edit-email-tf').val(data['email']);
		$('#edit-name-tf').val(data['name']);
		// $('#editUserFrm').attr('action', '/edituser');
	});
}

function gotoMainPage() {
	$(location).attr('href', $('#mainPageUrl').val());
}
//
// $('#editBtn').on('click', function (e) {
// 	var scrollX = window.scrollX;
// 	var scrollY = window.scrollY;
// 	if ($('#editUserFrm').isValid() ) {
// 		$.ajax({
// 			method: "GET",
// 			url: "/emailcheck",
// 			data: { email:  $('#edit-email-tf').val() },
// 			success: function (data, status, xhr) {
// 				if (data != null) {
// 					$('#loginResult').html(data.message);
// 					$('#loginResult').addClass('form-validate-result-success');
// 					$('#loginResult').removeClass('form-validate-result-error');
// 					setTimeout(gotoMainPage, 500);
// 				} else {
// 					$('#loginResult').html(data.message);
// 					$('#loginResult').removeClass('form-validate-result-success');
// 					$('#loginResult').addClass('form-validate-result-error');
// 				}
// 				$('#loginResult').show();
// 			},
// 			error: function (xhr, status, error) {
// 				$('#loginResult').html('Error occured, Internal server error!');
// 				$('#loginResult').removeClass('form-validate-result-success');
// 				$('#loginResult').addClass('form-validate-result-error');
// 				$('#loginResult').show();
// 			}
// 		});
//
// 	}
// 	e.preventDefault();
// 	window.scrollTo(scrollX, scrollY);
// });