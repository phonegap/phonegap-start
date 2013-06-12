var DetailView = function (employee) {
	
	this.initialize = function () {
		$.ajax({
			url:"views/detail.html", // relative path to www folder
			type:"get",
			contentType:"application/text",
			context:this,
			success: function(text){
				
				$("body").html(text);
				
				// rendering
				$('.detail_name').html(employee.firstName + " " + employee.lastName);
				$('.detail_title').html(employee.title);
				
				$('.detail_office_phone').html("<a href='tel:"+employee.officePhone+"'>Call Office<br/>"+employee.officePhone+"</a>");
				$('.detail_cell_phone').html("<a href='tel:"+employee.cellPhone+"'>Call Cell<br/>"+employee.cellPhone+"</a>");
				$('.detail_cell_phone2').html("<a href='sms:"+employee.cellPhone+"'>SMS<br/>"+employee.cellPhone+"</a>");
				
				$('.detail_image').attr("src", "images/"+employee.firstName+"_"+employee.lastName+".jpg");
				
			}
		});
		

		
		
	};
	
	this.initialize();
}