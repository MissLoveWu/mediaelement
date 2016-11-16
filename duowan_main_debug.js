define("vduowan/duopai/1.0.0/main-debug", [ "jquery-debug", "./m\\listview-debug", "./m\\adapter-debug", "./m\\util-debug", "./m\\datasource-debug", "./m\\player-debug", "./m\\template-debug", "./m\\comment-debug", "./m\\placeholder-debug", "./m\\commentdata-debug", "./m\\share-debug", "./m\\feedback-debug", "./m\\videosort-debug", "./m\\com-debug" ], function(require) {
    if (!window.console) {
        window.console = {
            log: function(msg) {}
        };
    }
    window.main_main_vid = (_arr = window.location.href.match(/\/(?:pc)?play\/(\d+)\.html/)) ? _arr[1] : "";
    window.phpbase_controller_and_action = (_arr = window.location.href.match(/r=([\w|\/]+)/)) ? _arr[1] : "";
    var $ = require("jquery-debug");
    var ListView = require("./m/listview-debug");
    var Adapter = require("./m/adapter-debug");
    var DataSource = require("./m/datasource-debug");
    var Player = require("./m/player-debug");
    var Template = require("./m/template-debug");
    var Comment = require("./m/comment-debug");
    var Share = require("./m/share-debug");
    var Util = require("./m/util-debug");
    var Feedback = require("./m/feedback-debug");
    var VideoSort = require("./m/videosort-debug");
    var com = require("./m/com-debug");
    var listView = new ListView();
    var dataSource = new DataSource();
    var adapter = new Adapter(Template.videoItemTpl, dataSource);
    var mainView = $("#video-list-wrap");
    var body = $("body");
    var viewedVids = {};
    dataSource.extra.login(function(json) {
        var avatar = json.login_info.avatar ? json.login_info.avatar : "http://att.bbs.duowan.com/avatar/noavatar_small.jpg";
        $(".user_avatar").attr("src", avatar);
    });
    require.async("mediaelement-debug", function() {
        Player.init(MediaElementPlayer, dataSource);
        listView.on("show", function(position, view) {
            var _player = new Player(position, view);
            _player.play();
            if ("__clientControlsInf" in window) {
                window.__clientControlsInf.pushNewPlayer(position, _player);
            }
            delete _player;
            dataSource.extra.setHistory(view.data("vid"), function() {});
            var vid = view.data("vid");
            var title = view.find(".video-title").text();
            var cover = view.data("cover");
            Share.init(vid, title, cover);
            if (viewedVids["vid_" + vid]) return;
            viewedVids["vid_" + vid] = 1;
            dataSource.reportData.video.loadNum(vid, title, position);
            dataSource.reportData.video.playNum(vid, title, position);
            dataSource.reportData.ya(Util.cookie.get("duopai_uid"), window.location.href, $("#position_" + position).data("channel"), vid);
            var comment = new Comment(vid, title, position, view);
            comment.init();
        });
        listView.on("hold", function(position, view) {
            var _player = new Player(position, view);
            _player.pause();
            delete _player;
        });
        listView.on("remove", function(position, view) {
            var _player = new Player(position, view);
            _player.remove();
            delete _player;
        });
        listView.setAdapter(adapter, mainView);
        bind(dataSource);
    });
    function bind(dataSource) {
        Feedback.init(dataSource);
        VideoSort.init(dataSource);
        body.on("click", ".video-zan", function(event) {
            event.preventDefault();
            var _thisObj = $(this);
            var num = _thisObj.data("num");
            var _siblingsObj = _thisObj.siblings(".video-cai");
            //用户已经点踩，再点赞的情况
            if (_siblingsObj.hasClass("video-caied")) {
                //取消点踩
                _siblingsObj.removeClass("video-caied");
                _silings_num = _siblingsObj.data("num") - 1 + 0;
                _siblingsObj.html("<i></i>" + _silings_num + "踩");
                _siblingsObj.data("num", _silings_num);
            }
            dataSource.reportData.zan(_thisObj.data("vid"), function(json) {
                if (json.result == true) {
                    num = num + 1 - 0;
                    _thisObj.data("num", num);
                    _thisObj.addClass("video-zaned");
                    _thisObj.html("<i></i>" + num + "赞");
                } else {
                    popFun("你已点过赞了哦！");
                }
            });
        });
        body.on("click", ".video-cai", function(event) {
            event.preventDefault();
            var _thisObj = $(this);
            var num = _thisObj.data("num");
            var _siblingsObj = _thisObj.siblings(".video-zan");
            //用户已经点赞，再点踩
            if (_siblingsObj.hasClass("video-zaned")) {
                //取消点踩
                _siblingsObj.removeClass("video-zaned");
                _silings_num = _siblingsObj.data("num") - 1 + 0;
                _siblingsObj.html("<i></i>" + _silings_num + "赞");
                _siblingsObj.data("num", _silings_num);
            }
            dataSource.reportData.cai(_thisObj.data("vid"), function(json) {
                if (json.result == true) {
                    num = num + 1 - 0;
                    _thisObj.data("num", num);
                    _thisObj.addClass("video-caied");
                    _thisObj.html("<i></i>" + num + "踩");
                } else {
                    popFun("你已经踩过了哦！");
                }
            });
        });
        body.on("click", ".video-comment-blank", function(event) {
            //阻止所有视频播放
            var aVideos = $("video");
            for (var i = 0, len = aVideos.length; i < len; i++) {
                aVideos[i].pause();
            }
        });
        body.on("click", ".contact-submit", function(event) {
            event.preventDefault();
            var _thisObj = $(this);
            var data = {};
            data.type = $("#contact-type").val();
            data.type_value = $("#contact-value").val();
            data.content = $("#contact-content").val();
            if (!data.content) {
                return;
            }
            dataSource.extra.contact(data, function(json) {
                alert("感谢您的反馈！");
                $("#pop-close").click();
            });
        });
        body.on("click", ".subs-btn-off", function(json) {
            dataSource.reportData.f;
        });
        mainView.on("mouseenter", ".video-share", function(event) {
            event.preventDefault();
            $(this).find(".ic-share").show();
        });
        mainView.on("mouseleave", ".video-share", function(event) {
            event.preventDefault();
            $(this).find(".ic-share").hide();
        });
        mainView.on("mouseenter", ".video-comment", function(event) {
            listView.commentStatus = 1;
            event.preventDefault();
            $(this).find(".comment-area").removeClass("hide");
        });
        mainView.on("click", ".mejs-video video", function(event) {
            if ($(this).get(0).paused) {
                var video_id = $(this).attr("id").substr(6);
                listView.pausePosition = video_id;
            }
        });
        var beginTime = new Date().getTime();
        $(window).on("beforeunload", function(e) {
            var endTime = new Date().getTime();
            var stayTime = endTime - beginTime;
        });
        var scrollList = $(window);
        scrollList.scroll(function() {
            var t = scrollList.scrollTop();
            var h = scrollList.height();
            $("#scroll-btn").fadeIn(200).css("top", t + h - 180);
            if (t > 0) {
                $(".comment-sort").css("top", t + 88);
            }
            if (Util.cookie.get("show_comment") == 1) {
                var current_comment_wrap = $("#position_" + listView.curPosition).find(".video-comment__wrap");
                if (true != current_comment_wrap.hasClass("has_off")) {
                    current_comment_wrap.fadeIn(500).removeClass("off").parent().siblings().find(".video-comment__wrap").fadeOut(800).addClass("off");
                    $("#position_" + listView.curPosition).find(".video-comment").removeClass("off").closest(".video-list").siblings().find(".video-comment").addClass("off");
                }
            }
        });
        $(document).on("ready", function() {
            var t = scrollList.scrollTop();
            var h = scrollList.height();
            $("#scroll-btn").fadeIn(200).css("top", t + h - 180);
        });
        $("#scroll-btn").css("cursor", "pointer").on("click", function() {
            var item = listView.getItemView(listView.curPosition);
            if (null == item) {
                return;
            }
            var itemTop = item.offset().top;
            var itemHeight = item.height();
            var _top = itemTop + itemHeight - 75;
            $("html,body").animate({
                scrollTop: _top
            }, 200);
        });
        $("#feedback").on("click", function() {
            $("#pop-bg,#pop").show();
        });
        $("#pop-close").on("click", function() {
            $("#pop-bg,#pop").hide();
        });
    }
});

