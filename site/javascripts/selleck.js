function selleck(tmpl, obj, opts) {
  if (!tmpl) { return; }
  opts = $.extend({
    remove_empty_els: false
  }, opts);
  tmpl = tmpl.replace(/\n/g, "");

  var methods = {
    loop: function(tmpl, arr, var_name) {
      var html = "";
      $.each(arr, function(i, val) {
        if (typeof val === "object") {
          html += methods.parse(tmpl, val, var_name + ".");
        }
        else {
          html += tmpl.replace(new RegExp("\\{\\{" + var_name + "\\}\\}", "g"), val.replace("$", "&#36;"));
        }
      });
      return html;
    },
    parse: function(tmpl, obj, chain) {
      var prop_name,
          var_name,
          each_left = "\\{\\{-\\s*",
          each_right = ".+\\}\\}",
          loop_regex,
          loops = (new RegExp(each_left + "(\\w+)\.each" + each_right)).exec(tmpl),
          fragment;
      if (loops && loops.length) { loops.slice(1); }
      chain = chain || "";
      for (var v in obj) {
        if ($.isArray(obj[v])) {
          prop_name = loops[$.inArray(v, loops)];
          if (prop_name) {
            var_name = (new RegExp(each_left + prop_name + "\.each do \\|\(.+\)\\|" + each_right)).exec(tmpl).slice(1).join("");
            loop_regex = new RegExp(each_left + prop_name + ".+\\|" + var_name + "\\|\\s*\\}\\}\(.+\)\\{\\{- end\\}\\}");
            fragment = loop_regex.exec(tmpl).slice(1).join("");
            tmpl = tmpl.replace(loop_regex, methods.loop(fragment, obj[v], var_name));
          }
        }
        else if (typeof obj[v] === "object") {
          tmpl = methods.parse(tmpl, obj[v], chain + v + ".");
        }
        tmpl = tmpl.replace((new RegExp("\\{\\{" + chain + v + "\\}\\}", "g")), obj[v]);
      }
      return tmpl;
    },
    strip: function(html) {
      var $frag = $("<div />", { html: html }),
          regex = /^\{\{.+\}\}$/;
      $frag.find("*").each(function() {
        var $e = $(this);
        if (regex.test($.trim($e.text()))) { $e.remove(); }
      });
      return $frag.html();
    }
  };

  var html = "";
  if ($.isArray(obj)) {
    $.each(obj, function(i, data) {
      html += methods.parse(tmpl, data);
    });
  }
  else { html = methods.parse(tmpl, obj); }
  if (opts.remove_empty_els) { html = methods.strip(html); }
  return html;
}
