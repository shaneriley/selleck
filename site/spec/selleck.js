$(function() {
  var setup = {
    $dom: $("<div />", { id: "dom" }).appendTo(document.body).hide(),
    tmpl: "<h1>{{heading}}</h1>\
            <p>{{paragraph}}</p>\
            <a href=\"{{href}}\">{{link}}</a>",
    data: {
      heading: "Title",
      paragraph: "Lorem ipsum",
      href: "http://www.google.com",
      link: "Google"
    }
  };
  assert = {
    allPopulated: function(data) {
      var matchProps = function(i, obj) {
        expect(setup.$dom.find("h1").eq(i).text()).toEqual(obj.heading);
        expect(setup.$dom.find("p").eq(i).text()).toEqual(obj.paragraph);
        expect(setup.$dom.find("a").eq(i).attr("href")).toEqual(obj.href);
        expect(setup.$dom.find("a").eq(i).text()).toEqual(obj.link);
      };

      if (data.length) {
        $.each(data, matchProps);
      }
      else { matchProps(0, data); }
    }
  };

  beforeEach(function() {
    this.addMatchers({
      toHave: function(prop) {
        return prop in this.actual;
      },
      toBeVisible: function() {
        return this.actual.is(":visible");
      },
      toBeHidden: function() {
        return this.actual.is(":hidden");
      }
    });
  });

  describe("When I load the page", function() {
    it("should include jQuery", function() {
      expect(window).toHave("$");
    });
    it("should include Selleck", function() {
      expect(window).toHave("selleck");
    });
  });

  describe("When I pass a single object", function() {
    it("I should see all properties rendered", function() {
      var $dom = setup.$dom,
          tmpl = setup.tmpl,
          data = $.extend({}, setup.data);
      $dom.html(selleck(tmpl, data));
      assert.allPopulated(data);
    });
  });

  describe("When I pass an array of objects", function() {
    it("I should see all objects and their properties rendered", function() {
      var $dom = setup.$dom.empty(),
          tmpl = setup.tmpl,
          data = [$.extend({}, setup.data), $.extend({}, setup.data)];
      $dom.html(selleck(tmpl, data));
      expect($dom.find("h1").length).toEqual(2);
      expect($dom.find("a").length).toEqual(2);
      assert.allPopulated(data);
    });
  });

  describe("When I pass an object with a nested array of primitives", function() {
    it("I should see all object properties as well as all array elements rendered", function() {
      var $dom = setup.$dom.empty(),
          tmpl = setup.tmpl,
          data = $.extend({ tags: ["a", "b", "c"] }, setup.data);
      tmpl += "<ul>{{- tags.each do |tag|}}<li>{{tag}}</li>{{- end}}</ul>";
      $dom.html(selleck(tmpl, data));
      expect($dom.find("li").length).toEqual(3);
      assert.allPopulated(data);
      $dom.find("li").each(function(i) {
        expect($dom.find("li").eq(i).text()).toEqual(data.tags[i]);
      });
    });
  });

  describe("When I pass an object with a nested array of objects", function() {
    it("I should see all properties of all objects rendered", function() {
      var $dom = setup.$dom.empty(),
          tmpl = setup.tmpl,
          data = $.extend({
            tags: [{
              text: "a",
              href: "#a"
            }, {
              text: "b",
              href: "#b"
            }, {
              text: "c",
              href: "#c"
            }]
          }, setup.data);
      tmpl += "<ul>\
                {{- tags.each do |tag|}}\
                  <li><a href=\"{{tag.href}}\">{{tag.text}}</a></li>\
                {{- end }}</ul>";
      $dom.html(selleck(tmpl, data));
      expect($dom.find("li").length).toEqual(3);
      $dom.find("li").each(function(i) {
        expect($dom.find("li").eq(i).text()).toEqual(data.tags[i].text);
        expect($dom.find("li").eq(i).find("a").attr("href")).toEqual(data.tags[i].href);
      });
      assert.allPopulated(data);
    });
  });

  describe("When I have property values that begin with $1", function() {
    it("I should see them output properly", function() {
      var $dom = setup.$dom.empty(),
          tmpl = setup.tmpl,
          data = $.extend({ tags: ["$1,000", "$1,500", "$1,800"] }, setup.data);
      tmpl += "<ul>{{- tags.each do |tag|}}<li>{{tag}}</li>{{- end}}</ul>";
      $dom.html(selleck(tmpl, data));
      expect($dom.find("li").length).toEqual(3);
      assert.allPopulated(data);
      $dom.find("li").each(function(i) {
        expect($dom.find("li").eq(i).text()).toEqual(data.tags[i]);
      });
    });
  });

  (function() {
    var jasmine_env = jasmine.getEnv();
    jasmine_env.updateInterval = 1000;

    var trivial_reporter = new jasmine.TrivialReporter();

    jasmine_env.addReporter(trivial_reporter);

    jasmine_env.specFilter = function(spec) {
      return trivial_reporter.specFilter(spec);
    };

    jasmine_env.execute();
  })();
});