define("vduowan/duopai/1.0.0/m/listview-debug", [ "jquery-debug" ], function(require, exports) {
    var $ = require("jquery-debug");
    function ListView() {
        this.adapter = null;
        this.mainView = null;
        this.curPosition = -1;
        this.upLimitCount = 1;
        this.downLimitCount = 1;
        this.lastScrollTop = -1;
        this.scrollLocked = false;
        this.isFullScreen = false;
        this.commentStatus = 0;
        this.pausePosition = null;
        this.eventMap = {};
        this.showItemLock = false;
    }
    ListView.prototype = {
        setAdapter: function(adapter, mainView) {
            this.adapter = adapter;
            this.mainView = mainView;
            this.bind();
        },
        bind: function() {
            var that = this;
            that.onScroll.call(that, 0);
            $(window).focus(function() {
                if (phpbase_controller_and_action != "client/pcplay" && phpbase_controller_and_action != "client/pcindex") {
                    setTimeout(function() {
                        that.showItem(that.curPosition);
                    }, 10);
                }
            });
            $(window).on("scroll", function() {
                setTimeout(function() {
                    that.onScroll.call(that, 10);
                }, 0);
            });
            //fix ie6-10        
            $(document).on("click", ".mejs-fullscreen-button", function() {
                that.isFullScreen = !that.isFullScreen;
            });
            //fix ie6-10 end
            //"esc" key
            $(document).keydown(function(event) {
                if (27 == event.keyCode) {
                    that.isFullScreen = false;
                }
            });
        },
        getItemView: function(position) {
            var view = this.mainView.find("#position_" + position);
            return view.length > 0 ? view : null;
        },
        getItem: function(position, callback) {
            var that = this, convertView = this.getItemView(position);
            that.adapter.getView(position, convertView, function(view) {
                if (null == convertView) {
                    that.insertItem(position, view);
                    view = that.getItemView(position);
                }
                callback.call(that, position, view);
            });
        },
        //当前显示
        showItem: function(position) {
            if (this.showItemLock == true) {
                return;
            }
            this.showItemLock = true;
            this.getItem(position, function(position, view) {
                try {
                    this.emit("show", [ position, view ]);
                    this.removeItems(position);
                    this.holdItems(position);
                } catch (e) {
                    console.log(e);
                }
                this.showItemLock = false;
            });
        },
        // 显示屏幕当前视频
        showCurrentItem: function() {
            //Show Current Video;
            var scrollTop = $(document).scrollTop();
            var scrollBottom = scrollTop + $(window).height();
            var position = this.calcCurrentItem(scrollTop, scrollBottom);
            if (position != this.pausePosition) {
                this.showItem(position);
            }
        },
        holdItem: function(position) {
            this.getItem(position, function(position, view) {
                this.emit("hold", [ position, view ]);
            });
        },
        removeItem: function(position) {
            var view = this.getItemView(position);
            if (null != view) {
                this.emit("remove", [ position, view ]);
            }
        },
        getHoldPositions: function(position) {
            var positions = [];
            for (var i = 1; i <= this.upLimitCount && position - i >= 0; i++) {
                positions.push(position - i);
            }
            for (var i = 1; i <= this.downLimitCount; i++) {
                positions.push(position + i - 0);
            }
            return positions;
        },
        //保留
        holdItems: function(position) {
            var that = this;
            $.each(that.getHoldPositions(position), function(i, _position) {
                that.holdItem(_position);
            });
        },
        //删除
        removeItems: function(position) {
            var that = this, holdpositions = this.getHoldPositions(position);
            var inHoldPositions = function(holdpositions, _position) {
                for (var i in holdpositions) {
                    if (_position == holdpositions[i]) {
                        return true;
                    }
                }
                return false;
            };
            this.eachItem(function(_position, jqThis) {
                if (_position == position) return true;
                if (!inHoldPositions(holdpositions, _position)) {
                    that.removeItem(_position);
                }
            });
        },
        onScroll: function(distance) {
            if (this.scrollLocked) return false;
            try {
                this.scrollLocked = true;
                var scrollTop = $(document).scrollTop();
                if (Math.abs(scrollTop - this.lastScrollTop) > distance) {
                    this.lastScrollTop = scrollTop;
                    var scrollBottom = scrollTop + $(window).height();
                    var position = this.calcCurrentItem(scrollTop, scrollBottom);
                    if (this.curPosition != position && !this.checkIsFullScreen()) {
                        this.curPosition = position;
                        this.showItem(position);
                    }
                }
            } catch (e) {
                console.log(e);
            }
            this.scrollLocked = false;
            return true;
        },
        eachItem: function(callback) {
            var that = this, items = this.mainView.find(".__item");
            if (items.length) {
                items.each(function() {
                    if ("none" != $(this).css("display")) {
                        return callback.call(that, parseInt($(this).data("position")), $(this));
                    }
                });
                return true;
            }
            return false;
        },
        calcCurrentItem: function(scrollTop, scrollBottom) {
            var diffMax = 0, position = 0;
            this.eachItem(function(_position, jqThis) {
                var itemTop = jqThis.offset().top - 0;
                var itemBottom = itemTop + jqThis.height() - 0;
                var _top = Math.max(itemTop, scrollTop);
                var _bottom = Math.min(itemBottom, scrollBottom);
                var _diff = _bottom - _top;
                if (_diff > diffMax) {
                    diffMax = _diff;
                    position = _position;
                }
                return true;
            });
            return position;
        },
        getPrePosition: function(position) {
            var prePosition = 0;
            this.eachItem(function(_position, _jqThis) {
                if (position == _position) {
                    prePosition = -1;
                    return false;
                }
                if (_position > prePosition && _position < position) {
                    prePosition = _position;
                    return true;
                }
            });
            return prePosition;
        },
        insertItem: function(position, view) {
            if (null == view) return false;
            if (0 == position) {
                this.mainView.prepend(view.html());
                return true;
            }
            //分享页只显示一个
            if (main_main_vid && 0 != position) {
                return false;
            }
            var prePosition = this.getPrePosition(position);
            if (-1 == prePosition) return false;
            var preView = this.getItemView(prePosition);
            if (null == preView) return false;
            preView.after(view.html());
            return true;
        },
        getViewedCount: function() {
            var count = 0;
            this.eachItem(function(_position, _jqThis) {
                count++;
            });
            return count >= 2 ? count - this.downLimitCount : 1;
        },
        checkIsFullScreen: function() {
            if ("boolean" == typeof document.webkitIsFullScreen) {
                return document.webkitIsFullScreen;
            } else if ("boolean" == document.mozFullScreen) {
                return document.mozFullScreen;
            } else if ("undefined" != document.msFullscreenElement) {
                return null == document.msFullscreenElement ? false : true;
            } else {
                return this.isFullScreen;
            }
        },
        on: function(eventName, callback) {
            if (!this.eventMap[eventName]) this.eventMap[eventName] = [];
            this.eventMap[eventName].push(callback);
        },
        emit: function(eventName, data) {
            var that = this;
            setTimeout(function() {
                if (that.eventMap[eventName]) {
                    for (var i in that.eventMap[eventName]) {
                        var callback = that.eventMap[eventName][i];
                        callback.apply(that, data);
                    }
                }
            }, 0);
        }
    };
    return ListView;
});

define("vduowan/duopai/1.0.0/m/adapter-debug", [ "jquery-debug", "vduowan/duopai/1.0.0/m/util-debug" ], function(require, exports) {
    var $ = require("jquery-debug");
    var Util = require("vduowan/duopai/1.0.0/m/util-debug");
    function Adapter(tpl, dataSource) {
        this.tpl = tpl;
        this.dataSource = dataSource;
        this.data = [];
    }
    Adapter.prototype = {
        getCount: function() {
            return this.data.length;
        },
        getItem: function(position, callback) {
            var that = this;
            //把position转换为相应页码0=>1 10=>2 30=>3 50=>4...
            var pageCalc = function(position) {
                return Math.floor((position / 10 + 1) / 2 + 1);
            };
            if (that.data[position]) {
                callback(that.data[position]);
            } else {
                var page = pageCalc(position);
                that.dataSource.getData(position, page, function(item) {
                    item.position = position;
                    item.id = that.getItemId(position);
                    item.show_comment = Util.cookie.get("show_comment");
                    item.in_channel = $(".main").data("channel");
                    that.data[position] = item;
                    callback(item);
                });
            }
            return that.data[position];
        },
        getItemId: function(position) {
            return "video-id-" + position;
        },
        getView: function(position, convertView, callback) {
            var that = this;
            if (null == convertView) {
                this.getItem(position, function(item) {
                    convertView = Util.templateEngine(that.tpl, item);
                    callback($("<div>" + convertView + "</div>"));
                });
            } else {
                callback(convertView);
            }
        }
    };
    return Adapter;
});

