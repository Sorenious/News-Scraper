// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='scraped-article' data-id='" + data[i]._id + "'><h2>" + data[i].title + "</h2><a href='" + data[i].link + "'>" + data[i].link + "</a><p>" + data[i].summary + "</p></div>");
  }
});


// Whenever someone clicks an article
$(document).on("click", ".scraped-article", function() {
  // Empty the notes from the note section
  $("#add-notes").empty();
  $("#notes-list").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#add-notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#add-notes").append("<input id='titleinput' name='title' placeholder='Title...'>");
      // A textarea to add a new note body
      $("#add-notes").append("<textarea id='bodyinput' name='body' placeholder='Comment...'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#add-notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        for (var i = 0; i < data.note.length; i++) {
          $("#notes-list").append("<div class='note'><h4>" + data.note[i].title + "</h4><button class='delete' data-id='" + data._id + "' note-id='"+ data.note[i]._id +"'>x</button><p>" + data.note[i].body + "</p></div>");
        }
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  if ($("#titleinput").val() && $("#bodyinput").val()){
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        //$("#add-notes").empty();
        $.ajax({
          method: "GET",
          url: "/articles/" + thisId
        })
          // With that done, add the note information to the page
          .then(function(data) {
            
            if (data.note) {
              $("#notes-list").empty();
              for (var i = 0; i < data.note.length; i++) {
                $("#notes-list").append("<div class='note'><h4>" + data.note[i].title + "</h4><button class='delete' data-id='" + data._id + "' note-id='"+ data.note[i]._id +"'>x</button><p>" + data.note[i].body + "</p></div>");
              }
            }
          });
      });
  
  }
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", ".delete", function() {
  // Grab the id associated with the article from the submit button
  var noteId = $(this).attr("note-id");
  var articleId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "DELETE",
    url: "/articles/" + articleId + "/" + noteId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      //$("#add-notes").empty();
      $.ajax({
        method: "GET",
        url: "/articles/" + articleId
      })
        // With that done, add the note information to the page
        .then(function(data) {
          
          if (data.note) {
            $("#notes-list").empty();
            for (var i = 0; i < data.note.length; i++) {
              $("#notes-list").append("<div class='note'><h4>" + data.note[i].title + "</h4><button class='delete' data-id='" + data._id + "' note-id='"+ data.note[i]._id +"'>x</button><p>" + data.note[i].body + "</p></div>");
            }
          }
        });
    });
});
