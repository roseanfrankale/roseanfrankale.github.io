$(document).ready(function() {


    if ($(this).scrollTop() > 50) {
        $('#btn-back-to-top').fadeIn();
    } else {
        $('#btn-back-to-top').fadeOut();
    }
});

// scroll body to 0px on click
$('#btn-back-to-top').click(function () {
    $('body,html').animate({
        scrollTop: 0,
        behavior: 'smooth'
    }, 1100 );
    return false;
});


//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}