define("vduowan/duopai/1.0.0/m/util-debug", [], function(require, exports) {
    exports.multiline = function(e) {
        var t = /\/\*!?(?:\@preserve)?\s*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//;
        if ("function" != typeof e) throw new TypeError("Expected a function.");
        return t.exec(e.toString())[1];
    };
    exports.cookie = {
        get: function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return decodeURIComponent(arr[2]);
            return null;
        },
        set: function(name, value, expire, path, domain) {
            var exp = new Date();
            exp.setTime(exp.getTime() + expire * 1e3);
            document.cookie = [ name, "=", encodeURIComponent(value), expire ? "; expires=" + exp.toGMTString() : "", path ? "; path=" + path : "", domain ? "; domain=" + domain : "" ].join("");
        }
    };
    exports.HTMLEnCode = function(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&gt;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/    /g, "&nbsp;");
        s = s.replace(/\'/g, "'");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, " <br>");
        return s;
    };
    exports.HTMLDeCode = function(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&gt;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, "    ");
        s = s.replace(/'/g, "'");
        s = s.replace(/&quot;/g, '"');
        s = s.replace(/<br>/g, "\n");
        return s;
    };
    exports.isEmptyStr = function(t) {
        return String.prototype.trim ? "" === t.trim() : "" === t.replace(/^\s+/, "").replace(/\s+$/, "");
    };
    exports.parseDate = function(timeStr) {
        return new Date(parseInt(timeStr, 10) * 1e3);
    };
    exports.getFriendlyDateStr = function(date) {
        var timeSpan = new Date().getTime() - date.getTime();
        var ONE_MINUTE = 60 * 1e3, ONE_HOUR = 60 * ONE_MINUTE, ONE_DAY = 24 * ONE_HOUR, ONE_MONTH = 30 * ONE_DAY, ONE_YEAR = 12 * ONE_MONTH;
        var friendlyString = "";
        if (timeSpan < ONE_MINUTE) {
            friendlyString = "刚刚";
        } else if (timeSpan < ONE_HOUR) {
            friendlyString = Math.floor(timeSpan / ONE_MINUTE) + "分钟前";
        } else if (timeSpan < ONE_DAY) {
            friendlyString = Math.floor(timeSpan / ONE_HOUR) + "小时前";
        } else if (timeSpan < ONE_MONTH) {
            friendlyString = Math.floor(timeSpan / ONE_DAY) + "天前";
        } else if (timeSpan < ONE_YEAR) {
            friendlyString = Math.floor(timeSpan / ONE_MONTH) + "个月前";
        } else if (timeSpan >= ONE_YEAR) {
            friendlyString = Math.floor(timeSpan / ONE_YEAR) + "年前";
        }
        return friendlyString;
    };
    exports.httpGetParams = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    };
    exports.templateEngine = function(html, options) {
        var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = "var r=[];\n", cursor = 0, match;
        var add = function(line, js) {
            js ? code += line.match(reExp) ? line + "\n" : "r.push(" + line + ");\n" : code += line != "" ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : "";
            return add;
        };
        while (match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';
        return new Function(code.replace(/[\r\t\n]/g, "")).apply(options);
    };
});

define("vduowan/duopai/1.0.0/m/datasource-debug", [ "jquery-debug", "vduowan/duopai/1.0.0/m/util-debug" ], function(require, exports) {
    var $ = require("jquery-debug");
    var Util = require("vduowan/duopai/1.0.0/m/util-debug");
    var baseDpUrl = "http://v.duowan.com/index.php?r=user/";
    var baseDpVUrl = "http://v.duowan.com/index.php?r=video/";
    var comment3Login = "http://comment3.duowan.com/index.php?r=default/login&domain=v.duowan.com";
    function DataSource() {
        this.jsonData = [];
    }
    DataSource.prototype = {
        _loadData: function(page, callback) {
            getUid();
            var that = this, _arr;
            var sort_key = Util.cookie.get("duopai_sort");
            var my_yyuid = Util.cookie.get("yyuid") ? Util.cookie.get("yyuid") : "";
            var target_yyuid = (_arr = window.location.href.match(/u\/(\d+)/)) ? _arr[1] : "";
            var channel = $(".main").data("channel");
            //其他用户个人主页
            if (target_yyuid != "") {
                var params = {
                    u: target_yyuid,
                    page: 1,
                    pageSize: 300
                };
                var final_url = baseDpUrl + "like";
                Util.cookie.set("dp_noscroll", 1, 1);
            } else if (phpbase_controller_and_action == "user/center") {
                var params = {
                    u: my_yyuid,
                    page: 1,
                    pageSize: 300
                };
                var final_url = baseDpUrl + "like";
                Util.cookie.set("dp_noscroll", 1, 1);
            } else {
                var params = {
                    channel: channel,
                    vid: main_main_vid,
                    hot_vid: Util.httpGetParams("hot_vid") || Util.httpGetParams("vid"),
                    page: page,
                    pageSize: 20,
                    sort_key: sort_key,
                    sort: "desc"
                };
                var final_url = baseDpVUrl + "list";
            }
            $.get(final_url, params, function(json) {
                if (json.data.length == 0) {
                    $(".no_video").show();
                }
                if (true == json.result) {
                    for (var i in json.data) {
                        that.jsonData.push(json.data[i]);
                    }
                    callback(that.jsonData);
                }
            }, "json");
        },
        getData: function(position, page, callback) {
            var that = this;
            var _callback = function(position, callback) {
                if ("undefined" != typeof that.jsonData[position]) {
                    callback(that.jsonData[position]);
                    return;
                }
            };
            //计算当position到10 30 50 ...时候请求数据
            if (0 == this.jsonData.length || position / 10 % 2 == 1) {
                this._loadData(page, function() {
                    _callback(position, callback);
                });
            } else {
                _callback(position, callback);
            }
        },
        extra: {
            login: function(callback) {
                $.get(comment3Login, {}, function(json) {
                    callback.call(this, json);
                }, "jsonp");
            },
            contact: function(data, callback) {
                $.get(baseDpUrl + "advise", data, function(json) {
                    callback.call(this, json);
                }, "json");
            },
            follow: function(data, callback) {
                $.get(baseDpUrl + "follow", data, function(json) {
                    callback.call(this, json);
                }, "json");
            },
            setHistory: function(vid, callback) {
                $.get(baseDpUrl + "history", {
                    vid: vid
                }, function(json) {
                    callback.call(this, json);
                }, "json");
            }
        },
        reportData: {
            zan: function(vid, callback) {
                $.get(baseDpUrl + "support", {
                    vid: vid
                }, function(json) {
                    callback.call(this, json);
                }, "json");
            },
            cai: function(vid, callback) {
                $.get(baseDpUrl + "opposite", {
                    vid: vid
                }, function(json) {
                    callback.call(this, json);
                }, "json");
            },
            stat: function(vid, play_time, total_time, position, channel) {
                try {
                    if (typeof vid == "undefined" || typeof play_time == "undefined" || typeof total_time == "undefined" || typeof position == "undefined") {
                        alert("return");
                        return;
                    }
                    var statUrl = "http://p2p.v.yyclouds.com/video/report";
                    //为了区分yyuid，此处暂时命名为gid
                    var gid = getUid();
                    var yyuid = Util.cookie.get("yyuid") ? Util.cookie.get("yyuid") : "";
                    if (isNaN(play_time)) {
                        play_time = 0;
                    } else {
                        play_time = Math.round(play_time);
                    }
                    var endSecond = Math.round(play_time);
                    if (isNaN(total_time)) {
                        return;
                    } else {
                        total_time = Math.round(total_time);
                    }
                    var totalSecond = Math.round(total_time);
                    statUrl = statUrl + "?vid=" + vid + "&gid=" + gid + "&endSecond=" + endSecond + "&totalSecond=" + totalSecond + "&uid=" + yyuid + "&channel=" + channel + "&origin=web";
                    $("#position_" + position).append("<img src='" + statUrl + "' style='display:none' />");
                } catch (e) {
                    alert("Faild:" + e.message);
                }
            },
            ya: function dataReport(passport, eidDesc, channel, vid) {
                try {
                    //产品id
                    var product = "hy_sjt_web";
                    var channel_s = "";
                    var regx = /\d+\.html$/g;
                    if (regx.test(eidDesc)) {
                        channel_s = "id.html-" + channel;
                    } else {
                        var index = eidDesc.lastIndexOf("/");
                        channel_s = eidDesc.substring(index + 1);
                        if (channel_s == "") {
                            channel_s = "index";
                        } else {
                            channel_s = channel;
                        }
                    }
                    var ya = new YA.report.YYAnalytics(product, passport);
                    var data = {
                        dty: "pas",
                        pro: product,
                        eid: "pageview/" + channel_s,
                        eid_desc: eidDesc
                    };
                    var ext = "channel=" + channel_s + "&vid=" + vid;
                    ya.reportProductEvent(data, ext);
                } catch (e) {
                    console.log("Faild:" + e.message);
                }
            },
            video: {
                laiyuanv3: "sjtweb",
                reportUrls: [],
                reportVids: {
                    load: {},
                    play: {}
                },
                reportLocked: false,
                loadNum: function(vid, title, position) {
                    if (this.reportVids.load["vid_" + vid]) return;
                    this.reportVids.load["vid_" + vid] = 1;
                    var channel = $("#position_" + position).data("channel");
                    this.reportUrls.push(this._reportHiido("webduowanvideoload", vid, channel, title));
                    this.reportUrls.push(this._reportDwPlatform("play/load", vid, channel, title));
                    this._report();
                },
                playNum: function(vid, title, position) {
                    if (this.reportVids.play["vid_" + vid]) return;
                    this.reportVids.play["vid_" + vid] = 1;
                    var channel = $("#position_" + position).data("channel");
                    this.reportUrls.push(this._reportHiido("webduowanvideo", vid, channel, title));
                    this.reportUrls.push(this._reportDwPlatform("play/do", vid, channel, title));
                    this._report();
                },
                _reportHiido: function(act, vid, channel, title) {
                    var url = "http://stat2.web.yy.com/c.gif";
                    var ui = Util.cookie.get("hiido_ui");
                    if (!ui) {
                        ui = Math.random();
                        Util.cookie.set("hiido_ui", ui, 3600 * 24 * 365, "/");
                    }
                    var args = {
                        act: act,
                        channel: channel || "",
                        lp: window.location.href,
                        vid: vid,
                        laiyuanv3: this.laiyuanv3,
                        vname: title,
                        time: new Date().valueOf(),
                        prevurl: window.location.origin,
                        ui: ui
                    };
                    url += "?" + $.param(args, true);
                    return url;
                },
                _reportDwPlatform: function(act, vid, channel, title) {
                    var url = "http://playstats.v.duowan.com/index.php";
                    var args = {
                        r: act,
                        vid: vid,
                        type: "web",
                        channelId: channel,
                        laiyuanv3: this.laiyuanv3,
                        source_url: window.location.href
                    };
                    url += "?" + $.param(args, true);
                    return url;
                },
                _report: function() {
                    if (this.reportLocked) return;
                    this.reportLocked = true;
                    var that = this;
                    setInterval(function() {
                        if (that.reportUrls.length > 0) {
                            new Image().src = that.reportUrls.shift();
                        }
                    }, 100);
                }
            }
        }
    };
    function getUid() {
        var uid = Util.cookie.get("duopai_uid");
        if (!uid) {
            uid = new Date().getTime() + "_" + Math.round(Math.random() * 1e3);
            Util.cookie.set("duopai_uid", uid, 3600 * 24 * 365, "/");
        }
        return uid;
    }
    function getChannel() {
        var channel = $(".main").data("channel");
        return channel;
    }
    return DataSource;
});

