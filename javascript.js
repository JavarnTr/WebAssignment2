//AJAX
let proxy = 'https://cors-anywhere.herokuapp.com/' ;
let url = 'http://danieldangs.com/itwd6408/json/faqs.json';

//---------------------------------- Home Page ----------------------------------//

//Change service fee depending on whether the user has warranty or not
$("#gridCheck1").change(function() {
	if(this.checked) {
		$("#serviceFee").val("0.00")
	} else {
		$("#serviceFee").val("85.00")
	}
})

//Bond
let courtesyList = [{item: 'iPhone', bond: 275},
	{item: 'otherPhone', bond: 100},
	{item: 'charger', bond: 30}
];

let appState = {customerType: 'customer',
	courtesyPhone: {item: 'none', bond: 0 },//Allow to borrow ONLY 1 phone
	courtesyCharger: {item: 'none', bond: 0}//Allow to borrow ONLY 1 charger
}; 

//Click add button event
$("#addBtn").click(function(e){
	//Prevent all the default functions of the add button
	e.preventDefault();
	//Get the selected item info
	let selectedItemText = $("#itemList").find(":selected").text();
	let selectedItemValue = $("#itemList").find(":selected").val();
	let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;
	
	//Append new row to table, check if it exists already
	let newRow = `
		<tr class="newSelectedItem">
			<td>${selectedItemText}</td>
			<td>${selectedItemBond}</td>
		</tr> `;
	

	if(appState.courtesyPhone.item == "none" && selectedItemValue.toLowerCase().includes("phone")) {
		$('#borrowItems').append(newRow);
		//Update
		appState.courtesyPhone.item = selectedItemValue;
		appState.courtesyPhone.bond = selectedItemBond;
		//Update the bond element
		if($('#customerType').is(":checked")) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0);
		}
	} else if (appState.courtesyCharger.item == "none" && selectedItemValue.toLowerCase().includes("charger")) {
		$('#borrowItems').append(newRow);
		//Update
		appState.courtesyCharger.item = selectedItemValue;
		appState.courtesyCharger.bond = selectedItemBond;
		//Update the bond element
		if($('#customerType').is(":checked")) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0);
		}
	} else {
		alert("Item already added")
	}
});

//Click remove button event
$("#removeBtn").click(function(e){
	e.preventDefault();
	//Remove all added rows with the name "newSelectedItem"
	$('.newSelectedItem').remove();

	//Update appstate
	appState.courtesyPhone = {item: 'none', bond: 0.00};
	appState.courtesyCharger = {item: 'none', bond: 0.00};
});

//Also remove the items when the form reset button is clicked
$("#resetBtn").click(function(e){
	//Remove all added rows with the name "newSelectedItem"
	$('.newSelectedItem').remove();

	//Update appstate
	appState.courtesyPhone = {item: 'none', bond: 0};
	appState.courtesyCharger = {item: 'none', bond: 0};
});

$('#customerType').click(function() {
	appState.customerType = 'customer';
	$("#bond").val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
})

$('#businessType').click(function() {
	appState.customerType = 'business';
	$("#bond").val(0);
})

//Get the current date and set it as the maximum possible value for the purchase date input box.
$('#submitBtn').click(function () {
	var date = new Date();
	var day = date.getDate()>9?date.getDate():"0"+date.getDate();
	var month = (date.getMonth()+1)>9?(date.getMonth()+1):"0"+(date.getMonth()+1);
	var year = date.getFullYear();
	
	//Full date in one variable
	var fullDate = (year + "-" + month + "-" + day)
	
	$("#inputPurchase").attr('max', fullDate);

	var end = $('#inputPurchase').val();
	$("#inputRepair").attr('min', end);
});

//---------------------------------- FAQ Page ----------------------------------//

//Get the json data for the FAQ page
//Jquery function "getJSON"
$.getJSON(
	proxy + url,//Send request to the url to get the JSON file 
	function(data){
		$.each(data, function(i, question){
			//Extract Q&A
			let content = `				
			<div class="col-12 col-md-6 bg-warning border border-dark">
				<h4>${question.question}</h4>
				<p class="">${question.answer}</p>
			</div>
			`;
			//Append question to the list
			$('#questions').append(content);
		});
	}//JSON file returned in "data"
);

//Search box to filter the FAQ
$('#search-box').on('keyup', function(){
	let keywords = $(this).val().toLowerCase();
	//Loop through the Q&A to find what was searched
	//If it contains the keyword, it is shown. Otherwise it is hidden.
	$('#questions div').filter(function(){
		$(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1);
	});
});

//---------------------------------- Extension Page ----------------------------------//

//Accordian menu
$('.content-demo-area div').hide();
//Loop through all buttons
//Hide all content sections and display only the according areas
//Highlight the button 
$('.btn-demo-area button').on('click', function(){
	//Set all button backgrounds to white
	$('.btn-demo-area button').css('background-color', 'white');
	//Change background color
	$(this).css('background-color', 'orange');
	//Hide all content areas
	$('.content-demo-area div').hide();
	//Show only the content area matching to the clicked button
	$('.content-demo-area div').eq($(this).index()).show(1000);
});
