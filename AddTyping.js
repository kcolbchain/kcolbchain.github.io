if(typeof($add)=="undefined")var $add={version:{},auto:{disabled:false}};Math.__proto__.randInt=function(a,b){return Math.floor(Math.random()*(b-a+1))+a};
(function($){
  $add.version.Typing = "1.0.0";
  $add.Typing = function(selector, settings){
    var r = $(selector).map(function(i, el){
      var $el = $(el);
      var phrases = $el.children().map(function(i,child){
        return $(child).text();
      }).toArray();

      var o = new $add.Typing.Obj(phrases, $el.data());
      o.render($el, "replace");
      return o;
    })
    return (r.length==0)?null:(r.length==1)?r[0]:r;
  };
  $add.Typing.Obj = Obj.create(function(phrases, settings){
    this.defSettings({
      speed: 350,
      variance: 100,
      backspace: true,
      pause: 3000,
      caret: true
    });
    this.defMember("current", "");
    this.defMember("phrases", [], function(newPhrases){
      this.addPhrase(newPhrases);
    });

    this.defMethod("addPhrase", function(p){
      if(p instanceof Array){
        for(var i=0; i<p.length; i++){
          this.addPhrase(p[i]);
        }
        return;
      }
      this._phrases.push(p);
    });
    this.defMethod("type", function(phrase, callback){
      if(this.current == phrase){
        if(callback)callback();
        return;
      }
      var self = this;
      setTimeout(function(){
        self.current += phrase[self.current.length];
        self.type(phrase, callback);
      }, Math.max(16, this.settings.speed + Math.min(Math.randInt( -(self.settings.variance), self.settings.variance ), 16) ) );
    });
    this.defMethod("backspace", function(callback){
      if(this.current == ""){
        if(callback)callback();
        return;
      }
      var self = this;
      this.current = this.current.slice(0, -1);
      setTimeout(function(){
        self.backspace(callback);
      }, Math.max(16, (this.settings.speed / 2) + Math.randInt( -(self.settings.variance), self.settings.variance ) ) );
    });
    this.defMethod("display", function(index, callback){
      var self = this;
      var phrase = this.phrases[index];
      this.type(phrase, function(){
        self.refresh("blink");
        setTimeout(function(){
          self.refresh("noblink")
          if(self.settings.backspace){
            self.backspace(function(){
              if(callback)callback();
            });
          } else {
            self.current = "";
            if(callback)callback();
          }
        }, self.settings.pause);
      });
    });

    this.renderer = function(){
      var $typing = $("<span class='addui-Typing'><span class='addui-Typing-text'>"+this.current+"</span></span>");
      if(this.settings.caret){
        $("<span class='addui-Typing-caret'>|</span>").appendTo($typing);
      }
      return $typing;
    };
    this.refresher = function($el, changed){
      if(changed == "current"){
        $el.find(".addui-Typing-text").html(this.current);
      } else if(changed == "blink"){
        $el.find(".addui-Typing-caret").addClass("addui-Typing-blink");
      } else if(changed == "noblink"){
        $el.find(".addui-Typing-caret").removeClass("addui-Typing-blink");
      }
    };

    this.defMethod("init", function(phrases, settings){
      var self = this;
      if(phrases) this.phrases = phrases;
      if(settings) this.settings = settings;

      this.on("render", function(){
        var index = -1;
        function displayNext(){
          index++;
          if(index > self.phrases.length - 1){
            index = 0;
          }
          self.display(index, displayNext);
        }
        displayNext();
      });
    });
    this.init.apply(this, arguments);
  });
  $.fn.addTyping = function(settings){
    $add.Typing(this, settings);
  };
  $add.auto.Typing = function(){
    if(!$add.auto.disabled){
      $("[data-addui=typing]").addTyping();
    }
  };
})(jQuery);
$(function(){for(var k in $add.auto){if(typeof($add.auto[k])=="function"){$add.auto[k]();}}});