define("vduowan/duopai/1.0.0/m/player-debug", [ "jquery-debug" ], function(require, exports) {
    var $ = require("jquery-debug");
    var MediaElementPlayer = null, dataSource = null, mediaElementMap = [];
    var PlayerStatus = {
        donelist: [],
        playing: 0,
        lastplay: 0
    };
    function _getMediaElementPlayer(position, view) {
        if ("undefined" !== typeof mediaElementMap[position]) {
            return mediaElementMap[position];
        }
        if (null != view && view.find("video").attr("src")) {
            mediaElementMap[position] = new MediaElementPlayer("#video_" + position, {
                loop: true,
                hideVideoControlsOnLoad: true,
                features: [ "playpause", "progress", "current", "duration", "tracks", "volume", "fullscreen" ],
                customError: ""
            });
            // Get Time 
            $("#video_" + position).on("pause ended", {
                position: position,
                view: view
            }, function(e) {
                var m = mediaElementMap[position];
                if ("ended" == e.type) {
                    m._startTime = 0;
                } else {
                    m._startTime = m.getCurrentTime();
                }
                var vid = $("#position_" + position).attr("data-vid");
                var channel = $("#position_" + position).data("channel") ? $("#position_" + position).data("channel") : $(".main").data("channel");
                if (position == PlayerStatus.lastplay || e.type == "ended") {
                    if (typeof PlayerStatus.donelist[vid] == "undefined") {
                        PlayerStatus.donelist[vid] = 1;
                        var totalTime = this.duration;
                        if (e.type == "ended") {
                            var statTime = totalTime;
                        } else {
                            var statTime = m._startTime;
                        }
                        dataSource.reportData.stat(vid, statTime, totalTime, position, channel);
                    }
                }
            });
            $("#video_" + position).on("play", {
                position: position,
                view: view
            }, function(e) {
                var m = mediaElementMap[position];
                if (m._startTime && m._startTime > 0) {
                    m.setCurrentTime(m._startTime);
                }
                PlayerStatus.lastplay = PlayerStatus.playing;
                PlayerStatus.playing = position;
            });
            $("#video_" + position).on("contextmenu", function(e) {
                return true;
            });
            return mediaElementMap[position];
        } else {
            return null == view ? null : view.find("video")[0];
        }
    }
    function Player(position, view) {
        this.position = position;
        this.view = view;
        this.videoObj = null == view ? null : view.find("video");
    }
    Player.init = function(_MediaElementPlayer, _dataSource) {
        MediaElementPlayer = _MediaElementPlayer;
        dataSource = _dataSource;
    };
    Player.prototype = {
        play: function() {
            if (!this.videoObj) return;
            if ("meta" != this.videoObj.attr("preload")) {
                this.videoObj.attr("preload", "meta");
            }
            if (!this.videoObj.attr("src")) {
                this.videoObj.attr("src", this.videoObj.data("src"));
            }
            var video = _getMediaElementPlayer(this.position, this.view);
            if (video && video.play && video.media && video.media.load) {
                video.play();
            }
        },
        pause: function() {
            if (!this.videoObj) return;
            if ("meta" != this.videoObj.attr("preload")) {
                this.videoObj.attr("preload", "meta");
            }
            if (!this.videoObj.attr("src")) {
                this.videoObj.attr("src", this.videoObj.data("src"));
            }
            var video = _getMediaElementPlayer(this.position, this.view);
            if (video && video.pause) {
                video.pause();
            }
        },
        remove: function() {
            if (!this.videoObj) return;
            if ("none" != this.videoObj.attr("preload")) {
                this.videoObj.attr("preload", "none");
            }
            if (this.videoObj.attr("src")) {
                this.videoObj.removeAttr("src");
            }
        }
    };
    return Player;
});

