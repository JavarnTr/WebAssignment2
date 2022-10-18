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

	let courtesyList = [{item: 'iPhone', bond: 275},
		{item: 'otherPhone', bond: 100},
		{item: 'charger', bond: 30}
	];

	let appState = {customerType: 'customer',
		courtesyPhone: {item: 'none', bond: 0 },//Allow to borrow ONLY 1 phone
		courtesyCharger: {item: 'none', bond: 0}//Allow to borrow ONLY 1 charger
 	}; 

	$("#addBtn").click(function(){
		let selectedItemText = $("#itemList").find("selected").text();
		let selectedItemValue = $("#itemList").find("").val();
		let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;
	})

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


