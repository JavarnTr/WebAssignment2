//AJAX
let proxy = "https://cors-anywhere.herokuapp.com/";
let url = "http://danieldangs.com/itwd6408/json/faqs.json";

//---------------------------------- Home Page ----------------------------------//

//Change service fee depending on whether the user has warranty or not
$("#gridCheck1").change(function () {
    if (this.checked) {
        $("#serviceFee").val("0.00");
    } else {
        $("#serviceFee").val("85.00");
    }
});

//Bond
let courtesyList = [
    { item: "iPhone", bond: 275.0 },
    { item: "otherPhone", bond: 100.0 },
    { item: "charger", bond: 30.0 },
];

let appState = {
    customerType: "customer",
    courtesyPhone: { item: "none", bond: 0 }, //Allow to borrow ONLY 1 phone
    courtesyCharger: { item: "none", bond: 0 }, //Allow to borrow ONLY 1 charger
};

//Click add button event
$("#addBtn").click(function (e) {
    //Prevent all the default functions of the add button
    e.preventDefault();
    //Get the selected item info
    let selectedItemText = $("#itemList").find(":selected").text();
    let selectedItemValue = $("#itemList").find(":selected").val();
    let selectedItemBond = courtesyList.find((foundItem) => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;

    //Append new row to table, check if it exists already
    let newRow = `
		<tr class="newSelectedItem">
			<td>${selectedItemText}</td>
			<td>${selectedItemBond}</td>
		</tr> `;

    if (appState.courtesyPhone.item == "none" && selectedItemValue.toLowerCase().includes("phone")) {
        $("#borrowItems").append(newRow);
        //Update
        appState.courtesyPhone.item = selectedItemValue;
        appState.courtesyPhone.bond = selectedItemBond;
        //Update the bond element
        if ($("#customerType").is(":checked")) {
            $("#bond").val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
        } else {
            $("#bond").val(0);
        }
    } else if (appState.courtesyCharger.item == "none" && selectedItemValue.toLowerCase().includes("charger")) {
        $("#borrowItems").append(newRow);
        //Update
        appState.courtesyCharger.item = selectedItemValue;
        appState.courtesyCharger.bond = selectedItemBond;
        //Update the bond element
        if ($("#customerType").is(":checked")) {
            $("#bond").val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
        } else {
            $("#bond").val(0);
        }
    } else {
        alert("Item already added");
    }
});

//Click remove button event
$("#removeBtn").click(function (e) {
    e.preventDefault();
    //Remove all added rows with the name "newSelectedItem"
    $(".newSelectedItem").remove();

    //Update appstate
    appState.courtesyPhone = { item: "none", bond: 0.0 };
    appState.courtesyCharger = { item: "none", bond: 0.0 };

    $("#bond").val("0.00");
});

//Also remove the items when the form reset button is clicked
$("#resetBtn").click(function (e) {
    //Remove all added rows with the name "newSelectedItem"
    $(".newSelectedItem").remove();

    //Update appstate
    appState.courtesyPhone = { item: "none", bond: 0 };
    appState.courtesyCharger = { item: "none", bond: 0 };
});

$("#customerType").click(function () {
    appState.customerType = "customer";
    $("#bond").val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
});

$("#businessType").click(function () {
    appState.customerType = "business";
    $("#bond").val(0);
});

//Get the current date and set it as the maximum possible value for the purchase date input box.
$("#submitBtn").click(function () {
    var date = new Date();
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    var year = date.getFullYear();

    //Full date in one variable
    var fullDate = year + "-" + month + "-" + day;

    $("#inputPurchase").attr("max", fullDate);

    var end = $("#inputPurchase").val();
    $("#inputRepair").attr("min", end);
    $("#inputRepair").attr("max", fullDate);
});

//Warranty should be disabled if purchase date is greater than 24 months
$("#inputPurchase, #inputRepair").change(function () {
    var date = new Date();
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    var year = date.getFullYear();
    

    //If warranty was purchased, it will have expired after two years. This value is the current date two years ago for comparison with the purchase date.
    var warrantyYear = date.getFullYear() - 2;

    //Both the current date and date two years ago stored as variables
    var fullWarrantyYear = warrantyYear + "-" + month + "-" + day;
    var fullDate = year + "-" + month + "-" + day;

    var end = $("#inputPurchase").val();
    $("#inputRepair").attr("min", end);
    $("#inputRepair").attr("max", fullDate);

    var purchaseDate = $("#inputPurchase").val();

    //If the purchase date was two or more years ago, warranty will no longer be given as an option.
    if (purchaseDate <= fullWarrantyYear) {
        $("#gridCheck1").prop("disabled", true);
        $("#gridCheck1").prop("checked", false);
        $("#serviceFee").val("85.00");
    } else {
        $("#gridCheck1").prop("disabled", false);
    }
});

$(document).ready(function () {
    $("#gridCheck1, #inputPurchase, #customerType, #businessType").change(function () {
        var bondValue = $("#bond").val();
        var serviceValue = $("#serviceFee").val();

        var totalPrice = +bondValue + +serviceValue;
        var fullGST = (totalPrice / 20) * 3;
        var completePrice = +totalPrice + +fullGST;

        $("#inputTotal").val(totalPrice);
        $("#inputGST").val(fullGST);
        $("#inputTotalGST").val(completePrice);
    });

    $("#addBtn, #removeBtn").click(function () {
        var bondValue = $("#bond").val();
        var serviceValue = $("#serviceFee").val();

        var totalPrice = +bondValue + +serviceValue;
        var fullGST = (totalPrice / 20) * 3;
        var completePrice = +totalPrice + +fullGST;

        $("#inputTotal").val(totalPrice);
        $("#inputGST").val(fullGST);
        $("#inputTotalGST").val(completePrice);
    });
});

//---------------------------------- FAQ Page ----------------------------------//

//Get the json data for the FAQ page
//Jquery function "getJSON"
$.getJSON(
    proxy + url, //Send request to the url to get the JSON file
    function (data) {
        $.each(data, function (i, question) {
            //Extract Q&A
            let content = `				
			<div class="col-12 col-md-6 bg-warning border border-dark">
				<h4>${question.question}</h4>
				<p class="">${question.answer}</p>
			</div>
			`;
            //Append question to the list
            $("#questions").append(content);
        });
    } //JSON file returned in "data"
);

//Search box to filter the FAQ
$("#search-box").on("keyup", function () {
    let keywords = $(this).val().toLowerCase();
    //Loop through the Q&A to find what was searched
    //If it contains the keyword, it is shown. Otherwise it is hidden.
    $("#questions div").filter(function () {
        $(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1);
    });
});

//---------------------------------- Extension Page ----------------------------------//

//Hide all content areas by default
$("#content-area-1").hide();
$("#content-area-2").hide();
$("#content-area-3").hide();
$("#content-area-4").hide();
$("#content-area-5").hide();


$(".btn-demo-area button").on("click", function () {
    //Button background color
    $(".btn-demo-area button").css("background-color", "white");

    //Change the color of the selected button to indicate which one is selected.
    $(this).css("background-color", "orange");

    
    $("#content-area-1").hide();
    $("#content-area-2").hide();
    $("#content-area-3").hide();
    $("#content-area-4").hide();
    $("#content-area-5").hide();

    
});

$("#contentBtn1").on("click", function () {
    $("#content-area-1").show(1000);
});

$("#contentBtn2").on("click", function () {
    $("#content-area-2").show(1000);
});

$("#contentBtn3").on("click", function () {
    $("#content-area-3").show(1000);
});

$("#contentBtn4").on("click", function () {
    $("#content-area-4").show(1000);
});

$("#contentBtn5").on("click", function () {
    $("#content-area-5").show(1000);
});

//Get the image from the image upload and display it in a div
//const image_input = document.querySelector("#image-input");
//image_input.addEventListener("change", function() {
  //const reader = new FileReader();
  //reader.addEventListener("load", () => {
    //const uploaded_image = reader.result;
    //document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  //});
  //reader.readAsDataURL(this.files[0]);
//});

var chosenColor = $("#selectColor").val()
$("#extensionHeader1, #extensionHeader2").css("background-color", chosenColor)

$("#selectColor").change(function(){
    var chosenColor = $("#selectColor").val()
	$("#extensionHeader1, #extensionHeader2").css("background-color", chosenColor)
    localStorage.setItem("saveColor", chosenColor)
});

$("#extensionHeader1, #extensionHeader2").css("background-color", localStorage.getItem("saveColor"));
$("#selectColor").val(localStorage.getItem("saveColor"));

//---------------------------------- Repair Page ----------------------------------//

function getData(){
    //Retrieve the values of all the input boxes
    var title = $('#selectTitle').val();
    var firstname = $("#firstName").val();
    var lastname = $("#lastName").val();
    var fullname = (title + " " + firstname + " " + lastname);
    var street = $('#inputStreet').val();
    var suburb = $('#inputSuburb').val();
    var city = $('#inputCity').val();
    var postcode = $('#inputCode').val();
    var fullAddress = (suburb + " " + city + " " + postcode);
    var phone = $('#inputPhone').val();
    var email = $('#inputEmail').val();
    var purchaseDate = $('#inputPurchase').val();
    var repairDate = $('#inputRepair').val();
    var warrantyCheck = $("#gridCheck1").is(':checked');
    var IMEI = $("#inputIMEI").val();
    var phoneMake = $("#selectMake").val();
    var modelNum = $("#inputModel").val();
    var faultCategory = $("#selectFault").val();
    var addDescription = $("#inputDescription").val();
    var bond = $("#bond").val();
    var service = $("#serviceFee").val();
    var total = $("#inputTotal").val();
    var gst = $("#inputGST").val();
    var totalGST = $("#inputTotalGST").val();

    //Get the current time and date
    var invoiceTime = new Date($.now());

    //Generate a random number and insert it into the job number text.
    var randomNumber = Math.floor((Math.random() * 9999) + 999);

    //Save each value to localstorage so that it can be carried over to another page
    localStorage.setItem("nameValue", fullname)
    localStorage.setItem("addressLn1Value", street)
    localStorage.setItem("addressLn2Value", fullAddress)
    localStorage.setItem("phoneNumber", phone)
    localStorage.setItem("emailAddress", email)
    localStorage.setItem("purchaseValue", purchaseDate)
    localStorage.setItem("repairValue", repairDate)
    localStorage.setItem("warrantyValue", warrantyCheck)
    localStorage.setItem("imeiValue", IMEI)
    localStorage.setItem("makeValue", phoneMake)
    localStorage.setItem("modelValue", modelNum)
    localStorage.setItem("faultValue", faultCategory)
    localStorage.setItem("descriptionValue", addDescription)
    localStorage.setItem("bondValue", "$" + bond)
    localStorage.setItem("serviceValue", "$" + service)
    localStorage.setItem("totalValue", "$" + total)
    localStorage.setItem("gstValue", "$" + gst)
    localStorage.setItem("totalGSTValue", "$" + totalGST)   
    localStorage.setItem("timeValue", invoiceTime)
    localStorage.setItem("jobValue", randomNumber) 
}

//Retrieve the stored data and insert it into the allocated spaces on the repair page.
document.getElementById("nameData").innerHTML=localStorage.getItem("nameValue");
document.getElementById("streetData").innerHTML=localStorage.getItem("addressLn1Value");
document.getElementById("addressData").innerHTML=localStorage.getItem("addressLn2Value");
document.getElementById("phoneData").innerHTML=localStorage.getItem("phoneNumber");
document.getElementById("emailData").innerHTML=localStorage.getItem("emailAddress");
document.getElementById("purchaseData").innerHTML=localStorage.getItem("purchaseValue");
document.getElementById("repairData").innerHTML=localStorage.getItem("repairValue");
document.getElementById("warrantyData").innerHTML=localStorage.getItem("warrantyValue");
document.getElementById("imeiData").innerHTML=localStorage.getItem("imeiValue");
document.getElementById("makeData").innerHTML=localStorage.getItem("makeValue");
document.getElementById("modelData").innerHTML=localStorage.getItem("modelValue");
document.getElementById("faultData").innerHTML=localStorage.getItem("faultValue");
document.getElementById("descriptionData").innerHTML=localStorage.getItem("descriptionValue");
document.getElementById("bondData").innerHTML=localStorage.getItem("bondValue");
document.getElementById("serviceData").innerHTML=localStorage.getItem("serviceValue");
document.getElementById("totalData").innerHTML=localStorage.getItem("totalValue");
document.getElementById("gstData").innerHTML=localStorage.getItem("gstValue");
document.getElementById("totalGSTData").innerHTML=localStorage.getItem("totalGSTValue");
document.getElementById("amountDue").innerHTML=localStorage.getItem("totalGSTValue");
document.getElementById("invoiceDate").innerHTML=localStorage.getItem("timeValue");
document.getElementById("jobNum").innerHTML=localStorage.getItem("jobValue");