define("vduowan/duopai/1.0.0/m/template-debug", [ "vduowan/duopai/1.0.0/m/util-debug" ], function(require, exports) {
    var Util = require("vduowan/duopai/1.0.0/m/util-debug");
    exports.videoItemTpl = '<div class="video-list clearfix __item" id="position_<% this.position %>" data-position="<% this.position %>" data-vid="<% this.vid %>" data-channel="<% this.video_channel %>" data-cover="<% this.video_cover%>">            <div class="video-left clearfix">                <div class="video-top-bar">                    <a href="/u/<% this.user_id %>" target="_self">                    <img src="<% this.user_avatar %>" alt="" class="fltL"  onerror="this.src="http://att.bbs.duowan.com/avatar/noavatar_small.jpg"">                    <p class="fltL"><% this.user_nickname %><em class="video-ptime">上传于<% this.video_upload_time_format %></em></p>                    </a>                    <% if(this.video_channel_label && this.in_channel == "") { %><span class="tag fltR"><a href="<% this.video_channel %>" target="_self"><% this.video_channel_label %></a></span><% } %>                </div>                <div class="video-wrap">                       <video id="video_<% this.position %>" class="video-duopai" controls  preload="none" width="800" height="450" poster="<% this.video_cover %>" data-src="<% this.video_url %>" data-vid="<% this.vid %>">                </div>                <div class="video-info-bar">                    <h2 class="video-title fltL"><% this.video_title %></h2>                </div>                <div class="video-info">                    <a class="video-zan video-info-btn" data-vid="<% this.vid %>" data-num="<% this.video_zan_num %>"><i></i><% this.video_zan_num %>赞</a>                    <a class="video-cai video-info-btn" data-vid="<% this.vid %>" data-num="<% this.video_cai_num %>"><i></i><% this.video_cai_num %>踩</a>                    <div class="video-share video-info-btn" id="video-share">                        <i></i>分享                        <div class="ic-share clearfix">                            <div class="bdsharebuttonbox"  data-tag="share_1">                                <span>分享到</span>                                <a class="ic-share-wx" data-cmd="weixin" title="分享到微信">微信</a>                                <a class="ic-share-qq" data-cmd="sqq" title="分享到qq">QQ</a>                                <a class="ic-share-wb" data-cmd="tsina" title="分享到微博">微博</a>                            </div>                            <div class="share-clipbord">                                <div class="copy-item clearfix">                                    <span class="copy-item-title">视频地址</span>                                    <input type="text" disabled="disabled" value="http://assets.dwstatic.com/video/vppp.swf?vid=<% this.vid %>&channelId=<% this.video_channel %>&auto_play=1&from=sjtshareweb&ui=dmxy&definition=yuanhua">                                    <a class="btn-copy" href="javascript:;">复制</a>                                </div>                                <div class="copy-item clearfix">                                    <span class="copy-item-title">html代码</span>                                    <input type="text" disabled="disabled" value=\'<embed src="http://assets.dwstatic.com/video/vppp.swf" allowfullscreen="true" quality="high" height="" width="" align="middle" allowscriptaccess="always" flashvars="vid=<% this.vid %>&channelId=<% this.video_channel %>&auto_play=1&from=sjtshareweb&ui=dmxy&definition=yuanhua" type="application/x-shockwave-flash" style="z-index:-1" wmode="transparent" />\'>                                    <a class="btn-copy" href="javascript:;">复制</a>                                </div>                            </div>                        </div>                    </div>                                        <div class="video-comment video-info-btn <% if (this.position != 0 || this.show_comment != 1) { %>off<% } %>" id="comment-show" >                        <a href="javascript:"><i></i>0</a>                        <a href="javascript:" class="index-comment__switch"></a>                    </div>                </div>                </div>            <div class="video-comment__wrap <% if (this.position != 0 || this.show_comment != 1) { %>off<% } %>">                <div class="video-comment__nav clearfix">                    <a href="javascript:" class="cur" data-order="hot"><i class="hot2"></i>精彩评论</a>                    <a href="javascript:" class="all-comment" data-order="time">全部评论</a>                </div>                <div class="video-comment__list">                    <ul class="comment-center clearfix hot-comment-center" ></ul>                    <ul class="comment-center clearfix time-comment-center hide">                    </ul>                    <div class="comment-center__noData" style="display:none;">                        <img src="http://assets.dwstatic.com/project/shenjingtou/1.1.0/img/no-data.png" class="no-data__img">                        <p>消灭零回复</p>                    </div>                  </div>                <div class="video-comment__control">                    <div class="comment-tips__list clearfix">                    </div>                    <div class="comment-replay__wrap video-comment__input clearfix">                        <input type="input" placeholder="说点什么吧...">                        <a href="javascript:" class="comment-replay__submit">评论</a>                    </div>                 </div></div>        </div>';
    exports.commentItemTpl = '<li class="comment-item">            <div class="comment-item__header">                <img src="<% this.user_img_min %>"  onerror="this.src=\'http://att.bbs.duowan.com/avatar/noavatar_small.jpg\'"> <span><% this.username %></span>            </div>            <p class="comment-item__words"><% this.contents %></p>            <div class="comment-item__tools clearfix">                <span class="comment-item__time"><% this.created %></span>                <div class="comment-item__tools--r clearfix">                    <a href="javascript:" class="comment-item__like" data-cid="<% this.comment_id %>"><em></em>赞(<span><% this.vote %></span>)</a>                    <a href="javascript:" class="comment-item__reply" data-cid="<% this.comment_id %>" data-top="1" data-username="<% this.username%>" data-dom_pid="<% this.comment_id %>">回复</a>                </div>            </div>            <ul class="comment-item2__list clearfix" data-parent_id="<% this.comment_id %>" >                <% if(this.reply){ %>                    <% for (var i=0; i<this.reply.length; i++){ %>                        <li class="comment-item2" data-cid="<% this.reply[i].comment_id %>">                            <p class="comment-item2__message">                                <a href="javascript:" class="comment-item2__user"><% this.reply[i].username %></a>                                ：<span><% this.reply[i].contents %></span>                            </p>                            <div class="comment-item2__control clearfix">                                <span class="comment-item2__time"><% this.reply[i].created %></span>                                <a href="javascript:" class="comment-item2__reply" data-top="0" data-cid="<% this.reply[i].comment_id %>"  data-username="<% this.reply[i].username%>" data-dom_pid="<% this.comment_id %>">回复</a>                            </div>                        </li>                    <% } %>                    <% if(this.comment_reply_total <= 3){ %>                    <% }else{ %>                    <p class="comment-item2__more"  data-parent_id="<% this.comment_id %>" >还有<% this.comment_reply_total - 3 %>条回复，<a href="javascript:">点击查看</a></p>                    <% } %>                <% } %>            </ul>        </li>';
    exports.replyItemTpl = '<li class="comment-item2" data-cid="<% this.comment_id %>">            <p class="comment-item2__message">                <a href="javascript:" class="comment-item2__user"><% this.username %></a>                ：<span><% this.contents %></span></p>            <div class="comment-item2__control clearfix">                <span class="comment-item2__time"><% this.created %></span>                <a href="javascript:" class="comment-item2__reply" data-top="0" data-cid="<% this.comment_id %>"  data-username="<% this.username%>" data-dom_pid="<% this.dom_pid %>">回复</a>            </div>        </li>';
    exports.childrenReplyInputTpl = '<div class="comment-replay__wrap item2-input clearfix">            <input type="input" placeholder="回复 <% this.username %>" data-parent_id="<% this.parent_id %>" data-dom_pid="<% this.dom_pid %>">            <a href="javascript:" class="comment-replay__submit">评论</a>        </div>';
    exports.topReplyInputTpl = '<div class="comment-replay__wrap clearfix">            <input type="input" placeholder="回复 <% this.username %>" data-parent_id="<% this.parent_id %>" data-dom_pid="<% this.dom_pid %>">            <a href="javascript:" class="comment-replay__submit">评论</a>         </div>';
});

