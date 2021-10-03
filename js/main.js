//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 1000 ||
    document.documentElement.scrollTop > 1000
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
  
};


function scrollFunction() {
  $('#portfolioCollapse1').on('shown.bs.collapse', function (e) {
          $('html,body').animate({
              scrollTop: $('#neubsis_card').offset().top
          }, 100); 
  }); 
});

function scrollFunction() {
  $('#portfolioCollapse1,#card-close').on('hide.bs.collapse', function (e) {
          $('html,body').animate({
              scrollTop: $('#my-projects').offset().top
          }, 100); 
  }); 
});

function scrollFunction() {
  $('#portfolioCollapse2').on('shown.bs.collapse', function (e) {
          $('html,body').animate({
              scrollTop: $('#new_soil_card').offset().top 
          }, 100); 
  }); 
});

function scrollFunction() {
  $('#portfolioCollapse2,#card-close').on('hide.bs.collapse', function (e) {
          $('html,body').animate({
              scrollTop: $('#my-projects').offset().top
          }, 100); 
  }); 
});


function scrollFunction() {
  $('#portfolioCollapse3').on('shown.bs.collapse', function (e) {
          $('html,body').animate({
              scrollTop: $('#neubsis_card').offset().top
          }, 1000); 
  }); 
});

function scrollFunction() {
  $('#portfolioCollapse3,#card-close').on('hide.bs.collapse', function (e) {
          $('html,body').animate({
              scrollTop: $('#my-projects').offset().top
          }, 100); 
  }); 
});







