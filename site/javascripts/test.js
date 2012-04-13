$(function() {
  var view = {
    $el: $("#posts"),
    tmpl: $("#post").html(),
    init: function() {
      this.$el.find("header").after(selleck(this.tmpl, posts, { remove_empty_els: true }));
    }
  };

  var posts = [{
    id: 1,
    title: "Save the Pandas",
    post_date: "2011-08-15",
    author: "Shane Riley",
    content: "My money's in that office, right? If she start giving me some bullshit about it ain't there, and we got to go someplace else and get it, I'm gonna shoot you in the head then and there. Then I'm gonna shoot that bitch in the kneecaps, find out where my goddamn money is. She gonna tell me too. Hey, look at me when I'm talking to you, motherfucker. You listen: we go in there, and that nigga Winston or anybody else is in there, you the first motherfucker to get shot. You understand?",
    tags: ["pandas", "sad"]
  }, {
    id: 2,
    title: "Don't Save the Chickens",
    post_date: "2012-04-01",
    author: "Tom Selleck",
    content: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass."
  }];

  view.init();
});