define("vduowan/duopai/1.0.0/m/comment-debug", [ "jquery-debug", "vduowan/duopai/1.0.0/m/placeholder-debug", "vduowan/duopai/1.0.0/m/util-debug", "vduowan/duopai/1.0.0/m/commentdata-debug", "vduowan/duopai/1.0.0/m/template-debug" ], function(require, exports) {
    var $ = require("jquery-debug");
    require("vduowan/duopai/1.0.0/m/placeholder-debug")($);
    var Util = require("vduowan/duopai/1.0.0/m/util-debug");
    var CommentData = require("vduowan/duopai/1.0.0/m/commentdata-debug");
    var Template = require("vduowan/duopai/1.0.0/m/template-debug");
    var defaultAvatar = "http://att.bbs.duowan.com/avatar/noavatar_small.jpg";
    require("nicescroll-debug");
    function Comment(vid, title, position, view) {
        this.vid = vid;
        this.title = title;
        this.position = position;
        this.view = view;
        this.commentData = new CommentData(vid, title, "v.duowan.com");
        this.uniqid = "";
        this.data = {};
        this.startNum = {};
        this.startNum["time"] = 0;
        this.startNum["hot"] = 0;
        this.loadLocked = {};
        this.loadLocked["time"] = false;
        this.loadLocked["hot"] = false;
        this.order = "hot";
    }
    Comment.prototype = {
        init: function() {
            var that = this;
            that.commentData.totaljson(that.uniqid).then(function(data) {
                if (!that.view) {
                    return;
                }
                if (!data.show || data.show.exist != 1) {
                    return false;
                }
                that.uniqid = data.show.uniqid;
                that.data.totaljson = data.show;
                that.renderCount(0);
                that.initComments();
                that.bind();
                that.hotWord();
            });
            that.commentNiceScroll();
        },
        renderCount: function(incr) {
            this.data.totaljson.total_num = this.data.totaljson.total_num - 0 + incr;
            this.view.find("#comment-show").html('<a href="javascript:"><i></i>' + this.data.totaljson.total_num + '</a><a href="javascript:" class="index-comment__switch"></a>');
        },
        initComments: function() {
            this.getComments();
        },
        //评论的排序方式
        getComments: function() {
            var that = this;
            if (that.loadLocked[that.order]) return;
            that.loadLocked[that.order] = true;
            this.commentData.comments(that.uniqid, that.order, that.startNum[that.order]).then(function(data) {
                if (that.startNum[that.order] == 0 && data.length == 0) {
                    that.view.find(".comment-center__noData").show();
                    return;
                }
                var _comment = {};
                $.each(data, function(i, _comment) {
                    that.renderComments(_comment, "append");
                });
                that.startNum[that.order] += 10;
                that.loadLocked[that.order] = false;
            });
        },
        getReplys: function(parent_id) {
            var that = this;
            that.commentData.replys(that.uniqid, parent_id).then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].created = Util.getFriendlyDateStr(Util.parseDate(data[i].created));
                    if (i > 2) {
                        that.renderReply(data[i], parent_id, parent_id, "append");
                    }
                }
            });
        },
        hotWord: function() {
            var hot_word = {};
            hot_word["lol"] = [ "PY交易", "666666", "笑死在路上", "MDZZ", "这真nb大家顶上去", "黑的漂亮（手动滑稽", "主播盒饭到手" ];
            hot_word["ow"] = [ "缘分", "厉害了我的哥", "承让了我的弟", "盲人先锋", "寒霜航空", "猎空保护协会" ];
            hot_word["df"] = [ "一发罐子入魂", "今晚荒古毕业", "没钱玩NMB", "不充钱还想变强？", "更新又出BUG了", "买买买，买10套", "主C666，主C8个9，卧槽，8个9" ];
            hot_word["wot"] = [ "这一发有一万个细节！", "装个逼就跑真刺激", "断腿掉血一炮顶五炮", "为了斯大林！", "主角太强了我们削一下德系吧", "对面的59下山啦！", "一发入魂好霸道！", "折腾五号战列舰" ];
            hot_word["tv"] = [ "厉害了我的哥", "23333333333", "菜鸡互啄", "66666666666", "满脑子都是骚操作", "强，无敌！", "大神请收下我的膝盖", "一脸懵逼" ];
            hot_word["ls"] = [ "66666", "野路子", "牌序感人", "迷之斩杀", "这也行？", "手贱系列", "人生的大起大落", "py" ];
            hot_word["kan"] = [];
            var html = "";
            var channel = $("#position_" + this.position).data("channel");
            for (var word in hot_word[channel]) {
                html += '<a href="javascript:">' + hot_word[channel][word] + "</a>";
            }
            this.view.find(".comment-tips__list").html(html);
        },
        renderComments: function(comment, opera) {
            comment.created = Util.getFriendlyDateStr(Util.parseDate(comment.created));
            if (comment.reply) {
                for (var i = 0; i < comment.reply.length; i++) {
                    comment.reply[i].created = Util.getFriendlyDateStr(Util.parseDate(comment.reply[i].created));
                }
            }
            var html = Util.templateEngine(Template.commentItemTpl, comment);
            if (opera == "append") {
                this.view.find("." + this.order + "-comment-center").append(html);
            } else {
                this.view.find("." + this.order + "-comment-center").prepend(html);
            }
        },
        renderReply: function(replys, parent_id, dom_pid, opera) {
            var that = this;
            replys.dom_pid = dom_pid;
            var html = Util.templateEngine(Template.replyItemTpl, replys);
            if (opera == "append") {
                that.view.find('.comment-item2__list[data-parent_id="' + parent_id + '"]').append(html);
            } else {
                that.view.find('.comment-item2__list[data-parent_id="' + dom_pid + '"]').prepend(html);
            }
        },
        replyBtn: function() {
            $(".comment-replay__wrap").find("input").on("focus", function() {
                if ($(this).prop("value").length > 0) $(this).parent().addClass("comment_focus");
            }).on("input", function() {
                $(this).prop("value").length > 0 ? $(this).parent().addClass("comment_focus") : $(this).parent().removeClass("comment_focus");
            });
        },
        bind: function() {
            var that = this;
            that.replyBtn();
            this.view.on("click", ".comment-replay__submit", function(event) {
                event.preventDefault();
                if (true != dwUDBProxy.isLogin()) {
                    dwUDBProxy.login();
                } else {
                    that.onAddComment($(this).parent());
                }
            });
            this.view.on("click", ".comment-item__like", function() {
                if ($(this).hasClass("liked")) {
                    popFun("你已点过赞了哦！");
                    return;
                }
                that.vote($(this).data("cid"));
                var vote_num = $(this).find("span").text();
                vote_num = parseInt(vote_num);
                $(this).find("span").text(++vote_num).parent().addClass("liked");
            });
            this.view.on("click", ".comment-item2__more", function() {
                that.getReplys($(this).data("parent_id"));
                $(this).hide();
            });
            $(".video-comment__list").on("scroll", "", function() {
                if ($(this).height() - $(this).scrollTop() < 350) {
                    that.getComments();
                }
            });
            this.view.on("click", ".video-comment", function() {
                $(this).toggleClass("off").toggleClass("has_off").parent().parent().siblings(".video-comment__wrap").attr("style", "").toggleClass("off").toggleClass("has_off");
            });
            $(".video-comment__nav").find("a").unbind("click").on("click", function(event) {
                event.preventDefault();
                var index = $(this).index();
                that.order = $(this).data("order");
                $(this).addClass("cur").siblings().removeClass("cur");
                $(this).parent().parent().find(".comment-center").eq(index).removeClass("hide").siblings().addClass("hide");
                that.getComments();
                $(this).closest(".video-list").find(".video-comment__list").animate({
                    scrollTop: 0
                }, 200);
            });
            //把灌水的评论文本填充到文本框
            this.view.on("click", ".comment-tips__list a", function() {
                $(this).parent().siblings(".comment-replay__wrap").find("input").val($(this).text()).focus();
            });
            //生成回复文本框
            this.view.on("click", ".comment-item__reply,.comment-item2__reply", function() {
                var is_top = $(this).data("top") == 1 ? true : false;
                var data = {};
                data.parent_id = $(this).data("cid");
                data.username = $(this).data("username");
                data.dom_pid = $(this).data("dom_pid");
                //点击一次后消除cid，不能再生成回复框
                if (!data.parent_id) {
                    return;
                }
                $(this).data("cid", "");
                var parent_node = $(this).parent().parent().parent();
                if (is_top) {
                    var html = Util.templateEngine(Template.topReplyInputTpl, data);
                    parent_node.find(".comment-item__tools").after(html);
                } else {
                    var html = Util.templateEngine(Template.childrenReplyInputTpl, data);
                    $(this).parent().after(html);
                }
                that.replyBtn();
            });
        },
        onAddComment: function(obj) {
            var that = this;
            var inputObj = obj.find("input");
            var msg = inputObj.val();
            var parent_id = inputObj.data("parent_id") ? inputObj.data("parent_id") : 0;
            var dom_pid = inputObj.data("dom_pid");
            if (Util.isEmptyStr(msg)) {
                popFun("请输入评论内容");
                return;
            }
            this.commentData.addComment(this.uniqid, this.data.totaljson.content_key, msg, parent_id).done(function(data) {
                if (data.rs) {
                    var comment = {
                        username: data.username,
                        contents: data.content,
                        user_img_min: $(".user_avatar").attr("src"),
                        created: new Date().getTime() / 1e3,
                        comment_id: data.cid,
                        vote: 0
                    };
                    if (parent_id == 0) {
                        //评论
                        that.order = "time";
                        if (that.view.find(".all-comment").hasClass("cur")) {
                            that.renderComments(comment, "prepend");
                        }
                        inputObj.val("").blur();
                        that.view.find(".all-comment").click();
                    } else {
                        //回复
                        comment.created = Util.getFriendlyDateStr(Util.parseDate(comment.created));
                        that.renderReply(comment, parent_id, dom_pid, "prepend");
                        inputObj.parent().slideUp(2e3).remove();
                    }
                    that.view.find(".comment-center__noData").hide();
                    that.renderCount(1);
                } else {
                    popFun(data.msg);
                }
            });
        },
        commentNiceScroll: function() {},
        vote: function(cid) {
            this.commentData.vote(cid).done(function(data) {
                if (data.rs) {}
            });
        }
    };
    return Comment;
});

