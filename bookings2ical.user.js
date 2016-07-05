// ==UserScript==
// @name        Bookings to iCal
// @namespace   http://www.richardgomer.co.uk/connect/
// @description Convert gym bookings into iCal format
// @include     https://sportandwellbeing.soton.ac.uk/Connect/mrmViewMyBookings.aspx
// @include     https://sportandwellbeing.soton.ac.uk/Connect/mrmViewMyBookings.aspx?showOption=1
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// ==/UserScript==

//alert("Hello!");

function monthNameToNumber(monthName) {
    var myDate = new Date(monthName + " 1, 2000");
    var monthDigit = myDate.getMonth();
    return isNaN(monthDigit) ? 0 : "0" + (monthDigit + 1).toString();
}

function getYear(){
  return new Date().getFullYear();
}

function dtstamp(){
  var date = new Date();
  
  return date.getFullYear().toString() + ("0" + date.getMonth()).slice(-2) + ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2) + "";
}

var ical = "BEGIN:VCALENDAR\n" + 
           "VERSION:2.0\n" +
           "PRODID:-//richardgomer/SportRecImport//NONSGML v1.0//EN\n";
    
$('.viewMyBookingsTable tr').each(function(id, row){
    
  if(id < 2) return;
  
  var txtdate = $(row).find("td:nth-of-type(2)").text().trim();
  var txttime = $(row).find("td:nth-of-type(3)").text().trim();
  var txtname = $(row).find("td:nth-of-type(4)").text().trim();

  var date = txtdate.split(/\ /);
  var dt = "" + getYear() + monthNameToNumber(date[2]) + date[1];
  
  var time = txttime.split(/\-/);
  var start = time[0].trim().replace(/:/, '');
  var end = time[1].trim().replace(/:/, '');
  
  var dtstart = dt + "T" + start + "00";
  var dtend = dt + "T" + end + "00";
      
  var uid = dt + "_" + txtname.replace(/[^a-zA-Z]+/g, '');
  
  ical += "BEGIN:VEVENT" + "\n" +
          "UID:" + uid + "\n" +
          "DTSTAMP:" + dtstamp() + "\n" +
          "DTSTART:" + dtstart + "\n" +
          "DTEND:" + dtend + "\n" +
          "SUMMARY:" + txtname + "\n" +
          "END:VEVENT\n";
  
});

ical += "END:VCALENDAR";

$("h1").append('<a id="dlical" style="margin: 0 0 20px 0; text-decoration: underline;">Download iCal Version</a>');
$('#dlical').attr('href', "data:text/calendar;base64," + window.btoa(ical));
