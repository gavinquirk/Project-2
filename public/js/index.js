$(document).ready(function () {
 

  // getPosts();

  var catArr = [

    {
      name: "General Tools",
      image: "./images/generaltools.png",
      description: "Enter text here",
    },
    {
      name: "Teaching Resources",
      image: "./images/teachingresources.png",
      description: "Enter text here",
    },
    {
      name: "CSS",
      image: "./images/css.png",
      description: "Enter text here",
    },
    {
      name: "Testing",
      image: "./images/testing.png",
      description: "Enter text here",
    },
    {
      name: "JavaScript",
      image: "./images/javascript.png",
      description: "Enter text here",
    },
    {
      name: "APIs",
      image: "./images/api.png",
      description: "Enter text here",
    },
    {
      name: "Databases",
      image: "./images/databases.png",
      description: "Enter text here",
    },
    {
      name: "NPM Packages",
      image: "./images/npmpackages.png",
      description: "Enter text here",
    },
    {
      name: "Templates",
      image: "./images/templates.png",
      description: "Enter text here",
    },
    {
      name: "Common Issues",
      image: "./images/commonissues.png",
      description: "Enter text here",
    },
    {
      name: "Job Resources",
      image: "./images/jobresources.png",
      description: "Enter text here",
    },
    {
      name: "HTML",
      image: "./images/html.png",
      description: "Enter text here",
    },
    {
      name: "Random",
      image: "./images/random.png",
      description: "Enter text here",
    },
    {
      name: "Podcasts",
      image: "./images/podcasts.png",
      description: "Enter text here",
    },
    {
      name: "Slack Submissions",
      image: "./images/slacksubmissions.png",
      description: "Enter text here",
    },
    {
      name: "Text Submissions",
      image: "./images/textsubmissions.png",
      description: "Enter text here",
    }
  ]


  for (i = 0; i < catArr.length; i++) {
    var name = catArr[i].name;
    var image = catArr[i].image;
    var description = catArr[i].description;

  //   $('#catCard').append(`
  //         <div class="col-md-3">
  //         <div class="card mb-4 box-shadow">
  //           <img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]"
  //             style="height: 75px; width: 100%; display: block;" src=${image} data-holder-rendered="true">
  //           <div class="card-body">
  //             <h4 class = "text-center">${name}</h4>
  //             <p class="card-text"></p>
  //             <div class="d-flex justify-content-between align-items-center">
  //               <div class="btn-group">
  //                 <button type="button" class="btn btn-sm btn-outline-secondary name center-block" value="${name}">View</button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>`)

  // }



$('#catCard').append(`
<div class="col-md-3">
  <div>
    <a href="#">
      <img class="name" src="${image}" alt="image" style="width:100%" data-name="${name}">
    </a>
  </div>
</div>`)
}


  // blogContainer holds all of our posts
  var blogContainer = $(".blog-container");
  // var postCategorySelect = $("#category"); -- old code related to dropdown
  var postCategorySel = $(".name");

  var newPostCategory

  // Click events for the upvote and downvote buttons
  $(document).on("click", "button.upBtn", handlePostUpvote);
  $(document).on("click", "button.downVote", handlePostDownVote);


  // postCategorySelect.on("change", handleCategoryChange); -- old code related to dropdown
  postCategorySel.on("click", handleCategoryChange2);

  // $(document).on("click", ".name", handleCategoryChange2);
 
  var post;

  // This function grabs posts from the database and updates the view
  function getPosts(category) {
    var categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/posts" + categoryString, function (data) {
      post = data;
      if (!post || !post.length) {
        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to downVote posts
  function downVotePost(id, category) {
    $.ajax({
      method: "PUT",
      url: "/api/posts/down/" + id
    })
      .then(function () {
        getPosts(category)
      });
  }  

  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    var postsToAdd = [];
    var reversePoststoAdd
    for (var i = 0; i < post.length; i++) {
      postsToAdd.push(createNewRow(post[i]));
    }
    reversePoststoAdd = postsToAdd.reverse()
    blogContainer.append(reversePoststoAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post) {
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header bg-light");
    var downVoteBtn = $("<button>");
    downVoteBtn.text("Down");
    downVoteBtn.addClass("downVote "+post.category+" btn btn-danger");
    $('#downVoteBtn').on('click', function () {
      Post.newVoteCount--
    })
    downVoteBtn.attr("id", "down");

    var newVoteCount = $("<span>")
    newVoteCount.text(post.voteCount)
    newVoteCount.css({
      float: "right",
      "clear": "both"
    })

    // Upvote Button Creation
    var upBtn = $("<button>");
    upBtn.text("Up");
    upBtn.addClass("upBtn "+post.category+" btn btn-default btn-outline-success");

    // JEREMY WORK
    // COMMENTED OUT DUMMY editBtn FOR CLEANING UP REDUNDANT CODE
    // Added attribute id 'voteCounter' to newVoteCount
    // newVoteCount.attr('id', 'voteCounter');
    // var editBtn = $("<button>");
    // editBtn.text("Upvote");
    // editBtn.addClass("edit btn btn-default btn-outline-success");
    // END JEREMY WORK


    var newPostTitle = $("<h2>");
    var newPostDate = $("<small>");
    var newPostCategory = $("<h5>");
    var newPostLink = $("<a target='_blank' href=" + post.link + ">")
    newPostLink.text(post.link)
    newPostCategory.text(post.category);
    newPostCategory.css({
      float: "left",
      "font-weight": "700",
      "margin-top":
        "-5px",
      "color": "blue"
    });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<p>");
    var newPostAuthor = $("<span>")
    newPostAuthor.text("   - posted by: " + post.author)
    newPostAuthor.css({
      "font-style": "italic",
      "font-weight": "strong"
    })
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.description);
    var formattedDate = new Date(post.createdAt);
    // Changes in time/date .utcOffset(-8)
    formattedDate = moment(post.createdAt).format("ddd, MMM Do YYYY");
    newPostDate.text(formattedDate);
    newPostDate.css({
      float: "right",
      "font-weight": "100",
      "margin-top":
        "20px"
    });

    newPostTitle.append(newPostDate);
    newPostCardHeading.append(upBtn);
    newPostCardHeading.append(downVoteBtn);
    newPostCardHeading.append(newVoteCount)
    newPostCardHeading.append(newPostTitle);
    newPostCardHeading.append(newPostCategory);
    newPostCardBody.append(newPostBody);
    newPostCardBody.append(newPostLink);
    newPostCardBody.append(newPostAuthor);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("post", post);
    return newPostCard;
  }


  // This function figures out which post we want to downvote and then calls downvote
  function handlePostDownVote() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    downVotePost(currentPost.id, currentPost.category);
  }


  // This function finds id of the voted post, and calls the put request function
  function handlePostUpvote() { 
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    upVotePost(currentPost.id, currentPost.category)
  }

  // This function does an API call to upvote post
  function upVotePost(id, category) {
    $.ajax({
      method: "PUT",
      url: "/api/posts/up/" + id
    })
      .then(function () {
        getPosts(category)
      })
  }

  // This function displays a message when there are no posts
  function displayEmpty() {
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px","color":"gray" });
    messageH2.html('No posts yet for this category. Click "Add Post" at top of page');
    blogContainer.append(messageH2);
  }

  // This function handles reloading new posts when the category changes
  function handleCategoryChange2(event) {
    event.preventDefault()

    // var newPostCategory = $(this).val();
    var newPostCategory = $(this).attr("data-name");
    console.log("new post category = " + newPostCategory)
    getPosts(newPostCategory);
    // console.log("new post category = " + newPostCategory)

  }


// JEREMY WORK BELOW 
// PUT CLOSING TAG ON LINE 361 TO RESOLVE LINTING ERROR

  // Scroll to function. When card button is clicked, go to div associated with the .blog-container class. 
  $(".name").click(function () {
    $('.blog-container').css('margin', '5% 0')
    $('html,body').animate({
      scrollTop: $(".blog-container").offset().top -100
    },
      'slow');
  });
    // temporary sms alert function, not working yet
    // $(".sms-alert").click(function(){
    //   $(".alert").alert('close')
    // })  
});

// });

