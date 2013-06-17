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
	
	
	var imageObj = new Image();
    imageObj.onload = function() {
	    drawImage(this);
   	};
    imageObj.src = 'images/egg1.png';
	
}

function drawImage(imageObj) { 

        var stage = new Kinetic.Stage({
          container: "container",
          width: 2048,
          height: 1000
        });
        var layer = new Kinetic.Layer();
        // darth vader
        var darthVaderImg = new Kinetic.Image({
          image: imageObj,
          x: stage.getWidth() / 2 - 200 / 2,
          y: stage.getHeight() / 2 - 137 / 2,
          width: 150,
          height: 150,
          draggable: true
        });
        // add cursor styling
        darthVaderImg.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
        });
        darthVaderImg.on('mouseout', function() {
          document.body.style.cursor = 'default';
        });

        layer.add(darthVaderImg);
        stage.add(layer);
      }