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
				'targets'       : [1,2]
			},
		]

	});

	$("input:text:visible:first").focus();

	$('#addBtn').on('click', function (e) {
		var scrollX = window.scrollX;
		var scrollY = window.scrollY;
		if ($('#addCategoryFrm').isValid() ) {
			$.ajax({
				method: "POST",
				url: "/addcategory",
				data: {name:  $('#add-name-tf').val(), },
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

	$('#editBtn').on('click', function (e) {
		var scrollX = window.scrollX;
		var scrollY = window.scrollY;
		if ($('#editCategoryFrm').isValid() ) {

			$.ajax({
				method: "POST",
				url: "/updatecategory",
				data: {id: $('#categoryId').val(), name:  $('#edit-name-tf').val(), },
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
	$('#name-tf').focus();

	$('.card .material-datatables label').addClass('form-group');

});

function setEditCategory(obj){
	var id = $(obj).data('id');
	$.ajax({
		method: "GET",
		url: "/fetchcategorydata",
		data: { id:  id },
	}).done(function( data ) {
		$('#categoryId').val(id);
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