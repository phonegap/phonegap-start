var GroupingGameView = {};


GroupingGameView.initialize = function (employee) {
	View.render("GroupingGameView");


/*	$('.detail_name').html(employee.firstName + " " + employee.lastName);
	$('.detail_title').html(employee.title);
	
	$('.detail_office_phone').html("<a href='tel:"+employee.officePhone+"'>Call Office<br/>"+employee.officePhone+"</a>");
	$('.detail_cell_phone').html("<a href='tel:"+employee.cellPhone+"'>Call Cell<br/>"+employee.cellPhone+"</a>");
	$('.detail_cell_phone2').html("<a href='sms:"+employee.cellPhone+"'>SMS<br/>"+employee.cellPhone+"</a>");
	
	$('.detail_image').attr("src", "images/"+employee.firstName+"_"+employee.lastName+".jpg");*/

	Controller.routeAnchor(".grouping_back", "LoginView", App.store);
	
	
}

