// Generated by CoffeeScript 1.6.3
(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof Backbone !== "undefined" && Backbone !== null) {
    this.DiscussionRouter = (function(_super) {
      __extends(DiscussionRouter, _super);

      function DiscussionRouter() {
        this.hideNewPost = __bind(this.hideNewPost, this);
        this.showNewPost = __bind(this.showNewPost, this);
        this.navigateToAllThreads = __bind(this.navigateToAllThreads, this);
        this.navigateToThread = __bind(this.navigateToThread, this);
        this.setActiveThread = __bind(this.setActiveThread, this);
        _ref = DiscussionRouter.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DiscussionRouter.prototype.routes = {
        "": "allThreads",
        ":forum_name/threads/:thread_id": "showThread"
      };

      DiscussionRouter.prototype.initialize = function(options) {
        var _this = this;
        this.discussion = options['discussion'];
        this.nav = new DiscussionThreadListView({
          collection: this.discussion,
          el: $(".sidebar")
        });
        this.nav.on("thread:selected", this.navigateToThread);
        this.nav.on("thread:removed", this.navigateToAllThreads);
        this.nav.on("threads:rendered", this.setActiveThread);
        this.nav.render();
        this.newPostView = new NewPostView({
          el: $(".new-post-article"),
          collection: this.discussion
        });
        this.nav.on("thread:created", this.navigateToThread);
        this.newPost = $('.new-post-article');
        $('.new-post-btn').bind("click", this.showNewPost);
        $('.new-post-btn').bind("keydown", function(event) {
          return DiscussionUtil.activateOnSpace(event, _this.showNewPost);
        });
        return $('.new-post-cancel').bind("click", this.hideNewPost);
      };

      DiscussionRouter.prototype.allThreads = function() {
        this.nav.updateSidebar();
        return this.nav.goHome();
      };

      DiscussionRouter.prototype.setActiveThread = function() {
        if (this.thread) {
          return this.nav.setActiveThread(this.thread.get("id"));
        } else {
          return this.nav.goHome;
        }
      };

      DiscussionRouter.prototype.showThread = function(forum_name, thread_id) {
        var callback,
          _this = this;
        this.thread = this.discussion.get(thread_id);
        if (!this.thread) {
          callback = function(thread) {
            _this.thread = thread;
            return _this.renderThreadView();
          };
          return this.retrieveSingleThread(forum_name, thread_id, callback);
        } else {
          return this.renderThreadView();
        }
      };

      DiscussionRouter.prototype.renderThreadView = function() {
        var _this = this;
        this.thread.set("unread_comments_count", 0);
        this.thread.set("read", true);
        this.setActiveThread();
        if (this.main) {
          this.main.cleanup();
          this.main.undelegateEvents();
        }
        this.main = new DiscussionThreadView({
          el: $(".discussion-column"),
          model: this.thread
        });
        this.main.render();
        return this.main.on("thread:responses:rendered", function() {
          return _this.nav.updateSidebar();
        });
      };

      DiscussionRouter.prototype.navigateToThread = function(thread_id) {
        var thread;
        thread = this.discussion.get(thread_id);
        return this.navigate("" + (thread.get("commentable_id")) + "/threads/" + thread_id, {
          trigger: true
        });
      };

      DiscussionRouter.prototype.navigateToAllThreads = function() {
        return this.navigate("", {
          trigger: true
        });
      };

      DiscussionRouter.prototype.showNewPost = function(event) {
        this.newPost.slideDown(300);
        return $('.new-post-title').focus();
      };

      DiscussionRouter.prototype.hideNewPost = function(event) {
        return this.newPost.slideUp(300);
      };

      DiscussionRouter.prototype.retrieveSingleThread = function(forum_name, thread_id, callback) {
        var _this = this;
        return DiscussionUtil.safeAjax({
          url: DiscussionUtil.urlFor('retrieve_single_thread', forum_name, thread_id),
          success: function(data, textStatus, xhr) {
            return callback(new Thread(data['content']));
          },
          error: function(xhr) {
            if (xhr.status === 404) {
              DiscussionUtil.discussionAlert(gettext("Sorry"), gettext("The thread you selected has been deleted. Please select another thread."));
            } else {
              DiscussionUtil.discussionAlert(gettext("Sorry"), gettext("We had some trouble loading more responses. Please try again."));
            }
            return _this.allThreads();
          }
        });
      };

      return DiscussionRouter;

    })(Backbone.Router);
  }

}).call(this);
