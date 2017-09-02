var i = 0,
    browsing = false,
    populate = false,
    error = false;

function ajaxSearch() {
//  $('.outer').append($('<div class="row twitch_row loading">Loading</div>)'));
    var data;
    $.ajax({
      url: "https://wind-bow.glitch.me/twitch-api/streams/featured",
      cache: false,
      async: true, // when using sync, chrome freezes while making request thus causing the 'loading' to never show (because the user cannot scroll down towards the end); firefox automatically deprecate sync to async thus the aforementioned prob does not appear
      timeout: 3000,
      type: "GET",
      dataType: "jsonp", //if use jsonp, the 'done' functions get done before ajaxEnd; if use json, each ajax request ends, and then 'done' functions get performed
      success: function(all_data) {
        console.log("successful request")
        if (all_data === null) {
         console.log("Not found")
        } else {
         data = all_data
         addFiveRows(data);
        }
      },
      error: function( xhr, status, errorThrown ) {
        alert( "Sorry, there was a problem!" );
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
      },
      complete: function( xhr, status ) {
        console.log("complete; status: ", status)
      }
    })
//    .done(function(all_data) {
//       console.dir(all_data)
//       console.log("running done")
//     })
//    addFiveRows(data); when using sync request, this function here will run even though the data isn't returned; to prevent this, this line is moved to the success/done call
}

$(document).ajaxStart(function() {
    console.log("ajax start");
    //browsing = false
  })
  .ajaxStop(function() {
    console.log("ajax end")
    //browsing = true
});

function addFiveRows(data) {
//  $('.outer').append($('<div class="new_rows"></div>'));
//  $('.new_rows').css({"display": "none"});
  for(var j =0; j < 5; j++) {
    if (!$('.list_end').length) {
          var stream = data.featured[i].stream
          var channel = stream.channel
          var name = channel.display_name,
            logo = channel.logo != null ? channel.logo : "https://dummyimage.com/50x50/ecf0e"
                                                         + "7/5c5457.jpg&text=0x3F",
            url = channel.url
          if (stream === null) {
              var status = "offline",
                  desc = "Offline"
            } else {
              var status = "online",
                  desc =  stream.game + ": " + stream.channel.status
            }
          makeRow(name, logo, url, status, desc);
          console.log(name, logo, url, status, desc)
          i += 1
          if (i == data.featured.length) {
            $('.outer').append($('<div class="row twitch_row list_end">End of List</div>)'));
          }
     }
   }
  $('.loading').remove();
  $('.twitch_row').show();
  if (!populateTillScrolling()) {
    console.log("populating")
    ajaxSearch();
  }
  browsing = true
}

function makeRow(name, logo, url, status, desc) {
  console.log("make row")
  $('.outer').append($('\
  <div class="row twitch_row ' + status + '" style="display: none;"> \
    <div class="col-xs-1"> \
      <img src="' + logo +'" class="logo">\
    </div>\
    <div class="col-xs-3 name">\
      <a href="'+ url +'">' + name + '</a>\
    </div>\
    <div class="col-xs-8 streaming">\
     <p>'+ desc + '</p>\
    </div>\
  </div>\
  '))
}

function populateTillScrolling() {
  if (populate || !reachBottom('.twitch_row:last')) {
    populate = true
  }
  return populate
}



function reachBottom(elem) {
    var windowTop, windowBottom, elemTop, elemBottom;
    windowTop = $(window).scrollTop()
    windowBottom = windowTop + $(window).height()
    elemTop = $(elem).offset().top
    elemBottom = elemTop + $(elem).height()
    //console.log("function_reachbottom", windowTop, windowBottom, elemTop, elemBottom, "docu_dimensions", $(document).height())
    return ((elemBottom <= windowBottom) && (elemTop >= windowTop))
}

function timeout() {
  setTimeout(function(){
    //console.log("browsing", browsing)
    console.log("reachbottom", reachBottom('.twitch_row:last'), $('.twitch_row:last').html() )
    timeout();
  },1000);
}

var channels = ["freecodecamp","test_channel","ESL_SC2","ESL_S"];

$(function(){
  $('.outer').append($('<div class="twitch_row row" id="header">Twitch featured streams</div>)'));
  ajaxSearch();
  //timeout();

   $(document).scroll(function(){
     if (browsing == true) {
       if (reachBottom('.twitch_row:last') && !($('.list_end').length)) {
         browsing = false
         $('.outer').append($('<div class="row twitch_row loading">Loading</div>)'));
         ajaxSearch();
       }
     }
   });


})