define("vduowan/duopai/1.0.0/m/placeholder-debug", [], function(require, exports) {
    return function(jquery) {
        (function($) {
            $.fn.extend({
                placeholder: function(options) {
                    options = $.extend({
                        placeholderColor: "#ACA899",
                        isUseSpan: false,
                        //是否使用插入span标签模拟placeholder的方式,默认false,默认使用value模拟
                        onInput: true
                    }, options);
                    $(this).each(function() {
                        var _this = this;
                        var supportPlaceholder = "placeholder" in document.createElement("input");
                        if (!supportPlaceholder) {
                            var defaultValue = $(_this).attr("placeholder");
                            var defaultColor = $(_this).css("color");
                            if (options.isUseSpan == false) {
                                $(_this).focus(function() {
                                    var pattern = new RegExp("^" + defaultValue + "$|^$");
                                    pattern.test($(_this).val()) && $(_this).val("").css("color", defaultColor);
                                }).blur(function() {
                                    if ($(_this).val() == defaultValue) {
                                        $(_this).css("color", defaultColor);
                                    } else if ($(_this).val().length == 0) {
                                        $(_this).val(defaultValue).css("color", options.placeholderColor);
                                    }
                                }).trigger("blur");
                            } else {
                                var $imitate = $('<span class="wrap-placeholder" style="position:absolute; display:inline-block; overflow:hidden; color:' + options.placeholderColor + "; width:" + $(_this).outerWidth() + "px; height:" + $(_this).outerHeight() + 'px;">' + defaultValue + "</span>");
                                $imitate.css({
                                    "margin-left": $(_this).css("margin-left"),
                                    "margin-top": $(_this).css("margin-top"),
                                    "font-size": $(_this).css("font-size"),
                                    "font-family": $(_this).css("font-family"),
                                    "font-weight": $(_this).css("font-weight"),
                                    "padding-left": parseInt($(_this).css("padding-left")) + 2 + "px",
                                    "line-height": _this.nodeName.toLowerCase() == "textarea" ? $(_this).css("line-weight") : $(_this).outerHeight() + "px",
                                    "padding-top": _this.nodeName.toLowerCase() == "textarea" ? parseInt($(_this).css("padding-top")) + 2 : 0
                                });
                                $(_this).before($imitate.click(function() {
                                    $(_this).trigger("focus");
                                }));
                                $(_this).val().length != 0 && $imitate.hide();
                                if (options.onInput) {
                                    //绑定oninput/onpropertychange事件
                                    var inputChangeEvent = typeof _this.oninput == "object" ? "input" : "propertychange";
                                    $(_this).bind(inputChangeEvent, function() {
                                        $imitate[0].style.display = $(_this).val().length != 0 ? "none" : "inline-block";
                                    });
                                } else {
                                    $(_this).focus(function() {
                                        $imitate.hide();
                                    }).blur(function() {
                                        /^$/.test($(_this).val()) && $imitate.show();
                                    });
                                }
                            }
                        }
                    });
                    return this;
                }
            });
        })(jQuery);
    };
});

define("vduowan/duopai/1.0.0/m/commentdata-debug", [ "jquery-debug", "vduowan/duopai/1.0.0/m/util-debug" ], function(require, exports) {
    var $ = require("jquery-debug");
    var Util = require("vduowan/duopai/1.0.0/m/util-debug");
    var REQ_URL = "http://comment3.duowan.com/index.php";
    var location = window.location;
    var agreePrefix = "cmtagr";
    var disagreePrefix = "cmtdagr";
    function CommentData(vid, title, domain, url) {
        this.vid = vid;
        this.title = title;
        this.domain = domain ? domain : "v.duowan.com";
        this.url = url ? url : "/play/" + this.vid + ".html";
    }
    CommentData.prototype = {
        getData: function(req, params, options) {
            if (!params) {
                params = {};
            }
            if (!options) {
                options = {};
            }
            if (options.domain) {
                params.domain = this.domain;
            }
            if (options.url) {
                params.url = this.url;
            }
            var defer = $.Deferred();
            $.ajax({
                url: REQ_URL + "?r=" + req,
                data: params,
                dataType: "jsonp"
            }).done(function() {
                defer.resolveWith(this, arguments);
            }).fail(function() {
                defer.rejectWith(this, arguments);
            });
            setTimeout(function() {
                defer.notify("timeout");
            }, 1e4);
            return defer;
        },
        totaljson: function(uniqId) {
            return this.getData("comment/totaljson", uniqId ? {
                uniqid: uniqId
            } : null, {
                domain: true,
                url: true
            });
        },
        getLoginInfo: function() {
            return this.getData("default/login", null, {
                domain: true
            });
        },
        setNickname: function(nickname) {
            return this.getData("default/nickname", {
                nickname: nickname
            }, {
                domain: true
            });
        },
        vote: function(cid) {
            return this.getData("comment/support", {
                cid: cid
            }, {
                domain: true,
                url: true,
                uniqid: true
            });
        },
        addComment: function(uniqId, key, content, parentId) {
            var params = {
                uniqid: uniqId
            };
            params[key] = content;
            if (parentId) {
                params.parent_id = parentId;
            }
            params.title = this.title;
            return this.getData("comment/add", params, {
                domain: true,
                url: true
            });
        },
        preaudit: function(uniqId) {
            return this.getData("comment/peraudit", {
                uniqid: uniqId
            }, {
                domain: true,
                url: true
            });
        },
        comments: function(uniqId, order, num) {
            var params = {
                order: order || "time",
                noimg: true
            };
            if (uniqId) {
                params.uniqid = uniqId;
            }
            if (num) {
                params.num = num;
            }
            return this.getData("comment/comment", params, {
                domain: true,
                url: true
            }).then(function(data) {
                $.each(data, function(i, d) {
                    if (Util.cookie.get(agreePrefix + d.comment_id)) {
                        d.agreed = true;
                    }
                    if (Util.cookie.get(disagreePrefix + d.comment_id)) {
                        d.disagreed = true;
                    }
                });
                return data;
            });
        },
        replys: function(uniqId, parent_id) {
            return this.getData("comment/reply", {
                parent_id: parent_id,
                uniqId: uniqId
            }, {
                domain: true,
                url: true
            });
        },
        moreReplies: function(uniqId, parentId, createTimeStr, flagId) {
            return this.getData("comment/reply", {
                parent_id: parentId,
                uniqid: uniqId,
                create: createTimeStr,
                flag_id: flagId
            }, {
                domain: true,
                url: true
            });
        },
        agree: function(uniqId, cid) {
            return this.getData("comment/support", {
                uniqid: uniqId,
                cid: cid
            }, {
                domain: true,
                url: true
            }).then(function(data) {
                if (data.vote > 0) {
                    Util.cookie.set(agreePrefix + cid, 1, 3600 * 24);
                } else if (data.vote < 0) {
                    Util.cookie.set(agreePrefix + cid, "", -1);
                }
                return data;
            });
        },
        disagree: function(uniqId, cid) {
            return this.getData("comment/oppose", {
                uniqid: uniqId,
                cid: cid
            }, {
                domain: true,
                url: true
            }).then(function(data) {
                if (data.vote > 0) {
                    Util.cookie.set(disagreePrefix + cid, 1, 3600 * 24);
                } else if (data.vote < 0) {
                    Util.cookie.set(disagreePrefix + cid, "", -1);
                }
                return data;
            });
        },
        tuCao: function(uniqId) {
            return this.getData("comment/tucao", {
                uniqid: uniqId
            }, {
                domain: true,
                url: true
            });
        },
        addTuCao: function(uniqId, contentKey, content) {
            var params = {
                uniqid: uniqId
            };
            params[contentKey] = content;
            params.title = this.title;
            return this.getData("comment/addtucao", params, {
                domain: true,
                url: true
            });
        },
        tuCaoVote: function(uniqId, tucaoId) {
            return this.getData("comment/tucaovote", {
                uniqid: uniqId,
                tucao_id: tucaoId
            }, {
                domain: true,
                url: true
            });
        },
        del: function(cid, uniqId) {
            return this.getData("default/delComment", {
                id: cid,
                uniqid: uniqId
            }, {
                domain: true,
                url: true
            });
        }
    };
    return CommentData;
});

define("vduowan/duopai/1.0.0/m/share-debug", [], function(require, exports) {
    exports.init = function(vid, title, cover) {
        var bdUrl = location.protocol + "//" + location.hostname + "/play/" + vid + ".html";
        window._bd_share_config = {
            share: {
                bdText: title,
                bdDesc: title,
                bdUrl: bdUrl,
                bdPic: cover
            }
        };
        if (window._bd_share_main) {
            window._bd_share_main.init();
        }
        //分成IE和非IE部分
        if (window.clipboardData && clipboardData.setData) {
            $(".share-clipbord .btn-copy").on("click", function(event) {
                var str = $(this).parent().find("input").val();
                var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>复制成功</div></div>");
                clipboardData.setData("Text", str);
                $("body").find(".copy-tips").remove().end().append($copysuc);
                $(".copy-tips").fadeOut(3e3);
            });
        } else {
            clipboard();
        }
        function clipboard() {
            var client = new ZeroClipboard($(".share-clipbord .btn-copy"));
            client.on("ready", function(event) {
                client.on("copy", function(event) {
                    var str = $(event.target).parent().find("input").val();
                    event.clipboardData.setData("text/plain", str);
                });
                client.on("aftercopy", function(event) {
                    var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>复制成功</div></div>");
                    $("body").find(".copy-tips").remove().end().append($copysuc);
                    $(".copy-tips").fadeOut(3e3);
                });
            });
            client.on("error", function(event) {
                ZeroClipboard.destroy();
            });
        }
    };
});

define("vduowan/duopai/1.0.0/m/feedback-debug", [ "jquery-debug", "vduowan/duopai/1.0.0/m/util-debug" ], function(require, exports) {
    var $ = require("jquery-debug");
    var Util = require("vduowan/duopai/1.0.0/m/util-debug");
    exports.init = function(dataSource) {
        $("#feedback_submit").on("click", function() {
            var contact_type = $("#feedback_contact_type").val();
            var contact = Util.HTMLEnCode($("#feedback_contact").val());
            var content = Util.HTMLEnCode($("#feedback_content").val());
            if (Util.isEmptyStr(contact)) {
                alert("请填写联系方式");
                return false;
            }
            if (Util.isEmptyStr(content) || "问题描述" == content) {
                alert("请填写问题");
                return false;
            }
            dataSource.reportData.feedback(contact_type, contact, content, function() {
                $("#pop-close").click();
                alert("提交成功，谢谢您的反馈！");
            });
        });
    };
});

define("vduowan/duopai/1.0.0/m/videosort-debug", [ "jquery-debug", "vduowan/duopai/1.0.0/m/util-debug" ], function(require, exports) {
    var $ = require("jquery-debug");
    var Util = require("vduowan/duopai/1.0.0/m/util-debug");
    exports.init = function(dataSource) {
        var sort_key = Util.cookie.get("duopai_sort");
        var show_comment = Util.cookie.get("show_comment");
        if (show_comment == 1) {
            $(".comment-btn__kan").addClass("selected");
        }
        $(".comment-sort .sort-type-btn").each(function() {
            if (sort_key == $(this).data("sort")) {
                $(this).addClass("selected");
            }
        });
        $(".comment-sort .sort-type-btn").on("click", function(event) {
            event.preventDefault();
            var sort_key = $(this).data("sort");
            if (sort_key) {
                Util.cookie.set("duopai_sort", sort_key);
                Util.cookie.set("dp_rescorll", 1, 1);
                window.location.reload();
            }
        });
        $(".comment-btn__kan").on("click", function(event) {
            event.preventDefault();
            if (show_comment == 1) {
                show_comment = 0;
                $(this).removeClass("selected");
                $(".video-comment__wrap").hide();
            } else {
                show_comment = 1;
                $(this).addClass("selected");
                $(".video-comment__wrap").show();
                $(".video-comment__wrap:last").hide();
            }
            Util.cookie.set("show_comment", show_comment);
        });
    };
});

define("vduowan/duopai/1.0.0/m/com-debug", [ "jquery-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    var siteUrl = "http://v.duowan.com/";
    var baseDpUrl = "./index.php?r=user/";
    var duopai = function() {
        var scrollList = $(window), /**
			 * 导航相关
			 */
        navFun = function() {
            var _header = $("#discover-btn,#top-info-user");
            _header.on("mouseenter", function(event) {
                event.preventDefault();
                $(this).addClass("h-menu-active");
            });
            _header.on("mouseleave", function(event) {
                event.preventDefault();
                $(this).removeClass("h-menu-active");
            });
        }, /**
			 * 登陆相关
			 */
        loginFun = function() {
            //登陆相关
            if (dwUDBProxy.isLogin()) {
                $(".top-info-login").hide();
                var userinfo = $("#top-info-user");
                $.ajax({
                    url: siteUrl + "?r=user/getUserInfo",
                    type: "POST",
                    dataType: "jsonp"
                }).done(function(data) {
                    if (data) {
                        // console.log( data );
                        var imgUrl = data.data.avatar || "http://assets.dwstatic.com/project/huya-v/1.0.0/img/default-avatar.png";
                        userinfo.find("img").attr("src", imgUrl);
                        $("#top-info-user img").error(function() {
                            $(this).attr("src", "http://att.bbs.duowan.com/avatar/noavatar_small.jpg");
                        });
                        userinfo.find(".top-info-name").html(data.data.nickname);
                        userinfo.show();
                        $('a[data-role="miti-loginout').on("click", function() {
                            dwUDBProxy.logout();
                        });
                    }
                });
            }
            $('a[data-role="miti-login"]').on("click", function(event) {
                event.preventDefault();
                dwUDBProxy.login();
            });
            $('a[data-role="miti-loginout"]').on("click", function(event) {
                event.preventDefault();
                dwUDBProxy.logout();
            });
        }, /**
			 * 意见反馈
			 **/
        contact = function() {
            $("body").on("click", ".contact-submit", function(event) {
                event.preventDefault();
                var _thisObj = $(this);
                var data = {};
                data.type = $("#contact-type").val();
                data.type_value = $("#contact-value").val();
                data.content = $("#contact-content").val();
                if (!data.content) {
                    return;
                }
                $.get(baseDpUrl + "advise", data, function(json) {
                    alert("感谢您的反馈！");
                    $("#pop-close").click();
                }, "json");
            });
        }, bindBtn = function() {
            $("#gotop-btn").on("click", function() {
                $("html,body").animate({
                    scrollTop: 0
                }, 200);
            });
            $("#feedback").on("click", function() {
                $("#pop-bg,#pop").show();
            });
            $("#pop-close").on("click", function() {
                $("#pop-bg,#pop").hide();
            });
            $(".video-info").on("mouseenter", "#video-share", function(event) {
                event.preventDefault();
                $(this).find(".ic-share").show();
            });
            $(".video-info").on("mouseleave", "#video-share", function(event) {
                event.preventDefault();
                $(this).find(".ic-share").hide();
            });
        }, init = function() {
            navFun();
            loginFun();
            bindBtn();
            contact();
        };
        return {
            init: init
        };
    }();
    duopai.init();
});