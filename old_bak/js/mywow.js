/**
 * Created by liujianzuo on 16/9/2.
 */
/*!
 */
function wowphp() {
    this.version = "0.1", this.ROOT = WOWPHP.ROOT, this.PUBLIC = WOWPHP.PUBLIC, this.DEEP = WOWPHP.DEEP, this.MODEL = WOWPHP.MODEL, this.VAR = WOWPHP.VAR, this.APP = WOWPHP.APP, this.User = WOWPHP.USERHASH, this.load = function (module, method, params, callback, onerror) {
        module = module || "index", method = method || "index", params = params || {}, callback = callback || !1, onerror = onerror || !1;
        var self = this, result = !1, purl = this.U(module + this.DEEP + method, "", "json");
        return $.ajax({
            async: !!callback,
            timeout: 15e4,
            type: "POST",
            url: this.DEEP + purl,
            data: params,
            processData: !0,
            datatype: "json",
            success: function (json) {
                if ("string" == typeof json) {
                    if (json.length < 1)return void self.growl(2, "鏈嶅姟鍣ㄥ嚭閿欙細JSON鏃犳晥,鏁版嵁涓虹┖", "鏈変汉瑕佹墸宸ヨ祫鍟�");
                    try {
                        result = eval("(" + json + ")")
                    } catch (e) {
                        return "undefined" != typeof console.log && console.log(json), self.growl(2, "鏈嶅姟鍣ㄨ繑鍥炴暟鎹棤娉曡В鏋�", "鏈変汉瑕佹墸宸ヨ祫鍟�"), !1
                    }
                } else result = json, 0 == result.status && self.growl(2, result.info, "鍑洪敊鍟�");
                null == result ? result = !1 : callback && callback(result)
            },
            error: function (a, b, c) {
                try {
                    if (window.top != window) {
                        if (401 == a.status)return self.loadDataStatus = 401, !1;
                        if ("undefined" != typeof self.loadDataStatus && 401 == self.loadDataStatus)return self.alert("姝ｅ湪楠岃瘉鐧诲綍鐘舵€�..."), !1;
                        sendMessageToGateway({HttpError: a.status})
                    }
                    callback && callback(null), self.showError(2, [b + " " + c])
                } catch (d) {
                }
            }
        }), result
    }, this.checklogin = function (a, b, c) {
        var b = b || !1;
        this.User ? b ? window.location.href = "/" + $wop.U(a) + "?callback=" + encodeURI(window.location.href) : c(this.User) : this.load("User", "checklogin", "", function (d) {
            d.info === b ? window.location.href = "/" + $wop.U(a) + "?callback=" + encodeURI(window.location.href) : c(d)
        })
    }, this.parse_url = function (a) {
        var b = a.match(/^(?:([a-z]+):\/\/)?([\w-]+(?:\.[\w-]+)+)?(?::(\d+))?([\w-\/]+)?(?:\?((?:\w+=[^#&=\/]*)?(?:&\w+=[^#&=\/]*)*))?(?:#([\w-]+))?$/i);
        return b || $.error("url鏍煎紡涓嶆纭紒"), {
            scheme: b[1],
            host: b[2],
            port: b[3],
            path: b[4],
            query: b[5],
            fragment: b[6]
        }
    }, this.parse_str = function (a) {
        var b, c = a.split("&"), d = {};
        for (val in c)b = c[val].split("="), d[b[0]] = b[1];
        return d
    }, this.parse_name = function (a, b) {
        return b ? (a.replace(/_([a-z])/g, function (a, b) {
            return b.toUpperCase()
        }), a.replace(/[a-z]/, function (a) {
            return a.toUpperCase()
        })) : (a = a.replace(/[A-Z]/g, function (a) {
            return "_" + a.toLowerCase()
        }), 0 === a.indexOf("_") && (a = a.substr(1))), a
    }, this.U = function (a, b, c) {
        var d = this.parse_url(a), e = [], f = {};
        return d.path || $.error("url鏍煎紡閿欒锛�"), a = d.path, 0 === a.indexOf("/") ? (0 == this.MODEL[0] && $.error("璇RL妯″紡涓嶆敮鎸佷娇鐢ㄨ矾鐢�!(" + a + ")"), "/" == a.substr(-1) && (a = a.substr(0, a.length - 1)), a = "/" == this.DEEP ? a.substr(1) : a.substr(1).replace(/\//g, this.DEEP), a = "/" + a) : (e = a.split("/"), e = [e.pop(), e.pop(), e.pop()].reverse(), e[1] || $.error("$wop.U(" + a + ")娌℃湁鎸囧畾鎺у埗鍣�"), e[0] && (f[this.VAR[0]] = this.MODEL[1] ? e[0].toLowerCase() : e[0]), f[this.VAR[1]] = this.MODEL[1] ? this.parse_name(e[1]) : e[1], f[this.VAR[2]] = e[2].toLowerCase(), a = "?" + $.param(f)), b && ("string" == typeof b ? b = this.parse_str(b) : $.isPlainObject(b) || (b = {})), d.query && $.extend(b, this.parse_str(d.query)), b && (a += "&" + $.param(b)), 0 != this.MODEL[0] && (a = a.replace("?" + (e[0] ? this.VAR[0] : this.VAR[1]) + "=", "/").replace("&" + this.VAR[1] + "=", this.DEEP).replace("&" + this.VAR[2] + "=", this.DEEP).replace(/(\w+=&)|(&?\w+=$)/g, "").replace(/[&=]/g, this.DEEP), !1 !== c && (c = c || this.MODEL[2].split("|")[0], c && (a += "." + c))), a = this.APP + a
    }, this.setValue = function (a, b) {
        var c, d, e = a.substr(0, 1), f = 0;
        if ("" !== b)if (c = "#" === e || "." === e ? $(a) : $("[name='" + a + "']"), c.eq(0).is(":radio"))c.filter("[value='" + b + "']").each(function () {
            this.checked = !0
        }); else if (c.eq(0).is(":checkbox"))for ($.isArray(b) ? d = b : (d = new Array, d[0] = b), f = 0, len = d.length; f < len; f++)c.filter("[value='" + d[f] + "']").each(function () {
            this.checked = !0
        }); else c.val(b)
    }, this.getUrlParams = function (a, b) {
        b = b || !1;
        var c = a || window.location.href, d = {};
        if (c.indexOf("?") < 0)return d;
        c = c.replace("#", "");
        var e = c.substring(c.indexOf("?") + 1, c.length).split("&");
        if (b)for (var f = 0; j = e[f]; f++)try {
            d[j.substring(0, j.indexOf("="))] = decodeURIComponent(j.substring(j.indexOf("=") + 1, j.length))
        } catch (g) {
            d[j.substring(0, j.indexOf("="))] = unescape(j.substring(j.indexOf("=") + 1, j.length))
        } else for (var f = 0; j = e[f]; f++)d[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        return d
    }, this.growl = function (a, b, c) {
        switch (a) {
            case 1:
                window.wownote.success(b, c);
                break;
            case 2:
                window.wownote.error(b, c);
                break;
            case 3:
                window.wownote.warning(b, c)
        }
    }, this.replayComment = function (a, b) {
        $("#cancelRepeat").length > 0 && $("#cancelRepeat").remove(), $("#comment-contents").attr("placeholder", "鍥炲 " + b + " 鐨勮瘎璁�"), $("body,html").animate({scrollTop: $("#comments").offset().top}, 500), $("#comment-contents").focus(), $("#commitComment").val("鍥炲").parent().prepend('<input class="btn btn-round btn-sm btn-danger" type="button" id="cancelRepeat" onclick="javascript:$wop.cancelRepeat()" value="鍙栨秷鍥炲">'), $("#comment-pid").val(a)
    }, this.cancelRepeat = function () {
        $("#cancelRepeat").remove(), $("#comment-pid").val(0), $("#comment-contents").attr("placeholder", "鍙戣〃浣犵殑鐪嬫硶"), $("#commitComment").val("鍙戣〃")
    }, this.loadCommentPage = function (a, b, c, d) {
        this.addSpinner(".comments"), $("#commentsPage").html("");
        var e = !0, f = "";
        null == d && (e = !1), d = d || 1, $wop.load(a, b, {did: c, page: d}, function (a) {
            a && a.info && a.info.list ? ($.each(a.info.list, function (a, b) {
                var c = b.pid > 0;
                f += "<li>", f += '    <a href="' + b.url + '" target="_profile">', f += '       <img alt="" src="' + b.uavatar + '!avatarlist">', f += "    </a>", f += "    <h6>", f += c ? '<a href="' + b.url + '" target="_profile">' + b.uname + '</a> 鍥炲 <a href="' + b.rurl + '" target="_profile">' + b.rname + "</a>" : '<a href="' + b.url + '" target="_profile">' + b.uname + '</a> <a class="comment-replay" href="javascript:$wop.replayComment(\'' + b.id + "','" + b.uname + "');\"><small>鍥炲</small></a>", f += "       <time>" + b.create_time + "</time>", f += "    </h6>", f += "    <p>" + b.content + "</p>", c && (f += '    <p class="bg-gray-light padding-10">' + b.fcontent + "</p>"), f += "</li>"
            }), $(".comments").html(f), "<ul class='pagination'>    </ul>" != a.info.page && $("#commentsPage").html('<nav class="text-center">' + a.info.page + "<nav>"), e && $("body,html").animate({scrollTop: $("#comments").offset().top}, 500)) : $(".comments").html('<div class="nocomment">杩樻湪鏈夎瘎璁哄摕</div>')
        })
    }, this.addSpinner = function (a) {
        var b = "";
        b += '<div class="spinner padding-10">', b += '    <span class="dot1"></span>', b += '    <span class="dot2"></span>', b += '    <span class="dot3"></span>', b += "</div>", $(a).html(b)
    }, this.ispc = function () {
        for (var a = navigator.userAgent, b = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"], c = !0, d = 0; d < b.length; d++)if (a.indexOf(b[d]) > 0) {
            c = !1;
            break
        }
        return c
    }, this.isMatch = function (a, b) {
        var c = a.indexOf(b);
        return c != -1
    }
}
if (!function (a, b) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function (a) {
            if (!a.document)throw new Error("jQuery requires a window with a document");
            return b(a)
        } : b(a)
    }("undefined" != typeof window ? window : this, function (a, b) {
        function c(a) {
            var b = "length" in a && a.length, c = _.type(a);
            return "function" !== c && !_.isWindow(a) && (!(1 !== a.nodeType || !b) || ("array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a))
        }

        function d(a, b, c) {
            if (_.isFunction(b))return _.grep(a, function (a, d) {
                return !!b.call(a, d, a) !== c
            });
            if (b.nodeType)return _.grep(a, function (a) {
                return a === b !== c
            });
            if ("string" == typeof b) {
                if (ha.test(b))return _.filter(b, a, c);
                b = _.filter(b, a)
            }
            return _.grep(a, function (a) {
                return U.call(b, a) >= 0 !== c
            })
        }

        function e(a, b) {
            for (; (a = a[b]) && 1 !== a.nodeType;);
            return a
        }

        function f(a) {
            var b = oa[a] = {};
            return _.each(a.match(na) || [], function (a, c) {
                b[c] = !0
            }), b
        }

        function g() {
            Z.removeEventListener("DOMContentLoaded", g, !1), a.removeEventListener("load", g, !1), _.ready()
        }

        function h() {
            Object.defineProperty(this.cache = {}, 0, {
                get: function () {
                    return {}
                }
            }), this.expando = _.expando + h.uid++
        }

        function i(a, b, c) {
            var d;
            if (void 0 === c && 1 === a.nodeType)if (d = "data-" + b.replace(ua, "-$1").toLowerCase(), c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = "true" === c || "false" !== c && ("null" === c ? null : +c + "" === c ? +c : ta.test(c) ? _.parseJSON(c) : c)
                } catch (e) {
                }
                sa.set(a, b, c)
            } else c = void 0;
            return c
        }

        function j() {
            return !0
        }

        function k() {
            return !1
        }

        function l() {
            try {
                return Z.activeElement
            } catch (a) {
            }
        }

        function m(a, b) {
            return _.nodeName(a, "table") && _.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
        }

        function n(a) {
            return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a
        }

        function o(a) {
            var b = Ka.exec(a.type);
            return b ? a.type = b[1] : a.removeAttribute("type"), a
        }

        function p(a, b) {
            for (var c = 0, d = a.length; d > c; c++)ra.set(a[c], "globalEval", !b || ra.get(b[c], "globalEval"))
        }

        function q(a, b) {
            var c, d, e, f, g, h, i, j;
            if (1 === b.nodeType) {
                if (ra.hasData(a) && (f = ra.access(a), g = ra.set(b, f), j = f.events)) {
                    delete g.handle, g.events = {};
                    for (e in j)for (c = 0, d = j[e].length; d > c; c++)_.event.add(b, e, j[e][c])
                }
                sa.hasData(a) && (h = sa.access(a), i = _.extend({}, h), sa.set(b, i))
            }
        }

        function r(a, b) {
            var c = a.getElementsByTagName ? a.getElementsByTagName(b || "*") : a.querySelectorAll ? a.querySelectorAll(b || "*") : [];
            return void 0 === b || b && _.nodeName(a, b) ? _.merge([a], c) : c
        }

        function s(a, b) {
            var c = b.nodeName.toLowerCase();
            "input" === c && ya.test(a.type) ? b.checked = a.checked : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
        }

        function t(b, c) {
            var d, e = _(c.createElement(b)).appendTo(c.body), f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : _.css(e[0], "display");
            return e.detach(), f
        }

        function u(a) {
            var b = Z, c = Oa[a];
            return c || (c = t(a, b), "none" !== c && c || (Na = (Na || _("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = Na[0].contentDocument, b.write(), b.close(), c = t(a, b), Na.detach()), Oa[a] = c), c
        }

        function v(a, b, c) {
            var d, e, f, g, h = a.style;
            return c = c || Ra(a), c && (g = c.getPropertyValue(b) || c[b]), c && ("" !== g || _.contains(a.ownerDocument, a) || (g = _.style(a, b)), Qa.test(g) && Pa.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 !== g ? g + "" : g
        }

        function w(a, b) {
            return {
                get: function () {
                    return a() ? void delete this.get : (this.get = b).apply(this, arguments)
                }
            }
        }

        function x(a, b) {
            if (b in a)return b;
            for (var c = b[0].toUpperCase() + b.slice(1), d = b, e = Xa.length; e--;)if (b = Xa[e] + c, b in a)return b;
            return d
        }

        function y(a, b, c) {
            var d = Ta.exec(b);
            return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
        }

        function z(a, b, c, d, e) {
            for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)"margin" === c && (g += _.css(a, c + wa[f], !0, e)), d ? ("content" === c && (g -= _.css(a, "padding" + wa[f], !0, e)), "margin" !== c && (g -= _.css(a, "border" + wa[f] + "Width", !0, e))) : (g += _.css(a, "padding" + wa[f], !0, e), "padding" !== c && (g += _.css(a, "border" + wa[f] + "Width", !0, e)));
            return g
        }

        function A(a, b, c) {
            var d = !0, e = "width" === b ? a.offsetWidth : a.offsetHeight, f = Ra(a), g = "border-box" === _.css(a, "boxSizing", !1, f);
            if (0 >= e || null == e) {
                if (e = v(a, b, f), (0 > e || null == e) && (e = a.style[b]), Qa.test(e))return e;
                d = g && (Y.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
            }
            return e + z(a, b, c || (g ? "border" : "content"), d, f) + "px"
        }

        function B(a, b) {
            for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)d = a[g], d.style && (f[g] = ra.get(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && xa(d) && (f[g] = ra.access(d, "olddisplay", u(d.nodeName)))) : (e = xa(d), "none" === c && e || ra.set(d, "olddisplay", e ? c : _.css(d, "display"))));
            for (g = 0; h > g; g++)d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
            return a
        }

        function C(a, b, c, d, e) {
            return new C.prototype.init(a, b, c, d, e)
        }

        function D() {
            return setTimeout(function () {
                Ya = void 0
            }), Ya = _.now()
        }

        function E(a, b) {
            var c, d = 0, e = {height: a};
            for (b = b ? 1 : 0; 4 > d; d += 2 - b)c = wa[d], e["margin" + c] = e["padding" + c] = a;
            return b && (e.opacity = e.width = a), e
        }

        function F(a, b, c) {
            for (var d, e = (cb[b] || []).concat(cb["*"]), f = 0, g = e.length; g > f; f++)if (d = e[f].call(c, b, a))return d
        }

        function G(a, b, c) {
            var d, e, f, g, h, i, j, k, l = this, m = {}, n = a.style, o = a.nodeType && xa(a), p = ra.get(a, "fxshow");
            c.queue || (h = _._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () {
                h.unqueued || i()
            }), h.unqueued++, l.always(function () {
                l.always(function () {
                    h.unqueued--, _.queue(a, "fx").length || h.empty.fire()
                })
            })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [n.overflow, n.overflowX, n.overflowY], j = _.css(a, "display"), k = "none" === j ? ra.get(a, "olddisplay") || u(a.nodeName) : j, "inline" === k && "none" === _.css(a, "float") && (n.display = "inline-block")), c.overflow && (n.overflow = "hidden", l.always(function () {
                n.overflow = c.overflow[0], n.overflowX = c.overflow[1], n.overflowY = c.overflow[2]
            }));
            for (d in b)if (e = b[d], $a.exec(e)) {
                if (delete b[d], f = f || "toggle" === e, e === (o ? "hide" : "show")) {
                    if ("show" !== e || !p || void 0 === p[d])continue;
                    o = !0
                }
                m[d] = p && p[d] || _.style(a, d)
            } else j = void 0;
            if (_.isEmptyObject(m))"inline" === ("none" === j ? u(a.nodeName) : j) && (n.display = j); else {
                p ? "hidden" in p && (o = p.hidden) : p = ra.access(a, "fxshow", {}), f && (p.hidden = !o), o ? _(a).show() : l.done(function () {
                    _(a).hide()
                }), l.done(function () {
                    var b;
                    ra.remove(a, "fxshow");
                    for (b in m)_.style(a, b, m[b])
                });
                for (d in m)g = F(o ? p[d] : 0, d, l), d in p || (p[d] = g.start, o && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
            }
        }

        function H(a, b) {
            var c, d, e, f, g;
            for (c in a)if (d = _.camelCase(c), e = b[d], f = a[c], _.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = _.cssHooks[d], g && "expand" in g) {
                f = g.expand(f), delete a[d];
                for (c in f)c in a || (a[c] = f[c], b[c] = e)
            } else b[d] = e
        }

        function I(a, b, c) {
            var d, e, f = 0, g = bb.length, h = _.Deferred().always(function () {
                delete i.elem
            }), i = function () {
                if (e)return !1;
                for (var b = Ya || D(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)j.tweens[g].run(f);
                return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
            }, j = h.promise({
                elem: a,
                props: _.extend({}, b),
                opts: _.extend(!0, {specialEasing: {}}, c),
                originalProperties: b,
                originalOptions: c,
                startTime: Ya || D(),
                duration: c.duration,
                tweens: [],
                createTween: function (b, c) {
                    var d = _.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                    return j.tweens.push(d), d
                },
                stop: function (b) {
                    var c = 0, d = b ? j.tweens.length : 0;
                    if (e)return this;
                    for (e = !0; d > c; c++)j.tweens[c].run(1);
                    return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
                }
            }), k = j.props;
            for (H(k, j.opts.specialEasing); g > f; f++)if (d = bb[f].call(j, a, k, j.opts))return d;
            return _.map(k, F, j), _.isFunction(j.opts.start) && j.opts.start.call(a, j), _.fx.timer(_.extend(i, {
                elem: a,
                anim: j,
                queue: j.opts.queue
            })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
        }

        function J(a) {
            return function (b, c) {
                "string" != typeof b && (c = b, b = "*");
                var d, e = 0, f = b.toLowerCase().match(na) || [];
                if (_.isFunction(c))for (; d = f[e++];)"+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
            }
        }

        function K(a, b, c, d) {
            function e(h) {
                var i;
                return f[h] = !0, _.each(a[h] || [], function (a, h) {
                    var j = h(b, c, d);
                    return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j), e(j), !1)
                }), i
            }

            var f = {}, g = a === tb;
            return e(b.dataTypes[0]) || !f["*"] && e("*")
        }

        function L(a, b) {
            var c, d, e = _.ajaxSettings.flatOptions || {};
            for (c in b)void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]);
            return d && _.extend(!0, a, d), a
        }

        function M(a, b, c) {
            for (var d, e, f, g, h = a.contents, i = a.dataTypes; "*" === i[0];)i.shift(), void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type"));
            if (d)for (e in h)if (h[e] && h[e].test(d)) {
                i.unshift(e);
                break
            }
            if (i[0] in c)f = i[0]; else {
                for (e in c) {
                    if (!i[0] || a.converters[e + " " + i[0]]) {
                        f = e;
                        break
                    }
                    g || (g = e)
                }
                f = f || g
            }
            return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
        }

        function N(a, b, c, d) {
            var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
            if (k[1])for (g in a.converters)j[g.toLowerCase()] = a.converters[g];
            for (f = k.shift(); f;)if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())if ("*" === f)f = i; else if ("*" !== i && i !== f) {
                if (g = j[i + " " + f] || j["* " + f], !g)for (e in j)if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                    g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                    break
                }
                if (g !== !0)if (g && a["throws"])b = g(b); else try {
                    b = g(b)
                } catch (l) {
                    return {state: "parsererror", error: g ? l : "No conversion from " + i + " to " + f}
                }
            }
            return {state: "success", data: b}
        }

        function O(a, b, c, d) {
            var e;
            if (_.isArray(b))_.each(b, function (b, e) {
                c || yb.test(a) ? d(a, e) : O(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
            }); else if (c || "object" !== _.type(b))d(a, b); else for (e in b)O(a + "[" + e + "]", b[e], c, d)
        }

        function P(a) {
            return _.isWindow(a) ? a : 9 === a.nodeType && a.defaultView
        }

        var Q = [], R = Q.slice, S = Q.concat, T = Q.push, U = Q.indexOf, V = {}, W = V.toString, X = V.hasOwnProperty, Y = {}, Z = a.document, $ = "2.1.4", _ = function (a, b) {
            return new _.fn.init(a, b)
        }, aa = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ba = /^-ms-/, ca = /-([\da-z])/gi, da = function (a, b) {
            return b.toUpperCase()
        };
        _.fn = _.prototype = {
            jquery: $, constructor: _, selector: "", length: 0, toArray: function () {
                return R.call(this)
            }, get: function (a) {
                return null != a ? 0 > a ? this[a + this.length] : this[a] : R.call(this)
            }, pushStack: function (a) {
                var b = _.merge(this.constructor(), a);
                return b.prevObject = this, b.context = this.context, b
            }, each: function (a, b) {
                return _.each(this, a, b)
            }, map: function (a) {
                return this.pushStack(_.map(this, function (b, c) {
                    return a.call(b, c, b)
                }))
            }, slice: function () {
                return this.pushStack(R.apply(this, arguments))
            }, first: function () {
                return this.eq(0)
            }, last: function () {
                return this.eq(-1)
            }, eq: function (a) {
                var b = this.length, c = +a + (0 > a ? b : 0);
                return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
            }, end: function () {
                return this.prevObject || this.constructor(null)
            }, push: T, sort: Q.sort, splice: Q.splice
        }, _.extend = _.fn.extend = function () {
            var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
            for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || _.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)if (null != (a = arguments[h]))for (b in a)c = g[b], d = a[b], g !== d && (j && d && (_.isPlainObject(d) || (e = _.isArray(d))) ? (e ? (e = !1, f = c && _.isArray(c) ? c : []) : f = c && _.isPlainObject(c) ? c : {}, g[b] = _.extend(j, f, d)) : void 0 !== d && (g[b] = d));
            return g
        }, _.extend({
            expando: "jQuery" + ($ + Math.random()).replace(/\D/g, ""), isReady: !0, error: function (a) {
                throw new Error(a)
            }, noop: function () {
            }, isFunction: function (a) {
                return "function" === _.type(a)
            }, isArray: Array.isArray, isWindow: function (a) {
                return null != a && a === a.window
            }, isNumeric: function (a) {
                return !_.isArray(a) && a - parseFloat(a) + 1 >= 0
            }, isPlainObject: function (a) {
                return "object" === _.type(a) && !a.nodeType && !_.isWindow(a) && !(a.constructor && !X.call(a.constructor.prototype, "isPrototypeOf"))
            }, isEmptyObject: function (a) {
                var b;
                for (b in a)return !1;
                return !0
            }, type: function (a) {
                return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? V[W.call(a)] || "object" : typeof a
            }, globalEval: function (a) {
                var b, c = eval;
                a = _.trim(a), a && (1 === a.indexOf("use strict") ? (b = Z.createElement("script"), b.text = a, Z.head.appendChild(b).parentNode.removeChild(b)) : c(a))
            }, camelCase: function (a) {
                return a.replace(ba, "ms-").replace(ca, da)
            }, nodeName: function (a, b) {
                return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
            }, each: function (a, b, d) {
                var e, f = 0, g = a.length, h = c(a);
                if (d) {
                    if (h)for (; g > f && (e = b.apply(a[f], d), e !== !1); f++); else for (f in a)if (e = b.apply(a[f], d), e === !1)break
                } else if (h)for (; g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++); else for (f in a)if (e = b.call(a[f], f, a[f]), e === !1)break;
                return a
            }, trim: function (a) {
                return null == a ? "" : (a + "").replace(aa, "")
            }, makeArray: function (a, b) {
                var d = b || [];
                return null != a && (c(Object(a)) ? _.merge(d, "string" == typeof a ? [a] : a) : T.call(d, a)), d
            }, inArray: function (a, b, c) {
                return null == b ? -1 : U.call(b, a, c)
            }, merge: function (a, b) {
                for (var c = +b.length, d = 0, e = a.length; c > d; d++)a[e++] = b[d];
                return a.length = e, a
            }, grep: function (a, b, c) {
                for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)d = !b(a[f], f), d !== h && e.push(a[f]);
                return e
            }, map: function (a, b, d) {
                var e, f = 0, g = a.length, h = c(a), i = [];
                if (h)for (; g > f; f++)e = b(a[f], f, d), null != e && i.push(e); else for (f in a)e = b(a[f], f, d), null != e && i.push(e);
                return S.apply([], i)
            }, guid: 1, proxy: function (a, b) {
                var c, d, e;
                return "string" == typeof b && (c = a[b], b = a, a = c), _.isFunction(a) ? (d = R.call(arguments, 2), e = function () {
                    return a.apply(b || this, d.concat(R.call(arguments)))
                }, e.guid = a.guid = a.guid || _.guid++, e) : void 0
            }, now: Date.now, support: Y
        }), _.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) {
            V["[object " + b + "]"] = b.toLowerCase()
        });
        var ea = function (a) {
            function b(a, b, c, d) {
                var e, f, g, h, i, j, l, n, o, p;
                if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], h = b.nodeType, "string" != typeof a || !a || 1 !== h && 9 !== h && 11 !== h)return c;
                if (!d && I) {
                    if (11 !== h && (e = sa.exec(a)))if (g = e[1]) {
                        if (9 === h) {
                            if (f = b.getElementById(g), !f || !f.parentNode)return c;
                            if (f.id === g)return c.push(f), c
                        } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g)return c.push(f), c
                    } else {
                        if (e[2])return $.apply(c, b.getElementsByTagName(a)), c;
                        if ((g = e[3]) && v.getElementsByClassName)return $.apply(c, b.getElementsByClassName(g)), c
                    }
                    if (v.qsa && (!J || !J.test(a))) {
                        if (n = l = N, o = b, p = 1 !== h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
                            for (j = z(a), (l = b.getAttribute("id")) ? n = l.replace(ua, "\\$&") : b.setAttribute("id", n), n = "[id='" + n + "'] ", i = j.length; i--;)j[i] = n + m(j[i]);
                            o = ta.test(a) && k(b.parentNode) || b, p = j.join(",")
                        }
                        if (p)try {
                            return $.apply(c, o.querySelectorAll(p)), c
                        } catch (q) {
                        } finally {
                            l || b.removeAttribute("id")
                        }
                    }
                }
                return B(a.replace(ia, "$1"), b, c, d)
            }

            function c() {
                function a(c, d) {
                    return b.push(c + " ") > w.cacheLength && delete a[b.shift()], a[c + " "] = d
                }

                var b = [];
                return a
            }

            function d(a) {
                return a[N] = !0, a
            }

            function e(a) {
                var b = G.createElement("div");
                try {
                    return !!a(b)
                } catch (c) {
                    return !1
                } finally {
                    b.parentNode && b.parentNode.removeChild(b), b = null
                }
            }

            function f(a, b) {
                for (var c = a.split("|"), d = a.length; d--;)w.attrHandle[c[d]] = b
            }

            function g(a, b) {
                var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || V) - (~a.sourceIndex || V);
                if (d)return d;
                if (c)for (; c = c.nextSibling;)if (c === b)return -1;
                return a ? 1 : -1
            }

            function h(a) {
                return function (b) {
                    var c = b.nodeName.toLowerCase();
                    return "input" === c && b.type === a
                }
            }

            function i(a) {
                return function (b) {
                    var c = b.nodeName.toLowerCase();
                    return ("input" === c || "button" === c) && b.type === a
                }
            }

            function j(a) {
                return d(function (b) {
                    return b = +b, d(function (c, d) {
                        for (var e, f = a([], c.length, b), g = f.length; g--;)c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                    })
                })
            }

            function k(a) {
                return a && "undefined" != typeof a.getElementsByTagName && a
            }

            function l() {
            }

            function m(a) {
                for (var b = 0, c = a.length, d = ""; c > b; b++)d += a[b].value;
                return d
            }

            function n(a, b, c) {
                var d = b.dir, e = c && "parentNode" === d, f = Q++;
                return b.first ? function (b, c, f) {
                    for (; b = b[d];)if (1 === b.nodeType || e)return a(b, c, f)
                } : function (b, c, g) {
                    var h, i, j = [P, f];
                    if (g) {
                        for (; b = b[d];)if ((1 === b.nodeType || e) && a(b, c, g))return !0
                    } else for (; b = b[d];)if (1 === b.nodeType || e) {
                        if (i = b[N] || (b[N] = {}), (h = i[d]) && h[0] === P && h[1] === f)return j[2] = h[2];
                        if (i[d] = j, j[2] = a(b, c, g))return !0
                    }
                }
            }

            function o(a) {
                return a.length > 1 ? function (b, c, d) {
                    for (var e = a.length; e--;)if (!a[e](b, c, d))return !1;
                    return !0
                } : a[0]
            }

            function p(a, c, d) {
                for (var e = 0, f = c.length; f > e; e++)b(a, c[e], d);
                return d
            }

            function q(a, b, c, d, e) {
                for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
                return g
            }

            function r(a, b, c, e, f, g) {
                return e && !e[N] && (e = r(e)), f && !f[N] && (f = r(f, g)), d(function (d, g, h, i) {
                    var j, k, l, m = [], n = [], o = g.length, r = d || p(b || "*", h.nodeType ? [h] : h, []), s = !a || !d && b ? r : q(r, m, a, h, i), t = c ? f || (d ? a : o || e) ? [] : g : s;
                    if (c && c(s, t, h, i), e)for (j = q(t, n), e(j, [], h, i), k = j.length; k--;)(l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                    if (d) {
                        if (f || a) {
                            if (f) {
                                for (j = [], k = t.length; k--;)(l = t[k]) && j.push(s[k] = l);
                                f(null, t = [], j, i)
                            }
                            for (k = t.length; k--;)(l = t[k]) && (j = f ? aa(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
                        }
                    } else t = q(t === g ? t.splice(o, t.length) : t), f ? f(null, g, t, i) : $.apply(g, t)
                })
            }

            function s(a) {
                for (var b, c, d, e = a.length, f = w.relative[a[0].type], g = f || w.relative[" "], h = f ? 1 : 0, i = n(function (a) {
                    return a === b
                }, g, !0), j = n(function (a) {
                    return aa(b, a) > -1
                }, g, !0), k = [function (a, c, d) {
                    var e = !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                    return b = null, e
                }]; e > h; h++)if (c = w.relative[a[h].type])k = [n(o(k), c)]; else {
                    if (c = w.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                        for (d = ++h; e > d && !w.relative[a[d].type]; d++);
                        return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({value: " " === a[h - 2].type ? "*" : ""})).replace(ia, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && m(a))
                    }
                    k.push(c)
                }
                return o(k)
            }

            function t(a, c) {
                var e = c.length > 0, f = a.length > 0, g = function (d, g, h, i, j) {
                    var k, l, m, n = 0, o = "0", p = d && [], r = [], s = C, t = d || f && w.find.TAG("*", j), u = P += null == s ? 1 : Math.random() || .1, v = t.length;
                    for (j && (C = g !== G && g); o !== v && null != (k = t[o]); o++) {
                        if (f && k) {
                            for (l = 0; m = a[l++];)if (m(k, g, h)) {
                                i.push(k);
                                break
                            }
                            j && (P = u)
                        }
                        e && ((k = !m && k) && n--, d && p.push(k))
                    }
                    if (n += o, e && o !== n) {
                        for (l = 0; m = c[l++];)m(p, r, g, h);
                        if (d) {
                            if (n > 0)for (; o--;)p[o] || r[o] || (r[o] = Y.call(i));
                            r = q(r)
                        }
                        $.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i)
                    }
                    return j && (P = u, C = s), p
                };
                return e ? d(g) : g
            }

            var u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + 1 * new Date, O = a.document, P = 0, Q = 0, R = c(), S = c(), T = c(), U = function (a, b) {
                return a === b && (E = !0), 0
            }, V = 1 << 31, W = {}.hasOwnProperty, X = [], Y = X.pop, Z = X.push, $ = X.push, _ = X.slice, aa = function (a, b) {
                for (var c = 0, d = a.length; d > c; c++)if (a[c] === b)return c;
                return -1
            }, ba = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", ca = "[\\x20\\t\\r\\n\\f]", da = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", ea = da.replace("w", "w#"), fa = "\\[" + ca + "*(" + da + ")(?:" + ca + "*([*^$|!~]?=)" + ca + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ea + "))|)" + ca + "*\\]", ga = ":(" + da + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + fa + ")*)|.*)\\)|)", ha = new RegExp(ca + "+", "g"), ia = new RegExp("^" + ca + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ca + "+$", "g"), ja = new RegExp("^" + ca + "*," + ca + "*"), ka = new RegExp("^" + ca + "*([>+~]|" + ca + ")" + ca + "*"), la = new RegExp("=" + ca + "*([^\\]'\"]*?)" + ca + "*\\]", "g"), ma = new RegExp(ga), na = new RegExp("^" + ea + "$"), oa = {
                ID: new RegExp("^#(" + da + ")"),
                CLASS: new RegExp("^\\.(" + da + ")"),
                TAG: new RegExp("^(" + da.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + fa),
                PSEUDO: new RegExp("^" + ga),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ca + "*(even|odd|(([+-]|)(\\d*)n|)" + ca + "*(?:([+-]|)" + ca + "*(\\d+)|))" + ca + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + ba + ")$", "i"),
                needsContext: new RegExp("^" + ca + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ca + "*((?:-\\d)?\\d*)" + ca + "*\\)|)(?=[^-]|$)", "i")
            }, pa = /^(?:input|select|textarea|button)$/i, qa = /^h\d$/i, ra = /^[^{]+\{\s*\[native \w/, sa = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ta = /[+~]/, ua = /'|\\/g, va = new RegExp("\\\\([\\da-f]{1,6}" + ca + "?|(" + ca + ")|.)", "ig"), wa = function (a, b, c) {
                var d = "0x" + b - 65536;
                return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
            }, xa = function () {
                F()
            };
            try {
                $.apply(X = _.call(O.childNodes), O.childNodes), X[O.childNodes.length].nodeType
            } catch (ya) {
                $ = {
                    apply: X.length ? function (a, b) {
                        Z.apply(a, _.call(b))
                    } : function (a, b) {
                        for (var c = a.length, d = 0; a[c++] = b[d++];);
                        a.length = c - 1
                    }
                }
            }
            v = b.support = {}, y = b.isXML = function (a) {
                var b = a && (a.ownerDocument || a).documentElement;
                return !!b && "HTML" !== b.nodeName
            }, F = b.setDocument = function (a) {
                var b, c, d = a ? a.ownerDocument || a : O;
                return d !== G && 9 === d.nodeType && d.documentElement ? (G = d, H = d.documentElement, c = d.defaultView, c && c !== c.top && (c.addEventListener ? c.addEventListener("unload", xa, !1) : c.attachEvent && c.attachEvent("onunload", xa)), I = !y(d), v.attributes = e(function (a) {
                    return a.className = "i", !a.getAttribute("className")
                }), v.getElementsByTagName = e(function (a) {
                    return a.appendChild(d.createComment("")), !a.getElementsByTagName("*").length
                }), v.getElementsByClassName = ra.test(d.getElementsByClassName), v.getById = e(function (a) {
                    return H.appendChild(a).id = N, !d.getElementsByName || !d.getElementsByName(N).length
                }), v.getById ? (w.find.ID = function (a, b) {
                    if ("undefined" != typeof b.getElementById && I) {
                        var c = b.getElementById(a);
                        return c && c.parentNode ? [c] : []
                    }
                }, w.filter.ID = function (a) {
                    var b = a.replace(va, wa);
                    return function (a) {
                        return a.getAttribute("id") === b
                    }
                }) : (delete w.find.ID, w.filter.ID = function (a) {
                    var b = a.replace(va, wa);
                    return function (a) {
                        var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                        return c && c.value === b
                    }
                }), w.find.TAG = v.getElementsByTagName ? function (a, b) {
                    return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0
                } : function (a, b) {
                    var c, d = [], e = 0, f = b.getElementsByTagName(a);
                    if ("*" === a) {
                        for (; c = f[e++];)1 === c.nodeType && d.push(c);
                        return d
                    }
                    return f
                }, w.find.CLASS = v.getElementsByClassName && function (a, b) {
                        return I ? b.getElementsByClassName(a) : void 0
                    }, K = [], J = [], (v.qsa = ra.test(d.querySelectorAll)) && (e(function (a) {
                    H.appendChild(a).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\f]' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && J.push("[*^$]=" + ca + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || J.push("\\[" + ca + "*(?:value|" + ba + ")"), a.querySelectorAll("[id~=" + N + "-]").length || J.push("~="), a.querySelectorAll(":checked").length || J.push(":checked"), a.querySelectorAll("a#" + N + "+*").length || J.push(".#.+[+~]")
                }), e(function (a) {
                    var b = d.createElement("input");
                    b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && J.push("name" + ca + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), J.push(",.*:")
                })), (v.matchesSelector = ra.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function (a) {
                    v.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", ga)
                }), J = J.length && new RegExp(J.join("|")), K = K.length && new RegExp(K.join("|")), b = ra.test(H.compareDocumentPosition), M = b || ra.test(H.contains) ? function (a, b) {
                    var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
                    return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                } : function (a, b) {
                    if (b)for (; b = b.parentNode;)if (b === a)return !0;
                    return !1
                }, U = b ? function (a, b) {
                    if (a === b)return E = !0, 0;
                    var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                    return c ? c : (c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & c || !v.sortDetached && b.compareDocumentPosition(a) === c ? a === d || a.ownerDocument === O && M(O, a) ? -1 : b === d || b.ownerDocument === O && M(O, b) ? 1 : D ? aa(D, a) - aa(D, b) : 0 : 4 & c ? -1 : 1)
                } : function (a, b) {
                    if (a === b)return E = !0, 0;
                    var c, e = 0, f = a.parentNode, h = b.parentNode, i = [a], j = [b];
                    if (!f || !h)return a === d ? -1 : b === d ? 1 : f ? -1 : h ? 1 : D ? aa(D, a) - aa(D, b) : 0;
                    if (f === h)return g(a, b);
                    for (c = a; c = c.parentNode;)i.unshift(c);
                    for (c = b; c = c.parentNode;)j.unshift(c);
                    for (; i[e] === j[e];)e++;
                    return e ? g(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
                }, d) : G
            }, b.matches = function (a, c) {
                return b(a, null, null, c)
            }, b.matchesSelector = function (a, c) {
                if ((a.ownerDocument || a) !== G && F(a), c = c.replace(la, "='$1']"), !(!v.matchesSelector || !I || K && K.test(c) || J && J.test(c)))try {
                    var d = L.call(a, c);
                    if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType)return d
                } catch (e) {
                }
                return b(c, G, null, [a]).length > 0
            }, b.contains = function (a, b) {
                return (a.ownerDocument || a) !== G && F(a), M(a, b)
            }, b.attr = function (a, b) {
                (a.ownerDocument || a) !== G && F(a);
                var c = w.attrHandle[b.toLowerCase()], d = c && W.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
                return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
            }, b.error = function (a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            }, b.uniqueSort = function (a) {
                var b, c = [], d = 0, e = 0;
                if (E = !v.detectDuplicates, D = !v.sortStable && a.slice(0), a.sort(U), E) {
                    for (; b = a[e++];)b === a[e] && (d = c.push(e));
                    for (; d--;)a.splice(c[d], 1)
                }
                return D = null, a
            }, x = b.getText = function (a) {
                var b, c = "", d = 0, e = a.nodeType;
                if (e) {
                    if (1 === e || 9 === e || 11 === e) {
                        if ("string" == typeof a.textContent)return a.textContent;
                        for (a = a.firstChild; a; a = a.nextSibling)c += x(a)
                    } else if (3 === e || 4 === e)return a.nodeValue
                } else for (; b = a[d++];)c += x(b);
                return c
            }, w = b.selectors = {
                cacheLength: 50,
                createPseudo: d,
                match: oa,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {dir: "parentNode", first: !0},
                    " ": {dir: "parentNode"},
                    "+": {dir: "previousSibling", first: !0},
                    "~": {dir: "previousSibling"}
                },
                preFilter: {
                    ATTR: function (a) {
                        return a[1] = a[1].replace(va, wa), a[3] = (a[3] || a[4] || a[5] || "").replace(va, wa), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                    }, CHILD: function (a) {
                        return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), a
                    }, PSEUDO: function (a) {
                        var b, c = !a[6] && a[2];
                        return oa.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && ma.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function (a) {
                        var b = a.replace(va, wa).toLowerCase();
                        return "*" === a ? function () {
                            return !0
                        } : function (a) {
                            return a.nodeName && a.nodeName.toLowerCase() === b
                        }
                    }, CLASS: function (a) {
                        var b = R[a + " "];
                        return b || (b = new RegExp("(^|" + ca + ")" + a + "(" + ca + "|$)")) && R(a, function (a) {
                                return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "");
                            })
                    }, ATTR: function (a, c, d) {
                        return function (e) {
                            var f = b.attr(e, a);
                            return null == f ? "!=" === c : !c || (f += "", "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f.replace(ha, " ") + " ").indexOf(d) > -1 : "|=" === c && (f === d || f.slice(0, d.length + 1) === d + "-"))
                        }
                    }, CHILD: function (a, b, c, d, e) {
                        var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b;
                        return 1 === d && 0 === e ? function (a) {
                            return !!a.parentNode
                        } : function (b, c, i) {
                            var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h;
                            if (q) {
                                if (f) {
                                    for (; p;) {
                                        for (l = b; l = l[p];)if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)return !1;
                                        o = p = "only" === a && !o && "nextSibling"
                                    }
                                    return !0
                                }
                                if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                    for (k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop();)if (1 === l.nodeType && ++m && l === b) {
                                        k[a] = [P, n, m];
                                        break
                                    }
                                } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P)m = j[1]; else for (; (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [P, m]), l !== b)););
                                return m -= e, m === d || m % d === 0 && m / d >= 0
                            }
                        }
                    }, PSEUDO: function (a, c) {
                        var e, f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                        return f[N] ? f(c) : f.length > 1 ? (e = [a, a, "", c], w.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function (a, b) {
                            for (var d, e = f(a, c), g = e.length; g--;)d = aa(a, e[g]), a[d] = !(b[d] = e[g])
                        }) : function (a) {
                            return f(a, 0, e)
                        }) : f
                    }
                },
                pseudos: {
                    not: d(function (a) {
                        var b = [], c = [], e = A(a.replace(ia, "$1"));
                        return e[N] ? d(function (a, b, c, d) {
                            for (var f, g = e(a, null, d, []), h = a.length; h--;)(f = g[h]) && (a[h] = !(b[h] = f))
                        }) : function (a, d, f) {
                            return b[0] = a, e(b, null, f, c), b[0] = null, !c.pop()
                        }
                    }), has: d(function (a) {
                        return function (c) {
                            return b(a, c).length > 0
                        }
                    }), contains: d(function (a) {
                        return a = a.replace(va, wa), function (b) {
                            return (b.textContent || b.innerText || x(b)).indexOf(a) > -1
                        }
                    }), lang: d(function (a) {
                        return na.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(va, wa).toLowerCase(), function (b) {
                            var c;
                            do if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                            return !1
                        }
                    }), target: function (b) {
                        var c = a.location && a.location.hash;
                        return c && c.slice(1) === b.id
                    }, root: function (a) {
                        return a === H
                    }, focus: function (a) {
                        return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                    }, enabled: function (a) {
                        return a.disabled === !1
                    }, disabled: function (a) {
                        return a.disabled === !0
                    }, checked: function (a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && !!a.checked || "option" === b && !!a.selected
                    }, selected: function (a) {
                        return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                    }, empty: function (a) {
                        for (a = a.firstChild; a; a = a.nextSibling)if (a.nodeType < 6)return !1;
                        return !0
                    }, parent: function (a) {
                        return !w.pseudos.empty(a)
                    }, header: function (a) {
                        return qa.test(a.nodeName)
                    }, input: function (a) {
                        return pa.test(a.nodeName)
                    }, button: function (a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && "button" === a.type || "button" === b
                    }, text: function (a) {
                        var b;
                        return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                    }, first: j(function () {
                        return [0]
                    }), last: j(function (a, b) {
                        return [b - 1]
                    }), eq: j(function (a, b, c) {
                        return [0 > c ? c + b : c]
                    }), even: j(function (a, b) {
                        for (var c = 0; b > c; c += 2)a.push(c);
                        return a
                    }), odd: j(function (a, b) {
                        for (var c = 1; b > c; c += 2)a.push(c);
                        return a
                    }), lt: j(function (a, b, c) {
                        for (var d = 0 > c ? c + b : c; --d >= 0;)a.push(d);
                        return a
                    }), gt: j(function (a, b, c) {
                        for (var d = 0 > c ? c + b : c; ++d < b;)a.push(d);
                        return a
                    })
                }
            }, w.pseudos.nth = w.pseudos.eq;
            for (u in{radio: !0, checkbox: !0, file: !0, password: !0, image: !0})w.pseudos[u] = h(u);
            for (u in{submit: !0, reset: !0})w.pseudos[u] = i(u);
            return l.prototype = w.filters = w.pseudos, w.setFilters = new l, z = b.tokenize = function (a, c) {
                var d, e, f, g, h, i, j, k = S[a + " "];
                if (k)return c ? 0 : k.slice(0);
                for (h = a, i = [], j = w.preFilter; h;) {
                    (!d || (e = ja.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = ka.exec(h)) && (d = e.shift(), f.push({
                        value: d,
                        type: e[0].replace(ia, " ")
                    }), h = h.slice(d.length));
                    for (g in w.filter)!(e = oa[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
                        value: d,
                        type: g,
                        matches: e
                    }), h = h.slice(d.length));
                    if (!d)break
                }
                return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
            }, A = b.compile = function (a, b) {
                var c, d = [], e = [], f = T[a + " "];
                if (!f) {
                    for (b || (b = z(a)), c = b.length; c--;)f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                    f = T(a, t(e, d)), f.selector = a
                }
                return f
            }, B = b.select = function (a, b, c, d) {
                var e, f, g, h, i, j = "function" == typeof a && a, l = !d && z(a = j.selector || a);
                if (c = c || [], 1 === l.length) {
                    if (f = l[0] = l[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
                        if (b = (w.find.ID(g.matches[0].replace(va, wa), b) || [])[0], !b)return c;
                        j && (b = b.parentNode), a = a.slice(f.shift().value.length)
                    }
                    for (e = oa.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !w.relative[h = g.type]);)if ((i = w.find[h]) && (d = i(g.matches[0].replace(va, wa), ta.test(f[0].type) && k(b.parentNode) || b))) {
                        if (f.splice(e, 1), a = d.length && m(f), !a)return $.apply(c, d), c;
                        break
                    }
                }
                return (j || A(a, l))(d, b, !I, c, ta.test(a) && k(b.parentNode) || b), c
            }, v.sortStable = N.split("").sort(U).join("") === N, v.detectDuplicates = !!E, F(), v.sortDetached = e(function (a) {
                return 1 & a.compareDocumentPosition(G.createElement("div"))
            }), e(function (a) {
                return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
            }) || f("type|href|height|width", function (a, b, c) {
                return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
            }), v.attributes && e(function (a) {
                return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
            }) || f("value", function (a, b, c) {
                return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
            }), e(function (a) {
                return null == a.getAttribute("disabled")
            }) || f(ba, function (a, b, c) {
                var d;
                return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
            }), b
        }(a);
        _.find = ea, _.expr = ea.selectors, _.expr[":"] = _.expr.pseudos, _.unique = ea.uniqueSort, _.text = ea.getText, _.isXMLDoc = ea.isXML, _.contains = ea.contains;
        var fa = _.expr.match.needsContext, ga = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, ha = /^.[^:#\[\.,]*$/;
        _.filter = function (a, b, c) {
            var d = b[0];
            return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? _.find.matchesSelector(d, a) ? [d] : [] : _.find.matches(a, _.grep(b, function (a) {
                return 1 === a.nodeType
            }))
        }, _.fn.extend({
            find: function (a) {
                var b, c = this.length, d = [], e = this;
                if ("string" != typeof a)return this.pushStack(_(a).filter(function () {
                    for (b = 0; c > b; b++)if (_.contains(e[b], this))return !0
                }));
                for (b = 0; c > b; b++)_.find(a, e[b], d);
                return d = this.pushStack(c > 1 ? _.unique(d) : d), d.selector = this.selector ? this.selector + " " + a : a, d
            }, filter: function (a) {
                return this.pushStack(d(this, a || [], !1))
            }, not: function (a) {
                return this.pushStack(d(this, a || [], !0))
            }, is: function (a) {
                return !!d(this, "string" == typeof a && fa.test(a) ? _(a) : a || [], !1).length
            }
        });
        var ia, ja = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, ka = _.fn.init = function (a, b) {
            var c, d;
            if (!a)return this;
            if ("string" == typeof a) {
                if (c = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : ja.exec(a), !c || !c[1] && b)return !b || b.jquery ? (b || ia).find(a) : this.constructor(b).find(a);
                if (c[1]) {
                    if (b = b instanceof _ ? b[0] : b, _.merge(this, _.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : Z, !0)), ga.test(c[1]) && _.isPlainObject(b))for (c in b)_.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                    return this
                }
                return d = Z.getElementById(c[2]), d && d.parentNode && (this.length = 1, this[0] = d), this.context = Z, this.selector = a, this
            }
            return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : _.isFunction(a) ? "undefined" != typeof ia.ready ? ia.ready(a) : a(_) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), _.makeArray(a, this))
        };
        ka.prototype = _.fn, ia = _(Z);
        var la = /^(?:parents|prev(?:Until|All))/, ma = {children: !0, contents: !0, next: !0, prev: !0};
        _.extend({
            dir: function (a, b, c) {
                for (var d = [], e = void 0 !== c; (a = a[b]) && 9 !== a.nodeType;)if (1 === a.nodeType) {
                    if (e && _(a).is(c))break;
                    d.push(a)
                }
                return d
            }, sibling: function (a, b) {
                for (var c = []; a; a = a.nextSibling)1 === a.nodeType && a !== b && c.push(a);
                return c
            }
        }), _.fn.extend({
            has: function (a) {
                var b = _(a, this), c = b.length;
                return this.filter(function () {
                    for (var a = 0; c > a; a++)if (_.contains(this, b[a]))return !0
                })
            }, closest: function (a, b) {
                for (var c, d = 0, e = this.length, f = [], g = fa.test(a) || "string" != typeof a ? _(a, b || this.context) : 0; e > d; d++)for (c = this[d]; c && c !== b; c = c.parentNode)if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && _.find.matchesSelector(c, a))) {
                    f.push(c);
                    break
                }
                return this.pushStack(f.length > 1 ? _.unique(f) : f)
            }, index: function (a) {
                return a ? "string" == typeof a ? U.call(_(a), this[0]) : U.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            }, add: function (a, b) {
                return this.pushStack(_.unique(_.merge(this.get(), _(a, b))))
            }, addBack: function (a) {
                return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
            }
        }), _.each({
            parent: function (a) {
                var b = a.parentNode;
                return b && 11 !== b.nodeType ? b : null
            }, parents: function (a) {
                return _.dir(a, "parentNode")
            }, parentsUntil: function (a, b, c) {
                return _.dir(a, "parentNode", c)
            }, next: function (a) {
                return e(a, "nextSibling")
            }, prev: function (a) {
                return e(a, "previousSibling")
            }, nextAll: function (a) {
                return _.dir(a, "nextSibling")
            }, prevAll: function (a) {
                return _.dir(a, "previousSibling")
            }, nextUntil: function (a, b, c) {
                return _.dir(a, "nextSibling", c)
            }, prevUntil: function (a, b, c) {
                return _.dir(a, "previousSibling", c)
            }, siblings: function (a) {
                return _.sibling((a.parentNode || {}).firstChild, a)
            }, children: function (a) {
                return _.sibling(a.firstChild)
            }, contents: function (a) {
                return a.contentDocument || _.merge([], a.childNodes)
            }
        }, function (a, b) {
            _.fn[a] = function (c, d) {
                var e = _.map(this, b, c);
                return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = _.filter(d, e)), this.length > 1 && (ma[a] || _.unique(e), la.test(a) && e.reverse()), this.pushStack(e)
            }
        });
        var na = /\S+/g, oa = {};
        _.Callbacks = function (a) {
            a = "string" == typeof a ? oa[a] || f(a) : _.extend({}, a);
            var b, c, d, e, g, h, i = [], j = !a.once && [], k = function (f) {
                for (b = a.memory && f, c = !0, h = e || 0, e = 0, g = i.length, d = !0; i && g > h; h++)if (i[h].apply(f[0], f[1]) === !1 && a.stopOnFalse) {
                    b = !1;
                    break
                }
                d = !1, i && (j ? j.length && k(j.shift()) : b ? i = [] : l.disable())
            }, l = {
                add: function () {
                    if (i) {
                        var c = i.length;
                        !function f(b) {
                            _.each(b, function (b, c) {
                                var d = _.type(c);
                                "function" === d ? a.unique && l.has(c) || i.push(c) : c && c.length && "string" !== d && f(c)
                            })
                        }(arguments), d ? g = i.length : b && (e = c, k(b))
                    }
                    return this
                }, remove: function () {
                    return i && _.each(arguments, function (a, b) {
                        for (var c; (c = _.inArray(b, i, c)) > -1;)i.splice(c, 1), d && (g >= c && g--, h >= c && h--)
                    }), this
                }, has: function (a) {
                    return a ? _.inArray(a, i) > -1 : !(!i || !i.length)
                }, empty: function () {
                    return i = [], g = 0, this
                }, disable: function () {
                    return i = j = b = void 0, this
                }, disabled: function () {
                    return !i
                }, lock: function () {
                    return j = void 0, b || l.disable(), this
                }, locked: function () {
                    return !j
                }, fireWith: function (a, b) {
                    return !i || c && !j || (b = b || [], b = [a, b.slice ? b.slice() : b], d ? j.push(b) : k(b)), this
                }, fire: function () {
                    return l.fireWith(this, arguments), this
                }, fired: function () {
                    return !!c
                }
            };
            return l
        }, _.extend({
            Deferred: function (a) {
                var b = [["resolve", "done", _.Callbacks("once memory"), "resolved"], ["reject", "fail", _.Callbacks("once memory"), "rejected"], ["notify", "progress", _.Callbacks("memory")]], c = "pending", d = {
                    state: function () {
                        return c
                    }, always: function () {
                        return e.done(arguments).fail(arguments), this
                    }, then: function () {
                        var a = arguments;
                        return _.Deferred(function (c) {
                            _.each(b, function (b, f) {
                                var g = _.isFunction(a[b]) && a[b];
                                e[f[1]](function () {
                                    var a = g && g.apply(this, arguments);
                                    a && _.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                                })
                            }), a = null
                        }).promise()
                    }, promise: function (a) {
                        return null != a ? _.extend(a, d) : d
                    }
                }, e = {};
                return d.pipe = d.then, _.each(b, function (a, f) {
                    var g = f[2], h = f[3];
                    d[f[1]] = g.add, h && g.add(function () {
                        c = h
                    }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function () {
                        return e[f[0] + "With"](this === e ? d : this, arguments), this
                    }, e[f[0] + "With"] = g.fireWith
                }), d.promise(e), a && a.call(e, e), e
            }, when: function (a) {
                var b, c, d, e = 0, f = R.call(arguments), g = f.length, h = 1 !== g || a && _.isFunction(a.promise) ? g : 0, i = 1 === h ? a : _.Deferred(), j = function (a, c, d) {
                    return function (e) {
                        c[a] = this, d[a] = arguments.length > 1 ? R.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                    }
                };
                if (g > 1)for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++)f[e] && _.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
                return h || i.resolveWith(d, f), i.promise()
            }
        });
        var pa;
        _.fn.ready = function (a) {
            return _.ready.promise().done(a), this
        }, _.extend({
            isReady: !1, readyWait: 1, holdReady: function (a) {
                a ? _.readyWait++ : _.ready(!0)
            }, ready: function (a) {
                (a === !0 ? --_.readyWait : _.isReady) || (_.isReady = !0, a !== !0 && --_.readyWait > 0 || (pa.resolveWith(Z, [_]), _.fn.triggerHandler && (_(Z).triggerHandler("ready"), _(Z).off("ready"))))
            }
        }), _.ready.promise = function (b) {
            return pa || (pa = _.Deferred(), "complete" === Z.readyState ? setTimeout(_.ready) : (Z.addEventListener("DOMContentLoaded", g, !1), a.addEventListener("load", g, !1))), pa.promise(b)
        }, _.ready.promise();
        var qa = _.access = function (a, b, c, d, e, f, g) {
            var h = 0, i = a.length, j = null == c;
            if ("object" === _.type(c)) {
                e = !0;
                for (h in c)_.access(a, b, h, c[h], !0, f, g)
            } else if (void 0 !== d && (e = !0, _.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) {
                    return j.call(_(a), c)
                })), b))for (; i > h; h++)b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
            return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
        };
        _.acceptData = function (a) {
            return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType
        }, h.uid = 1, h.accepts = _.acceptData, h.prototype = {
            key: function (a) {
                if (!h.accepts(a))return 0;
                var b = {}, c = a[this.expando];
                if (!c) {
                    c = h.uid++;
                    try {
                        b[this.expando] = {value: c}, Object.defineProperties(a, b)
                    } catch (d) {
                        b[this.expando] = c, _.extend(a, b)
                    }
                }
                return this.cache[c] || (this.cache[c] = {}), c
            }, set: function (a, b, c) {
                var d, e = this.key(a), f = this.cache[e];
                if ("string" == typeof b)f[b] = c; else if (_.isEmptyObject(f))_.extend(this.cache[e], b); else for (d in b)f[d] = b[d];
                return f
            }, get: function (a, b) {
                var c = this.cache[this.key(a)];
                return void 0 === b ? c : c[b]
            }, access: function (a, b, c) {
                var d;
                return void 0 === b || b && "string" == typeof b && void 0 === c ? (d = this.get(a, b), void 0 !== d ? d : this.get(a, _.camelCase(b))) : (this.set(a, b, c), void 0 !== c ? c : b)
            }, remove: function (a, b) {
                var c, d, e, f = this.key(a), g = this.cache[f];
                if (void 0 === b)this.cache[f] = {}; else {
                    _.isArray(b) ? d = b.concat(b.map(_.camelCase)) : (e = _.camelCase(b), b in g ? d = [b, e] : (d = e, d = d in g ? [d] : d.match(na) || [])), c = d.length;
                    for (; c--;)delete g[d[c]]
                }
            }, hasData: function (a) {
                return !_.isEmptyObject(this.cache[a[this.expando]] || {})
            }, discard: function (a) {
                a[this.expando] && delete this.cache[a[this.expando]]
            }
        };
        var ra = new h, sa = new h, ta = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, ua = /([A-Z])/g;
        _.extend({
            hasData: function (a) {
                return sa.hasData(a) || ra.hasData(a)
            }, data: function (a, b, c) {
                return sa.access(a, b, c)
            }, removeData: function (a, b) {
                sa.remove(a, b)
            }, _data: function (a, b, c) {
                return ra.access(a, b, c)
            }, _removeData: function (a, b) {
                ra.remove(a, b)
            }
        }), _.fn.extend({
            data: function (a, b) {
                var c, d, e, f = this[0], g = f && f.attributes;
                if (void 0 === a) {
                    if (this.length && (e = sa.get(f), 1 === f.nodeType && !ra.get(f, "hasDataAttrs"))) {
                        for (c = g.length; c--;)g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = _.camelCase(d.slice(5)), i(f, d, e[d])));
                        ra.set(f, "hasDataAttrs", !0)
                    }
                    return e
                }
                return "object" == typeof a ? this.each(function () {
                    sa.set(this, a)
                }) : qa(this, function (b) {
                    var c, d = _.camelCase(a);
                    if (f && void 0 === b) {
                        if (c = sa.get(f, a), void 0 !== c)return c;
                        if (c = sa.get(f, d), void 0 !== c)return c;
                        if (c = i(f, d, void 0), void 0 !== c)return c
                    } else this.each(function () {
                        var c = sa.get(this, d);
                        sa.set(this, d, b), -1 !== a.indexOf("-") && void 0 !== c && sa.set(this, a, b)
                    })
                }, null, b, arguments.length > 1, null, !0)
            }, removeData: function (a) {
                return this.each(function () {
                    sa.remove(this, a)
                })
            }
        }), _.extend({
            queue: function (a, b, c) {
                var d;
                return a ? (b = (b || "fx") + "queue", d = ra.get(a, b), c && (!d || _.isArray(c) ? d = ra.access(a, b, _.makeArray(c)) : d.push(c)), d || []) : void 0
            }, dequeue: function (a, b) {
                b = b || "fx";
                var c = _.queue(a, b), d = c.length, e = c.shift(), f = _._queueHooks(a, b), g = function () {
                    _.dequeue(a, b)
                };
                "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
            }, _queueHooks: function (a, b) {
                var c = b + "queueHooks";
                return ra.get(a, c) || ra.access(a, c, {
                        empty: _.Callbacks("once memory").add(function () {
                            ra.remove(a, [b + "queue", c])
                        })
                    })
            }
        }), _.fn.extend({
            queue: function (a, b) {
                var c = 2;
                return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? _.queue(this[0], a) : void 0 === b ? this : this.each(function () {
                    var c = _.queue(this, a, b);
                    _._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && _.dequeue(this, a)
                })
            }, dequeue: function (a) {
                return this.each(function () {
                    _.dequeue(this, a)
                })
            }, clearQueue: function (a) {
                return this.queue(a || "fx", [])
            }, promise: function (a, b) {
                var c, d = 1, e = _.Deferred(), f = this, g = this.length, h = function () {
                    --d || e.resolveWith(f, [f])
                };
                for ("string" != typeof a && (b = a, a = void 0), a = a || "fx"; g--;)c = ra.get(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
                return h(), e.promise(b)
            }
        });
        var va = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, wa = ["Top", "Right", "Bottom", "Left"], xa = function (a, b) {
            return a = b || a, "none" === _.css(a, "display") || !_.contains(a.ownerDocument, a)
        }, ya = /^(?:checkbox|radio)$/i;
        !function () {
            var a = Z.createDocumentFragment(), b = a.appendChild(Z.createElement("div")), c = Z.createElement("input");
            c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), b.appendChild(c), Y.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, b.innerHTML = "<textarea>x</textarea>", Y.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue
        }();
        var za = "undefined";
        Y.focusinBubbles = "onfocusin" in a;
        var Aa = /^key/, Ba = /^(?:mouse|pointer|contextmenu)|click/, Ca = /^(?:focusinfocus|focusoutblur)$/, Da = /^([^.]*)(?:\.(.+)|)$/;
        _.event = {
            global: {},
            add: function (a, b, c, d, e) {
                var f, g, h, i, j, k, l, m, n, o, p, q = ra.get(a);
                if (q)for (c.handler && (f = c, c = f.handler, e = f.selector), c.guid || (c.guid = _.guid++), (i = q.events) || (i = q.events = {}), (g = q.handle) || (g = q.handle = function (b) {
                    return typeof _ !== za && _.event.triggered !== b.type ? _.event.dispatch.apply(a, arguments) : void 0
                }), b = (b || "").match(na) || [""], j = b.length; j--;)h = Da.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n && (l = _.event.special[n] || {}, n = (e ? l.delegateType : l.bindType) || n, l = _.event.special[n] || {}, k = _.extend({
                    type: n,
                    origType: p,
                    data: d,
                    handler: c,
                    guid: c.guid,
                    selector: e,
                    needsContext: e && _.expr.match.needsContext.test(e),
                    namespace: o.join(".")
                }, f), (m = i[n]) || (m = i[n] = [], m.delegateCount = 0, l.setup && l.setup.call(a, d, o, g) !== !1 || a.addEventListener && a.addEventListener(n, g, !1)), l.add && (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, k) : m.push(k), _.event.global[n] = !0)
            },
            remove: function (a, b, c, d, e) {
                var f, g, h, i, j, k, l, m, n, o, p, q = ra.hasData(a) && ra.get(a);
                if (q && (i = q.events)) {
                    for (b = (b || "").match(na) || [""], j = b.length; j--;)if (h = Da.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                        for (l = _.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = i[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length; f--;)k = m[f], !e && p !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k));
                        g && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || _.removeEvent(a, n, q.handle), delete i[n])
                    } else for (n in i)_.event.remove(a, n + b[j], c, d, !0);
                    _.isEmptyObject(i) && (delete q.handle, ra.remove(a, "events"))
                }
            },
            trigger: function (b, c, d, e) {
                var f, g, h, i, j, k, l, m = [d || Z], n = X.call(b, "type") ? b.type : b, o = X.call(b, "namespace") ? b.namespace.split(".") : [];
                if (g = h = d = d || Z, 3 !== d.nodeType && 8 !== d.nodeType && !Ca.test(n + _.event.triggered) && (n.indexOf(".") >= 0 && (o = n.split("."), n = o.shift(), o.sort()), j = n.indexOf(":") < 0 && "on" + n, b = b[_.expando] ? b : new _.Event(n, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = o.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : _.makeArray(c, [b]), l = _.event.special[n] || {}, e || !l.trigger || l.trigger.apply(d, c) !== !1)) {
                    if (!e && !l.noBubble && !_.isWindow(d)) {
                        for (i = l.delegateType || n, Ca.test(i + n) || (g = g.parentNode); g; g = g.parentNode)m.push(g), h = g;
                        h === (d.ownerDocument || Z) && m.push(h.defaultView || h.parentWindow || a)
                    }
                    for (f = 0; (g = m[f++]) && !b.isPropagationStopped();)b.type = f > 1 ? i : l.bindType || n, k = (ra.get(g, "events") || {})[b.type] && ra.get(g, "handle"), k && k.apply(g, c), k = j && g[j], k && k.apply && _.acceptData(g) && (b.result = k.apply(g, c), b.result === !1 && b.preventDefault());
                    return b.type = n, e || b.isDefaultPrevented() || l._default && l._default.apply(m.pop(), c) !== !1 || !_.acceptData(d) || j && _.isFunction(d[n]) && !_.isWindow(d) && (h = d[j], h && (d[j] = null), _.event.triggered = n, d[n](), _.event.triggered = void 0, h && (d[j] = h)), b.result
                }
            },
            dispatch: function (a) {
                a = _.event.fix(a);
                var b, c, d, e, f, g = [], h = R.call(arguments), i = (ra.get(this, "events") || {})[a.type] || [], j = _.event.special[a.type] || {};
                if (h[0] = a, a.delegateTarget = this, !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                    for (g = _.event.handlers.call(this, a, i), b = 0; (e = g[b++]) && !a.isPropagationStopped();)for (a.currentTarget = e.elem, c = 0; (f = e.handlers[c++]) && !a.isImmediatePropagationStopped();)(!a.namespace_re || a.namespace_re.test(f.namespace)) && (a.handleObj = f, a.data = f.data, d = ((_.event.special[f.origType] || {}).handle || f.handler).apply(e.elem, h), void 0 !== d && (a.result = d) === !1 && (a.preventDefault(), a.stopPropagation()));
                    return j.postDispatch && j.postDispatch.call(this, a), a.result
                }
            },
            handlers: function (a, b) {
                var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
                if (h && i.nodeType && (!a.button || "click" !== a.type))for (; i !== this; i = i.parentNode || this)if (i.disabled !== !0 || "click" !== a.type) {
                    for (d = [], c = 0; h > c; c++)f = b[c], e = f.selector + " ", void 0 === d[e] && (d[e] = f.needsContext ? _(e, this).index(i) >= 0 : _.find(e, this, null, [i]).length), d[e] && d.push(f);
                    d.length && g.push({elem: i, handlers: d})
                }
                return h < b.length && g.push({elem: this, handlers: b.slice(h)}), g
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "), filter: function (a, b) {
                    return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function (a, b) {
                    var c, d, e, f = b.button;
                    return null == a.pageX && null != b.clientX && (c = a.target.ownerDocument || Z, d = c.documentElement, e = c.body, a.pageX = b.clientX + (d && d.scrollLeft || e && e.scrollLeft || 0) - (d && d.clientLeft || e && e.clientLeft || 0), a.pageY = b.clientY + (d && d.scrollTop || e && e.scrollTop || 0) - (d && d.clientTop || e && e.clientTop || 0)), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
                }
            },
            fix: function (a) {
                if (a[_.expando])return a;
                var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
                for (g || (this.fixHooks[e] = g = Ba.test(e) ? this.mouseHooks : Aa.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new _.Event(f), b = d.length; b--;)c = d[b], a[c] = f[c];
                return a.target || (a.target = Z), 3 === a.target.nodeType && (a.target = a.target.parentNode), g.filter ? g.filter(a, f) : a
            },
            special: {
                load: {noBubble: !0}, focus: {
                    trigger: function () {
                        return this !== l() && this.focus ? (this.focus(), !1) : void 0
                    }, delegateType: "focusin"
                }, blur: {
                    trigger: function () {
                        return this === l() && this.blur ? (this.blur(), !1) : void 0
                    }, delegateType: "focusout"
                }, click: {
                    trigger: function () {
                        return "checkbox" === this.type && this.click && _.nodeName(this, "input") ? (this.click(), !1) : void 0
                    }, _default: function (a) {
                        return _.nodeName(a.target, "a")
                    }
                }, beforeunload: {
                    postDispatch: function (a) {
                        void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                    }
                }
            },
            simulate: function (a, b, c, d) {
                var e = _.extend(new _.Event, c, {type: a, isSimulated: !0, originalEvent: {}});
                d ? _.event.trigger(e, null, b) : _.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
            }
        }, _.removeEvent = function (a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1)
        }, _.Event = function (a, b) {
            return this instanceof _.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? j : k) : this.type = a, b && _.extend(this, b), this.timeStamp = a && a.timeStamp || _.now(), void(this[_.expando] = !0)) : new _.Event(a, b)
        }, _.Event.prototype = {
            isDefaultPrevented: k,
            isPropagationStopped: k,
            isImmediatePropagationStopped: k,
            preventDefault: function () {
                var a = this.originalEvent;
                this.isDefaultPrevented = j, a && a.preventDefault && a.preventDefault()
            },
            stopPropagation: function () {
                var a = this.originalEvent;
                this.isPropagationStopped = j, a && a.stopPropagation && a.stopPropagation()
            },
            stopImmediatePropagation: function () {
                var a = this.originalEvent;
                this.isImmediatePropagationStopped = j, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
            }
        }, _.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function (a, b) {
            _.event.special[a] = {
                delegateType: b, bindType: b, handle: function (a) {
                    var c, d = this, e = a.relatedTarget, f = a.handleObj;
                    return (!e || e !== d && !_.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
                }
            }
        }), Y.focusinBubbles || _.each({focus: "focusin", blur: "focusout"}, function (a, b) {
            var c = function (a) {
                _.event.simulate(b, a.target, _.event.fix(a), !0)
            };
            _.event.special[b] = {
                setup: function () {
                    var d = this.ownerDocument || this, e = ra.access(d, b);
                    e || d.addEventListener(a, c, !0), ra.access(d, b, (e || 0) + 1)
                }, teardown: function () {
                    var d = this.ownerDocument || this, e = ra.access(d, b) - 1;
                    e ? ra.access(d, b, e) : (d.removeEventListener(a, c, !0), ra.remove(d, b))
                }
            }
        }), _.fn.extend({
            on: function (a, b, c, d, e) {
                var f, g;
                if ("object" == typeof a) {
                    "string" != typeof b && (c = c || b, b = void 0);
                    for (g in a)this.on(g, b, c, a[g], e);
                    return this
                }
                if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1)d = k; else if (!d)return this;
                return 1 === e && (f = d, d = function (a) {
                    return _().off(a), f.apply(this, arguments)
                }, d.guid = f.guid || (f.guid = _.guid++)), this.each(function () {
                    _.event.add(this, a, d, c, b)
                })
            }, one: function (a, b, c, d) {
                return this.on(a, b, c, d, 1)
            }, off: function (a, b, c) {
                var d, e;
                if (a && a.preventDefault && a.handleObj)return d = a.handleObj, _(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
                if ("object" == typeof a) {
                    for (e in a)this.off(e, b, a[e]);
                    return this
                }
                return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = k), this.each(function () {
                    _.event.remove(this, a, c, b)
                })
            }, trigger: function (a, b) {
                return this.each(function () {
                    _.event.trigger(a, b, this)
                })
            }, triggerHandler: function (a, b) {
                var c = this[0];
                return c ? _.event.trigger(a, b, c, !0) : void 0
            }
        });
        var Ea = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Fa = /<([\w:]+)/, Ga = /<|&#?\w+;/, Ha = /<(?:script|style|link)/i, Ia = /checked\s*(?:[^=]|=\s*.checked.)/i, Ja = /^$|\/(?:java|ecma)script/i, Ka = /^true\/(.*)/, La = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Ma = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
        Ma.optgroup = Ma.option, Ma.tbody = Ma.tfoot = Ma.colgroup = Ma.caption = Ma.thead, Ma.th = Ma.td, _.extend({
            clone: function (a, b, c) {
                var d, e, f, g, h = a.cloneNode(!0), i = _.contains(a.ownerDocument, a);
                if (!(Y.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || _.isXMLDoc(a)))for (g = r(h), f = r(a), d = 0, e = f.length; e > d; d++)s(f[d], g[d]);
                if (b)if (c)for (f = f || r(a), g = g || r(h), d = 0, e = f.length; e > d; d++)q(f[d], g[d]); else q(a, h);
                return g = r(h, "script"), g.length > 0 && p(g, !i && r(a, "script")), h
            }, buildFragment: function (a, b, c, d) {
                for (var e, f, g, h, i, j, k = b.createDocumentFragment(), l = [], m = 0, n = a.length; n > m; m++)if (e = a[m], e || 0 === e)if ("object" === _.type(e))_.merge(l, e.nodeType ? [e] : e); else if (Ga.test(e)) {
                    for (f = f || k.appendChild(b.createElement("div")), g = (Fa.exec(e) || ["", ""])[1].toLowerCase(), h = Ma[g] || Ma._default, f.innerHTML = h[1] + e.replace(Ea, "<$1></$2>") + h[2], j = h[0]; j--;)f = f.lastChild;
                    _.merge(l, f.childNodes), f = k.firstChild, f.textContent = ""
                } else l.push(b.createTextNode(e));
                for (k.textContent = "", m = 0; e = l[m++];)if ((!d || -1 === _.inArray(e, d)) && (i = _.contains(e.ownerDocument, e), f = r(k.appendChild(e), "script"), i && p(f), c))for (j = 0; e = f[j++];)Ja.test(e.type || "") && c.push(e);
                return k
            }, cleanData: function (a) {
                for (var b, c, d, e, f = _.event.special, g = 0; void 0 !== (c = a[g]); g++) {
                    if (_.acceptData(c) && (e = c[ra.expando], e && (b = ra.cache[e]))) {
                        if (b.events)for (d in b.events)f[d] ? _.event.remove(c, d) : _.removeEvent(c, d, b.handle);
                        ra.cache[e] && delete ra.cache[e]
                    }
                    delete sa.cache[c[sa.expando]]
                }
            }
        }), _.fn.extend({
            text: function (a) {
                return qa(this, function (a) {
                    return void 0 === a ? _.text(this) : this.empty().each(function () {
                        (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = a)
                    })
                }, null, a, arguments.length)
            }, append: function () {
                return this.domManip(arguments, function (a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = m(this, a);
                        b.appendChild(a)
                    }
                })
            }, prepend: function () {
                return this.domManip(arguments, function (a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = m(this, a);
                        b.insertBefore(a, b.firstChild)
                    }
                })
            }, before: function () {
                return this.domManip(arguments, function (a) {
                    this.parentNode && this.parentNode.insertBefore(a, this)
                })
            }, after: function () {
                return this.domManip(arguments, function (a) {
                    this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
                })
            }, remove: function (a, b) {
                for (var c, d = a ? _.filter(a, this) : this, e = 0; null != (c = d[e]); e++)b || 1 !== c.nodeType || _.cleanData(r(c)), c.parentNode && (b && _.contains(c.ownerDocument, c) && p(r(c, "script")), c.parentNode.removeChild(c));
                return this
            }, empty: function () {
                for (var a, b = 0; null != (a = this[b]); b++)1 === a.nodeType && (_.cleanData(r(a, !1)), a.textContent = "");
                return this
            }, clone: function (a, b) {
                return a = null != a && a, b = null == b ? a : b, this.map(function () {
                    return _.clone(this, a, b)
                })
            }, html: function (a) {
                return qa(this, function (a) {
                    var b = this[0] || {}, c = 0, d = this.length;
                    if (void 0 === a && 1 === b.nodeType)return b.innerHTML;
                    if ("string" == typeof a && !Ha.test(a) && !Ma[(Fa.exec(a) || ["", ""])[1].toLowerCase()]) {
                        a = a.replace(Ea, "<$1></$2>");
                        try {
                            for (; d > c; c++)b = this[c] || {}, 1 === b.nodeType && (_.cleanData(r(b, !1)), b.innerHTML = a);
                            b = 0
                        } catch (e) {
                        }
                    }
                    b && this.empty().append(a)
                }, null, a, arguments.length)
            }, replaceWith: function () {
                var a = arguments[0];
                return this.domManip(arguments, function (b) {
                    a = this.parentNode, _.cleanData(r(this)), a && a.replaceChild(b, this)
                }), a && (a.length || a.nodeType) ? this : this.remove()
            }, detach: function (a) {
                return this.remove(a, !0)
            }, domManip: function (a, b) {
                a = S.apply([], a);
                var c, d, e, f, g, h, i = 0, j = this.length, k = this, l = j - 1, m = a[0], p = _.isFunction(m);
                if (p || j > 1 && "string" == typeof m && !Y.checkClone && Ia.test(m))return this.each(function (c) {
                    var d = k.eq(c);
                    p && (a[0] = m.call(this, c, d.html())), d.domManip(a, b)
                });
                if (j && (c = _.buildFragment(a, this[0].ownerDocument, !1, this), d = c.firstChild, 1 === c.childNodes.length && (c = d), d)) {
                    for (e = _.map(r(c, "script"), n), f = e.length; j > i; i++)g = c, i !== l && (g = _.clone(g, !0, !0), f && _.merge(e, r(g, "script"))), b.call(this[i], g, i);
                    if (f)for (h = e[e.length - 1].ownerDocument, _.map(e, o), i = 0; f > i; i++)g = e[i], Ja.test(g.type || "") && !ra.access(g, "globalEval") && _.contains(h, g) && (g.src ? _._evalUrl && _._evalUrl(g.src) : _.globalEval(g.textContent.replace(La, "")))
                }
                return this
            }
        }), _.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function (a, b) {
            _.fn[a] = function (a) {
                for (var c, d = [], e = _(a), f = e.length - 1, g = 0; f >= g; g++)c = g === f ? this : this.clone(!0), _(e[g])[b](c), T.apply(d, c.get());
                return this.pushStack(d)
            }
        });
        var Na, Oa = {}, Pa = /^margin/, Qa = new RegExp("^(" + va + ")(?!px)[a-z%]+$", "i"), Ra = function (b) {
            return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
        };
        !function () {
            function b() {
                g.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", g.innerHTML = "", e.appendChild(f);
                var b = a.getComputedStyle(g, null);
                c = "1%" !== b.top, d = "4px" === b.width, e.removeChild(f)
            }

            var c, d, e = Z.documentElement, f = Z.createElement("div"), g = Z.createElement("div");
            g.style && (g.style.backgroundClip = "content-box", g.cloneNode(!0).style.backgroundClip = "", Y.clearCloneStyle = "content-box" === g.style.backgroundClip, f.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", f.appendChild(g), a.getComputedStyle && _.extend(Y, {
                pixelPosition: function () {
                    return b(), c
                }, boxSizingReliable: function () {
                    return null == d && b(), d
                }, reliableMarginRight: function () {
                    var b, c = g.appendChild(Z.createElement("div"));
                    return c.style.cssText = g.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                        c.style.marginRight = c.style.width = "0", g.style.width = "1px", e.appendChild(f), b = !parseFloat(a.getComputedStyle(c, null).marginRight), e.removeChild(f), g.removeChild(c), b
                }
            }))
        }(), _.swap = function (a, b, c, d) {
            var e, f, g = {};
            for (f in b)g[f] = a.style[f], a.style[f] = b[f];
            e = c.apply(a, d || []);
            for (f in b)a.style[f] = g[f];
            return e
        };
        var Sa = /^(none|table(?!-c[ea]).+)/, Ta = new RegExp("^(" + va + ")(.*)$", "i"), Ua = new RegExp("^([+-])=(" + va + ")", "i"), Va = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, Wa = {letterSpacing: "0", fontWeight: "400"}, Xa = ["Webkit", "O", "Moz", "ms"];
        _.extend({
            cssHooks: {
                opacity: {
                    get: function (a, b) {
                        if (b) {
                            var c = v(a, "opacity");
                            return "" === c ? "1" : c
                        }
                    }
                }
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {"float": "cssFloat"},
            style: function (a, b, c, d) {
                if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                    var e, f, g, h = _.camelCase(b), i = a.style;
                    return b = _.cssProps[h] || (_.cssProps[h] = x(i, h)), g = _.cssHooks[b] || _.cssHooks[h], void 0 === c ? g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b] : (f = typeof c, "string" === f && (e = Ua.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(_.css(a, b)), f = "number"), void(null != c && c === c && ("number" !== f || _.cssNumber[h] || (c += "px"), Y.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), g && "set" in g && void 0 === (c = g.set(a, c, d)) || (i[b] = c))))
                }
            },
            css: function (a, b, c, d) {
                var e, f, g, h = _.camelCase(b);
                return b = _.cssProps[h] || (_.cssProps[h] = x(a.style, h)), g = _.cssHooks[b] || _.cssHooks[h], g && "get" in g && (e = g.get(a, !0, c)), void 0 === e && (e = v(a, b, d)), "normal" === e && b in Wa && (e = Wa[b]), "" === c || c ? (f = parseFloat(e), c === !0 || _.isNumeric(f) ? f || 0 : e) : e
            }
        }), _.each(["height", "width"], function (a, b) {
            _.cssHooks[b] = {
                get: function (a, c, d) {
                    return c ? Sa.test(_.css(a, "display")) && 0 === a.offsetWidth ? _.swap(a, Va, function () {
                        return A(a, b, d)
                    }) : A(a, b, d) : void 0
                }, set: function (a, c, d) {
                    var e = d && Ra(a);
                    return y(a, c, d ? z(a, b, d, "border-box" === _.css(a, "boxSizing", !1, e), e) : 0)
                }
            }
        }), _.cssHooks.marginRight = w(Y.reliableMarginRight, function (a, b) {
            return b ? _.swap(a, {display: "inline-block"}, v, [a, "marginRight"]) : void 0
        }), _.each({margin: "", padding: "", border: "Width"}, function (a, b) {
            _.cssHooks[a + b] = {
                expand: function (c) {
                    for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)e[a + wa[d] + b] = f[d] || f[d - 2] || f[0];
                    return e
                }
            }, Pa.test(a) || (_.cssHooks[a + b].set = y)
        }), _.fn.extend({
            css: function (a, b) {
                return qa(this, function (a, b, c) {
                    var d, e, f = {}, g = 0;
                    if (_.isArray(b)) {
                        for (d = Ra(a), e = b.length; e > g; g++)f[b[g]] = _.css(a, b[g], !1, d);
                        return f
                    }
                    return void 0 !== c ? _.style(a, b, c) : _.css(a, b)
                }, a, b, arguments.length > 1)
            }, show: function () {
                return B(this, !0)
            }, hide: function () {
                return B(this)
            }, toggle: function (a) {
                return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
                    xa(this) ? _(this).show() : _(this).hide()
                })
            }
        }), _.Tween = C, C.prototype = {
            constructor: C, init: function (a, b, c, d, e, f) {
                this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (_.cssNumber[c] ? "" : "px")
            }, cur: function () {
                var a = C.propHooks[this.prop];
                return a && a.get ? a.get(this) : C.propHooks._default.get(this)
            }, run: function (a) {
                var b, c = C.propHooks[this.prop];
                return this.options.duration ? this.pos = b = _.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : C.propHooks._default.set(this), this
            }
        }, C.prototype.init.prototype = C.prototype, C.propHooks = {
            _default: {
                get: function (a) {
                    var b;
                    return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = _.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
                }, set: function (a) {
                    _.fx.step[a.prop] ? _.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[_.cssProps[a.prop]] || _.cssHooks[a.prop]) ? _.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
                }
            }
        }, C.propHooks.scrollTop = C.propHooks.scrollLeft = {
            set: function (a) {
                a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
            }
        }, _.easing = {
            linear: function (a) {
                return a
            }, swing: function (a) {
                return .5 - Math.cos(a * Math.PI) / 2
            }
        }, _.fx = C.prototype.init, _.fx.step = {};
        var Ya, Za, $a = /^(?:toggle|show|hide)$/, _a = new RegExp("^(?:([+-])=|)(" + va + ")([a-z%]*)$", "i"), ab = /queueHooks$/, bb = [G], cb = {
            "*": [function (a, b) {
                var c = this.createTween(a, b), d = c.cur(), e = _a.exec(b), f = e && e[3] || (_.cssNumber[a] ? "" : "px"), g = (_.cssNumber[a] || "px" !== f && +d) && _a.exec(_.css(c.elem, a)), h = 1, i = 20;
                if (g && g[3] !== f) {
                    f = f || g[3], e = e || [], g = +d || 1;
                    do h = h || ".5", g /= h, _.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
                }
                return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
            }]
        };
        _.Animation = _.extend(I, {
            tweener: function (a, b) {
                _.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
                for (var c, d = 0, e = a.length; e > d; d++)c = a[d], cb[c] = cb[c] || [], cb[c].unshift(b)
            }, prefilter: function (a, b) {
                b ? bb.unshift(a) : bb.push(a)
            }
        }), _.speed = function (a, b, c) {
            var d = a && "object" == typeof a ? _.extend({}, a) : {
                complete: c || !c && b || _.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !_.isFunction(b) && b
            };
            return d.duration = _.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in _.fx.speeds ? _.fx.speeds[d.duration] : _.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function () {
                _.isFunction(d.old) && d.old.call(this), d.queue && _.dequeue(this, d.queue)
            }, d
        }, _.fn.extend({
            fadeTo: function (a, b, c, d) {
                return this.filter(xa).css("opacity", 0).show().end().animate({opacity: b}, a, c, d)
            }, animate: function (a, b, c, d) {
                var e = _.isEmptyObject(a), f = _.speed(b, c, d), g = function () {
                    var b = I(this, _.extend({}, a), f);
                    (e || ra.get(this, "finish")) && b.stop(!0)
                };
                return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
            }, stop: function (a, b, c) {
                var d = function (a) {
                    var b = a.stop;
                    delete a.stop, b(c)
                };
                return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () {
                    var b = !0, e = null != a && a + "queueHooks", f = _.timers, g = ra.get(this);
                    if (e)g[e] && g[e].stop && d(g[e]); else for (e in g)g[e] && g[e].stop && ab.test(e) && d(g[e]);
                    for (e = f.length; e--;)f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                    (b || !c) && _.dequeue(this, a)
                })
            }, finish: function (a) {
                return a !== !1 && (a = a || "fx"), this.each(function () {
                    var b, c = ra.get(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = _.timers, g = d ? d.length : 0;
                    for (c.finish = !0, _.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;)f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                    for (b = 0; g > b; b++)d[b] && d[b].finish && d[b].finish.call(this);
                    delete c.finish
                })
            }
        }), _.each(["toggle", "show", "hide"], function (a, b) {
            var c = _.fn[b];
            _.fn[b] = function (a, d, e) {
                return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(E(b, !0), a, d, e)
            }
        }), _.each({
            slideDown: E("show"),
            slideUp: E("hide"),
            slideToggle: E("toggle"),
            fadeIn: {opacity: "show"},
            fadeOut: {opacity: "hide"},
            fadeToggle: {opacity: "toggle"}
        }, function (a, b) {
            _.fn[a] = function (a, c, d) {
                return this.animate(b, a, c, d)
            }
        }), _.timers = [], _.fx.tick = function () {
            var a, b = 0, c = _.timers;
            for (Ya = _.now(); b < c.length; b++)a = c[b], a() || c[b] !== a || c.splice(b--, 1);
            c.length || _.fx.stop(), Ya = void 0
        }, _.fx.timer = function (a) {
            _.timers.push(a), a() ? _.fx.start() : _.timers.pop()
        }, _.fx.interval = 13, _.fx.start = function () {
            Za || (Za = setInterval(_.fx.tick, _.fx.interval))
        }, _.fx.stop = function () {
            clearInterval(Za), Za = null
        }, _.fx.speeds = {slow: 600, fast: 200, _default: 400}, _.fn.delay = function (a, b) {
            return a = _.fx ? _.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) {
                var d = setTimeout(b, a);
                c.stop = function () {
                    clearTimeout(d)
                }
            })
        }, function () {
            var a = Z.createElement("input"), b = Z.createElement("select"), c = b.appendChild(Z.createElement("option"));
            a.type = "checkbox", Y.checkOn = "" !== a.value, Y.optSelected = c.selected, b.disabled = !0, Y.optDisabled = !c.disabled, a = Z.createElement("input"), a.value = "t", a.type = "radio", Y.radioValue = "t" === a.value
        }();
        var db, eb, fb = _.expr.attrHandle;
        _.fn.extend({
            attr: function (a, b) {
                return qa(this, _.attr, a, b, arguments.length > 1)
            }, removeAttr: function (a) {
                return this.each(function () {
                    _.removeAttr(this, a)
                })
            }
        }), _.extend({
            attr: function (a, b, c) {
                var d, e, f = a.nodeType;
                if (a && 3 !== f && 8 !== f && 2 !== f)return typeof a.getAttribute === za ? _.prop(a, b, c) : (1 === f && _.isXMLDoc(a) || (b = b.toLowerCase(), d = _.attrHooks[b] || (_.expr.match.bool.test(b) ? eb : db)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = _.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void _.removeAttr(a, b))
            }, removeAttr: function (a, b) {
                var c, d, e = 0, f = b && b.match(na);
                if (f && 1 === a.nodeType)for (; c = f[e++];)d = _.propFix[c] || c, _.expr.match.bool.test(c) && (a[d] = !1), a.removeAttribute(c)
            }, attrHooks: {
                type: {
                    set: function (a, b) {
                        if (!Y.radioValue && "radio" === b && _.nodeName(a, "input")) {
                            var c = a.value;
                            return a.setAttribute("type", b), c && (a.value = c), b
                        }
                    }
                }
            }
        }), eb = {
            set: function (a, b, c) {
                return b === !1 ? _.removeAttr(a, c) : a.setAttribute(c, c), c
            }
        }, _.each(_.expr.match.bool.source.match(/\w+/g), function (a, b) {
            var c = fb[b] || _.find.attr;
            fb[b] = function (a, b, d) {
                var e, f;
                return d || (f = fb[b], fb[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, fb[b] = f), e
            }
        });
        var gb = /^(?:input|select|textarea|button)$/i;
        _.fn.extend({
            prop: function (a, b) {
                return qa(this, _.prop, a, b, arguments.length > 1)
            }, removeProp: function (a) {
                return this.each(function () {
                    delete this[_.propFix[a] || a]
                })
            }
        }), _.extend({
            propFix: {"for": "htmlFor", "class": "className"}, prop: function (a, b, c) {
                var d, e, f, g = a.nodeType;
                if (a && 3 !== g && 8 !== g && 2 !== g)return f = 1 !== g || !_.isXMLDoc(a), f && (b = _.propFix[b] || b, e = _.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
            }, propHooks: {
                tabIndex: {
                    get: function (a) {
                        return a.hasAttribute("tabindex") || gb.test(a.nodeName) || a.href ? a.tabIndex : -1
                    }
                }
            }
        }), Y.optSelected || (_.propHooks.selected = {
            get: function (a) {
                var b = a.parentNode;
                return b && b.parentNode && b.parentNode.selectedIndex, null
            }
        }), _.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
            _.propFix[this.toLowerCase()] = this
        });
        var hb = /[\t\r\n\f]/g;
        _.fn.extend({
            addClass: function (a) {
                var b, c, d, e, f, g, h = "string" == typeof a && a, i = 0, j = this.length;
                if (_.isFunction(a))return this.each(function (b) {
                    _(this).addClass(a.call(this, b, this.className))
                });
                if (h)for (b = (a || "").match(na) || []; j > i; i++)if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(hb, " ") : " ")) {
                    for (f = 0; e = b[f++];)d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                    g = _.trim(d), c.className !== g && (c.className = g)
                }
                return this
            }, removeClass: function (a) {
                var b, c, d, e, f, g, h = 0 === arguments.length || "string" == typeof a && a, i = 0, j = this.length;
                if (_.isFunction(a))return this.each(function (b) {
                    _(this).removeClass(a.call(this, b, this.className))
                });
                if (h)for (b = (a || "").match(na) || []; j > i; i++)if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(hb, " ") : "")) {
                    for (f = 0; e = b[f++];)for (; d.indexOf(" " + e + " ") >= 0;)d = d.replace(" " + e + " ", " ");
                    g = a ? _.trim(d) : "", c.className !== g && (c.className = g)
                }
                return this
            }, toggleClass: function (a, b) {
                var c = typeof a;
                return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(_.isFunction(a) ? function (c) {
                    _(this).toggleClass(a.call(this, c, this.className, b), b)
                } : function () {
                    if ("string" === c)for (var b, d = 0, e = _(this), f = a.match(na) || []; b = f[d++];)e.hasClass(b) ? e.removeClass(b) : e.addClass(b); else(c === za || "boolean" === c) && (this.className && ra.set(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : ra.get(this, "__className__") || "")
                })
            }, hasClass: function (a) {
                for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(hb, " ").indexOf(b) >= 0)return !0;
                return !1
            }
        });
        var ib = /\r/g;
        _.fn.extend({
            val: function (a) {
                var b, c, d, e = this[0];
                return arguments.length ? (d = _.isFunction(a), this.each(function (c) {
                    var e;
                    1 === this.nodeType && (e = d ? a.call(this, c, _(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : _.isArray(e) && (e = _.map(e, function (a) {
                        return null == a ? "" : a + ""
                    })), b = _.valHooks[this.type] || _.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                })) : e ? (b = _.valHooks[e.type] || _.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(ib, "") : null == c ? "" : c)) : void 0
            }
        }), _.extend({
            valHooks: {
                option: {
                    get: function (a) {
                        var b = _.find.attr(a, "value");
                        return null != b ? b : _.trim(_.text(a))
                    }
                }, select: {
                    get: function (a) {
                        for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)if (c = d[i], !(!c.selected && i !== e || (Y.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && _.nodeName(c.parentNode, "optgroup"))) {
                            if (b = _(c).val(), f)return b;
                            g.push(b)
                        }
                        return g
                    }, set: function (a, b) {
                        for (var c, d, e = a.options, f = _.makeArray(b), g = e.length; g--;)d = e[g], (d.selected = _.inArray(d.value, f) >= 0) && (c = !0);
                        return c || (a.selectedIndex = -1), f
                    }
                }
            }
        }), _.each(["radio", "checkbox"], function () {
            _.valHooks[this] = {
                set: function (a, b) {
                    return _.isArray(b) ? a.checked = _.inArray(_(a).val(), b) >= 0 : void 0
                }
            }, Y.checkOn || (_.valHooks[this].get = function (a) {
                return null === a.getAttribute("value") ? "on" : a.value
            })
        }), _.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
            _.fn[b] = function (a, c) {
                return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }
        }), _.fn.extend({
            hover: function (a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            }, bind: function (a, b, c) {
                return this.on(a, null, b, c)
            }, unbind: function (a, b) {
                return this.off(a, null, b)
            }, delegate: function (a, b, c, d) {
                return this.on(b, a, c, d)
            }, undelegate: function (a, b, c) {
                return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
            }
        });
        var jb = _.now(), kb = /\?/;
        _.parseJSON = function (a) {
            return JSON.parse(a + "")
        }, _.parseXML = function (a) {
            var b, c;
            if (!a || "string" != typeof a)return null;
            try {
                c = new DOMParser, b = c.parseFromString(a, "text/xml")
            } catch (d) {
                b = void 0
            }
            return (!b || b.getElementsByTagName("parsererror").length) && _.error("Invalid XML: " + a), b
        };
        var lb = /#.*$/, mb = /([?&])_=[^&]*/, nb = /^(.*?):[ \t]*([^\r\n]*)$/gm, ob = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, pb = /^(?:GET|HEAD)$/, qb = /^\/\//, rb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, sb = {}, tb = {}, ub = "*/".concat("*"), vb = a.location.href, wb = rb.exec(vb.toLowerCase()) || [];
        _.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: vb,
                type: "GET",
                isLocal: ob.test(wb[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": ub,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {xml: /xml/, html: /html/, json: /json/},
                responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"},
                converters: {"* text": String, "text html": !0, "text json": _.parseJSON, "text xml": _.parseXML},
                flatOptions: {url: !0, context: !0}
            },
            ajaxSetup: function (a, b) {
                return b ? L(L(a, _.ajaxSettings), b) : L(_.ajaxSettings, a)
            },
            ajaxPrefilter: J(sb),
            ajaxTransport: J(tb),
            ajax: function (a, b) {
                function c(a, b, c, g) {
                    var i, k, r, s, u, w = b;
                    2 !== t && (t = 2, h && clearTimeout(h), d = void 0, f = g || "", v.readyState = a > 0 ? 4 : 0, i = a >= 200 && 300 > a || 304 === a, c && (s = M(l, v, c)), s = N(l, s, v, i), i ? (l.ifModified && (u = v.getResponseHeader("Last-Modified"), u && (_.lastModified[e] = u), u = v.getResponseHeader("etag"), u && (_.etag[e] = u)), 204 === a || "HEAD" === l.type ? w = "nocontent" : 304 === a ? w = "notmodified" : (w = s.state, k = s.data, r = s.error, i = !r)) : (r = w, (a || !w) && (w = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || w) + "", i ? o.resolveWith(m, [k, w, v]) : o.rejectWith(m, [v, w, r]), v.statusCode(q), q = void 0, j && n.trigger(i ? "ajaxSuccess" : "ajaxError", [v, l, i ? k : r]), p.fireWith(m, [v, w]), j && (n.trigger("ajaxComplete", [v, l]), --_.active || _.event.trigger("ajaxStop")))
                }

                "object" == typeof a && (b = a, a = void 0), b = b || {};
                var d, e, f, g, h, i, j, k, l = _.ajaxSetup({}, b), m = l.context || l, n = l.context && (m.nodeType || m.jquery) ? _(m) : _.event, o = _.Deferred(), p = _.Callbacks("once memory"), q = l.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {
                    readyState: 0,
                    getResponseHeader: function (a) {
                        var b;
                        if (2 === t) {
                            if (!g)for (g = {}; b = nb.exec(f);)g[b[1].toLowerCase()] = b[2];
                            b = g[a.toLowerCase()]
                        }
                        return null == b ? null : b
                    },
                    getAllResponseHeaders: function () {
                        return 2 === t ? f : null
                    },
                    setRequestHeader: function (a, b) {
                        var c = a.toLowerCase();
                        return t || (a = s[c] = s[c] || a, r[a] = b), this
                    },
                    overrideMimeType: function (a) {
                        return t || (l.mimeType = a), this
                    },
                    statusCode: function (a) {
                        var b;
                        if (a)if (2 > t)for (b in a)q[b] = [q[b], a[b]]; else v.always(a[v.status]);
                        return this
                    },
                    abort: function (a) {
                        var b = a || u;
                        return d && d.abort(b), c(0, b), this
                    }
                };
                if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, l.url = ((a || l.url || vb) + "").replace(lb, "").replace(qb, wb[1] + "//"), l.type = b.method || b.type || l.method || l.type, l.dataTypes = _.trim(l.dataType || "*").toLowerCase().match(na) || [""], null == l.crossDomain && (i = rb.exec(l.url.toLowerCase()), l.crossDomain = !(!i || i[1] === wb[1] && i[2] === wb[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (wb[3] || ("http:" === wb[1] ? "80" : "443")))), l.data && l.processData && "string" != typeof l.data && (l.data = _.param(l.data, l.traditional)), K(sb, l, b, v), 2 === t)return v;
                j = _.event && l.global, j && 0 === _.active++ && _.event.trigger("ajaxStart"), l.type = l.type.toUpperCase(), l.hasContent = !pb.test(l.type), e = l.url, l.hasContent || (l.data && (e = l.url += (kb.test(e) ? "&" : "?") + l.data, delete l.data), l.cache === !1 && (l.url = mb.test(e) ? e.replace(mb, "$1_=" + jb++) : e + (kb.test(e) ? "&" : "?") + "_=" + jb++)), l.ifModified && (_.lastModified[e] && v.setRequestHeader("If-Modified-Since", _.lastModified[e]), _.etag[e] && v.setRequestHeader("If-None-Match", _.etag[e])), (l.data && l.hasContent && l.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", l.contentType), v.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + ("*" !== l.dataTypes[0] ? ", " + ub + "; q=0.01" : "") : l.accepts["*"]);
                for (k in l.headers)v.setRequestHeader(k, l.headers[k]);
                if (l.beforeSend && (l.beforeSend.call(m, v, l) === !1 || 2 === t))return v.abort();
                u = "abort";
                for (k in{success: 1, error: 1, complete: 1})v[k](l[k]);
                if (d = K(tb, l, b, v)) {
                    v.readyState = 1, j && n.trigger("ajaxSend", [v, l]), l.async && l.timeout > 0 && (h = setTimeout(function () {
                        v.abort("timeout")
                    }, l.timeout));
                    try {
                        t = 1, d.send(r, c)
                    } catch (w) {
                        if (!(2 > t))throw w;
                        c(-1, w)
                    }
                } else c(-1, "No Transport");
                return v
            },
            getJSON: function (a, b, c) {
                return _.get(a, b, c, "json")
            },
            getScript: function (a, b) {
                return _.get(a, void 0, b, "script")
            }
        }), _.each(["get", "post"], function (a, b) {
            _[b] = function (a, c, d, e) {
                return _.isFunction(c) && (e = e || d, d = c, c = void 0), _.ajax({
                    url: a,
                    type: b,
                    dataType: e,
                    data: c,
                    success: d
                })
            }
        }), _._evalUrl = function (a) {
            return _.ajax({url: a, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0})
        }, _.fn.extend({
            wrapAll: function (a) {
                var b;
                return _.isFunction(a) ? this.each(function (b) {
                    _(this).wrapAll(a.call(this, b))
                }) : (this[0] && (b = _(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
                    for (var a = this; a.firstElementChild;)a = a.firstElementChild;
                    return a
                }).append(this)), this)
            }, wrapInner: function (a) {
                return this.each(_.isFunction(a) ? function (b) {
                    _(this).wrapInner(a.call(this, b))
                } : function () {
                    var b = _(this), c = b.contents();
                    c.length ? c.wrapAll(a) : b.append(a)
                })
            }, wrap: function (a) {
                var b = _.isFunction(a);
                return this.each(function (c) {
                    _(this).wrapAll(b ? a.call(this, c) : a)
                })
            }, unwrap: function () {
                return this.parent().each(function () {
                    _.nodeName(this, "body") || _(this).replaceWith(this.childNodes)
                }).end()
            }
        }), _.expr.filters.hidden = function (a) {
            return a.offsetWidth <= 0 && a.offsetHeight <= 0
        }, _.expr.filters.visible = function (a) {
            return !_.expr.filters.hidden(a)
        };
        var xb = /%20/g, yb = /\[\]$/, zb = /\r?\n/g, Ab = /^(?:submit|button|image|reset|file)$/i, Bb = /^(?:input|select|textarea|keygen)/i;
        _.param = function (a, b) {
            var c, d = [], e = function (a, b) {
                b = _.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
            };
            if (void 0 === b && (b = _.ajaxSettings && _.ajaxSettings.traditional), _.isArray(a) || a.jquery && !_.isPlainObject(a))_.each(a, function () {
                e(this.name, this.value)
            }); else for (c in a)O(c, a[c], b, e);
            return d.join("&").replace(xb, "+")
        }, _.fn.extend({
            serialize: function () {
                return _.param(this.serializeArray())
            }, serializeArray: function () {
                return this.map(function () {
                    var a = _.prop(this, "elements");
                    return a ? _.makeArray(a) : this
                }).filter(function () {
                    var a = this.type;
                    return this.name && !_(this).is(":disabled") && Bb.test(this.nodeName) && !Ab.test(a) && (this.checked || !ya.test(a))
                }).map(function (a, b) {
                    var c = _(this).val();
                    return null == c ? null : _.isArray(c) ? _.map(c, function (a) {
                        return {name: b.name, value: a.replace(zb, "\r\n")}
                    }) : {name: b.name, value: c.replace(zb, "\r\n")}
                }).get()
            }
        }), _.ajaxSettings.xhr = function () {
            try {
                return new XMLHttpRequest
            } catch (a) {
            }
        };
        var Cb = 0, Db = {}, Eb = {0: 200, 1223: 204}, Fb = _.ajaxSettings.xhr();
        a.attachEvent && a.attachEvent("onunload", function () {
            for (var a in Db)Db[a]()
        }), Y.cors = !!Fb && "withCredentials" in Fb, Y.ajax = Fb = !!Fb, _.ajaxTransport(function (a) {
            var b;
            return Y.cors || Fb && !a.crossDomain ? {
                send: function (c, d) {
                    var e, f = a.xhr(), g = ++Cb;
                    if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)for (e in a.xhrFields)f[e] = a.xhrFields[e];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c)f.setRequestHeader(e, c[e]);
                    b = function (a) {
                        return function () {
                            b && (delete Db[g], b = f.onload = f.onerror = null, "abort" === a ? f.abort() : "error" === a ? d(f.status, f.statusText) : d(Eb[f.status] || f.status, f.statusText, "string" == typeof f.responseText ? {text: f.responseText} : void 0, f.getAllResponseHeaders()))
                        }
                    }, f.onload = b(), f.onerror = b("error"), b = Db[g] = b("abort");
                    try {
                        f.send(a.hasContent && a.data || null)
                    } catch (h) {
                        if (b)throw h
                    }
                }, abort: function () {
                    b && b()
                }
            } : void 0
        }), _.ajaxSetup({
            accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
            contents: {script: /(?:java|ecma)script/},
            converters: {
                "text script": function (a) {
                    return _.globalEval(a), a
                }
            }
        }), _.ajaxPrefilter("script", function (a) {
            void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET")
        }), _.ajaxTransport("script", function (a) {
            if (a.crossDomain) {
                var b, c;
                return {
                    send: function (d, e) {
                        b = _("<script>").prop({
                            async: !0,
                            charset: a.scriptCharset,
                            src: a.url
                        }).on("load error", c = function (a) {
                            b.remove(), c = null, a && e("error" === a.type ? 404 : 200, a.type)
                        }), Z.head.appendChild(b[0])
                    }, abort: function () {
                        c && c()
                    }
                }
            }
        });
        var Gb = [], Hb = /(=)\?(?=&|$)|\?\?/;
        _.ajaxSetup({
            jsonp: "callback", jsonpCallback: function () {
                var a = Gb.pop() || _.expando + "_" + jb++;
                return this[a] = !0, a
            }
        }), _.ajaxPrefilter("json jsonp", function (b, c, d) {
            var e, f, g, h = b.jsonp !== !1 && (Hb.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && Hb.test(b.data) && "data");
            return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = _.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(Hb, "$1" + e) : b.jsonp !== !1 && (b.url += (kb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
                return g || _.error(e + " was not called"), g[0]
            }, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
                g = arguments
            }, d.always(function () {
                a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, Gb.push(e)), g && _.isFunction(f) && f(g[0]), g = f = void 0
            }), "script") : void 0
        }), _.parseHTML = function (a, b, c) {
            if (!a || "string" != typeof a)return null;
            "boolean" == typeof b && (c = b, b = !1), b = b || Z;
            var d = ga.exec(a), e = !c && [];
            return d ? [b.createElement(d[1])] : (d = _.buildFragment([a], b, e), e && e.length && _(e).remove(), _.merge([], d.childNodes))
        };
        var Ib = _.fn.load;
        _.fn.load = function (a, b, c) {
            if ("string" != typeof a && Ib)return Ib.apply(this, arguments);
            var d, e, f, g = this, h = a.indexOf(" ");
            return h >= 0 && (d = _.trim(a.slice(h)), a = a.slice(0, h)), _.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (e = "POST"), g.length > 0 && _.ajax({
                url: a,
                type: e,
                dataType: "html",
                data: b
            }).done(function (a) {
                f = arguments, g.html(d ? _("<div>").append(_.parseHTML(a)).find(d) : a)
            }).complete(c && function (a, b) {
                    g.each(c, f || [a.responseText, b, a])
                }), this
        }, _.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
            _.fn[b] = function (a) {
                return this.on(b, a)
            }
        }), _.expr.filters.animated = function (a) {
            return _.grep(_.timers, function (b) {
                return a === b.elem
            }).length
        };
        var Jb = a.document.documentElement;
        _.offset = {
            setOffset: function (a, b, c) {
                var d, e, f, g, h, i, j, k = _.css(a, "position"), l = _(a), m = {};
                "static" === k && (a.style.position = "relative"), h = l.offset(), f = _.css(a, "top"), i = _.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), _.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
            }
        }, _.fn.extend({
            offset: function (a) {
                if (arguments.length)return void 0 === a ? this : this.each(function (b) {
                    _.offset.setOffset(this, a, b)
                });
                var b, c, d = this[0], e = {top: 0, left: 0}, f = d && d.ownerDocument;
                return f ? (b = f.documentElement, _.contains(b, d) ? (typeof d.getBoundingClientRect !== za && (e = d.getBoundingClientRect()), c = P(f), {
                    top: e.top + c.pageYOffset - b.clientTop,
                    left: e.left + c.pageXOffset - b.clientLeft
                }) : e) : void 0
            }, position: function () {
                if (this[0]) {
                    var a, b, c = this[0], d = {top: 0, left: 0};
                    return "fixed" === _.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), _.nodeName(a[0], "html") || (d = a.offset()), d.top += _.css(a[0], "borderTopWidth", !0), d.left += _.css(a[0], "borderLeftWidth", !0)), {
                        top: b.top - d.top - _.css(c, "marginTop", !0),
                        left: b.left - d.left - _.css(c, "marginLeft", !0)
                    }
                }
            }, offsetParent: function () {
                return this.map(function () {
                    for (var a = this.offsetParent || Jb; a && !_.nodeName(a, "html") && "static" === _.css(a, "position");)a = a.offsetParent;
                    return a || Jb
                })
            }
        }), _.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (b, c) {
            var d = "pageYOffset" === c;
            _.fn[b] = function (e) {
                return qa(this, function (b, e, f) {
                    var g = P(b);
                    return void 0 === f ? g ? g[c] : b[e] : void(g ? g.scrollTo(d ? a.pageXOffset : f, d ? f : a.pageYOffset) : b[e] = f)
                }, b, e, arguments.length, null)
            }
        }), _.each(["top", "left"], function (a, b) {
            _.cssHooks[b] = w(Y.pixelPosition, function (a, c) {
                return c ? (c = v(a, b), Qa.test(c) ? _(a).position()[b] + "px" : c) : void 0
            })
        }), _.each({Height: "height", Width: "width"}, function (a, b) {
            _.each({padding: "inner" + a, content: b, "": "outer" + a}, function (c, d) {
                _.fn[d] = function (d, e) {
                    var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border");
                    return qa(this, function (b, c, d) {
                        var e;
                        return _.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? _.css(b, c, g) : _.style(b, c, d, g)
                    }, b, f ? d : void 0, f, null)
                }
            })
        }), _.fn.size = function () {
            return this.length
        }, _.fn.andSelf = _.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
            return _
        });
        var Kb = a.jQuery, Lb = a.$;
        return _.noConflict = function (b) {
            return a.$ === _ && (a.$ = Lb), b && a.jQuery === _ && (a.jQuery = Kb), _
        }, typeof b === za && (a.jQuery = a.$ = _), _
    }), "undefined" == typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");
+function (a) {
    "use strict";
    var b = a.fn.jquery.split(" ")[0].split(".");
    if (b[0] < 2 && b[1] < 9 || 1 == b[0] && 9 == b[1] && b[2] < 1 || b[0] > 2)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")
}(jQuery), +function (a) {
    "use strict";
    function b() {
        var a = document.createElement("bootstrap"), b = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var c in b)if (void 0 !== a.style[c])return {end: b[c]};
        return !1
    }

    a.fn.emulateTransitionEnd = function (b) {
        var c = !1, d = this;
        a(this).one("bsTransitionEnd", function () {
            c = !0
        });
        var e = function () {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b), this
    }, a(function () {
        a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {
            bindType: a.support.transition.end,
            delegateType: a.support.transition.end,
            handle: function (b) {
                return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0
            }
        })
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var c = a(this), e = c.data("bs.alert");
            e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c)
        })
    }

    var c = '[data-dismiss="alert"]', d = function (b) {
        a(b).on("click", c, this.close)
    };
    d.VERSION = "3.3.6", d.TRANSITION_DURATION = 150, d.prototype.close = function (b) {
        function c() {
            g.detach().trigger("closed.bs.alert").remove()
        }

        var e = a(this), f = e.attr("data-target");
        f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
        var g = a(f);
        b && b.preventDefault(), g.length || (g = e.closest(".alert")), g.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (g.removeClass("in"), a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c())
    };
    var e = a.fn.alert;
    a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function () {
        return a.fn.alert = e, this
    }, a(document).on("click.bs.alert.data-api", c, d.prototype.close)
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.button"), f = "object" == typeof b && b;
            e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b)
        })
    }

    var c = function (b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1
    };
    c.VERSION = "3.3.6", c.DEFAULTS = {loadingText: "loading..."}, c.prototype.setState = function (b) {
        var c = "disabled", d = this.$element, e = d.is("input") ? "val" : "html", f = d.data();
        b += "Text", null == f.resetText && d.data("resetText", d[e]()), setTimeout(a.proxy(function () {
            d[e](null == f[b] ? this.options[b] : f[b]), "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
        }, this), 0)
    }, c.prototype.toggle = function () {
        var a = !0, b = this.$element.closest('[data-toggle="buttons"]');
        if (b.length) {
            var c = this.$element.find("input");
            "radio" == c.prop("type") ? (c.prop("checked") && (a = !1), b.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == c.prop("type") && (c.prop("checked") !== this.$element.hasClass("active") && (a = !1), this.$element.toggleClass("active")), c.prop("checked", this.$element.hasClass("active")), a && c.trigger("change")
        } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
    };
    var d = a.fn.button;
    a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function () {
        return a.fn.button = d, this
    }, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function (c) {
        var d = a(c.target);
        d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), a(c.target).is('input[type="radio"]') || a(c.target).is('input[type="checkbox"]') || c.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (b) {
        a(b.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(b.type))
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.carousel"), f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b), g = "string" == typeof b ? b : f.slide;
            e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
        })
    }

    var c = function (b, c) {
        this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
    };
    c.VERSION = "3.3.6", c.TRANSITION_DURATION = 600, c.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
    }, c.prototype.keydown = function (a) {
        if (!/input|textarea/i.test(a.target.tagName)) {
            switch (a.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
            }
            a.preventDefault()
        }
    }, c.prototype.cycle = function (b) {
        return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
    }, c.prototype.getItemIndex = function (a) {
        return this.$items = a.parent().children(".item"), this.$items.index(a || this.$active)
    }, c.prototype.getItemForDirection = function (a, b) {
        var c = this.getItemIndex(b), d = "prev" == a && 0 === c || "next" == a && c == this.$items.length - 1;
        if (d && !this.options.wrap)return b;
        var e = "prev" == a ? -1 : 1, f = (c + e) % this.$items.length;
        return this.$items.eq(f)
    }, c.prototype.to = function (a) {
        var b = this, c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        return a > this.$items.length - 1 || 0 > a ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function () {
            b.to(a)
        }) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a))
    }, c.prototype.pause = function (b) {
        return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, c.prototype.next = function () {
        return this.sliding ? void 0 : this.slide("next")
    }, c.prototype.prev = function () {
        return this.sliding ? void 0 : this.slide("prev")
    }, c.prototype.slide = function (b, d) {
        var e = this.$element.find(".item.active"), f = d || this.getItemForDirection(b, e), g = this.interval, h = "next" == b ? "left" : "right", i = this;
        if (f.hasClass("active"))return this.sliding = !1;
        var j = f[0], k = a.Event("slide.bs.carousel", {relatedTarget: j, direction: h});
        if (this.$element.trigger(k), !k.isDefaultPrevented()) {
            if (this.sliding = !0, g && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var l = a(this.$indicators.children()[this.getItemIndex(f)]);
                l && l.addClass("active")
            }
            var m = a.Event("slid.bs.carousel", {relatedTarget: j, direction: h});
            return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b), f[0].offsetWidth, e.addClass(h), f.addClass(h), e.one("bsTransitionEnd", function () {
                f.removeClass([b, h].join(" ")).addClass("active"), e.removeClass(["active", h].join(" ")), i.sliding = !1, setTimeout(function () {
                    i.$element.trigger(m)
                }, 0)
            }).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"), f.addClass("active"), this.sliding = !1, this.$element.trigger(m)), g && this.cycle(), this
        }
    };
    var d = a.fn.carousel;
    a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function () {
        return a.fn.carousel = d, this
    };
    var e = function (c) {
        var d, e = a(this), f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
        if (f.hasClass("carousel")) {
            var g = a.extend({}, f.data(), e.data()), h = e.attr("data-slide-to");
            h && (g.interval = !1), b.call(f, g), h && f.data("bs.carousel").to(h), c.preventDefault()
        }
    };
    a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e), a(window).on("load", function () {
        a('[data-ride="carousel"]').each(function () {
            var c = a(this);
            b.call(c, c.data())
        })
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        var c, d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
        return a(d)
    }

    function c(b) {
        return this.each(function () {
            var c = a(this), e = c.data("bs.collapse"), f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
            !e && f.toggle && /show|hide/.test(b) && (f.toggle = !1), e || c.data("bs.collapse", e = new d(this, f)), "string" == typeof b && e[b]()
        })
    }

    var d = function (b, c) {
        this.$element = a(b), this.options = a.extend({}, d.DEFAULTS, c), this.$trigger = a('[data-toggle="collapse"][href="#' + b.id + '"],[data-toggle="collapse"][data-target="#' + b.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    d.VERSION = "3.3.6", d.TRANSITION_DURATION = 350, d.DEFAULTS = {toggle: !0}, d.prototype.dimension = function () {
        var a = this.$element.hasClass("width");
        return a ? "width" : "height"
    }, d.prototype.show = function () {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var b, e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
            if (!(e && e.length && (b = e.data("bs.collapse"), b && b.transitioning))) {
                var f = a.Event("show.bs.collapse");
                if (this.$element.trigger(f), !f.isDefaultPrevented()) {
                    e && e.length && (c.call(e, "hide"), b || e.data("bs.collapse", null));
                    var g = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                    var h = function () {
                        this.$element.removeClass("collapsing").addClass("collapse in")[g](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                    };
                    if (!a.support.transition)return h.call(this);
                    var i = a.camelCase(["scroll", g].join("-"));
                    this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])
                }
            }
        }
    }, d.prototype.hide = function () {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var b = a.Event("hide.bs.collapse");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                var c = this.dimension();
                this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                var e = function () {
                    this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this)
            }
        }
    }, d.prototype.toggle = function () {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, d.prototype.getParent = function () {
        return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function (c, d) {
            var e = a(d);
            this.addAriaAndCollapsedClass(b(e), e)
        }, this)).end()
    }, d.prototype.addAriaAndCollapsedClass = function (a, b) {
        var c = a.hasClass("in");
        a.attr("aria-expanded", c), b.toggleClass("collapsed", !c).attr("aria-expanded", c)
    };
    var e = a.fn.collapse;
    a.fn.collapse = c, a.fn.collapse.Constructor = d, a.fn.collapse.noConflict = function () {
        return a.fn.collapse = e, this
    }, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (d) {
        var e = a(this);
        e.attr("data-target") || d.preventDefault();
        var f = b(e), g = f.data("bs.collapse"), h = g ? "toggle" : e.data();
        c.call(f, h)
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d : b.parent()
    }

    function c(c) {
        c && 3 === c.which || (a(e).remove(), a(f).each(function () {
            var d = a(this), e = b(d), f = {relatedTarget: this};
            e.hasClass("open") && (c && "click" == c.type && /input|textarea/i.test(c.target.tagName) && a.contains(e[0], c.target) || (e.trigger(c = a.Event("hide.bs.dropdown", f)), c.isDefaultPrevented() || (d.attr("aria-expanded", "false"), e.removeClass("open").trigger(a.Event("hidden.bs.dropdown", f)))))
        }))
    }

    function d(b) {
        return this.each(function () {
            var c = a(this), d = c.data("bs.dropdown");
            d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c)
        })
    }

    var e = ".dropdown-backdrop", f = '[data-toggle="dropdown"]', g = function (b) {
        a(b).on("click.bs.dropdown", this.toggle)
    };
    g.VERSION = "3.3.6", g.prototype.toggle = function (d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
            var f = b(e), g = f.hasClass("open");
            if (c(), !g) {
                "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click", c);
                var h = {relatedTarget: this};
                if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented())return;
                e.trigger("focus").attr("aria-expanded", "true"), f.toggleClass("open").trigger(a.Event("shown.bs.dropdown", h))
            }
            return !1
        }
    }, g.prototype.keydown = function (c) {
        if (/(38|40|27|32)/.test(c.which) && !/input|textarea/i.test(c.target.tagName)) {
            var d = a(this);
            if (c.preventDefault(), c.stopPropagation(), !d.is(".disabled, :disabled")) {
                var e = b(d), g = e.hasClass("open");
                if (!g && 27 != c.which || g && 27 == c.which)return 27 == c.which && e.find(f).trigger("focus"), d.trigger("click");
                var h = " li:not(.disabled):visible a", i = e.find(".dropdown-menu" + h);
                if (i.length) {
                    var j = i.index(c.target);
                    38 == c.which && j > 0 && j--, 40 == c.which && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus")
                }
            }
        }
    };
    var h = a.fn.dropdown;
    a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function () {
        return a.fn.dropdown = h, this
    }, a(document).on("click.bs.dropdown.data-api", c).on("click.bs.dropdown.data-api", ".dropdown form", function (a) {
        a.stopPropagation()
    }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", g.prototype.keydown)
}(jQuery), +function (a) {
    "use strict";
    function b(b, d) {
        return this.each(function () {
            var e = a(this), f = e.data("bs.modal"), g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
            f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
        })
    }

    var c = function (b, c) {
        this.options = c, this.$body = a(document.body), this.$element = a(b), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function () {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    c.VERSION = "3.3.6", c.TRANSITION_DURATION = 300, c.BACKDROP_TRANSITION_DURATION = 150, c.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, c.prototype.toggle = function (a) {
        return this.isShown ? this.hide() : this.show(a)
    }, c.prototype.show = function (b) {
        var d = this, e = a.Event("show.bs.modal", {relatedTarget: b});
        this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function () {
            d.$element.one("mouseup.dismiss.bs.modal", function (b) {
                a(b.target).is(d.$element) && (d.ignoreBackdropClick = !0)
            })
        }), this.backdrop(function () {
            var e = a.support.transition && d.$element.hasClass("fade");
            d.$element.parent().length || d.$element.appendTo(d.$body), d.$element.show().scrollTop(0), d.adjustDialog(), e && d.$element[0].offsetWidth, d.$element.addClass("in"), d.enforceFocus();
            var f = a.Event("shown.bs.modal", {relatedTarget: b});
            e ? d.$dialog.one("bsTransitionEnd", function () {
                d.$element.trigger("focus").trigger(f)
            }).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f)
        }))
    }, c.prototype.hide = function (b) {
        b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal())
    }, c.prototype.enforceFocus = function () {
        a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function (a) {
            this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
        }, this))
    }, c.prototype.escape = function () {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function (a) {
            27 == a.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, c.prototype.resize = function () {
        this.isShown ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this)) : a(window).off("resize.bs.modal")
    }, c.prototype.hideModal = function () {
        var a = this;
        this.$element.hide(), this.backdrop(function () {
            a.$body.removeClass("modal-open"), a.resetAdjustments(), a.resetScrollbar(), a.$element.trigger("hidden.bs.modal")
        })
    }, c.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, c.prototype.backdrop = function (b) {
        var d = this, e = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var f = a.support.transition && e;
            if (this.$backdrop = a(document.createElement("div")).addClass("modal-backdrop " + e).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", a.proxy(function (a) {
                    return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
                }, this)), f && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b)return;
            f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var g = function () {
                d.removeBackdrop(), b && b()
            };
            a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g()
        } else b && b()
    }, c.prototype.handleUpdate = function () {
        this.adjustDialog()
    }, c.prototype.adjustDialog = function () {
        var a = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""
        })
    }, c.prototype.resetAdjustments = function () {
        this.$element.css({paddingLeft: "", paddingRight: ""})
    }, c.prototype.checkScrollbar = function () {
        var a = window.innerWidth;
        if (!a) {
            var b = document.documentElement.getBoundingClientRect();
            a = b.right - Math.abs(b.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < a, this.scrollbarWidth = this.measureScrollbar()
    }, c.prototype.setScrollbar = function () {
        var a = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", a + this.scrollbarWidth)
    }, c.prototype.resetScrollbar = function () {
        this.$body.css("padding-right", this.originalBodyPad)
    }, c.prototype.measureScrollbar = function () {
        var a = document.createElement("div");
        a.className = "modal-scrollbar-measure", this.$body.append(a);
        var b = a.offsetWidth - a.clientWidth;
        return this.$body[0].removeChild(a), b
    };
    var d = a.fn.modal;
    a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function () {
        return a.fn.modal = d, this
    }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (c) {
        var d = a(this), e = d.attr("href"), f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")), g = f.data("bs.modal") ? "toggle" : a.extend({remote: !/#/.test(e) && e}, f.data(), d.data());
        d.is("a") && c.preventDefault(), f.one("show.bs.modal", function (a) {
            a.isDefaultPrevented() || f.one("hidden.bs.modal", function () {
                d.is(":visible") && d.trigger("focus")
            })
        }), b.call(f, g, this)
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.tooltip"), f = "object" == typeof b && b;
            (e || !/destroy|hide/.test(b)) && (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }

    var c = function (a, b) {
        this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", a, b)
    };
    c.VERSION = "3.3.6", c.TRANSITION_DURATION = 150, c.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {selector: "body", padding: 0}
    }, c.prototype.init = function (b, c, d) {
        if (this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(a.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
                click: !1,
                hover: !1,
                focus: !1
            }, this.$element[0] instanceof document.constructor && !this.options.selector)throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
            var g = e[f];
            if ("click" == g)this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this)); else if ("manual" != g) {
                var h = "hover" == g ? "mouseenter" : "focusin", i = "hover" == g ? "mouseleave" : "focusout";
                this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = a.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }, c.prototype.getDefaults = function () {
        return c.DEFAULTS
    }, c.prototype.getOptions = function (b) {
        return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {
            show: b.delay,
            hide: b.delay
        }), b
    }, c.prototype.getDelegateOptions = function () {
        var b = {}, c = this.getDefaults();
        return this._options && a.each(this._options, function (a, d) {
            c[a] != d && (b[a] = d)
        }), b
    }, c.prototype.enter = function (b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusin" == b.type ? "focus" : "hover"] = !0), c.tip().hasClass("in") || "in" == c.hoverState ? void(c.hoverState = "in") : (clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function () {
            "in" == c.hoverState && c.show()
        }, c.options.delay.show)) : c.show())
    }, c.prototype.isInStateTrue = function () {
        for (var a in this.inState)if (this.inState[a])return !0;
        return !1
    }, c.prototype.leave = function (b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusout" == b.type ? "focus" : "hover"] = !1), c.isInStateTrue() ? void 0 : (clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function () {
            "out" == c.hoverState && c.hide()
        }, c.options.delay.hide)) : c.hide())
    }, c.prototype.show = function () {
        var b = a.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(b);
            var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (b.isDefaultPrevented() || !d)return;
            var e = this, f = this.tip(), g = this.getUID(this.type);
            this.setContent(), f.attr("id", g), this.$element.attr("aria-describedby", g), this.options.animation && f.addClass("fade");
            var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement, i = /\s?auto?\s?/i, j = i.test(h);
            j && (h = h.replace(i, "") || "top"), f.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(h).data("bs." + this.type, this), this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
            var k = this.getPosition(), l = f[0].offsetWidth, m = f[0].offsetHeight;
            if (j) {
                var n = h, o = this.getPosition(this.$viewport);
                h = "bottom" == h && k.bottom + m > o.bottom ? "top" : "top" == h && k.top - m < o.top ? "bottom" : "right" == h && k.right + l > o.width ? "left" : "left" == h && k.left - l < o.left ? "right" : h, f.removeClass(n).addClass(h)
            }
            var p = this.getCalculatedOffset(h, k, l, m);
            this.applyPlacement(p, h);
            var q = function () {
                var a = e.hoverState;
                e.$element.trigger("shown.bs." + e.type), e.hoverState = null, "out" == a && e.leave(e)
            };
            a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", q).emulateTransitionEnd(c.TRANSITION_DURATION) : q()
        }
    }, c.prototype.applyPlacement = function (b, c) {
        var d = this.tip(), e = d[0].offsetWidth, f = d[0].offsetHeight, g = parseInt(d.css("margin-top"), 10), h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top += g, b.left += h, a.offset.setOffset(d[0], a.extend({
            using: function (a) {
                d.css({top: Math.round(a.top), left: Math.round(a.left)})
            }
        }, b), 0), d.addClass("in");
        var i = d[0].offsetWidth, j = d[0].offsetHeight;
        "top" == c && j != f && (b.top = b.top + f - j);
        var k = this.getViewportAdjustedDelta(c, b, i, j);
        k.left ? b.left += k.left : b.top += k.top;
        var l = /top|bottom/.test(c), m = l ? 2 * k.left - e + i : 2 * k.top - f + j, n = l ? "offsetWidth" : "offsetHeight";
        d.offset(b), this.replaceArrow(m, d[0][n], l)
    }, c.prototype.replaceArrow = function (a, b, c) {
        this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "")
    }, c.prototype.setContent = function () {
        var a = this.tip(), b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
    }, c.prototype.hide = function (b) {
        function d() {
            "in" != e.hoverState && f.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), b && b()
        }

        var e = this, f = a(this.$tip), g = a.Event("hide.bs." + this.type);
        return this.$element.trigger(g), g.isDefaultPrevented() ? void 0 : (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(), this.hoverState = null, this)
    }, c.prototype.fixTitle = function () {
        var a = this.$element;
        (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
    }, c.prototype.hasContent = function () {
        return this.getTitle()
    }, c.prototype.getPosition = function (b) {
        b = b || this.$element;
        var c = b[0], d = "BODY" == c.tagName, e = c.getBoundingClientRect();
        null == e.width && (e = a.extend({}, e, {width: e.right - e.left, height: e.bottom - e.top}));
        var f = d ? {
            top: 0,
            left: 0
        } : b.offset(), g = {scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()}, h = d ? {
            width: a(window).width(),
            height: a(window).height()
        } : null;
        return a.extend({}, e, g, h, f)
    }, c.prototype.getCalculatedOffset = function (a, b, c, d) {
        return "bottom" == a ? {
            top: b.top + b.height,
            left: b.left + b.width / 2 - c / 2
        } : "top" == a ? {
            top: b.top - d,
            left: b.left + b.width / 2 - c / 2
        } : "left" == a ? {top: b.top + b.height / 2 - d / 2, left: b.left - c} : {
            top: b.top + b.height / 2 - d / 2,
            left: b.left + b.width
        }
    }, c.prototype.getViewportAdjustedDelta = function (a, b, c, d) {
        var e = {top: 0, left: 0};
        if (!this.$viewport)return e;
        var f = this.options.viewport && this.options.viewport.padding || 0, g = this.getPosition(this.$viewport);
        if (/right|left/.test(a)) {
            var h = b.top - f - g.scroll, i = b.top + f - g.scroll + d;
            h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
        } else {
            var j = b.left - f, k = b.left + f + c;
            j < g.left ? e.left = g.left - j : k > g.right && (e.left = g.left + g.width - k)
        }
        return e
    }, c.prototype.getTitle = function () {
        var a, b = this.$element, c = this.options;
        return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
    }, c.prototype.getUID = function (a) {
        do a += ~~(1e6 * Math.random()); while (document.getElementById(a));
        return a
    }, c.prototype.tip = function () {
        if (!this.$tip && (this.$tip = a(this.options.template), 1 != this.$tip.length))throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
        return this.$tip
    }, c.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, c.prototype.enable = function () {
        this.enabled = !0
    }, c.prototype.disable = function () {
        this.enabled = !1
    }, c.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }, c.prototype.toggle = function (b) {
        var c = this;
        b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), b ? (c.inState.click = !c.inState.click, c.isInStateTrue() ? c.enter(c) : c.leave(c)) : c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
    }, c.prototype.destroy = function () {
        var a = this;
        clearTimeout(this.timeout), this.hide(function () {
            a.$element.off("." + a.type).removeData("bs." + a.type), a.$tip && a.$tip.detach(), a.$tip = null, a.$arrow = null, a.$viewport = null
        })
    };
    var d = a.fn.tooltip;
    a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function () {
        return a.fn.tooltip = d, this
    }
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.popover"), f = "object" == typeof b && b;
            (e || !/destroy|hide/.test(b)) && (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }

    var c = function (a, b) {
        this.init("popover", a, b)
    };
    if (!a.fn.tooltip)throw new Error("Popover requires tooltip.js");
    c.VERSION = "3.3.6", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function () {
        return c.DEFAULTS
    }, c.prototype.setContent = function () {
        var a = this.tip(), b = this.getTitle(), c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide()
    }, c.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }, c.prototype.getContent = function () {
        var a = this.$element, b = this.options;
        return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
    }, c.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    };
    var d = a.fn.popover;
    a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function () {
        return a.fn.popover = d, this
    }
}(jQuery), +function (a) {
    "use strict";
    function b(c, d) {
        this.$body = a(document.body), this.$scrollElement = a(a(c).is(document.body) ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", a.proxy(this.process, this)), this.refresh(), this.process()
    }

    function c(c) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.scrollspy"), f = "object" == typeof c && c;
            e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]()
        })
    }

    b.VERSION = "3.3.6", b.DEFAULTS = {offset: 10}, b.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }, b.prototype.refresh = function () {
        var b = this, c = "offset", d = 0;
        this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), a.isWindow(this.$scrollElement[0]) || (c = "position", d = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function () {
            var b = a(this), e = b.data("target") || b.attr("href"), f = /^#./.test(e) && a(e);
            return f && f.length && f.is(":visible") && [[f[c]().top + d, e]] || null
        }).sort(function (a, b) {
            return a[0] - b[0]
        }).each(function () {
            b.offsets.push(this[0]), b.targets.push(this[1])
        })
    }, b.prototype.process = function () {
        var a, b = this.$scrollElement.scrollTop() + this.options.offset, c = this.getScrollHeight(), d = this.options.offset + c - this.$scrollElement.height(), e = this.offsets, f = this.targets, g = this.activeTarget;
        if (this.scrollHeight != c && this.refresh(), b >= d)return g != (a = f[f.length - 1]) && this.activate(a);
        if (g && b < e[0])return this.activeTarget = null, this.clear();
        for (a = e.length; a--;)g != f[a] && b >= e[a] && (void 0 === e[a + 1] || b < e[a + 1]) && this.activate(f[a])
    }, b.prototype.activate = function (b) {
        this.activeTarget = b, this.clear();
        var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]', d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy")
    }, b.prototype.clear = function () {
        a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var d = a.fn.scrollspy;
    a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function () {
        return a.fn.scrollspy = d, this
    }, a(window).on("load.bs.scrollspy.data-api", function () {
        a('[data-spy="scroll"]').each(function () {
            var b = a(this);
            c.call(b, b.data())
        })
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.tab");
            e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]()
        })
    }

    var c = function (b) {
        this.element = a(b)
    };
    c.VERSION = "3.3.6", c.TRANSITION_DURATION = 150, c.prototype.show = function () {
        var b = this.element, c = b.closest("ul:not(.dropdown-menu)"), d = b.data("target");
        if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
            var e = c.find(".active:last a"), f = a.Event("hide.bs.tab", {relatedTarget: b[0]}), g = a.Event("show.bs.tab", {relatedTarget: e[0]});
            if (e.trigger(f), b.trigger(g), !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
                var h = a(d);
                this.activate(b.closest("li"), c), this.activate(h, h.parent(), function () {
                    e.trigger({type: "hidden.bs.tab", relatedTarget: b[0]}), b.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: e[0]
                    })
                })
            }
        }
    }, c.prototype.activate = function (b, d, e) {
        function f() {
            g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu").length && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), e && e()
        }

        var g = d.find("> .active"), h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
        g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(), g.removeClass("in")
    };
    var d = a.fn.tab;
    a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function () {
        return a.fn.tab = d, this
    };
    var e = function (c) {
        c.preventDefault(), b.call(a(this), "show")
    };
    a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e)
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.affix"), f = "object" == typeof b && b;
            e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]()
        })
    }

    var c = function (b, d) {
        this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
    };
    c.VERSION = "3.3.6", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {
        offset: 0,
        target: window
    }, c.prototype.getState = function (a, b, c, d) {
        var e = this.$target.scrollTop(), f = this.$element.offset(), g = this.$target.height();
        if (null != c && "top" == this.affixed)return c > e && "top";
        if ("bottom" == this.affixed)return null != c ? !(e + this.unpin <= f.top) && "bottom" : !(a - d >= e + g) && "bottom";
        var h = null == this.affixed, i = h ? e : f.top, j = h ? g : b;
        return null != c && c >= e ? "top" : null != d && i + j >= a - d && "bottom"
    }, c.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset)return this.pinnedOffset;
        this.$element.removeClass(c.RESET).addClass("affix");
        var a = this.$target.scrollTop(), b = this.$element.offset();
        return this.pinnedOffset = b.top - a
    }, c.prototype.checkPositionWithEventLoop = function () {
        setTimeout(a.proxy(this.checkPosition, this), 1)
    }, c.prototype.checkPosition = function () {
        if (this.$element.is(":visible")) {
            var b = this.$element.height(), d = this.options.offset, e = d.top, f = d.bottom, g = Math.max(a(document).height(), a(document.body).height());
            "object" != typeof d && (f = e = d), "function" == typeof e && (e = d.top(this.$element)), "function" == typeof f && (f = d.bottom(this.$element));
            var h = this.getState(g, b, e, f);
            if (this.affixed != h) {
                null != this.unpin && this.$element.css("top", "");
                var i = "affix" + (h ? "-" + h : ""), j = a.Event(i + ".bs.affix");
                if (this.$element.trigger(j), j.isDefaultPrevented())return;
                this.affixed = h, this.unpin = "bottom" == h ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == h && this.$element.offset({top: g - b - f})
        }
    };
    var d = a.fn.affix;
    a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function () {
        return a.fn.affix = d, this
    }, a(window).on("load", function () {
        a('[data-spy="affix"]').each(function () {
            var c = a(this), d = c.data();
            d.offset = d.offset || {}, null != d.offsetBottom && (d.offset.bottom = d.offsetBottom), null != d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d)
        })
    })
}(jQuery), !function (a, b) {
    "use strict";
    var c = {
        item: 3,
        autoWidth: !1,
        slideMove: 1,
        slideMargin: 10,
        addClass: "",
        mode: "slide",
        useCSS: !0,
        cssEasing: "ease",
        easing: "linear",
        speed: 400,
        auto: !1,
        pauseOnHover: !1,
        loop: !1,
        slideEndAnimation: !0,
        pause: 2e3,
        keyPress: !1,
        controls: !0,
        prevHtml: "",
        nextHtml: "",
        rtl: !1,
        adaptiveHeight: !1,
        vertical: !1,
        verticalHeight: 500,
        vThumbWidth: 100,
        thumbItem: 10,
        pager: !0,
        gallery: !1,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: "middle",
        enableTouch: !0,
        enableDrag: !0,
        freeMove: !0,
        swipeThreshold: 40,
        responsive: [],
        onBeforeStart: function (a) {
        },
        onSliderLoad: function (a) {
        },
        onBeforeSlide: function (a, b) {
        },
        onAfterSlide: function (a, b) {
        },
        onBeforeNextSlide: function (a, b) {
        },
        onBeforePrevSlide: function (a, b) {
        }
    };
    a.fn.lightSlider = function (b) {
        if (0 === this.length)return this;
        if (this.length > 1)return this.each(function () {
            a(this).lightSlider(b)
        }), this;
        var d = {}, e = a.extend(!0, {}, c, b), f = {}, g = this;
        d.$el = this, "fade" === e.mode && (e.vertical = !1);
        var h = g.children(), i = a(window).width(), j = null, k = null, l = 0, m = 0, n = !1, o = 0, p = "", q = 0, r = e.vertical === !0 ? "height" : "width", s = e.vertical === !0 ? "margin-bottom" : "margin-right", t = 0, u = 0, v = 0, w = 0, x = null, y = "ontouchstart" in document.documentElement, z = {};
        return z.chbreakpoint = function () {
            if (i = a(window).width(), e.responsive.length) {
                var b;
                if (e.autoWidth === !1 && (b = e.item), i < e.responsive[0].breakpoint)for (var c = 0; c < e.responsive.length; c++)i < e.responsive[c].breakpoint && (j = e.responsive[c].breakpoint, k = e.responsive[c]);
                if ("undefined" != typeof k && null !== k)for (var d in k.settings)k.settings.hasOwnProperty(d) && (("undefined" == typeof f[d] || null === f[d]) && (f[d] = e[d]), e[d] = k.settings[d]);
                if (!a.isEmptyObject(f) && i > e.responsive[0].breakpoint)for (var g in f)f.hasOwnProperty(g) && (e[g] = f[g]);
                e.autoWidth === !1 && t > 0 && v > 0 && b !== e.item && (q = Math.round(t / ((v + e.slideMargin) * e.slideMove)))
            }
        }, z.calSW = function () {
            e.autoWidth === !1 && (v = (o - (e.item * e.slideMargin - e.slideMargin)) / e.item)
        }, z.calWidth = function (a) {
            var b = a === !0 ? p.find(".lslide").length : h.length;
            if (e.autoWidth === !1)m = b * (v + e.slideMargin); else {
                m = 0;
                for (var c = 0; b > c; c++)m += parseInt(h.eq(c).width()) + e.slideMargin
            }
            return m
        }, d = {
            doCss: function () {
                var a = function () {
                    for (var a = ["transition", "MozTransition", "WebkitTransition", "OTransition", "msTransition", "KhtmlTransition"], b = document.documentElement, c = 0; c < a.length; c++)if (a[c] in b.style)return !0
                };
                return !(!e.useCSS || !a())
            }, keyPress: function () {
                e.keyPress && a(document).on("keyup.lightslider", function (b) {
                    a(":focus").is("input, textarea") || (b.preventDefault ? b.preventDefault() : b.returnValue = !1, 37 === b.keyCode ? g.goToPrevSlide() : 39 === b.keyCode && g.goToNextSlide())
                })
            }, controls: function () {
                e.controls && (g.after('<div class="lSAction"><a class="lSPrev">' + e.prevHtml + '</a><a class="lSNext">' + e.nextHtml + "</a></div>"), e.autoWidth ? z.calWidth(!1) < o && p.find(".lSAction").hide() : l <= e.item && p.find(".lSAction").hide(), p.find(".lSAction a").on("click", function (b) {
                    return b.preventDefault ? b.preventDefault() : b.returnValue = !1, "lSPrev" === a(this).attr("class") ? g.goToPrevSlide() : g.goToNextSlide(), !1
                }))
            }, initialStyle: function () {
                var a = this;
                "fade" === e.mode && (e.autoWidth = !1, e.slideEndAnimation = !1), e.auto && (e.slideEndAnimation = !1), e.autoWidth && (e.slideMove = 1, e.item = 1), e.loop && (e.slideMove = 1, e.freeMove = !1), e.onBeforeStart.call(this, g), z.chbreakpoint(), g.addClass("lightSlider").wrap('<div class="lSSlideOuter ' + e.addClass + '"><div class="lSSlideWrapper"></div></div>'), p = g.parent(".lSSlideWrapper"), e.rtl === !0 && p.parent().addClass("lSrtl"), e.vertical ? (p.parent().addClass("vertical"), o = e.verticalHeight, p.css("height", o + "px")) : o = g.outerWidth(), h.addClass("lslide"), e.loop === !0 && "slide" === e.mode && (z.calSW(), z.clone = function () {
                    if (z.calWidth(!0) > o) {
                        for (var b = 0, c = 0, d = 0; d < h.length && (b += parseInt(g.find(".lslide").eq(d).width()) + e.slideMargin, c++, !(b >= o + e.slideMargin)); d++);
                        var f = e.autoWidth === !0 ? c : e.item;
                        if (f < g.find(".clone.left").length)for (var i = 0; i < g.find(".clone.left").length - f; i++)h.eq(i).remove();
                        if (f < g.find(".clone.right").length)for (var j = h.length - 1; j > h.length - 1 - g.find(".clone.right").length; j--)q--, h.eq(j).remove();
                        for (var k = g.find(".clone.right").length; f > k; k++)g.find(".lslide").eq(k).clone().removeClass("lslide").addClass("clone right").appendTo(g), q++;
                        for (var l = g.find(".lslide").length - g.find(".clone.left").length; l > g.find(".lslide").length - f; l--)g.find(".lslide").eq(l - 1).clone().removeClass("lslide").addClass("clone left").prependTo(g);
                        h = g.children()
                    } else h.hasClass("clone") && (g.find(".clone").remove(), a.move(g, 0))
                }, z.clone()), z.sSW = function () {
                    l = h.length, e.rtl === !0 && e.vertical === !1 && (s = "margin-left"), e.autoWidth === !1 && h.css(r, v + "px"), h.css(s, e.slideMargin + "px"), m = z.calWidth(!1), g.css(r, m + "px"), e.loop === !0 && "slide" === e.mode && n === !1 && (q = g.find(".clone.left").length)
                }, z.calL = function () {
                    h = g.children(), l = h.length
                }, this.doCss() && p.addClass("usingCss"), z.calL(), "slide" === e.mode ? (z.calSW(), z.sSW(), e.loop === !0 && (t = a.slideValue(), this.move(g, t)), e.vertical === !1 && this.setHeight(g, !1)) : (this.setHeight(g, !0), g.addClass("lSFade"), this.doCss() || (h.fadeOut(0), h.eq(q).fadeIn(0))), e.loop === !0 && "slide" === e.mode ? h.eq(q).addClass("active") : h.first().addClass("active")
            }, pager: function () {
                var a = this;
                if (z.createPager = function () {
                        w = (o - (e.thumbItem * e.thumbMargin - e.thumbMargin)) / e.thumbItem;
                        var b = p.find(".lslide"), c = p.find(".lslide").length, d = 0, f = "", h = 0;
                        for (d = 0; c > d; d++) {
                            "slide" === e.mode && (e.autoWidth ? h += (parseInt(b.eq(d).width()) + e.slideMargin) * e.slideMove : h = d * (v + e.slideMargin) * e.slideMove);
                            var i = b.eq(d * e.slideMove).attr("data-thumb");
                            if (f += e.gallery === !0 ? '<li style="width:100%;' + r + ":" + w + "px;" + s + ":" + e.thumbMargin + 'px"><a href="#"><img src="' + i + '" /></a></li>' : '<li><a href="#">' + (d + 1) + "</a></li>", "slide" === e.mode && h >= m - o - e.slideMargin) {
                                d += 1;
                                var j = 2;
                                e.autoWidth && (f += '<li><a href="#">' + (d + 1) + "</a></li>", j = 1), j > d ? (f = null, p.parent().addClass("noPager")) : p.parent().removeClass("noPager");
                                break
                            }
                        }
                        var k = p.parent();
                        k.find(".lSPager").html(f), e.gallery === !0 && (e.vertical === !0 && k.find(".lSPager").css("width", e.vThumbWidth + "px"), u = d * (e.thumbMargin + w) + .5, k.find(".lSPager").css({
                            property: u + "px",
                            "transition-duration": e.speed + "ms"
                        }), e.vertical === !0 && p.parent().css("padding-right", e.vThumbWidth + e.galleryMargin + "px"), k.find(".lSPager").css(r, u + "px"));
                        var l = k.find(".lSPager").find("li");
                        l.first().addClass("active"), l.on("click", function () {
                            return e.loop === !0 && "slide" === e.mode ? q += l.index(this) - k.find(".lSPager").find("li.active").index() : q = l.index(this), g.mode(!1), e.gallery === !0 && a.slideThumb(), !1
                        })
                    }, e.pager) {
                    var b = "lSpg";
                    e.gallery && (b = "lSGallery"), p.after('<ul class="lSPager ' + b + '"></ul>');
                    var c = e.vertical ? "margin-left" : "margin-top";
                    p.parent().find(".lSPager").css(c, e.galleryMargin + "px"), z.createPager()
                }
                setTimeout(function () {
                    z.init()
                }, 0)
            }, setHeight: function (a, b) {
                var c = null, d = this;
                c = e.loop ? a.children(".lslide ").first() : a.children().first();
                var f = function () {
                    var d = c.outerHeight(), e = 0, f = d;
                    b && (d = 0, e = 100 * f / o), a.css({height: d + "px", "padding-bottom": e + "%"})
                };
                f(), c.find("img").length ? c.find("img")[0].complete ? (f(), x || d.auto()) : c.find("img").load(function () {
                    setTimeout(function () {
                        f(), x || d.auto()
                    }, 100)
                }) : x || d.auto()
            }, active: function (a, b) {
                this.doCss() && "fade" === e.mode && p.addClass("on");
                var c = 0;
                if (q * e.slideMove < l) {
                    a.removeClass("active"), this.doCss() || "fade" !== e.mode || b !== !1 || a.fadeOut(e.speed), c = b === !0 ? q : q * e.slideMove;
                    var d, f;
                    b === !0 && (d = a.length, f = d - 1, c + 1 >= d && (c = f)), e.loop === !0 && "slide" === e.mode && (c = b === !0 ? q - g.find(".clone.left").length : q * e.slideMove, b === !0 && (d = a.length, f = d - 1, c + 1 === d ? c = f : c + 1 > d && (c = 0))), this.doCss() || "fade" !== e.mode || b !== !1 || a.eq(c).fadeIn(e.speed), a.eq(c).addClass("active")
                } else a.removeClass("active"), a.eq(a.length - 1).addClass("active"), this.doCss() || "fade" !== e.mode || b !== !1 || (a.fadeOut(e.speed), a.eq(c).fadeIn(e.speed))
            }, move: function (a, b) {
                e.rtl === !0 && (b = -b), this.doCss() ? a.css(e.vertical === !0 ? {
                    transform: "translate3d(0px, " + -b + "px, 0px)",
                    "-webkit-transform": "translate3d(0px, " + -b + "px, 0px)"
                } : {
                    transform: "translate3d(" + -b + "px, 0px, 0px)",
                    "-webkit-transform": "translate3d(" + -b + "px, 0px, 0px)"
                }) : e.vertical === !0 ? a.css("position", "relative").animate({top: -b + "px"}, e.speed, e.easing) : a.css("position", "relative").animate({left: -b + "px"}, e.speed, e.easing);
                var c = p.parent().find(".lSPager").find("li");
                this.active(c, !0)
            }, fade: function () {
                this.active(h, !1);
                var a = p.parent().find(".lSPager").find("li");
                this.active(a, !0)
            }, slide: function () {
                var a = this;
                z.calSlide = function () {
                    m > o && (t = a.slideValue(), a.active(h, !1), t > m - o - e.slideMargin ? t = m - o - e.slideMargin : 0 > t && (t = 0), a.move(g, t), e.loop === !0 && "slide" === e.mode && (q >= l - g.find(".clone.left").length / e.slideMove && a.resetSlide(g.find(".clone.left").length), 0 === q && a.resetSlide(p.find(".lslide").length)))
                }, z.calSlide()
            }, resetSlide: function (a) {
                var b = this;
                p.find(".lSAction a").addClass("disabled"), setTimeout(function () {
                    q = a, p.css("transition-duration", "0ms"), t = b.slideValue(), b.active(h, !1), d.move(g, t), setTimeout(function () {
                        p.css("transition-duration", e.speed + "ms"), p.find(".lSAction a").removeClass("disabled")
                    }, 50)
                }, e.speed + 100)
            }, slideValue: function () {
                var a = 0;
                if (e.autoWidth === !1)a = q * (v + e.slideMargin) * e.slideMove; else {
                    a = 0;
                    for (var b = 0; q > b; b++)a += parseInt(h.eq(b).width()) + e.slideMargin
                }
                return a
            }, slideThumb: function () {
                var a;
                switch (e.currentPagerPosition) {
                    case"left":
                        a = 0;
                        break;
                    case"middle":
                        a = o / 2 - w / 2;
                        break;
                    case"right":
                        a = o - w
                }
                var b = q - g.find(".clone.left").length, c = p.parent().find(".lSPager");
                "slide" === e.mode && e.loop === !0 && (b >= c.children().length ? b = 0 : 0 > b && (b = c.children().length));
                var d = b * (w + e.thumbMargin) - a;
                d + o > u && (d = u - o - e.thumbMargin), 0 > d && (d = 0), this.move(c, d)
            }, auto: function () {
                e.auto && (clearInterval(x), x = setInterval(function () {
                    g.goToNextSlide()
                }, e.pause))
            }, pauseOnHover: function () {
                var b = this;
                e.auto && e.pauseOnHover && (p.on("mouseenter", function () {
                    a(this).addClass("ls-hover"), g.pause(), e.auto = !0
                }), p.on("mouseleave", function () {
                    a(this).removeClass("ls-hover"), p.find(".lightSlider").hasClass("lsGrabbing") || b.auto()
                }))
            }, touchMove: function (a, b) {
                if (p.css("transition-duration", "0ms"), "slide" === e.mode) {
                    var c = a - b, d = t - c;
                    if (d >= m - o - e.slideMargin)if (e.freeMove === !1)d = m - o - e.slideMargin; else {
                        var f = m - o - e.slideMargin;
                        d = f + (d - f) / 5
                    } else 0 > d && (e.freeMove === !1 ? d = 0 : d /= 5);
                    this.move(g, d)
                }
            }, touchEnd: function (a) {
                if (p.css("transition-duration", e.speed + "ms"), "slide" === e.mode) {
                    var b = !1, c = !0;
                    t -= a, t > m - o - e.slideMargin ? (t = m - o - e.slideMargin, e.autoWidth === !1 && (b = !0)) : 0 > t && (t = 0);
                    var d = function (a) {
                        var c = 0;
                        if (b || a && (c = 1), e.autoWidth)for (var d = 0, f = 0; f < h.length && (d += parseInt(h.eq(f).width()) + e.slideMargin, q = f + c, !(d >= t)); f++); else {
                            var g = t / ((v + e.slideMargin) * e.slideMove);
                            q = parseInt(g) + c, t >= m - o - e.slideMargin && g % 1 !== 0 && q++
                        }
                    };
                    a >= e.swipeThreshold ? (d(!1), c = !1) : a <= -e.swipeThreshold && (d(!0), c = !1), g.mode(c), this.slideThumb()
                } else a >= e.swipeThreshold ? g.goToPrevSlide() : a <= -e.swipeThreshold && g.goToNextSlide()
            }, enableDrag: function () {
                var b = this;
                if (!y) {
                    var c = 0, d = 0, f = !1;
                    p.find(".lightSlider").addClass("lsGrab"), p.on("mousedown", function (b) {
                        return !(o > m && 0 !== m) && void("lSPrev" !== a(b.target).attr("class") && "lSNext" !== a(b.target).attr("class") && (c = e.vertical === !0 ? b.pageY : b.pageX, f = !0, b.preventDefault ? b.preventDefault() : b.returnValue = !1, p.scrollLeft += 1, p.scrollLeft -= 1, p.find(".lightSlider").removeClass("lsGrab").addClass("lsGrabbing"), clearInterval(x)))
                    }), a(window).on("mousemove", function (a) {
                        f && (d = e.vertical === !0 ? a.pageY : a.pageX, b.touchMove(d, c))
                    }), a(window).on("mouseup", function (g) {
                        if (f) {
                            p.find(".lightSlider").removeClass("lsGrabbing").addClass("lsGrab"), f = !1, d = e.vertical === !0 ? g.pageY : g.pageX;
                            var h = d - c;
                            Math.abs(h) >= e.swipeThreshold && a(window).on("click.ls", function (b) {
                                b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.stopImmediatePropagation(), b.stopPropagation(), a(window).off("click.ls")
                            }), b.touchEnd(h)
                        }
                    })
                }
            }, enableTouch: function () {
                var a = this;
                if (y) {
                    var b = {}, c = {};
                    p.on("touchstart", function (a) {
                        c = a.originalEvent.targetTouches[0], b.pageX = a.originalEvent.targetTouches[0].pageX, b.pageY = a.originalEvent.targetTouches[0].pageY, clearInterval(x)
                    }), p.on("touchmove", function (d) {
                        if (o > m && 0 !== m)return !1;
                        var f = d.originalEvent;
                        c = f.targetTouches[0];
                        var g = Math.abs(c.pageX - b.pageX), h = Math.abs(c.pageY - b.pageY);
                        e.vertical === !0 ? (3 * h > g && d.preventDefault(), a.touchMove(c.pageY, b.pageY)) : (3 * g > h && d.preventDefault(), a.touchMove(c.pageX, b.pageX))
                    }), p.on("touchend", function () {
                        if (o > m && 0 !== m)return !1;
                        var d;
                        d = e.vertical === !0 ? c.pageY - b.pageY : c.pageX - b.pageX, a.touchEnd(d)
                    })
                }
            }, build: function () {
                var b = this;
                b.initialStyle(), this.doCss() && (e.enableTouch === !0 && b.enableTouch(), e.enableDrag === !0 && b.enableDrag()), a(window).on("focus", function () {
                    b.auto()
                }), a(window).on("blur", function () {
                    clearInterval(x)
                }), b.pager(), b.pauseOnHover(), b.controls(), b.keyPress()
            }
        }, d.build(), z.init = function () {
            z.chbreakpoint(), e.vertical === !0 ? (o = e.item > 1 ? e.verticalHeight : h.outerHeight(), p.css("height", o + "px")) : o = p.outerWidth(), e.loop === !0 && "slide" === e.mode && z.clone(), z.calL(), "slide" === e.mode && g.removeClass("lSSlide"), "slide" === e.mode && (z.calSW(), z.sSW()), setTimeout(function () {
                "slide" === e.mode && g.addClass("lSSlide")
            }, 1e3), e.pager && z.createPager(), e.adaptiveHeight === !0 && e.vertical === !1 && g.css("height", h.eq(q).outerHeight(!0)), e.adaptiveHeight === !1 && ("slide" === e.mode ? e.vertical === !1 ? d.setHeight(g, !1) : d.auto() : d.setHeight(g, !0)), e.gallery === !0 && d.slideThumb(), "slide" === e.mode && d.slide(), e.autoWidth === !1 ? h.length <= e.item ? p.find(".lSAction").hide() : p.find(".lSAction").show() : z.calWidth(!1) < o && 0 !== m ? p.find(".lSAction").hide() : p.find(".lSAction").show()
        }, g.goToPrevSlide = function () {
            if (q > 0)e.onBeforePrevSlide.call(this, g, q), q--, g.mode(!1), e.gallery === !0 && d.slideThumb(); else if (e.loop === !0) {
                if (e.onBeforePrevSlide.call(this, g, q), "fade" === e.mode) {
                    var a = l - 1;
                    q = parseInt(a / e.slideMove)
                }
                g.mode(!1), e.gallery === !0 && d.slideThumb()
            } else e.slideEndAnimation === !0 && (g.addClass("leftEnd"), setTimeout(function () {
                g.removeClass("leftEnd")
            }, 400))
        }, g.goToNextSlide = function () {
            var a = !0;
            if ("slide" === e.mode) {
                var b = d.slideValue();
                a = b < m - o - e.slideMargin
            }
            q * e.slideMove < l - e.slideMove && a ? (e.onBeforeNextSlide.call(this, g, q), q++, g.mode(!1), e.gallery === !0 && d.slideThumb()) : e.loop === !0 ? (e.onBeforeNextSlide.call(this, g, q), q = 0, g.mode(!1), e.gallery === !0 && d.slideThumb()) : e.slideEndAnimation === !0 && (g.addClass("rightEnd"), setTimeout(function () {
                g.removeClass("rightEnd")
            }, 400))
        }, g.mode = function (a) {
            e.adaptiveHeight === !0 && e.vertical === !1 && g.css("height", h.eq(q).outerHeight(!0)), n === !1 && ("slide" === e.mode ? d.doCss() && (g.addClass("lSSlide"), "" !== e.speed && p.css("transition-duration", e.speed + "ms"), "" !== e.cssEasing && p.css("transition-timing-function", e.cssEasing)) : d.doCss() && ("" !== e.speed && g.css("transition-duration", e.speed + "ms"), "" !== e.cssEasing && g.css("transition-timing-function", e.cssEasing))), a || e.onBeforeSlide.call(this, g, q), "slide" === e.mode ? d.slide() : d.fade(), p.hasClass("ls-hover") || d.auto(), setTimeout(function () {
                a || e.onAfterSlide.call(this, g, q)
            }, e.speed), n = !0
        }, g.play = function () {
            g.goToNextSlide(), e.auto = !0, d.auto()
        }, g.pause = function () {
            e.auto = !1, clearInterval(x)
        }, g.refresh = function () {
            z.init()
        }, g.getCurrentSlideCount = function () {
            var a = q;
            if (e.loop) {
                var b = p.find(".lslide").length, c = g.find(".clone.left").length;
                a = c - 1 >= q ? b + (q - c) : q >= b + c ? q - b - c : q - c
            }
            return a + 1
        }, g.getTotalSlideCount = function () {
            return p.find(".lslide").length
        }, g.goToSlide = function (a) {
            q = e.loop ? a + g.find(".clone.left").length - 1 : a, g.mode(!1), e.gallery === !0 && d.slideThumb()
        }, g.destroy = function () {
            g.lightSlider && (g.goToPrevSlide = function () {
            }, g.goToNextSlide = function () {
            }, g.mode = function () {
            }, g.play = function () {
            }, g.pause = function () {
            }, g.refresh = function () {
            }, g.getCurrentSlideCount = function () {
            }, g.getTotalSlideCount = function () {
            }, g.goToSlide = function () {
            }, g.lightSlider = null, z = {
                init: function () {
                }
            }, g.parent().parent().find(".lSAction, .lSPager").remove(), g.removeClass("lightSlider lSFade lSSlide lsGrab lsGrabbing leftEnd right").removeAttr("style").unwrap().unwrap(), g.children().removeAttr("style"), h.removeClass("lslide active"), g.find(".clone").remove(), h = null, x = null, n = !1, q = 0)
        }, setTimeout(function () {
            e.onSliderLoad.call(this, g)
        }, 10), a(window).on("resize orientationchange", function (a) {
            setTimeout(function () {
                a.preventDefault ? a.preventDefault() : a.returnValue = !1, z.init()
            }, 200)
        }), this
    }
}(jQuery), function (a, b) {
    "function" == typeof define && define.amd ? define(b) : "object" == typeof exports ? module.exports = b() : a.NProgress = b()
}(this, function () {
    function a(a, b, c) {
        return a < b ? b : a > c ? c : a
    }

    function b(a) {
        return 100 * (-1 + a)
    }

    function c(a, c, d) {
        var e;
        return e = "translate3d" === j.positionUsing ? {transform: "translate3d(" + b(a) + "%,0,0)"} : "translate" === j.positionUsing ? {transform: "translate(" + b(a) + "%,0)"} : {"margin-left": b(a) + "%"}, e.transition = "all " + c + "ms " + d, e
    }

    function d(a, b) {
        var c = "string" == typeof a ? a : g(a);
        return c.indexOf(" " + b + " ") >= 0
    }

    function e(a, b) {
        var c = g(a), e = c + b;
        d(c, b) || (a.className = e.substring(1))
    }

    function f(a, b) {
        var c, e = g(a);
        d(a, b) && (c = e.replace(" " + b + " ", " "), a.className = c.substring(1, c.length - 1))
    }

    function g(a) {
        return (" " + (a && a.className || "") + " ").replace(/\s+/gi, " ")
    }

    function h(a) {
        a && a.parentNode && a.parentNode.removeChild(a)
    }

    var i = {};
    i.version = "0.2.0";
    var j = i.settings = {
        minimum: .08,
        easing: "linear",
        positionUsing: "",
        speed: 350,
        trickle: !0,
        trickleSpeed: 250,
        showSpinner: !0,
        barSelector: '[role="bar"]',
        spinnerSelector: '[role="spinner"]',
        parent: "body",
        template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
    };
    i.configure = function (a) {
        var b, c;
        for (b in a)c = a[b], void 0 !== c && a.hasOwnProperty(b) && (j[b] = c);
        return this
    }, i.status = null, i.set = function (b) {
        var d = i.isStarted();
        b = a(b, j.minimum, 1), i.status = 1 === b ? null : b;
        var e = i.render(!d), f = e.querySelector(j.barSelector), g = j.speed, h = j.easing;
        return e.offsetWidth, k(function (a) {
            "" === j.positionUsing && (j.positionUsing = i.getPositioningCSS()), l(f, c(b, g, h)), 1 === b ? (l(e, {
                transition: "none",
                opacity: 1
            }), e.offsetWidth, setTimeout(function () {
                l(e, {transition: "all " + g + "ms linear", opacity: 0}), setTimeout(function () {
                    i.remove(), a()
                }, g)
            }, g)) : setTimeout(a, g)
        }), this
    }, i.isStarted = function () {
        return "number" == typeof i.status
    }, i.start = function () {
        i.status || i.set(0);
        var a = function () {
            setTimeout(function () {
                i.status && (i.trickle(), a())
            }, j.trickleSpeed)
        };
        return j.trickle && a(), this
    }, i.done = function (a) {
        return a || i.status ? i.inc(.3 + .5 * Math.random()).set(1) : this
    }, i.inc = function (b) {
        var c = i.status;
        return c ? c > 1 ? void 0 : ("number" != typeof b && (b = c >= 0 && c < .25 ? (3 * Math.random() + 3) / 100 : c >= .25 && c < .65 ? 3 * Math.random() / 100 : c >= .65 && c < .9 ? 2 * Math.random() / 100 : c >= .9 && c < .99 ? .005 : 0), c = a(c + b, 0, .994), i.set(c)) : i.start()
    }, i.trickle = function () {
        return i.inc()
    }, function () {
        var a = 0, b = 0;
        i.promise = function (c) {
            return c && "resolved" !== c.state() ? (0 === b && i.start(), a++, b++, c.always(function () {
                b--, 0 === b ? (a = 0, i.done()) : i.set((a - b) / a)
            }), this) : this
        }
    }(), i.render = function (a) {
        if (i.isRendered())return document.getElementById("nprogress");
        e(document.documentElement, "nprogress-busy");
        var c = document.createElement("div");
        c.id = "nprogress", c.innerHTML = j.template;
        var d, f = c.querySelector(j.barSelector), g = a ? "-100" : b(i.status || 0), k = document.querySelector(j.parent);
        return l(f, {
            transition: "all 0 linear",
            transform: "translate3d(" + g + "%,0,0)"
        }), j.showSpinner || (d = c.querySelector(j.spinnerSelector), d && h(d)), k != document.body && e(k, "nprogress-custom-parent"), k.appendChild(c), c
    }, i.remove = function () {
        f(document.documentElement, "nprogress-busy"), f(document.querySelector(j.parent), "nprogress-custom-parent");
        var a = document.getElementById("nprogress");
        a && h(a)
    }, i.isRendered = function () {
        return !!document.getElementById("nprogress")
    }, i.getPositioningCSS = function () {
        var a = document.body.style, b = "WebkitTransform" in a ? "Webkit" : "MozTransform" in a ? "Moz" : "msTransform" in a ? "ms" : "OTransform" in a ? "O" : "";
        return b + "Perspective" in a ? "translate3d" : b + "Transform" in a ? "translate" : "margin"
    };
    var k = function () {
        function a() {
            var c = b.shift();
            c && c(a)
        }

        var b = [];
        return function (c) {
            b.push(c), 1 == b.length && a()
        }
    }(), l = function () {
        function a(a) {
            return a.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function (a, b) {
                return b.toUpperCase()
            })
        }

        function b(a) {
            var b = document.body.style;
            if (a in b)return a;
            for (var c, d = e.length, f = a.charAt(0).toUpperCase() + a.slice(1); d--;)if (c = e[d] + f, c in b)return c;
            return a
        }

        function c(c) {
            return c = a(c), f[c] || (f[c] = b(c))
        }

        function d(a, b, d) {
            b = c(b), a.style[b] = d
        }

        var e = ["Webkit", "O", "Moz", "ms"], f = {};
        return function (a, b) {
            var c, e, f = arguments;
            if (2 == f.length)for (c in b)e = b[c], void 0 !== e && b.hasOwnProperty(c) && d(a, c, e); else d(a, f[1], f[2])
        }
    }();
    return i
});
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {}, Prism = function () {
    var a = /\blang(?:uage)?-(\w+)\b/i, b = 0, c = _self.Prism = {
        util: {
            encode: function (a) {
                return a instanceof d ? new d(a.type, c.util.encode(a.content), a.alias) : "Array" === c.util.type(a) ? a.map(c.util.encode) : a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
            }, type: function (a) {
                return Object.prototype.toString.call(a).match(/\[object (\w+)\]/)[1]
            }, objId: function (a) {
                return a.__id || Object.defineProperty(a, "__id", {value: ++b}), a.__id
            }, clone: function (a) {
                var b = c.util.type(a);
                switch (b) {
                    case"Object":
                        var d = {};
                        for (var e in a)a.hasOwnProperty(e) && (d[e] = c.util.clone(a[e]));
                        return d;
                    case"Array":
                        return a.map && a.map(function (a) {
                                return c.util.clone(a)
                            })
                }
                return a
            }
        }, languages: {
            extend: function (a, b) {
                var d = c.util.clone(c.languages[a]);
                for (var e in b)d[e] = b[e];
                return d
            }, insertBefore: function (a, b, d, e) {
                e = e || c.languages;
                var f = e[a];
                if (2 == arguments.length) {
                    d = arguments[1];
                    for (var g in d)d.hasOwnProperty(g) && (f[g] = d[g]);
                    return f
                }
                var h = {};
                for (var i in f)if (f.hasOwnProperty(i)) {
                    if (i == b)for (var g in d)d.hasOwnProperty(g) && (h[g] = d[g]);
                    h[i] = f[i]
                }
                return c.languages.DFS(c.languages, function (b, c) {
                    c === e[a] && b != a && (this[b] = h)
                }), e[a] = h
            }, DFS: function (a, b, d, e) {
                e = e || {};
                for (var f in a)a.hasOwnProperty(f) && (b.call(a, f, a[f], d || f), "Object" !== c.util.type(a[f]) || e[c.util.objId(a[f])] ? "Array" !== c.util.type(a[f]) || e[c.util.objId(a[f])] || (e[c.util.objId(a[f])] = !0, c.languages.DFS(a[f], b, f, e)) : (e[c.util.objId(a[f])] = !0, c.languages.DFS(a[f], b, null, e)))
            }
        }, plugins: {}, highlightAll: function (a, b) {
            var d = {
                callback: b,
                selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };
            c.hooks.run("before-highlightall", d);
            for (var e, f = d.elements || document.querySelectorAll(d.selector), g = 0; e = f[g++];)c.highlightElement(e, a === !0, d.callback)
        }, highlightElement: function (b, d, e) {
            for (var f, g, h = b; h && !a.test(h.className);)h = h.parentNode;
            h && (f = (h.className.match(a) || [, ""])[1].toLowerCase(), g = c.languages[f]), b.className = b.className.replace(a, "").replace(/\s+/g, " ") + " language-" + f, h = b.parentNode, /pre/i.test(h.nodeName) && (h.className = h.className.replace(a, "").replace(/\s+/g, " ") + " language-" + f);
            var i = b.textContent, j = {element: b, language: f, grammar: g, code: i};
            if (c.hooks.run("before-sanity-check", j), !j.code || !j.grammar)return void c.hooks.run("complete", j);
            if (c.hooks.run("before-highlight", j), d && _self.Worker) {
                var k = new Worker(c.filename);
                k.onmessage = function (a) {
                    j.highlightedCode = a.data, c.hooks.run("before-insert", j), j.element.innerHTML = j.highlightedCode, e && e.call(j.element), c.hooks.run("after-highlight", j), c.hooks.run("complete", j)
                }, k.postMessage(JSON.stringify({language: j.language, code: j.code, immediateClose: !0}))
            } else j.highlightedCode = c.highlight(j.code, j.grammar, j.language), c.hooks.run("before-insert", j), j.element.innerHTML = j.highlightedCode, e && e.call(b), c.hooks.run("after-highlight", j), c.hooks.run("complete", j)
        }, highlight: function (a, b, e) {
            var f = c.tokenize(a, b);
            return d.stringify(c.util.encode(f), e)
        }, tokenize: function (a, b) {
            var d = c.Token, e = [a], f = b.rest;
            if (f) {
                for (var g in f)b[g] = f[g];
                delete b.rest
            }
            a:for (var g in b)if (b.hasOwnProperty(g) && b[g]) {
                var h = b[g];
                h = "Array" === c.util.type(h) ? h : [h];
                for (var i = 0; i < h.length; ++i) {
                    var j = h[i], k = j.inside, l = !!j.lookbehind, m = !!j.greedy, n = 0, o = j.alias;
                    if (m && !j.pattern.global) {
                        var p = j.pattern.toString().match(/[imuy]*$/)[0];
                        j.pattern = RegExp(j.pattern.source, p + "g")
                    }
                    j = j.pattern || j;
                    for (var q = 0, r = 0; q < e.length; r += (e[q].matchedStr || e[q]).length, ++q) {
                        var s = e[q];
                        if (e.length > a.length)break a;
                        if (!(s instanceof d)) {
                            j.lastIndex = 0;
                            var t = j.exec(s), u = 1;
                            if (!t && m && q != e.length - 1) {
                                if (j.lastIndex = r, t = j.exec(a), !t)break;
                                for (var v = t.index + (l ? t[1].length : 0), w = t.index + t[0].length, x = q, y = r, z = e.length; z > x && w > y; ++x)y += (e[x].matchedStr || e[x]).length, v >= y && (++q, r = y);
                                if (e[q] instanceof d || e[x - 1].greedy)continue;
                                u = x - q, s = a.slice(r, y), t.index -= r
                            }
                            if (t) {
                                l && (n = t[1].length);
                                var v = t.index + n, t = t[0].slice(n), w = v + t.length, A = s.slice(0, v), B = s.slice(w), C = [q, u];
                                A && C.push(A);
                                var D = new d(g, k ? c.tokenize(t, k) : t, o, t, m);
                                C.push(D), B && C.push(B), Array.prototype.splice.apply(e, C)
                            }
                        }
                    }
                }
            }
            return e
        }, hooks: {
            all: {}, add: function (a, b) {
                var d = c.hooks.all;
                d[a] = d[a] || [], d[a].push(b)
            }, run: function (a, b) {
                var d = c.hooks.all[a];
                if (d && d.length)for (var e, f = 0; e = d[f++];)e(b)
            }
        }
    }, d = c.Token = function (a, b, c, d, e) {
        this.type = a, this.content = b, this.alias = c, this.matchedStr = d || null, this.greedy = !!e
    };
    if (d.stringify = function (a, b, e) {
            if ("string" == typeof a)return a;
            if ("Array" === c.util.type(a))return a.map(function (c) {
                return d.stringify(c, b, a)
            }).join("");
            var f = {
                type: a.type,
                content: d.stringify(a.content, b, e),
                tag: "span",
                classes: ["token", a.type],
                attributes: {},
                language: b,
                parent: e
            };
            if ("comment" == f.type && (f.attributes.spellcheck = "true"), a.alias) {
                var g = "Array" === c.util.type(a.alias) ? a.alias : [a.alias];
                Array.prototype.push.apply(f.classes, g)
            }
            c.hooks.run("wrap", f);
            var h = "";
            for (var i in f.attributes)h += (h ? " " : "") + i + '="' + (f.attributes[i] || "") + '"';
            return "<" + f.tag + ' class="' + f.classes.join(" ") + '" ' + h + ">" + f.content + "</" + f.tag + ">"
        }, !_self.document)return _self.addEventListener ? (_self.addEventListener("message", function (a) {
        var b = JSON.parse(a.data), d = b.language, e = b.code, f = b.immediateClose;
        _self.postMessage(c.highlight(e, c.languages[d], d)), f && _self.close()
    }, !1), _self.Prism) : _self.Prism;
    var e = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
    return e && (c.filename = e.src, document.addEventListener && !e.hasAttribute("data-manual") && ("loading" !== document.readyState ? window.requestAnimationFrame ? window.requestAnimationFrame(c.highlightAll) : window.setTimeout(c.highlightAll, 16) : document.addEventListener("DOMContentLoaded", c.highlightAll))), _self.Prism
}();
"undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism), Prism.languages.markup = {
    comment: /<!--[\w\W]*?-->/,
    prolog: /<\?[\w\W]+?\?>/,
    doctype: /<!DOCTYPE[\w\W]+?>/,
    cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        inside: {
            tag: {pattern: /^<\/?[^\s>\/]+/i, inside: {punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/}},
            "attr-value": {pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i, inside: {punctuation: /[=>"']/}},
            punctuation: /\/?>/,
            "attr-name": {pattern: /[^\s>\/]+/, inside: {namespace: /^[^\s>\/:]+:/}}
        }
    },
    entity: /&#?[\da-z]{1,8};/i
}, Prism.hooks.add("wrap", function (a) {
    "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"))
}), Prism.languages.xml = Prism.languages.markup, Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup, Prism.languages.css = {
    comment: /\/\*[\w\W]*?\*\//,
    atrule: {pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i, inside: {rule: /@[\w-]+/}},
    url: /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
    selector: /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
    string: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
    property: /(\b|\B)[\w-]+(?=\s*:)/i,
    important: /\B!important\b/i,
    "function": /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:]/
}, Prism.languages.css.atrule.inside.rest = Prism.util.clone(Prism.languages.css), Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", {
    style: {
        pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
        lookbehind: !0,
        inside: Prism.languages.css,
        alias: "language-css"
    }
}), Prism.languages.insertBefore("inside", "attr-value", {
    "style-attr": {
        pattern: /\s*style=("|').*?\1/i,
        inside: {
            "attr-name": {pattern: /^\s*style/i, inside: Prism.languages.markup.tag.inside},
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": {pattern: /.+/i, inside: Prism.languages.css}
        },
        alias: "language-css"
    }
}, Prism.languages.markup.tag)), Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
        lookbehind: !0
    }, {pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0}],
    string: {pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0},
    "class-name": {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
        lookbehind: !0,
        inside: {punctuation: /(\.|\\)/}
    },
    keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    "boolean": /\b(true|false)\b/,
    "function": /[a-z0-9_]+(?=\()/i,
    number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
}, Prism.languages.javascript = Prism.languages.extend("clike", {
    keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
    number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
    "function": /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
}), Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: !0,
        greedy: !0
    }
}), Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\\\|\\?[^\\])*?`/,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /\$\{[^}]+\}/,
                inside: {
                    "interpolation-punctuation": {pattern: /^\$\{|\}$/, alias: "punctuation"},
                    rest: Prism.languages.javascript
                }
            }, string: /[\s\S]+/
        }
    }
}), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
    script: {
        pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
        alias: "language-javascript"
    }
}), Prism.languages.js = Prism.languages.javascript, Prism.languages.apacheconf = {
    comment: /#.*/,
    "directive-inline": {
        pattern: /^(\s*)\b(AcceptFilter|AcceptPathInfo|AccessFileName|Action|AddAlt|AddAltByEncoding|AddAltByType|AddCharset|AddDefaultCharset|AddDescription|AddEncoding|AddHandler|AddIcon|AddIconByEncoding|AddIconByType|AddInputFilter|AddLanguage|AddModuleInfo|AddOutputFilter|AddOutputFilterByType|AddType|Alias|AliasMatch|Allow|AllowCONNECT|AllowEncodedSlashes|AllowMethods|AllowOverride|AllowOverrideList|Anonymous|Anonymous_LogEmail|Anonymous_MustGiveEmail|Anonymous_NoUserID|Anonymous_VerifyEmail|AsyncRequestWorkerFactor|AuthBasicAuthoritative|AuthBasicFake|AuthBasicProvider|AuthBasicUseDigestAlgorithm|AuthDBDUserPWQuery|AuthDBDUserRealmQuery|AuthDBMGroupFile|AuthDBMType|AuthDBMUserFile|AuthDigestAlgorithm|AuthDigestDomain|AuthDigestNonceLifetime|AuthDigestProvider|AuthDigestQop|AuthDigestShmemSize|AuthFormAuthoritative|AuthFormBody|AuthFormDisableNoStore|AuthFormFakeBasicAuth|AuthFormLocation|AuthFormLoginRequiredLocation|AuthFormLoginSuccessLocation|AuthFormLogoutLocation|AuthFormMethod|AuthFormMimetype|AuthFormPassword|AuthFormProvider|AuthFormSitePassphrase|AuthFormSize|AuthFormUsername|AuthGroupFile|AuthLDAPAuthorizePrefix|AuthLDAPBindAuthoritative|AuthLDAPBindDN|AuthLDAPBindPassword|AuthLDAPCharsetConfig|AuthLDAPCompareAsUser|AuthLDAPCompareDNOnServer|AuthLDAPDereferenceAliases|AuthLDAPGroupAttribute|AuthLDAPGroupAttributeIsDN|AuthLDAPInitialBindAsUser|AuthLDAPInitialBindPattern|AuthLDAPMaxSubGroupDepth|AuthLDAPRemoteUserAttribute|AuthLDAPRemoteUserIsDN|AuthLDAPSearchAsUser|AuthLDAPSubGroupAttribute|AuthLDAPSubGroupClass|AuthLDAPUrl|AuthMerging|AuthName|AuthnCacheContext|AuthnCacheEnable|AuthnCacheProvideFor|AuthnCacheSOCache|AuthnCacheTimeout|AuthnzFcgiCheckAuthnProvider|AuthnzFcgiDefineProvider|AuthType|AuthUserFile|AuthzDBDLoginToReferer|AuthzDBDQuery|AuthzDBDRedirectQuery|AuthzDBMType|AuthzSendForbiddenOnFailure|BalancerGrowth|BalancerInherit|BalancerMember|BalancerPersist|BrowserMatch|BrowserMatchNoCase|BufferedLogs|BufferSize|CacheDefaultExpire|CacheDetailHeader|CacheDirLength|CacheDirLevels|CacheDisable|CacheEnable|CacheFile|CacheHeader|CacheIgnoreCacheControl|CacheIgnoreHeaders|CacheIgnoreNoLastMod|CacheIgnoreQueryString|CacheIgnoreURLSessionIdentifiers|CacheKeyBaseURL|CacheLastModifiedFactor|CacheLock|CacheLockMaxAge|CacheLockPath|CacheMaxExpire|CacheMaxFileSize|CacheMinExpire|CacheMinFileSize|CacheNegotiatedDocs|CacheQuickHandler|CacheReadSize|CacheReadTime|CacheRoot|CacheSocache|CacheSocacheMaxSize|CacheSocacheMaxTime|CacheSocacheMinTime|CacheSocacheReadSize|CacheSocacheReadTime|CacheStaleOnError|CacheStoreExpired|CacheStoreNoStore|CacheStorePrivate|CGIDScriptTimeout|CGIMapExtension|CharsetDefault|CharsetOptions|CharsetSourceEnc|CheckCaseOnly|CheckSpelling|ChrootDir|ContentDigest|CookieDomain|CookieExpires|CookieName|CookieStyle|CookieTracking|CoreDumpDirectory|CustomLog|Dav|DavDepthInfinity|DavGenericLockDB|DavLockDB|DavMinTimeout|DBDExptime|DBDInitSQL|DBDKeep|DBDMax|DBDMin|DBDParams|DBDPersist|DBDPrepareSQL|DBDriver|DefaultIcon|DefaultLanguage|DefaultRuntimeDir|DefaultType|Define|DeflateBufferSize|DeflateCompressionLevel|DeflateFilterNote|DeflateInflateLimitRequestBody|DeflateInflateRatioBurst|DeflateInflateRatioLimit|DeflateMemLevel|DeflateWindowSize|Deny|DirectoryCheckHandler|DirectoryIndex|DirectoryIndexRedirect|DirectorySlash|DocumentRoot|DTracePrivileges|DumpIOInput|DumpIOOutput|EnableExceptionHook|EnableMMAP|EnableSendfile|Error|ErrorDocument|ErrorLog|ErrorLogFormat|Example|ExpiresActive|ExpiresByType|ExpiresDefault|ExtendedStatus|ExtFilterDefine|ExtFilterOptions|FallbackResource|FileETag|FilterChain|FilterDeclare|FilterProtocol|FilterProvider|FilterTrace|ForceLanguagePriority|ForceType|ForensicLog|GprofDir|GracefulShutdownTimeout|Group|Header|HeaderName|HeartbeatAddress|HeartbeatListen|HeartbeatMaxServers|HeartbeatStorage|HeartbeatStorage|HostnameLookups|IdentityCheck|IdentityCheckTimeout|ImapBase|ImapDefault|ImapMenu|Include|IncludeOptional|IndexHeadInsert|IndexIgnore|IndexIgnoreReset|IndexOptions|IndexOrderDefault|IndexStyleSheet|InputSed|ISAPIAppendLogToErrors|ISAPIAppendLogToQuery|ISAPICacheFile|ISAPIFakeAsync|ISAPILogNotSupported|ISAPIReadAheadBuffer|KeepAlive|KeepAliveTimeout|KeptBodySize|LanguagePriority|LDAPCacheEntries|LDAPCacheTTL|LDAPConnectionPoolTTL|LDAPConnectionTimeout|LDAPLibraryDebug|LDAPOpCacheEntries|LDAPOpCacheTTL|LDAPReferralHopLimit|LDAPReferrals|LDAPRetries|LDAPRetryDelay|LDAPSharedCacheFile|LDAPSharedCacheSize|LDAPTimeout|LDAPTrustedClientCert|LDAPTrustedGlobalCert|LDAPTrustedMode|LDAPVerifyServerCert|LimitInternalRecursion|LimitRequestBody|LimitRequestFields|LimitRequestFieldSize|LimitRequestLine|LimitXMLRequestBody|Listen|ListenBackLog|LoadFile|LoadModule|LogFormat|LogLevel|LogMessage|LuaAuthzProvider|LuaCodeCache|LuaHookAccessChecker|LuaHookAuthChecker|LuaHookCheckUserID|LuaHookFixups|LuaHookInsertFilter|LuaHookLog|LuaHookMapToStorage|LuaHookTranslateName|LuaHookTypeChecker|LuaInherit|LuaInputFilter|LuaMapHandler|LuaOutputFilter|LuaPackageCPath|LuaPackagePath|LuaQuickHandler|LuaRoot|LuaScope|MaxConnectionsPerChild|MaxKeepAliveRequests|MaxMemFree|MaxRangeOverlaps|MaxRangeReversals|MaxRanges|MaxRequestWorkers|MaxSpareServers|MaxSpareThreads|MaxThreads|MergeTrailers|MetaDir|MetaFiles|MetaSuffix|MimeMagicFile|MinSpareServers|MinSpareThreads|MMapFile|ModemStandard|ModMimeUsePathInfo|MultiviewsMatch|Mutex|NameVirtualHost|NoProxy|NWSSLTrustedCerts|NWSSLUpgradeable|Options|Order|OutputSed|PassEnv|PidFile|PrivilegesMode|Protocol|ProtocolEcho|ProxyAddHeaders|ProxyBadHeader|ProxyBlock|ProxyDomain|ProxyErrorOverride|ProxyExpressDBMFile|ProxyExpressDBMType|ProxyExpressEnable|ProxyFtpDirCharset|ProxyFtpEscapeWildcards|ProxyFtpListOnWildcard|ProxyHTMLBufSize|ProxyHTMLCharsetOut|ProxyHTMLDocType|ProxyHTMLEnable|ProxyHTMLEvents|ProxyHTMLExtended|ProxyHTMLFixups|ProxyHTMLInterp|ProxyHTMLLinks|ProxyHTMLMeta|ProxyHTMLStripComments|ProxyHTMLURLMap|ProxyIOBufferSize|ProxyMaxForwards|ProxyPass|ProxyPassInherit|ProxyPassInterpolateEnv|ProxyPassMatch|ProxyPassReverse|ProxyPassReverseCookieDomain|ProxyPassReverseCookiePath|ProxyPreserveHost|ProxyReceiveBufferSize|ProxyRemote|ProxyRemoteMatch|ProxyRequests|ProxySCGIInternalRedirect|ProxySCGISendfile|ProxySet|ProxySourceAddress|ProxyStatus|ProxyTimeout|ProxyVia|ReadmeName|ReceiveBufferSize|Redirect|RedirectMatch|RedirectPermanent|RedirectTemp|ReflectorHeader|RemoteIPHeader|RemoteIPInternalProxy|RemoteIPInternalProxyList|RemoteIPProxiesHeader|RemoteIPTrustedProxy|RemoteIPTrustedProxyList|RemoveCharset|RemoveEncoding|RemoveHandler|RemoveInputFilter|RemoveLanguage|RemoveOutputFilter|RemoveType|RequestHeader|RequestReadTimeout|Require|RewriteBase|RewriteCond|RewriteEngine|RewriteMap|RewriteOptions|RewriteRule|RLimitCPU|RLimitMEM|RLimitNPROC|Satisfy|ScoreBoardFile|Script|ScriptAlias|ScriptAliasMatch|ScriptInterpreterSource|ScriptLog|ScriptLogBuffer|ScriptLogLength|ScriptSock|SecureListen|SeeRequestTail|SendBufferSize|ServerAdmin|ServerAlias|ServerLimit|ServerName|ServerPath|ServerRoot|ServerSignature|ServerTokens|Session|SessionCookieName|SessionCookieName2|SessionCookieRemove|SessionCryptoCipher|SessionCryptoDriver|SessionCryptoPassphrase|SessionCryptoPassphraseFile|SessionDBDCookieName|SessionDBDCookieName2|SessionDBDCookieRemove|SessionDBDDeleteLabel|SessionDBDInsertLabel|SessionDBDPerUser|SessionDBDSelectLabel|SessionDBDUpdateLabel|SessionEnv|SessionExclude|SessionHeader|SessionInclude|SessionMaxAge|SetEnv|SetEnvIf|SetEnvIfExpr|SetEnvIfNoCase|SetHandler|SetInputFilter|SetOutputFilter|SSIEndTag|SSIErrorMsg|SSIETag|SSILastModified|SSILegacyExprParser|SSIStartTag|SSITimeFormat|SSIUndefinedEcho|SSLCACertificateFile|SSLCACertificatePath|SSLCADNRequestFile|SSLCADNRequestPath|SSLCARevocationCheck|SSLCARevocationFile|SSLCARevocationPath|SSLCertificateChainFile|SSLCertificateFile|SSLCertificateKeyFile|SSLCipherSuite|SSLCompression|SSLCryptoDevice|SSLEngine|SSLFIPS|SSLHonorCipherOrder|SSLInsecureRenegotiation|SSLOCSPDefaultResponder|SSLOCSPEnable|SSLOCSPOverrideResponder|SSLOCSPResponderTimeout|SSLOCSPResponseMaxAge|SSLOCSPResponseTimeSkew|SSLOCSPUseRequestNonce|SSLOpenSSLConfCmd|SSLOptions|SSLPassPhraseDialog|SSLProtocol|SSLProxyCACertificateFile|SSLProxyCACertificatePath|SSLProxyCARevocationCheck|SSLProxyCARevocationFile|SSLProxyCARevocationPath|SSLProxyCheckPeerCN|SSLProxyCheckPeerExpire|SSLProxyCheckPeerName|SSLProxyCipherSuite|SSLProxyEngine|SSLProxyMachineCertificateChainFile|SSLProxyMachineCertificateFile|SSLProxyMachineCertificatePath|SSLProxyProtocol|SSLProxyVerify|SSLProxyVerifyDepth|SSLRandomSeed|SSLRenegBufferSize|SSLRequire|SSLRequireSSL|SSLSessionCache|SSLSessionCacheTimeout|SSLSessionTicketKeyFile|SSLSRPUnknownUserSeed|SSLSRPVerifierFile|SSLStaplingCache|SSLStaplingErrorCacheTimeout|SSLStaplingFakeTryLater|SSLStaplingForceURL|SSLStaplingResponderTimeout|SSLStaplingResponseMaxAge|SSLStaplingResponseTimeSkew|SSLStaplingReturnResponderErrors|SSLStaplingStandardCacheTimeout|SSLStrictSNIVHostCheck|SSLUserName|SSLUseStapling|SSLVerifyClient|SSLVerifyDepth|StartServers|StartThreads|Substitute|Suexec|SuexecUserGroup|ThreadLimit|ThreadsPerChild|ThreadStackSize|TimeOut|TraceEnable|TransferLog|TypesConfig|UnDefine|UndefMacro|UnsetEnv|Use|UseCanonicalName|UseCanonicalPhysicalPort|User|UserDir|VHostCGIMode|VHostCGIPrivs|VHostGroup|VHostPrivs|VHostSecure|VHostUser|VirtualDocumentRoot|VirtualDocumentRootIP|VirtualScriptAlias|VirtualScriptAliasIP|WatchdogInterval|XBitHack|xml2EncAlias|xml2EncDefault|xml2StartParse)\b/im,
        lookbehind: !0, alias: "property"
    },
    "directive-block": {
        pattern: /<\/?\b(AuthnProviderAlias|AuthzProviderAlias|Directory|DirectoryMatch|Else|ElseIf|Files|FilesMatch|If|IfDefine|IfModule|IfVersion|Limit|LimitExcept|Location|LocationMatch|Macro|Proxy|RequireAll|RequireAny|RequireNone|VirtualHost)\b *.*>/i,
        inside: {
            "directive-block": {pattern: /^<\/?\w+/, inside: {punctuation: /^<\/?/}, alias: "tag"},
            "directive-block-parameter": {
                pattern: /.*[^>]/,
                inside: {
                    punctuation: /:/,
                    string: {pattern: /("|').*\1/, inside: {variable: /(\$|%)\{?(\w\.?(\+|\-|:)?)+\}?/}}
                },
                alias: "attr-value"
            },
            punctuation: />/
        },
        alias: "tag"
    },
    "directive-flags": {pattern: /\[(\w,?)+\]/, alias: "keyword"},
    string: {pattern: /("|').*\1/, inside: {variable: /(\$|%)\{?(\w\.?(\+|\-|:)?)+\}?/}},
    variable: /(\$|%)\{?(\w\.?(\+|\-|:)?)+\}?/,
    regex: /\^?.*\$|\^.*\$?/
}, !function (a) {
    var b = {
        variable: [{
            pattern: /\$?\(\([\w\W]+?\)\)/,
            inside: {
                variable: [{pattern: /(^\$\(\([\w\W]+)\)\)/, lookbehind: !0}, /^\$\(\(/],
                number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,
                operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
                punctuation: /\(\(?|\)\)?|,|;/
            }
        }, {
            pattern: /\$\([^)]+\)|`[^`]+`/,
            inside: {variable: /^\$\(|^`|\)$|`$/}
        }, /\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i]
    };
    a.languages.bash = {
        shebang: {pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/, alias: "important"},
        comment: {pattern: /(^|[^"{\\])#.*/, lookbehind: !0},
        string: [{
            pattern: /((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,
            lookbehind: !0,
            greedy: !0,
            inside: b
        }, {pattern: /(["'])(?:\\\\|\\?[^\\])*?\1/g, greedy: !0, inside: b}],
        variable: b.variable,
        "function": {
            pattern: /(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,
            lookbehind: !0
        },
        keyword: {
            pattern: /(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,
            lookbehind: !0
        },
        "boolean": {pattern: /(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/, lookbehind: !0},
        operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
    };
    var c = b.variable[1].inside;
    c["function"] = a.languages.bash["function"], c.keyword = a.languages.bash.keyword, c["boolean"] = a.languages.bash["boolean"], c.operator = a.languages.bash.operator, c.punctuation = a.languages.bash.punctuation
}(Prism), Prism.languages.css.selector = {
    pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/,
    inside: {
        "pseudo-element": /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
        "pseudo-class": /:[-\w]+(?:\(.*\))?/,
        "class": /\.[-:\.\w]+/,
        id: /#[-:\.\w]+/
    }
}, Prism.languages.insertBefore("css", "function", {
    hexcode: /#[\da-f]{3,6}/i,
    entity: /\\[\da-f]{1,8}/i,
    number: /[\d%\.]+/
}), Prism.languages.c = Prism.languages.extend("clike", {
    keyword: /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
    operator: /\-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|?\||[~^%?*\/]/,
    number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)[ful]*\b/i
}), Prism.languages.insertBefore("c", "string", {
    macro: {
        pattern: /(^\s*)#\s*[a-z]+([^\r\n\\]|\\.|\\(?:\r\n?|\n))*/im,
        lookbehind: !0,
        alias: "property",
        inside: {
            string: {pattern: /(#\s*include\s*)(<.+?>|("|')(\\?.)+?\3)/, lookbehind: !0},
            directive: {
                pattern: /(#\s*)\b(define|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/,
                lookbehind: !0,
                alias: "keyword"
            }
        }
    }, constant: /\b(__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|stdin|stdout|stderr)\b/
}), delete Prism.languages.c["class-name"], delete Prism.languages.c["boolean"], Prism.languages.docker = {
    keyword: {
        pattern: /(^\s*)(?:ONBUILD|FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|COPY|VOLUME|USER|WORKDIR|CMD|LABEL|ENTRYPOINT)(?=\s)/im,
        lookbehind: !0
    },
    string: /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*?\1/,
    comment: /#.*/,
    punctuation: /---|\.\.\.|[:[\]{}\-,|>?]/
}, Prism.languages.http = {
    "request-line": {
        pattern: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b\shttps?:\/\/\S+\sHTTP\/[0-9.]+/m,
        inside: {property: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/, "attr-name": /:\w+/}
    },
    "response-status": {
        pattern: /^HTTP\/1.[01] [0-9]+.*/m,
        inside: {property: {pattern: /(^HTTP\/1.[01] )[0-9]+.*/i, lookbehind: !0}}
    },
    "header-name": {pattern: /^[\w-]+:(?=.)/m, alias: "keyword"}
};
var httpLanguages = {
    "application/json": Prism.languages.javascript,
    "application/xml": Prism.languages.markup,
    "text/xml": Prism.languages.markup,
    "text/html": Prism.languages.markup
};
for (var contentType in httpLanguages)if (httpLanguages[contentType]) {
    var options = {};
    options[contentType] = {
        pattern: new RegExp("(content-type:\\s*" + contentType + "[\\w\\W]*?)(?:\\r?\\n|\\r){2}[\\w\\W]*", "i"),
        lookbehind: !0,
        inside: {rest: httpLanguages[contentType]}
    }, Prism.languages.insertBefore("http", "header-name", options)
}
Prism.languages.java = Prism.languages.extend("clike", {
    keyword: /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,
    number: /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+(?:e[+-]?\d+)?[df]?\b/i,
    operator: {
        pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
        lookbehind: !0
    }
}), Prism.languages.insertBefore("java", "function", {
    annotation: {
        alias: "punctuation",
        pattern: /(^|[^.])@\w+/,
        lookbehind: !0
    }
}), Prism.languages.json = {
    property: /".*?"(?=\s*:)/gi,
    string: /"(?!:)(\\?[^"])*?"(?!:)/g,
    number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
    punctuation: /[{}[\]);,]/g,
    operator: /:/g,
    "boolean": /\b(true|false)\b/gi,
    "null": /\bnull\b/gi
}, Prism.languages.jsonp = Prism.languages.json, Prism.languages.markdown = Prism.languages.extend("markup", {}), Prism.languages.insertBefore("markdown", "prolog", {
    blockquote: {
        pattern: /^>(?:[\t ]*>)*/m,
        alias: "punctuation"
    },
    code: [{pattern: /^(?: {4}|\t).+/m, alias: "keyword"}, {pattern: /``.+?``|`[^`\n]+`/, alias: "keyword"}],
    title: [{
        pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
        alias: "important",
        inside: {punctuation: /==+$|--+$/}
    }, {pattern: /(^\s*)#+.+/m, lookbehind: !0, alias: "important", inside: {punctuation: /^#+|#+$/}}],
    hr: {pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m, lookbehind: !0, alias: "punctuation"},
    list: {pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m, lookbehind: !0, alias: "punctuation"},
    "url-reference": {
        pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
        inside: {
            variable: {pattern: /^(!?\[)[^\]]+/, lookbehind: !0},
            string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
            punctuation: /^[\[\]!:]|[<>]/
        },
        alias: "url"
    },
    bold: {
        pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
        lookbehind: !0,
        inside: {punctuation: /^\*\*|^__|\*\*$|__$/}
    },
    italic: {
        pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
        lookbehind: !0,
        inside: {punctuation: /^[*_]|[*_]$/}
    },
    url: {
        pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
        inside: {
            variable: {pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0},
            string: {pattern: /"(?:\\.|[^"\\])*"(?=\)$)/}
        }
    }
}), Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic), Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold), Prism.languages.nginx = Prism.languages.extend("clike", {
    comment: {
        pattern: /(^|[^"{\\])#.*/,
        lookbehind: !0
    },
    keyword: /\b(?:CONTENT_|DOCUMENT_|GATEWAY_|HTTP_|HTTPS|if_not_empty|PATH_|QUERY_|REDIRECT_|REMOTE_|REQUEST_|SCGI|SCRIPT_|SERVER_|http|server|events|location|include|accept_mutex|accept_mutex_delay|access_log|add_after_body|add_before_body|add_header|addition_types|aio|alias|allow|ancient_browser|ancient_browser_value|auth|auth_basic|auth_basic_user_file|auth_http|auth_http_header|auth_http_timeout|autoindex|autoindex_exact_size|autoindex_localtime|break|charset|charset_map|charset_types|chunked_transfer_encoding|client_body_buffer_size|client_body_in_file_only|client_body_in_single_buffer|client_body_temp_path|client_body_timeout|client_header_buffer_size|client_header_timeout|client_max_body_size|connection_pool_size|create_full_put_path|daemon|dav_access|dav_methods|debug_connection|debug_points|default_type|deny|devpoll_changes|devpoll_events|directio|directio_alignment|disable_symlinks|empty_gif|env|epoll_events|error_log|error_page|expires|fastcgi_buffer_size|fastcgi_buffers|fastcgi_busy_buffers_size|fastcgi_cache|fastcgi_cache_bypass|fastcgi_cache_key|fastcgi_cache_lock|fastcgi_cache_lock_timeout|fastcgi_cache_methods|fastcgi_cache_min_uses|fastcgi_cache_path|fastcgi_cache_purge|fastcgi_cache_use_stale|fastcgi_cache_valid|fastcgi_connect_timeout|fastcgi_hide_header|fastcgi_ignore_client_abort|fastcgi_ignore_headers|fastcgi_index|fastcgi_intercept_errors|fastcgi_keep_conn|fastcgi_max_temp_file_size|fastcgi_next_upstream|fastcgi_no_cache|fastcgi_param|fastcgi_pass|fastcgi_pass_header|fastcgi_read_timeout|fastcgi_redirect_errors|fastcgi_send_timeout|fastcgi_split_path_info|fastcgi_store|fastcgi_store_access|fastcgi_temp_file_write_size|fastcgi_temp_path|flv|geo|geoip_city|geoip_country|google_perftools_profiles|gzip|gzip_buffers|gzip_comp_level|gzip_disable|gzip_http_version|gzip_min_length|gzip_proxied|gzip_static|gzip_types|gzip_vary|if|if_modified_since|ignore_invalid_headers|image_filter|image_filter_buffer|image_filter_jpeg_quality|image_filter_sharpen|image_filter_transparency|imap_capabilities|imap_client_buffer|include|index|internal|ip_hash|keepalive|keepalive_disable|keepalive_requests|keepalive_timeout|kqueue_changes|kqueue_events|large_client_header_buffers|limit_conn|limit_conn_log_level|limit_conn_zone|limit_except|limit_rate|limit_rate_after|limit_req|limit_req_log_level|limit_req_zone|limit_zone|lingering_close|lingering_time|lingering_timeout|listen|location|lock_file|log_format|log_format_combined|log_not_found|log_subrequest|map|map_hash_bucket_size|map_hash_max_size|master_process|max_ranges|memcached_buffer_size|memcached_connect_timeout|memcached_next_upstream|memcached_pass|memcached_read_timeout|memcached_send_timeout|merge_slashes|min_delete_depth|modern_browser|modern_browser_value|mp4|mp4_buffer_size|mp4_max_buffer_size|msie_padding|msie_refresh|multi_accept|open_file_cache|open_file_cache_errors|open_file_cache_min_uses|open_file_cache_valid|open_log_file_cache|optimize_server_names|override_charset|pcre_jit|perl|perl_modules|perl_require|perl_set|pid|pop3_auth|pop3_capabilities|port_in_redirect|post_action|postpone_output|protocol|proxy|proxy_buffer|proxy_buffer_size|proxy_buffering|proxy_buffers|proxy_busy_buffers_size|proxy_cache|proxy_cache_bypass|proxy_cache_key|proxy_cache_lock|proxy_cache_lock_timeout|proxy_cache_methods|proxy_cache_min_uses|proxy_cache_path|proxy_cache_use_stale|proxy_cache_valid|proxy_connect_timeout|proxy_cookie_domain|proxy_cookie_path|proxy_headers_hash_bucket_size|proxy_headers_hash_max_size|proxy_hide_header|proxy_http_version|proxy_ignore_client_abort|proxy_ignore_headers|proxy_intercept_errors|proxy_max_temp_file_size|proxy_method|proxy_next_upstream|proxy_no_cache|proxy_pass|proxy_pass_error_message|proxy_pass_header|proxy_pass_request_body|proxy_pass_request_headers|proxy_read_timeout|proxy_redirect|proxy_redirect_errors|proxy_send_lowat|proxy_send_timeout|proxy_set_body|proxy_set_header|proxy_ssl_session_reuse|proxy_store|proxy_store_access|proxy_temp_file_write_size|proxy_temp_path|proxy_timeout|proxy_upstream_fail_timeout|proxy_upstream_max_fails|random_index|read_ahead|real_ip_header|recursive_error_pages|request_pool_size|reset_timedout_connection|resolver|resolver_timeout|return|rewrite|root|rtsig_overflow_events|rtsig_overflow_test|rtsig_overflow_threshold|rtsig_signo|satisfy|satisfy_any|secure_link_secret|send_lowat|send_timeout|sendfile|sendfile_max_chunk|server|server_name|server_name_in_redirect|server_names_hash_bucket_size|server_names_hash_max_size|server_tokens|set|set_real_ip_from|smtp_auth|smtp_capabilities|so_keepalive|source_charset|split_clients|ssi|ssi_silent_errors|ssi_types|ssi_value_length|ssl|ssl_certificate|ssl_certificate_key|ssl_ciphers|ssl_client_certificate|ssl_crl|ssl_dhparam|ssl_engine|ssl_prefer_server_ciphers|ssl_protocols|ssl_session_cache|ssl_session_timeout|ssl_verify_client|ssl_verify_depth|starttls|stub_status|sub_filter|sub_filter_once|sub_filter_types|tcp_nodelay|tcp_nopush|timeout|timer_resolution|try_files|types|types_hash_bucket_size|types_hash_max_size|underscores_in_headers|uninitialized_variable_warn|upstream|use|user|userid|userid_domain|userid_expires|userid_name|userid_p3p|userid_path|userid_service|valid_referers|variables_hash_bucket_size|variables_hash_max_size|worker_connections|worker_cpu_affinity|worker_priority|worker_processes|worker_rlimit_core|worker_rlimit_nofile|worker_rlimit_sigpending|working_directory|xclient|xml_entities|xslt_entities|xslt_stylesheet|xslt_types)\b/i
}), Prism.languages.insertBefore("nginx", "keyword", {variable: /\$[a-z_]+/i}), Prism.languages.php = Prism.languages.extend("clike", {
    keyword: /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
    constant: /\b[A-Z0-9_]{2,}\b/,
    comment: {pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/, lookbehind: !0, greedy: !0}
}), Prism.languages.insertBefore("php", "class-name", {
    "shell-comment": {
        pattern: /(^|[^\\])#.*/,
        lookbehind: !0,
        alias: "comment"
    }
}), Prism.languages.insertBefore("php", "keyword", {
    delimiter: /\?>|<\?(?:php)?/i,
    variable: /\$\w+\b/i,
    "package": {pattern: /(\\|namespace\s+|use\s+)[\w\\]+/, lookbehind: !0, inside: {punctuation: /\\/}}
}), Prism.languages.insertBefore("php", "operator", {
    property: {
        pattern: /(->)[\w]+/,
        lookbehind: !0
    }
}), Prism.languages.markup && (Prism.hooks.add("before-highlight", function (a) {
    "php" === a.language && (a.tokenStack = [], a.backupCode = a.code, a.code = a.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/gi, function (b) {
        return a.tokenStack.push(b), "{{{PHP" + a.tokenStack.length + "}}}"
    }))
}), Prism.hooks.add("before-insert", function (a) {
    "php" === a.language && (a.code = a.backupCode, delete a.backupCode)
}), Prism.hooks.add("after-highlight", function (a) {
    if ("php" === a.language) {
        for (var b, c = 0; b = a.tokenStack[c]; c++)a.highlightedCode = a.highlightedCode.replace("{{{PHP" + (c + 1) + "}}}", Prism.highlight(b, a.grammar, "php").replace(/\$/g, "$$$$"));
        a.element.innerHTML = a.highlightedCode
    }
}), Prism.hooks.add("wrap", function (a) {
    "php" === a.language && "markup" === a.type && (a.content = a.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, '<span class="token php">$1</span>'))
}), Prism.languages.insertBefore("php", "comment", {
    markup: {pattern: /<[^?]\/?(.*?)>/, inside: Prism.languages.markup},
    php: /\{\{\{PHP[0-9]+\}\}\}/
})), Prism.languages.insertBefore("php", "variable", {
    "this": /\$this\b/,
    global: /\$(?:_(?:SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE)|GLOBALS|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/,
    scope: {pattern: /\b[\w\\]+::/, inside: {keyword: /(static|self|parent)/, punctuation: /(::|\\)/}}
}), !function (a) {
    var b = /\{\*[\w\W]+?\*\}|\{[\w\W]+?\}/g, c = "{literal}", d = "{/literal}", e = !1;
    a.languages.smarty = a.languages.extend("markup", {
        smarty: {
            pattern: b,
            inside: {
                delimiter: {pattern: /^\{|\}$/i, alias: "punctuation"},
                string: /(["'])(?:\\?.)*?\1/,
                number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee][-+]?\d+)?)\b/,
                variable: [/\$(?!\d)\w+/, /#(?!\d)\w+#/, {
                    pattern: /(\.|->)(?!\d)\w+/,
                    lookbehind: !0
                }, {pattern: /(\[)(?!\d)\w+(?=\])/, lookbehind: !0}],
                "function": [{pattern: /(\|\s*)@?(?!\d)\w+/, lookbehind: !0}, /^\/?(?!\d)\w+/, /(?!\d)\w+(?=\()/],
                "attr-name": {
                    pattern: /\w+\s*=\s*(?:(?!\d)\w+)?/,
                    inside: {variable: {pattern: /(=\s*)(?!\d)\w+/, lookbehind: !0}, operator: /=/}
                },
                punctuation: [/[\[\]().,:`]|\->/],
                operator: [/[+\-*\/%]|==?=?|[!<>]=?|&&|\|\|?/, /\bis\s+(?:not\s+)?(?:div|even|odd)(?:\s+by)?\b/, /\b(?:eq|neq?|gt|lt|gt?e|lt?e|not|mod|or|and)\b/],
                keyword: /\b(?:false|off|on|no|true|yes)\b/
            }
        }
    }), a.languages.insertBefore("smarty", "tag", {
        "smarty-comment": {
            pattern: /\{\*[\w\W]*?\*\}/,
            alias: ["smarty", "comment"]
        }
    }), a.hooks.add("before-highlight", function (a) {
        "smarty" === a.language && (a.tokenStack = [], a.backupCode = a.code, a.code = a.code.replace(b, function (b) {
            return b === d && (e = !1), e ? b : (b === c && (e = !0), a.tokenStack.push(b), "___SMARTY" + a.tokenStack.length + "___")
        }))
    }), a.hooks.add("before-insert", function (a) {
        "smarty" === a.language && (a.code = a.backupCode, delete a.backupCode)
    }), a.hooks.add("after-highlight", function (b) {
        if ("smarty" === b.language) {
            for (var c, d = 0; c = b.tokenStack[d]; d++)b.highlightedCode = b.highlightedCode.replace("___SMARTY" + (d + 1) + "___", a.highlight(c, b.grammar, "smarty").replace(/\$/g, "$$$$"));
            b.element.innerHTML = b.highlightedCode
        }
    })
}(Prism), Prism.languages.sql = {
    comment: {pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|(?:--|\/\/|#).*)/, lookbehind: !0},
    string: {pattern: /(^|[^@\\])("|')(?:\\?[\s\S])*?\2/, lookbehind: !0},
    variable: /@[\w.$]+|@("|'|`)(?:\\?[\s\S])+?\1/,
    "function": /\b(?:COUNT|SUM|AVG|MIN|MAX|FIRST|LAST|UCASE|LCASE|MID|LEN|ROUND|NOW|FORMAT)(?=\s*\()/i,
    keyword: /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR VARYING|CHARACTER (?:SET|VARYING)|CHARSET|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|DATA(?:BASES?)?|DATE(?:TIME)?|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITER(?:S)?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE(?: PRECISION)?|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE(?:D BY)?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEYS?|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL(?: CHAR VARYING| CHARACTER(?: VARYING)?| VARCHAR)?|NATURAL|NCHAR(?: VARCHAR)?|NEXT|NO(?: SQL|CHECK|CYCLE)?|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READ(?:S SQL DATA|TEXT)?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START(?:ING BY)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED BY|TEXT(?:SIZE)?|THEN|TIMESTAMP|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNPIVOT|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?)\b/i,
    "boolean": /\b(?:TRUE|FALSE|NULL)\b/i,
    number: /\b-?(?:0x)?\d*\.?[\da-f]+\b/,
    operator: /[-+*\/=%^~]|&&?|\|?\||!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
    punctuation: /[;[\]()`,.]/
}, Prism.languages.vim = {
    string: /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\r\n]|'')*'/,
    comment: /".*/,
    "function": /\w+(?=\()/,
    keyword: /\b(?:ab|abbreviate|abc|abclear|abo|aboveleft|al|all|arga|argadd|argd|argdelete|argdo|arge|argedit|argg|argglobal|argl|arglocal|ar|args|argu|argument|as|ascii|bad|badd|ba|ball|bd|bdelete|be|bel|belowright|bf|bfirst|bl|blast|bm|bmodified|bn|bnext|bN|bNext|bo|botright|bp|bprevious|brea|break|breaka|breakadd|breakd|breakdel|breakl|breaklist|br|brewind|bro|browse|bufdo|b|buffer|buffers|bun|bunload|bw|bwipeout|ca|cabbrev|cabc|cabclear|caddb|caddbuffer|cad|caddexpr|caddf|caddfile|cal|call|cat|catch|cb|cbuffer|cc|ccl|cclose|cd|ce|center|cex|cexpr|cf|cfile|cfir|cfirst|cgetb|cgetbuffer|cgete|cgetexpr|cg|cgetfile|c|change|changes|chd|chdir|che|checkpath|checkt|checktime|cla|clast|cl|clist|clo|close|cmapc|cmapclear|cnew|cnewer|cn|cnext|cN|cNext|cnf|cnfile|cNfcNfile|cnorea|cnoreabbrev|col|colder|colo|colorscheme|comc|comclear|comp|compiler|conf|confirm|con|continue|cope|copen|co|copy|cpf|cpfile|cp|cprevious|cq|cquit|cr|crewind|cuna|cunabbrev|cu|cunmap|cw|cwindow|debugg|debuggreedy|delc|delcommand|d|delete|delf|delfunction|delm|delmarks|diffg|diffget|diffoff|diffpatch|diffpu|diffput|diffsplit|diffthis|diffu|diffupdate|dig|digraphs|di|display|dj|djump|dl|dlist|dr|drop|ds|dsearch|dsp|dsplit|earlier|echoe|echoerr|echom|echomsg|echon|e|edit|el|else|elsei|elseif|em|emenu|endfo|endfor|endf|endfunction|endfun|en|endif|endt|endtry|endw|endwhile|ene|enew|ex|exi|exit|exu|exusage|f|file|files|filetype|fina|finally|fin|find|fini|finish|fir|first|fix|fixdel|fo|fold|foldc|foldclose|folddoc|folddoclosed|foldd|folddoopen|foldo|foldopen|for|fu|fun|function|go|goto|gr|grep|grepa|grepadd|ha|hardcopy|h|help|helpf|helpfind|helpg|helpgrep|helpt|helptags|hid|hide|his|history|ia|iabbrev|iabc|iabclear|if|ij|ijump|il|ilist|imapc|imapclear|in|inorea|inoreabbrev|isearch|isp|isplit|iuna|iunabbrev|iu|iunmap|j|join|ju|jumps|k|keepalt|keepj|keepjumps|kee|keepmarks|laddb|laddbuffer|lad|laddexpr|laddf|laddfile|lan|language|la|last|later|lb|lbuffer|lc|lcd|lch|lchdir|lcl|lclose|let|left|lefta|leftabove|lex|lexpr|lf|lfile|lfir|lfirst|lgetb|lgetbuffer|lgete|lgetexpr|lg|lgetfile|lgr|lgrep|lgrepa|lgrepadd|lh|lhelpgrep|l|list|ll|lla|llast|lli|llist|lmak|lmake|lm|lmap|lmapc|lmapclear|lnew|lnewer|lne|lnext|lN|lNext|lnf|lnfile|lNf|lNfile|ln|lnoremap|lo|loadview|loc|lockmarks|lockv|lockvar|lol|lolder|lop|lopen|lpf|lpfile|lp|lprevious|lr|lrewind|ls|lt|ltag|lu|lunmap|lv|lvimgrep|lvimgrepa|lvimgrepadd|lw|lwindow|mak|make|ma|mark|marks|mat|match|menut|menutranslate|mk|mkexrc|mks|mksession|mksp|mkspell|mkvie|mkview|mkv|mkvimrc|mod|mode|m|move|mzf|mzfile|mz|mzscheme|nbkey|new|n|next|N|Next|nmapc|nmapclear|noh|nohlsearch|norea|noreabbrev|nu|number|nun|nunmap|omapc|omapclear|on|only|o|open|opt|options|ou|ounmap|pc|pclose|ped|pedit|pe|perl|perld|perldo|po|pop|popu|popu|popup|pp|ppop|pre|preserve|prev|previous|p|print|P|Print|profd|profdel|prof|profile|promptf|promptfind|promptr|promptrepl|ps|psearch|pta|ptag|ptf|ptfirst|ptj|ptjump|ptl|ptlast|ptn|ptnext|ptN|ptNext|ptp|ptprevious|ptr|ptrewind|pts|ptselect|pu|put|pw|pwd|pyf|pyfile|py|python|qa|qall|q|quit|quita|quitall|r|read|rec|recover|redi|redir|red|redo|redr|redraw|redraws|redrawstatus|reg|registers|res|resize|ret|retab|retu|return|rew|rewind|ri|right|rightb|rightbelow|rub|ruby|rubyd|rubydo|rubyf|rubyfile|ru|runtime|rv|rviminfo|sal|sall|san|sandbox|sa|sargument|sav|saveas|sba|sball|sbf|sbfirst|sbl|sblast|sbm|sbmodified|sbn|sbnext|sbN|sbNext|sbp|sbprevious|sbr|sbrewind|sb|sbuffer|scripte|scriptencoding|scrip|scriptnames|se|set|setf|setfiletype|setg|setglobal|setl|setlocal|sf|sfind|sfir|sfirst|sh|shell|sign|sil|silent|sim|simalt|sla|slast|sl|sleep|sm|smagic|sm|smap|smapc|smapclear|sme|smenu|sn|snext|sN|sNext|sni|sniff|sno|snomagic|snor|snoremap|snoreme|snoremenu|sor|sort|so|source|spelld|spelldump|spe|spellgood|spelli|spellinfo|spellr|spellrepall|spellu|spellundo|spellw|spellwrong|sp|split|spr|sprevious|sre|srewind|sta|stag|startg|startgreplace|star|startinsert|startr|startreplace|stj|stjump|st|stop|stopi|stopinsert|sts|stselect|sun|sunhide|sunm|sunmap|sus|suspend|sv|sview|syncbind|t|tab|tabc|tabclose|tabd|tabdo|tabe|tabedit|tabf|tabfind|tabfir|tabfirst|tabl|tablast|tabm|tabmove|tabnew|tabn|tabnext|tabN|tabNext|tabo|tabonly|tabp|tabprevious|tabr|tabrewind|tabs|ta|tag|tags|tc|tcl|tcld|tcldo|tclf|tclfile|te|tearoff|tf|tfirst|th|throw|tj|tjump|tl|tlast|tm|tm|tmenu|tn|tnext|tN|tNext|to|topleft|tp|tprevious|tr|trewind|try|ts|tselect|tu|tu|tunmenu|una|unabbreviate|u|undo|undoj|undojoin|undol|undolist|unh|unhide|unlet|unlo|unlockvar|unm|unmap|up|update|verb|verbose|ve|version|vert|vertical|vie|view|vim|vimgrep|vimgrepa|vimgrepadd|vi|visual|viu|viusage|vmapc|vmapclear|vne|vnew|vs|vsplit|vu|vunmap|wa|wall|wh|while|winc|wincmd|windo|winp|winpos|win|winsize|wn|wnext|wN|wNext|wp|wprevious|wq|wqa|wqall|w|write|ws|wsverb|wv|wviminfo|X|xa|xall|x|xit|xm|xmap|xmapc|xmapclear|xme|xmenu|XMLent|XMLns|xn|xnoremap|xnoreme|xnoremenu|xu|xunmap|y|yank)\b/,
    builtin: /\b(?:autocmd|acd|ai|akm|aleph|allowrevins|altkeymap|ambiwidth|ambw|anti|antialias|arab|arabic|arabicshape|ari|arshape|autochdir|autoindent|autoread|autowrite|autowriteall|aw|awa|background|backspace|backup|backupcopy|backupdir|backupext|backupskip|balloondelay|ballooneval|balloonexpr|bdir|bdlay|beval|bex|bexpr|bg|bh|bin|binary|biosk|bioskey|bk|bkc|bomb|breakat|brk|browsedir|bs|bsdir|bsk|bt|bufhidden|buflisted|buftype|casemap|ccv|cdpath|cedit|cfu|ch|charconvert|ci|cin|cindent|cink|cinkeys|cino|cinoptions|cinw|cinwords|clipboard|cmdheight|cmdwinheight|cmp|cms|columns|com|comments|commentstring|compatible|complete|completefunc|completeopt|consk|conskey|copyindent|cot|cpo|cpoptions|cpt|cscopepathcomp|cscopeprg|cscopequickfix|cscopetag|cscopetagorder|cscopeverbose|cspc|csprg|csqf|cst|csto|csverb|cuc|cul|cursorcolumn|cursorline|cwh|debug|deco|def|define|delcombine|dex|dg|dict|dictionary|diff|diffexpr|diffopt|digraph|dip|dir|directory|dy|ea|ead|eadirection|eb|ed|edcompatible|ef|efm|ei|ek|enc|encoding|endofline|eol|ep|equalalways|equalprg|errorbells|errorfile|errorformat|esckeys|et|eventignore|expandtab|exrc|fcl|fcs|fdc|fde|fdi|fdl|fdls|fdm|fdn|fdo|fdt|fen|fenc|fencs|fex|ff|ffs|fileencoding|fileencodings|fileformat|fileformats|fillchars|fk|fkmap|flp|fml|fmr|foldcolumn|foldenable|foldexpr|foldignore|foldlevel|foldlevelstart|foldmarker|foldmethod|foldminlines|foldnestmax|foldtext|formatexpr|formatlistpat|formatoptions|formatprg|fp|fs|fsync|ft|gcr|gd|gdefault|gfm|gfn|gfs|gfw|ghr|gp|grepformat|grepprg|gtl|gtt|guicursor|guifont|guifontset|guifontwide|guiheadroom|guioptions|guipty|guitablabel|guitabtooltip|helpfile|helpheight|helplang|hf|hh|hi|hidden|highlight|hk|hkmap|hkmapp|hkp|hl|hlg|hls|hlsearch|ic|icon|iconstring|ignorecase|im|imactivatekey|imak|imc|imcmdline|imd|imdisable|imi|iminsert|ims|imsearch|inc|include|includeexpr|incsearch|inde|indentexpr|indentkeys|indk|inex|inf|infercase|insertmode|isf|isfname|isi|isident|isk|iskeyword|isprint|joinspaces|js|key|keymap|keymodel|keywordprg|km|kmp|kp|langmap|langmenu|laststatus|lazyredraw|lbr|lcs|linebreak|lines|linespace|lisp|lispwords|listchars|loadplugins|lpl|lsp|lz|macatsui|magic|makeef|makeprg|matchpairs|matchtime|maxcombine|maxfuncdepth|maxmapdepth|maxmem|maxmempattern|maxmemtot|mco|mef|menuitems|mfd|mh|mis|mkspellmem|ml|mls|mm|mmd|mmp|mmt|modeline|modelines|modifiable|modified|more|mouse|mousef|mousefocus|mousehide|mousem|mousemodel|mouses|mouseshape|mouset|mousetime|mp|mps|msm|mzq|mzquantum|nf|nrformats|numberwidth|nuw|odev|oft|ofu|omnifunc|opendevice|operatorfunc|opfunc|osfiletype|pa|para|paragraphs|paste|pastetoggle|patchexpr|patchmode|path|pdev|penc|pex|pexpr|pfn|ph|pheader|pi|pm|pmbcs|pmbfn|popt|preserveindent|previewheight|previewwindow|printdevice|printencoding|printexpr|printfont|printheader|printmbcharset|printmbfont|printoptions|prompt|pt|pumheight|pvh|pvw|qe|quoteescape|readonly|remap|report|restorescreen|revins|rightleft|rightleftcmd|rl|rlc|ro|rs|rtp|ruf|ruler|rulerformat|runtimepath|sbo|sc|scb|scr|scroll|scrollbind|scrolljump|scrolloff|scrollopt|scs|sect|sections|secure|sel|selection|selectmode|sessionoptions|sft|shcf|shellcmdflag|shellpipe|shellquote|shellredir|shellslash|shelltemp|shelltype|shellxquote|shiftround|shiftwidth|shm|shortmess|shortname|showbreak|showcmd|showfulltag|showmatch|showmode|showtabline|shq|si|sidescroll|sidescrolloff|siso|sj|slm|smartcase|smartindent|smarttab|smc|smd|softtabstop|sol|spc|spell|spellcapcheck|spellfile|spelllang|spellsuggest|spf|spl|splitbelow|splitright|sps|sr|srr|ss|ssl|ssop|stal|startofline|statusline|stl|stmp|su|sua|suffixes|suffixesadd|sw|swapfile|swapsync|swb|swf|switchbuf|sws|sxq|syn|synmaxcol|syntax|tabline|tabpagemax|tabstop|tagbsearch|taglength|tagrelative|tagstack|tal|tb|tbi|tbidi|tbis|tbs|tenc|term|termbidi|termencoding|terse|textauto|textmode|textwidth|tgst|thesaurus|tildeop|timeout|timeoutlen|title|titlelen|titleold|titlestring|toolbar|toolbariconsize|top|tpm|tsl|tsr|ttimeout|ttimeoutlen|ttm|tty|ttybuiltin|ttyfast|ttym|ttymouse|ttyscroll|ttytype|tw|tx|uc|ul|undolevels|updatecount|updatetime|ut|vb|vbs|vdir|verbosefile|vfile|viewdir|viewoptions|viminfo|virtualedit|visualbell|vop|wak|warn|wb|wc|wcm|wd|weirdinvert|wfh|wfw|whichwrap|wi|wig|wildchar|wildcharm|wildignore|wildmenu|wildmode|wildoptions|wim|winaltkeys|window|winfixheight|winfixwidth|winheight|winminheight|winminwidth|winwidth|wiv|wiw|wm|wmh|wmnu|wmw|wop|wrap|wrapmargin|wrapscan|writeany|writebackup|writedelay|ww|noacd|noai|noakm|noallowrevins|noaltkeymap|noanti|noantialias|noar|noarab|noarabic|noarabicshape|noari|noarshape|noautochdir|noautoindent|noautoread|noautowrite|noautowriteall|noaw|noawa|nobackup|noballooneval|nobeval|nobin|nobinary|nobiosk|nobioskey|nobk|nobl|nobomb|nobuflisted|nocf|noci|nocin|nocindent|nocompatible|noconfirm|noconsk|noconskey|nocopyindent|nocp|nocscopetag|nocscopeverbose|nocst|nocsverb|nocuc|nocul|nocursorcolumn|nocursorline|nodeco|nodelcombine|nodg|nodiff|nodigraph|nodisable|noea|noeb|noed|noedcompatible|noek|noendofline|noeol|noequalalways|noerrorbells|noesckeys|noet|noex|noexpandtab|noexrc|nofen|nofk|nofkmap|nofoldenable|nogd|nogdefault|noguipty|nohid|nohidden|nohk|nohkmap|nohkmapp|nohkp|nohls|noic|noicon|noignorecase|noim|noimc|noimcmdline|noimd|noincsearch|noinf|noinfercase|noinsertmode|nois|nojoinspaces|nojs|nolazyredraw|nolbr|nolinebreak|nolisp|nolist|noloadplugins|nolpl|nolz|noma|nomacatsui|nomagic|nomh|noml|nomod|nomodeline|nomodifiable|nomodified|nomore|nomousef|nomousefocus|nomousehide|nonu|nonumber|noodev|noopendevice|nopaste|nopi|nopreserveindent|nopreviewwindow|noprompt|nopvw|noreadonly|noremap|norestorescreen|norevins|nori|norightleft|norightleftcmd|norl|norlc|noro|nors|noru|noruler|nosb|nosc|noscb|noscrollbind|noscs|nosecure|nosft|noshellslash|noshelltemp|noshiftround|noshortname|noshowcmd|noshowfulltag|noshowmatch|noshowmode|nosi|nosm|nosmartcase|nosmartindent|nosmarttab|nosmd|nosn|nosol|nospell|nosplitbelow|nosplitright|nospr|nosr|nossl|nosta|nostartofline|nostmp|noswapfile|noswf|nota|notagbsearch|notagrelative|notagstack|notbi|notbidi|notbs|notermbidi|noterse|notextauto|notextmode|notf|notgst|notildeop|notimeout|notitle|noto|notop|notr|nottimeout|nottybuiltin|nottyfast|notx|novb|novisualbell|nowa|nowarn|nowb|noweirdinvert|nowfh|nowfw|nowildmenu|nowinfixheight|nowinfixwidth|nowiv|nowmnu|nowrap|nowrapscan|nowrite|nowriteany|nowritebackup|nows|invacd|invai|invakm|invallowrevins|invaltkeymap|invanti|invantialias|invar|invarab|invarabic|invarabicshape|invari|invarshape|invautochdir|invautoindent|invautoread|invautowrite|invautowriteall|invaw|invawa|invbackup|invballooneval|invbeval|invbin|invbinary|invbiosk|invbioskey|invbk|invbl|invbomb|invbuflisted|invcf|invci|invcin|invcindent|invcompatible|invconfirm|invconsk|invconskey|invcopyindent|invcp|invcscopetag|invcscopeverbose|invcst|invcsverb|invcuc|invcul|invcursorcolumn|invcursorline|invdeco|invdelcombine|invdg|invdiff|invdigraph|invdisable|invea|inveb|inved|invedcompatible|invek|invendofline|inveol|invequalalways|inverrorbells|invesckeys|invet|invex|invexpandtab|invexrc|invfen|invfk|invfkmap|invfoldenable|invgd|invgdefault|invguipty|invhid|invhidden|invhk|invhkmap|invhkmapp|invhkp|invhls|invhlsearch|invic|invicon|invignorecase|invim|invimc|invimcmdline|invimd|invincsearch|invinf|invinfercase|invinsertmode|invis|invjoinspaces|invjs|invlazyredraw|invlbr|invlinebreak|invlisp|invlist|invloadplugins|invlpl|invlz|invma|invmacatsui|invmagic|invmh|invml|invmod|invmodeline|invmodifiable|invmodified|invmore|invmousef|invmousefocus|invmousehide|invnu|invnumber|invodev|invopendevice|invpaste|invpi|invpreserveindent|invpreviewwindow|invprompt|invpvw|invreadonly|invremap|invrestorescreen|invrevins|invri|invrightleft|invrightleftcmd|invrl|invrlc|invro|invrs|invru|invruler|invsb|invsc|invscb|invscrollbind|invscs|invsecure|invsft|invshellslash|invshelltemp|invshiftround|invshortname|invshowcmd|invshowfulltag|invshowmatch|invshowmode|invsi|invsm|invsmartcase|invsmartindent|invsmarttab|invsmd|invsn|invsol|invspell|invsplitbelow|invsplitright|invspr|invsr|invssl|invsta|invstartofline|invstmp|invswapfile|invswf|invta|invtagbsearch|invtagrelative|invtagstack|invtbi|invtbidi|invtbs|invtermbidi|invterse|invtextauto|invtextmode|invtf|invtgst|invtildeop|invtimeout|invtitle|invto|invtop|invtr|invttimeout|invttybuiltin|invttyfast|invtx|invvb|invvisualbell|invwa|invwarn|invwb|invweirdinvert|invwfh|invwfw|invwildmenu|invwinfixheight|invwinfixwidth|invwiv|invwmnu|invwrap|invwrapscan|invwrite|invwriteany|invwritebackup|invws|t_AB|t_AF|t_al|t_AL|t_bc|t_cd|t_ce|t_Ce|t_cl|t_cm|t_Co|t_cs|t_Cs|t_CS|t_CV|t_da|t_db|t_dl|t_DL|t_EI|t_F1|t_F2|t_F3|t_F4|t_F5|t_F6|t_F7|t_F8|t_F9|t_fs|t_IE|t_IS|t_k1|t_K1|t_k2|t_k3|t_K3|t_k4|t_K4|t_k5|t_K5|t_k6|t_K6|t_k7|t_K7|t_k8|t_K8|t_k9|t_K9|t_KA|t_kb|t_kB|t_KB|t_KC|t_kd|t_kD|t_KD|t_ke|t_KE|t_KF|t_KG|t_kh|t_KH|t_kI|t_KI|t_KJ|t_KK|t_kl|t_KL|t_kN|t_kP|t_kr|t_ks|t_ku|t_le|t_mb|t_md|t_me|t_mr|t_ms|t_nd|t_op|t_RI|t_RV|t_Sb|t_se|t_Sf|t_SI|t_so|t_sr|t_te|t_ti|t_ts|t_ue|t_us|t_ut|t_vb|t_ve|t_vi|t_vs|t_WP|t_WS|t_xs|t_ZH|t_ZR)\b/,
    number: /\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b/i,
    operator: /\|\||&&|[-+.]=?|[=!](?:[=~][#?]?)?|[<>]=?[#?]?|[*\/%?]|\b(?:is(?:not)?)\b/,
    punctuation: /[{}[\](),;:]/
}, !function () {
    function a(a, b) {
        return Array.prototype.slice.call((b || document).querySelectorAll(a))
    }

    function b(a, b) {
        return b = " " + b + " ", (" " + a.className + " ").replace(/[\n\t]/g, " ").indexOf(b) > -1
    }

    function c(a, c, d) {
        for (var f, g = c.replace(/\s+/g, "").split(","), h = +a.getAttribute("data-line-offset") || 0, i = e() ? parseInt : parseFloat, j = i(getComputedStyle(a).lineHeight), k = 0; f = g[k++];) {
            f = f.split("-");
            var l = +f[0], m = +f[1] || l, n = document.createElement("div");
            n.textContent = Array(m - l + 2).join(" \n"), n.className = (d || "") + " line-highlight", b(a, "line-numbers") || (n.setAttribute("data-start", l), m > l && n.setAttribute("data-end", m)), n.style.top = (l - h - 1) * j + "px", b(a, "line-numbers") ? a.appendChild(n) : (a.querySelector("code") || a).appendChild(n)
        }
    }

    function d() {
        var b = location.hash.slice(1);
        a(".temporary.line-highlight").forEach(function (a) {
            a.parentNode.removeChild(a)
        });
        var d = (b.match(/\.([\d,-]+)$/) || [, ""])[1];
        if (d && !document.getElementById(b)) {
            var e = b.slice(0, b.lastIndexOf(".")), f = document.getElementById(e);
            f && (f.hasAttribute("data-line") || f.setAttribute("data-line", ""), c(f, d, "temporary "), document.querySelector(".temporary.line-highlight").scrollIntoView())
        }
    }

    if ("undefined" != typeof self && self.Prism && self.document && document.querySelector) {
        var e = function () {
            var a;
            return function () {
                if ("undefined" == typeof a) {
                    var b = document.createElement("div");
                    b.style.fontSize = "13px", b.style.lineHeight = "1.5", b.style.padding = 0, b.style.border = 0, b.innerHTML = "&nbsp;<br />&nbsp;", document.body.appendChild(b), a = 38 === b.offsetHeight, document.body.removeChild(b)
                }
                return a
            }
        }(), f = 0;
        Prism.hooks.add("complete", function (b) {
            var e = b.element.parentNode, g = e && e.getAttribute("data-line");
            e && g && /pre/i.test(e.nodeName) && (clearTimeout(f), a(".line-highlight", e).forEach(function (a) {
                a.parentNode.removeChild(a)
            }), c(e, g), f = setTimeout(d, 1))
        }), window.addEventListener && window.addEventListener("hashchange", d)
    }
}(), !function () {
    "undefined" != typeof self && self.Prism && self.document && Prism.hooks.add("complete", function (a) {
        if (a.code) {
            var b = a.element.parentNode, c = /\s*\bline-numbers\b\s*/;
            if (b && /pre/i.test(b.nodeName) && (c.test(b.className) || c.test(a.element.className)) && !a.element.querySelector(".line-numbers-rows")) {
                c.test(a.element.className) && (a.element.className = a.element.className.replace(c, "")), c.test(b.className) || (b.className += " line-numbers");
                var d, e = a.code.match(/\n(?!$)/g), f = e ? e.length + 1 : 1, g = new Array(f + 1);
                g = g.join("<span></span>"), d = document.createElement("span"), d.className = "line-numbers-rows", d.innerHTML = g, b.hasAttribute("data-start") && (b.style.counterReset = "linenumber " + (parseInt(b.getAttribute("data-start"), 10) - 1)), a.element.appendChild(d)
            }
        }
    })
}(), !function (a) {
    if ("object" == typeof exports && "undefined" != typeof module)module.exports = a(); else if ("function" == typeof define && define.amd)define([], a); else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, b.Clipboard = a()
    }
}(function () {
    return function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i)return i(g, !0);
                    if (f)return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j
                }
                var k = c[g] = {exports: {}};
                b[g][0].call(k.exports, function (a) {
                    var c = b[g][1][a];
                    return e(c ? c : a)
                }, k, k.exports, a, b, c, d)
            }
            return c[g].exports
        }

        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++)e(d[g]);
        return e
    }({
        1: [function (a, b, c) {
            var d = a("matches-selector");
            b.exports = function (a, b, c) {
                for (var e = c ? a : a.parentNode; e && e !== document;) {
                    if (d(e, b))return e;
                    e = e.parentNode
                }
            }
        }, {"matches-selector": 2}], 2: [function (a, b, c) {
            function d(a, b) {
                if (f)return f.call(a, b);
                for (var c = a.parentNode.querySelectorAll(b), d = 0; d < c.length; ++d)if (c[d] == a)return !0;
                return !1
            }

            var e = Element.prototype, f = e.matchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector || e.oMatchesSelector;
            b.exports = d
        }, {}], 3: [function (a, b, c) {
            function d(a, b, c, d) {
                var f = e.apply(this, arguments);
                return a.addEventListener(c, f), {
                    destroy: function () {
                        a.removeEventListener(c, f)
                    }
                }
            }

            function e(a, b, c, d) {
                return function (c) {
                    c.delegateTarget = f(c.target, b, !0), c.delegateTarget && d.call(a, c)
                }
            }

            var f = a("closest");
            b.exports = d
        }, {closest: 1}], 4: [function (a, b, c) {
            c.node = function (a) {
                return void 0 !== a && a instanceof HTMLElement && 1 === a.nodeType
            }, c.nodeList = function (a) {
                var b = Object.prototype.toString.call(a);
                return void 0 !== a && ("[object NodeList]" === b || "[object HTMLCollection]" === b) && "length" in a && (0 === a.length || c.node(a[0]))
            }, c.string = function (a) {
                return "string" == typeof a || a instanceof String
            }, c["function"] = function (a) {
                var b = Object.prototype.toString.call(a);
                return "[object Function]" === b
            }
        }, {}], 5: [function (a, b, c) {
            function d(a, b, c) {
                if (!a && !b && !c)throw new Error("Missing required arguments");
                if (!h.string(b))throw new TypeError("Second argument must be a String");
                if (!h["function"](c))throw new TypeError("Third argument must be a Function");
                if (h.node(a))return e(a, b, c);
                if (h.nodeList(a))return f(a, b, c);
                if (h.string(a))return g(a, b, c);
                throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")
            }

            function e(a, b, c) {
                return a.addEventListener(b, c), {
                    destroy: function () {
                        a.removeEventListener(b, c)
                    }
                }
            }

            function f(a, b, c) {
                return Array.prototype.forEach.call(a, function (a) {
                    a.addEventListener(b, c)
                }), {
                    destroy: function () {
                        Array.prototype.forEach.call(a, function (a) {
                            a.removeEventListener(b, c)
                        })
                    }
                }
            }

            function g(a, b, c) {
                return i(document.body, a, b, c)
            }

            var h = a("./is"), i = a("delegate");
            b.exports = d
        }, {"./is": 4, delegate: 3}], 6: [function (a, b, c) {
            function d(a) {
                var b;
                if ("INPUT" === a.nodeName || "TEXTAREA" === a.nodeName)a.focus(), a.setSelectionRange(0, a.value.length), b = a.value; else {
                    a.hasAttribute("contenteditable") && a.focus();
                    var c = window.getSelection(), d = document.createRange();
                    d.selectNodeContents(a), c.removeAllRanges(), c.addRange(d), b = c.toString()
                }
                return b
            }

            b.exports = d
        }, {}], 7: [function (a, b, c) {
            function d() {
            }

            d.prototype = {
                on: function (a, b, c) {
                    var d = this.e || (this.e = {});
                    return (d[a] || (d[a] = [])).push({fn: b, ctx: c}), this
                }, once: function (a, b, c) {
                    function d() {
                        e.off(a, d), b.apply(c, arguments)
                    }

                    var e = this;
                    return d._ = b, this.on(a, d, c)
                }, emit: function (a) {
                    var b = [].slice.call(arguments, 1), c = ((this.e || (this.e = {}))[a] || []).slice(), d = 0, e = c.length;
                    for (d; e > d; d++)c[d].fn.apply(c[d].ctx, b);
                    return this
                }, off: function (a, b) {
                    var c = this.e || (this.e = {}), d = c[a], e = [];
                    if (d && b)for (var f = 0, g = d.length; g > f; f++)d[f].fn !== b && d[f].fn._ !== b && e.push(d[f]);
                    return e.length ? c[a] = e : delete c[a], this
                }
            }, b.exports = d
        }, {}], 8: [function (a, b, c) {
            "use strict";
            function d(a) {
                return a && a.__esModule ? a : {"default": a}
            }

            function e(a, b) {
                if (!(a instanceof b))throw new TypeError("Cannot call a class as a function")
            }

            c.__esModule = !0;
            var f = function () {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }

                return function (b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(), g = a("select"), h = d(g), i = function () {
                function a(b) {
                    e(this, a), this.resolveOptions(b), this.initSelection()
                }

                return a.prototype.resolveOptions = function () {
                    var a = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                    this.action = a.action, this.emitter = a.emitter, this.target = a.target, this.text = a.text, this.trigger = a.trigger, this.selectedText = ""
                }, a.prototype.initSelection = function () {
                    if (this.text && this.target)throw new Error('Multiple attributes declared, use either "target" or "text"');
                    if (this.text)this.selectFake(); else {
                        if (!this.target)throw new Error('Missing required attributes, use either "target" or "text"');
                        this.selectTarget()
                    }
                }, a.prototype.selectFake = function () {
                    var a = this;
                    this.removeFake(), this.fakeHandler = document.body.addEventListener("click", function () {
                        return a.removeFake()
                    }), this.fakeElem = document.createElement("textarea"), this.fakeElem.style.position = "absolute", this.fakeElem.style.left = "-9999px", this.fakeElem.style.top = (window.pageYOffset || document.documentElement.scrollTop) + "px", this.fakeElem.setAttribute("readonly", ""), this.fakeElem.value = this.text, document.body.appendChild(this.fakeElem), this.selectedText = h["default"](this.fakeElem), this.copyText()
                }, a.prototype.removeFake = function () {
                    this.fakeHandler && (document.body.removeEventListener("click"), this.fakeHandler = null), this.fakeElem && (document.body.removeChild(this.fakeElem), this.fakeElem = null)
                }, a.prototype.selectTarget = function () {
                    this.selectedText = h["default"](this.target), this.copyText()
                }, a.prototype.copyText = function () {
                    var a = void 0;
                    try {
                        a = document.execCommand(this.action)
                    } catch (b) {
                        a = !1
                    }
                    this.handleResult(a)
                }, a.prototype.handleResult = function (a) {
                    a ? this.emitter.emit("success", {
                        action: this.action,
                        text: this.selectedText,
                        trigger: this.trigger,
                        clearSelection: this.clearSelection.bind(this)
                    }) : this.emitter.emit("error", {
                        action: this.action,
                        trigger: this.trigger,
                        clearSelection: this.clearSelection.bind(this)
                    })
                }, a.prototype.clearSelection = function () {
                    this.target && this.target.blur(), window.getSelection().removeAllRanges()
                }, a.prototype.destroy = function () {
                    this.removeFake()
                }, f(a, [{
                    key: "action", set: function () {
                        var a = arguments.length <= 0 || void 0 === arguments[0] ? "copy" : arguments[0];
                        if (this._action = a, "copy" !== this._action && "cut" !== this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')
                    }, get: function () {
                        return this._action
                    }
                }, {
                    key: "target", set: function (a) {
                        if (void 0 !== a) {
                            if (!a || "object" != typeof a || 1 !== a.nodeType)throw new Error('Invalid "target" value, use a valid Element');
                            this._target = a
                        }
                    }, get: function () {
                        return this._target
                    }
                }]), a
            }();
            c["default"] = i, b.exports = c["default"]
        }, {select: 6}], 9: [function (a, b, c) {
            "use strict";
            function d(a) {
                return a && a.__esModule ? a : {"default": a}
            }

            function e(a, b) {
                if (!(a instanceof b))throw new TypeError("Cannot call a class as a function")
            }

            function f(a, b) {
                if ("function" != typeof b && null !== b)throw new TypeError("Super expression must either be null or a function, not " + typeof b);
                a.prototype = Object.create(b && b.prototype, {
                    constructor: {
                        value: a,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
            }

            function g(a, b) {
                var c = "data-clipboard-" + a;
                if (b.hasAttribute(c))return b.getAttribute(c)
            }

            c.__esModule = !0;
            var h = a("./clipboard-action"), i = d(h), j = a("tiny-emitter"), k = d(j), l = a("good-listener"), m = d(l), n = function (a) {
                function b(c, d) {
                    e(this, b), a.call(this), this.resolveOptions(d), this.listenClick(c)
                }

                return f(b, a), b.prototype.resolveOptions = function () {
                    var a = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                    this.action = "function" == typeof a.action ? a.action : this.defaultAction, this.target = "function" == typeof a.target ? a.target : this.defaultTarget, this.text = "function" == typeof a.text ? a.text : this.defaultText
                }, b.prototype.listenClick = function (a) {
                    var b = this;
                    this.listener = m["default"](a, "click", function (a) {
                        return b.onClick(a)
                    })
                }, b.prototype.onClick = function (a) {
                    var b = a.delegateTarget || a.currentTarget;
                    this.clipboardAction && (this.clipboardAction = null), this.clipboardAction = new i["default"]({
                        action: this.action(b),
                        target: this.target(b),
                        text: this.text(b),
                        trigger: b,
                        emitter: this
                    })
                }, b.prototype.defaultAction = function (a) {
                    return g("action", a)
                }, b.prototype.defaultTarget = function (a) {
                    var b = g("target", a);
                    return b ? document.querySelector(b) : void 0
                }, b.prototype.defaultText = function (a) {
                    return g("text", a)
                }, b.prototype.destroy = function () {
                    this.listener.destroy(), this.clipboardAction && (this.clipboardAction.destroy(), this.clipboardAction = null)
                }, b
            }(k["default"]);
            c["default"] = n, b.exports = c["default"]
        }, {"./clipboard-action": 8, "good-listener": 5, "tiny-emitter": 7}]
    }, {}, [9])(9)
}), !function (a) {
    "use strict";
    a.fn.fitVids = function (b) {
        var c = {customSelector: null, ignore: null};
        if (!document.getElementById("fit-vids-style")) {
            var d = document.head || document.getElementsByTagName("head")[0], e = ".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}", f = document.createElement("div");
            f.innerHTML = '<p>x</p><style id="fit-vids-style">' + e + "</style>", d.appendChild(f.childNodes[1])
        }
        return b && a.extend(c, b), this.each(function () {
            var b = ['iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', "object", "embed"];
            c.customSelector && b.push(c.customSelector);
            var d = ".fitvidsignore";
            c.ignore && (d = d + ", " + c.ignore);
            var e = a(this).find(b.join(","));
            e = e.not("object object"), e = e.not(d), e.each(function () {
                var b = a(this);
                if (!(b.parents(d).length > 0 || "embed" === this.tagName.toLowerCase() && b.parent("object").length || b.parent(".fluid-width-video-wrapper").length)) {
                    b.css("height") || b.css("width") || !isNaN(b.attr("height")) && !isNaN(b.attr("width")) || (b.attr("height", 9), b.attr("width", 16));
                    var c = "object" === this.tagName.toLowerCase() || b.attr("height") && !isNaN(parseInt(b.attr("height"), 10)) ? parseInt(b.attr("height"), 10) : b.height(), e = isNaN(parseInt(b.attr("width"), 10)) ? b.width() : parseInt(b.attr("width"), 10), f = c / e;
                    if (!b.attr("id")) {
                        var g = "fitvid" + Math.floor(999999 * Math.random());
                        b.attr("id", g)
                    }
                    b.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * f + "%"), b.removeAttr("height").removeAttr("width")
                }
            })
        })
    }
}(window.jQuery || window.Zepto), !function (a, b) {
    "function" == typeof define && define.amd ? define(["jquery"], function (c) {
        return b(a, c)
    }) : "object" == typeof module && "object" == typeof module.exports ? module.exports = b(a, require("jquery")) : a.lity = b(a, a.jQuery || a.Zepto)
}("undefined" != typeof window ? window : this, function (a, b) {
    "use strict";
    function c() {
        p[q > 0 ? "addClass" : "removeClass"]("lity-active")
    }

    function d(a) {
        var c = b.Deferred();
        return x ? (a.one(x, c.resolve), setTimeout(c.resolve, 500)) : c.resolve(), c.promise()
    }

    function e(a, c, d) {
        if (1 === arguments.length)return b.extend({}, a);
        if ("string" == typeof c) {
            if ("undefined" == typeof d)return "undefined" == typeof a[c] ? null : a[c];
            a[c] = d
        } else b.extend(a, c);
        return this
    }

    function f() {
        return "file:" === a.location.protocol ? "http:" : ""
    }

    function g(a) {
        for (var b, c = decodeURI(a).split("&"), d = {}, e = 0, f = c.length; f > e; e++)c[e] && (b = c[e].split("="), d[b[0]] = b[1]);
        return d
    }

    function h(a, c) {
        return a + (a.indexOf("?") > -1 ? "&" : "?") + b.param(c)
    }

    function i(a) {
        return b('<span class="lity-error"/>').append(a)
    }

    function j(a) {
        if (!r.test(a))return !1;
        var c = b('<img src="' + a + '">'), d = b.Deferred(), e = function () {
            d.reject(i("Failed loading image"))
        };
        return c.on("load", function () {
            return 0 === this.naturalWidth ? e() : void d.resolve(c)
        }).on("error", e), d.promise()
    }

    function k(a) {
        var c;
        try {
            c = b(a)
        } catch (d) {
            return !1
        }
        if (!c.length)return !1;
        var e = b('<span style="display:none !important" class="lity-inline-placeholder"/>');
        return c.after(e).on("lity:ready", function (a, b) {
            b.one("lity:remove", function () {
                e.before(c.addClass("lity-hide")).remove()
            })
        })
    }

    function l(a) {
        var c, d = a;
        return c = s.exec(a), c && (d = h(f() + "//www.youtube" + (c[2] || "") + ".com/embed/" + c[4], b.extend({autoplay: 1}, g(c[5] || "")))), c = t.exec(a), c && (d = h(f() + "//player.vimeo.com/video/" + c[3], b.extend({autoplay: 1}, g(c[4] || "")))), c = u.exec(a), c && (d = h(f() + "//www.google." + c[3] + "/maps?" + c[6], {output: c[6].indexOf("layer=c") > 0 ? "svembed" : "embed"})), '<div class="lity-iframe-container"><iframe frameborder="0" allowfullscreen src="' + d + '"></iframe></div>'
    }

    function m(a) {
        function f(a) {
            27 === a.keyCode && k()
        }

        function g() {
            var a = n.documentElement.clientHeight ? n.documentElement.clientHeight : Math.round(o.height());
            p.css("max-height", Math.floor(a) + "px").trigger("lity:resize", [m, l])
        }

        function h(a) {
            m && (p = b(a), o.on("resize", g), g(), m.find(".lity-loader").each(function () {
                var a = b(this);
                d(a).always(function () {
                    a.remove()
                })
            }), m.removeClass("lity-loading").find(".lity-content").empty().append(p), p.removeClass("lity-hide").trigger("lity:ready", [m, l]), t.resolve())
        }

        function i(a, d, e) {
            q++, c(), m = b(e.template).addClass("lity-loading").appendTo("body"), e.esc && o.one("keyup", f), setTimeout(function () {
                m.addClass("lity-opened lity-" + a).on("click", "[data-lity-close]", function (a) {
                    b(a.target).is("[data-lity-close]") && k()
                }).trigger("lity:open", [m, l]), b.when(d).always(h)
            }, 0)
        }

        function j(a, c) {
            var d, e, f = b.extend({}, v, s);
            if (c.handler && f[c.handler])e = f[c.handler](a, l), d = c.handler; else {
                var g = {};
                b.each(["inline", "iframe"], function (a, b) {
                    f[b] && (g[b] = f[b]), delete f[b]
                });
                var h = function (b, c) {
                    return !c || (e = c(a, l), e ? (d = b, !1) : void 0)
                };
                b.each(f, h), d || b.each(g, h)
            }
            return e && (t = b.Deferred(), b.when(k()).done(b.proxy(i, null, d, e, c))), !!e
        }

        function k() {
            if (m) {
                var a = b.Deferred();
                return t.done(function () {
                    q--, c(), o.off("resize", g).off("keyup", f), p.trigger("lity:close", [m, l]), m.removeClass("lity-opened").addClass("lity-closed");
                    var b = m, e = p;
                    m = null, p = null, d(e.add(b)).always(function () {
                        e.trigger("lity:remove", [b, l]), b.remove(), a.resolve()
                    })
                }), a.promise()
            }
        }

        function l(a) {
            if (!a.preventDefault)return l.open(a);
            var c = b(this), d = c.data("lity-target") || c.attr("href") || c.attr("src");
            if (d) {
                var e = b.extend({}, w, r, c.data("lity-options") || c.data("lity"));
                j(d, e) && a.preventDefault()
            }
        }

        var m, p, r = {}, s = {}, t = b.Deferred().resolve();
        return l.handlers = b.proxy(e, l, s), l.options = b.proxy(e, l, r), l.open = function (a) {
            return j(a, b.extend({}, w, r)), l
        }, l.close = function () {
            return k(), l
        }, l.options(a)
    }

    var n = a.document, o = b(a), p = b("html"), q = 0, r = /\.(png|jpe?g|gif|svg|webp|bmp|ico|tiff?)(\?\S*)?$/i, s = /(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i, t = /(vimeo(pro)?.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/, u = /((maps|www)\.)?google\.([^\/\?]+)\/?((maps\/?)?\?)(.*)/i, v = {
        image: j,
        inline: k,
        iframe: l
    }, w = {
        esc: !0,
        handler: null,
        template: '<div class="lity" tabindex="-1"><div class="lity-wrap" data-lity-close><div class="lity-loader">Loading...</div><div class="lity-container"><div class="lity-content"></div><button class="lity-close" type="button" title="Close (Esc)" data-lity-close>脳</button></div></div></div>'
    }, x = function () {
        var a = n.createElement("div"), b = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var c in b)if (void 0 !== a.style[c])return b[c];
        return !1
    }();
    return m.version = "1.5.1", m.handlers = b.proxy(e, m, v), m.options = b.proxy(e, m, w), b(n).on("click", "[data-lity]", m()), m
}), function (a) {
    var b = -1, c = -1, d = function (a) {
        return parseFloat(a) || 0
    }, e = function (b) {
        var c = null, e = [];
        return a(b).each(function () {
            var b = a(this), f = b.offset().top - d(b.css("margin-top")), g = 0 < e.length ? e[e.length - 1] : null;
            null === g ? e.push(b) : 1 >= Math.floor(Math.abs(c - f)) ? e[e.length - 1] = g.add(b) : e.push(b), c = f
        }), e
    }, f = function (b) {
        var c = {byRow: !0, property: "height", target: null, remove: !1};
        return "object" == typeof b ? a.extend(c, b) : ("boolean" == typeof b ? c.byRow = b : "remove" === b && (c.remove = !0), c)
    }, g = a.fn.matchHeight = function (b) {
        if (b = f(b), b.remove) {
            var c = this;
            return this.css(b.property, ""), a.each(g._groups, function (a, b) {
                b.elements = b.elements.not(c)
            }), this
        }
        return 1 >= this.length && !b.target ? this : (g._groups.push({
            elements: this,
            options: b
        }), g._apply(this, b), this)
    };
    g._groups = [], g._throttle = 80, g._maintainScroll = !1, g._beforeUpdate = null, g._afterUpdate = null, g._apply = function (b, c) {
        var h = f(c), i = a(b), j = [i], k = a(window).scrollTop(), l = a("html").outerHeight(!0), m = i.parents().filter(":hidden");
        return m.each(function () {
            var b = a(this);
            b.data("style-cache", b.attr("style"))
        }), m.css("display", "block"), h.byRow && !h.target && (i.each(function () {
            var b = a(this), c = b.css("display");
            "inline-block" !== c && "inline-flex" !== c && (c = "block"), b.data("style-cache", b.attr("style")), b.css({
                display: c,
                "padding-top": "0",
                "padding-bottom": "0",
                "margin-top": "0",
                "margin-bottom": "0",
                "border-top-width": "0",
                "border-bottom-width": "0",
                height: "100px"
            })
        }), j = e(i), i.each(function () {
            var b = a(this);
            b.attr("style", b.data("style-cache") || "")
        })), a.each(j, function (b, c) {
            var e = a(c), f = 0;
            if (h.target)f = h.target.outerHeight(!1); else {
                if (h.byRow && 1 >= e.length)return void e.css(h.property, "");
                e.each(function () {
                    var b = a(this), c = b.css("display");
                    "inline-block" !== c && "inline-flex" !== c && (c = "block"), c = {display: c}, c[h.property] = "", b.css(c), b.outerHeight(!1) > f && (f = b.outerHeight(!1)), b.css("display", "")
                })
            }
            e.each(function () {
                var b = a(this), c = 0;
                h.target && b.is(h.target) || ("border-box" !== b.css("box-sizing") && (c += d(b.css("border-top-width")) + d(b.css("border-bottom-width")), c += d(b.css("padding-top")) + d(b.css("padding-bottom"))), b.css(h.property, f - c + "px"))
            })
        }), m.each(function () {
            var b = a(this);
            b.attr("style", b.data("style-cache") || null)
        }), g._maintainScroll && a(window).scrollTop(k / l * a("html").outerHeight(!0)), this
    }, g._applyDataApi = function () {
        var b = {};
        a("[data-match-height], [data-mh]").each(function () {
            var c = a(this), d = c.attr("data-mh") || c.attr("data-match-height");
            b[d] = d in b ? b[d].add(c) : c
        }), a.each(b, function () {
            this.matchHeight(!0)
        })
    };
    var h = function (b) {
        g._beforeUpdate && g._beforeUpdate(b, g._groups), a.each(g._groups, function () {
            g._apply(this.elements, this.options)
        }), g._afterUpdate && g._afterUpdate(b, g._groups)
    };
    g._update = function (d, e) {
        if (e && "resize" === e.type) {
            var f = a(window).width();
            if (f === b)return;
            b = f
        }
        d ? -1 === c && (c = setTimeout(function () {
            h(e), c = -1
        }, g._throttle)) : h(e)
    }, a(g._applyDataApi), a(window).bind("load", function (a) {
        g._update(!1, a)
    }), a(window).bind("resize orientationchange", function (a) {
        g._update(!0, a)
    })
}(jQuery), jQuery.extend({
    highlight: function (a, b, c, d) {
        if (3 === a.nodeType) {
            var e = a.data.match(b);
            if (e) {
                var f = document.createElement(c || "span");
                f.className = d || "highlight";
                var g = a.splitText(e.index);
                g.splitText(e[0].length);
                var h = g.cloneNode(!0);
                return f.appendChild(h), g.parentNode.replaceChild(f, g), 1
            }
        } else if (1 === a.nodeType && a.childNodes && !/(script|style)/i.test(a.tagName) && (a.tagName !== c.toUpperCase() || a.className !== d))for (var i = 0; i < a.childNodes.length; i++)i += jQuery.highlight(a.childNodes[i], b, c, d);
        return 0
    }
}), jQuery.fn.unhighlight = function (a) {
    var b = {className: "highlight", element: "span"};
    return jQuery.extend(b, a), this.find(b.element + "." + b.className).each(function () {
        var a = this.parentNode;
        a.replaceChild(this.firstChild, this), a.normalize()
    }).end()
}, jQuery.fn.highlight = function (a, b) {
    var c = {className: "highlight", element: "span", caseSensitive: !1, wordsOnly: !1};
    if (jQuery.extend(c, b), a.constructor === String && (a = [a]), a = jQuery.grep(a, function (a, b) {
            return "" != a
        }), a = jQuery.map(a, function (a, b) {
            return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
        }), 0 == a.length)return this;
    var d = c.caseSensitive ? "" : "i", e = "(" + a.join("|") + ")";
    c.wordsOnly && (e = "\\b" + e + "\\b");
    var f = new RegExp(e, d);
    return this.each(function () {
        jQuery.highlight(this, f, c.element, c.className)
    })
}, !function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
}(function (a) {
    function b(b) {
        var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
        if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) {
            if (1 === g.deltaMode) {
                var q = a.data(this, "mousewheel-line-height");
                j *= q, m *= q, l *= q
            } else if (2 === g.deltaMode) {
                var r = a.data(this, "mousewheel-page-height");
                j *= r, m *= r, l *= r
            }
            if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
                var s = this.getBoundingClientRect();
                o = b.clientX - s.left, p = b.clientY - s.top
            }
            return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h)
        }
    }

    function c() {
        f = null
    }

    function d(a, b) {
        return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
    }

    var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice;
    if (a.event.fixHooks)for (var j = g.length; j;)a.event.fixHooks[g[--j]] = a.event.mouseHooks;
    var k = a.event.special.mousewheel = {
        version: "3.1.12", setup: function () {
            if (this.addEventListener)for (var c = h.length; c;)this.addEventListener(h[--c], b, !1); else this.onmousewheel = b;
            a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this))
        }, teardown: function () {
            if (this.removeEventListener)for (var c = h.length; c;)this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null;
            a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height")
        }, getLineHeight: function (b) {
            var c = a(b), d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
            return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
        }, getPageHeight: function (b) {
            return a(b).height()
        }, settings: {adjustOldDeltas: !0, normalizeOffset: !0}
    };
    a.fn.extend({
        mousewheel: function (a) {
            return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
        }, unmousewheel: function (a) {
            return this.unbind("mousewheel", a)
        }
    })
}), function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
}(function (a) {
    function b(a, b) {
        return a.toFixed(b.decimals)
    }

    var c = function (b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, this.dataOptions(), d), this.init()
    };
    c.DEFAULTS = {
        from: 0,
        to: 0,
        speed: 1e3,
        refreshInterval: 100,
        decimals: 0,
        formatter: b,
        onUpdate: null,
        onComplete: null
    }, c.prototype.init = function () {
        this.value = this.options.from, this.loops = Math.ceil(this.options.speed / this.options.refreshInterval), this.loopCount = 0, this.increment = (this.options.to - this.options.from) / this.loops
    }, c.prototype.dataOptions = function () {
        var a = {
            from: this.$element.data("from"),
            to: this.$element.data("to"),
            speed: this.$element.data("speed"),
            refreshInterval: this.$element.data("refresh-interval"),
            decimals: this.$element.data("decimals")
        }, b = Object.keys(a);
        for (var c in b) {
            var d = b[c];
            "undefined" == typeof a[d] && delete a[d]
        }
        return a
    }, c.prototype.update = function () {
        this.value += this.increment, this.loopCount++, this.render(), "function" == typeof this.options.onUpdate && this.options.onUpdate.call(this.$element, this.value), this.loopCount >= this.loops && (clearInterval(this.interval), this.value = this.options.to, "function" == typeof this.options.onComplete && this.options.onComplete.call(this.$element, this.value))
    }, c.prototype.render = function () {
        var a = this.options.formatter.call(this.$element, this.value, this.options);
        this.$element.text(a)
    }, c.prototype.restart = function () {
        this.stop(), this.init(), this.start()
    }, c.prototype.start = function () {
        this.stop(), this.render(), this.interval = setInterval(this.update.bind(this), this.options.refreshInterval)
    }, c.prototype.stop = function () {
        this.interval && clearInterval(this.interval)
    }, c.prototype.toggle = function () {
        this.interval ? this.stop() : this.start()
    }, a.fn.countTo = function (b) {
        return this.each(function () {
            var d = a(this), e = d.data("countTo"), f = !e || "object" == typeof b, g = "object" == typeof b ? b : {}, h = "string" == typeof b ? b : "start";
            f && (e && e.stop(), d.data("countTo", e = new c(this, g))), e[h].call(e)
        })
    }
}), function (a) {
    a(["jquery"], function (a) {
        return function () {
            function b(a, b, c) {
                return o({type: v.error, iconClass: p().iconClasses.error, message: a, optionsOverride: c, title: b})
            }

            function c(b, c) {
                return b || (b = p()), r = a("#" + b.containerId), r.length ? r : (c && (r = l(b)), r)
            }

            function d(a, b, c) {
                return o({type: v.info, iconClass: p().iconClasses.info, message: a, optionsOverride: c, title: b})
            }

            function e(a) {
                s = a
            }

            function f(a, b, c) {
                return o({
                    type: v.success,
                    iconClass: p().iconClasses.success,
                    message: a,
                    optionsOverride: c,
                    title: b
                })
            }

            function g(a, b, c) {
                return o({
                    type: v.warning,
                    iconClass: p().iconClasses.warning,
                    message: a,
                    optionsOverride: c,
                    title: b
                })
            }

            function h(a, b) {
                var d = p();
                r || c(d), k(a, d, b) || j(d)
            }

            function i(b) {
                var d = p();
                return r || c(d), b && 0 === a(":focus", b).length ? void q(b) : void(r.children().length && r.remove())
            }

            function j(b) {
                for (var c = r.children(), d = c.length - 1; d >= 0; d--)k(a(c[d]), b)
            }

            function k(b, c, d) {
                var e = !(!d || !d.force) && d.force;
                return !(!b || !e && 0 !== a(":focus", b).length) && (b[c.hideMethod]({
                        duration: c.hideDuration,
                        easing: c.hideEasing,
                        complete: function () {
                            q(b)
                        }
                    }), !0)
            }

            function l(b) {
                return r = a("<div/>").attr("id", b.containerId).addClass(b.positionClass).attr("aria-live", "polite").attr("role", "alert"), r.appendTo(a(b.target)), r
            }

            function m() {
                return {
                    tapToDismiss: !0,
                    toastClass: "toast",
                    containerId: "toast-container",
                    debug: !1,
                    showMethod: "fadeIn",
                    showDuration: 300,
                    showEasing: "swing",
                    onShown: void 0,
                    hideMethod: "fadeOut",
                    hideDuration: 1e3,
                    hideEasing: "swing",
                    onHidden: void 0,
                    closeMethod: !1,
                    closeDuration: !1,
                    closeEasing: !1,
                    extendedTimeOut: 1e3,
                    iconClasses: {
                        error: "toast-error",
                        info: "toast-info",
                        success: "toast-success",
                        warning: "toast-warning"
                    },
                    iconClass: "toast-info",
                    positionClass: "toast-top-right",
                    timeOut: 5e3,
                    titleClass: "toast-title",
                    messageClass: "toast-message",
                    escapeHtml: !1,
                    target: "body",
                    closeHtml: '<button type="button">&times;</button>',
                    newestOnTop: !0,
                    preventDuplicates: !1,
                    progressBar: !1
                }
            }

            function n(a) {
                s && s(a)
            }

            function o(b) {
                function d(a) {
                    return null == a && (a = ""), new String(a).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                }

                function e() {
                    h(), j(), k(), l(), m(), i()
                }

                function f() {
                    B.hover(w, v), !y.onclick && y.tapToDismiss && B.click(s), y.closeButton && F && F.click(function (a) {
                        a.stopPropagation ? a.stopPropagation() : void 0 !== a.cancelBubble && a.cancelBubble !== !0 && (a.cancelBubble = !0), s(!0)
                    }), y.onclick && B.click(function (a) {
                        y.onclick(a), s()
                    })
                }

                function g() {
                    B.hide(), B[y.showMethod]({
                        duration: y.showDuration,
                        easing: y.showEasing,
                        complete: y.onShown
                    }), y.timeOut > 0 && (A = setTimeout(s, y.timeOut), G.maxHideTime = parseFloat(y.timeOut), G.hideEta = (new Date).getTime() + G.maxHideTime, y.progressBar && (G.intervalId = setInterval(x, 10)))
                }

                function h() {
                    b.iconClass && B.addClass(y.toastClass).addClass(z)
                }

                function i() {
                    y.newestOnTop ? r.prepend(B) : r.append(B)
                }

                function j() {
                    b.title && (C.append(y.escapeHtml ? d(b.title) : b.title).addClass(y.titleClass), B.append(C))
                }

                function k() {
                    b.message && (D.append(y.escapeHtml ? d(b.message) : b.message).addClass(y.messageClass), B.append(D))
                }

                function l() {
                    y.closeButton && (F.addClass("toast-close-button").attr("role", "button"), B.prepend(F))
                }

                function m() {
                    y.progressBar && (E.addClass("toast-progress"), B.prepend(E))
                }

                function o(a, b) {
                    if (a.preventDuplicates) {
                        if (b.message === t)return !0;
                        t = b.message
                    }
                    return !1
                }

                function s(b) {
                    var c = b && y.closeMethod !== !1 ? y.closeMethod : y.hideMethod, d = b && y.closeDuration !== !1 ? y.closeDuration : y.hideDuration, e = b && y.closeEasing !== !1 ? y.closeEasing : y.hideEasing;
                    if (!a(":focus", B).length || b)return clearTimeout(G.intervalId), B[c]({
                        duration: d,
                        easing: e,
                        complete: function () {
                            q(B), y.onHidden && "hidden" !== H.state && y.onHidden(), H.state = "hidden", H.endTime = new Date, n(H)
                        }
                    })
                }

                function v() {
                    (y.timeOut > 0 || y.extendedTimeOut > 0) && (A = setTimeout(s, y.extendedTimeOut), G.maxHideTime = parseFloat(y.extendedTimeOut), G.hideEta = (new Date).getTime() + G.maxHideTime)
                }

                function w() {
                    clearTimeout(A), G.hideEta = 0, B.stop(!0, !0)[y.showMethod]({
                        duration: y.showDuration,
                        easing: y.showEasing
                    })
                }

                function x() {
                    var a = (G.hideEta - (new Date).getTime()) / G.maxHideTime * 100;
                    E.width(a + "%")
                }

                var y = p(), z = b.iconClass || y.iconClass;
                if ("undefined" != typeof b.optionsOverride && (y = a.extend(y, b.optionsOverride), z = b.optionsOverride.iconClass || z), !o(y, b)) {
                    u++, r = c(y, !0);
                    var A = null, B = a("<div/>"), C = a("<div/>"), D = a("<div/>"), E = a("<div/>"), F = a(y.closeHtml), G = {
                        intervalId: null,
                        hideEta: null,
                        maxHideTime: null
                    }, H = {toastId: u, state: "visible", startTime: new Date, options: y, map: b};
                    return e(), g(), f(), n(H), y.debug && console && console.log(H), B
                }
            }

            function p() {
                return a.extend({}, m(), w.options)
            }

            function q(a) {
                r || (r = c()), a.is(":visible") || (a.remove(), a = null, 0 === r.children().length && (r.remove(), t = void 0))
            }

            var r, s, t, u = 0, v = {
                error: "error",
                info: "info",
                success: "success",
                warning: "warning"
            }, w = {
                clear: h,
                remove: i,
                error: b,
                getContainer: c,
                info: d,
                options: {},
                subscribe: e,
                success: f,
                version: "2.1.2",
                warning: g
            };
            return w
        }()
    })
}("function" == typeof define && define.amd ? define : function (a, b) {
    "undefined" != typeof module && module.exports ? module.exports = b(require("jquery")) : window.wownote = b(window.jQuery)
}), function (a, b) {
    "function" == typeof define && define.amd ? define(["jquery"], b) : "object" == typeof exports ? module.exports = b(require("jquery")) : a.Dropify = b(a.jQuery)
}(this, function (a) {
    function b(b, c) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var d = {
                defaultFile: "",
                maxFileSize: 0,
                minWidth: 0,
                maxWidth: 0,
                minHeight: 0,
                maxHeight: 0,
                showRemove: !0,
                showLoader: !0,
                showErrors: !0,
                errorTimeout: 3e3,
                errorsPosition: "overlay",
                imgFileExtensions: ["png", "jpg", "jpeg", "gif", "bmp"],
                maxFileSizePreview: "5M",
                allowedFormats: ["portrait", "square", "landscape"],
                allowedFileExtensions: ["*"],
                messages: {
                    "default": "Drag and drop a file here or click",
                    replace: "Drag and drop or click to replace",
                    remove: "Remove",
                    error: "Ooops, something wrong appended."
                },
                error: {
                    fileSize: "The file size is too big ({{ value }} max).",
                    minWidth: "The image width is too small ({{ value }}}px min).",
                    maxWidth: "The image width is too big ({{ value }}}px max).",
                    minHeight: "The image height is too small ({{ value }}}px min).",
                    maxHeight: "The image height is too big ({{ value }}px max).",
                    imageFormat: "The image format is not allowed ({{ value }} only).",
                    fileExtension: "The file is not allowed ({{ value }} only)."
                },
                tpl: {
                    wrap: '<div class="dropify-wrapper"></div>',
                    loader: '<div class="dropify-loader"></div>',
                    message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                    preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                    filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                    clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                    errorLine: '<p class="dropify-error">{{ error }}</p>',
                    errorsContainer: '<div class="dropify-errors-container"><ul></ul></div>'
                }
            };
            this.element = b, this.input = a(this.element), this.wrapper = null, this.preview = null, this.filenameWrapper = null, this.settings = a.extend(!0, d, c, this.input.data()), this.errorsEvent = a.Event("dropify.errors"), this.isDisabled = !1, this.isInit = !1, this.file = {
                object: null,
                name: null,
                size: null,
                width: null,
                height: null,
                type: null
            }, Array.isArray(this.settings.allowedFormats) || (this.settings.allowedFormats = this.settings.allowedFormats.split(" ")), Array.isArray(this.settings.allowedFileExtensions) || (this.settings.allowedFileExtensions = this.settings.allowedFileExtensions.split(" ")), this.onChange = this.onChange.bind(this), this.clearElement = this.clearElement.bind(this), this.onFileReady = this.onFileReady.bind(this), this.translateMessages(), this.createElements(), this.setContainerSize(), this.errorsEvent.errors = [], this.input.on("change", this.onChange)
        }
    }

    var c = "dropify";
    return b.prototype.onChange = function () {
        this.resetPreview(), this.readFile(this.element)
    }, b.prototype.createElements = function () {
        this.isInit = !0, this.input.wrap(a(this.settings.tpl.wrap)), this.wrapper = this.input.parent();
        var b = a(this.settings.tpl.message).insertBefore(this.input);
        a(this.settings.tpl.errorLine).appendTo(b), this.isTouchDevice() === !0 && this.wrapper.addClass("touch-fallback"), this.input.attr("disabled") && (this.isDisabled = !0, this.wrapper.addClass("disabled")), this.settings.showLoader === !0 && (this.loader = a(this.settings.tpl.loader), this.loader.insertBefore(this.input)), this.preview = a(this.settings.tpl.preview), this.preview.insertAfter(this.input), this.isDisabled === !1 && this.settings.showRemove === !0 && (this.clearButton = a(this.settings.tpl.clearButton), this.clearButton.insertAfter(this.input), this.clearButton.on("click", this.clearElement)), this.filenameWrapper = a(this.settings.tpl.filename), this.filenameWrapper.prependTo(this.preview.find(".dropify-infos-inner")), this.settings.showErrors === !0 && (this.errorsContainer = a(this.settings.tpl.errorsContainer), "outside" === this.settings.errorsPosition ? this.errorsContainer.insertAfter(this.wrapper) : this.errorsContainer.insertBefore(this.input));
        var c = this.settings.defaultFile || "";
        "" !== c.trim() && (this.file.name = this.cleanFilename(c), this.setPreview(this.isImage(), c))
    }, b.prototype.readFile = function (b) {
        if (b.files && b.files[0]) {
            var c = new FileReader, d = new Image, e = b.files[0], f = null, g = this, h = a.Event("dropify.fileReady");
            this.clearErrors(), this.showLoader(), this.setFileInformations(e), this.errorsEvent.errors = [], this.checkFileSize(), this.isFileExtensionAllowed(), this.isImage() && this.file.size < this.sizeToByte(this.settings.maxFileSizePreview) ? (this.input.on("dropify.fileReady", this.onFileReady), c.readAsDataURL(e), c.onload = function (a) {
                f = a.target.result, d.src = a.target.result, d.onload = function () {
                    g.setFileDimensions(this.width, this.height), g.validateImage(), g.input.trigger(h, [!0, f])
                }
            }.bind(this)) : this.onFileReady(!1)
        }
    }, b.prototype.onFileReady = function (a, b, c) {
        if (this.input.off("dropify.fileReady", this.onFileReady), 0 === this.errorsEvent.errors.length)this.setPreview(b, c); else {
            this.input.trigger(this.errorsEvent, [this]);
            for (var d = this.errorsEvent.errors.length - 1; d >= 0; d--) {
                var e = this.errorsEvent.errors[d].namespace, f = e.split(".").pop();
                this.showError(f)
            }
            if ("undefined" != typeof this.errorsContainer) {
                this.errorsContainer.addClass("visible");
                var g = this.errorsContainer;
                setTimeout(function () {
                    g.removeClass("visible")
                }, this.settings.errorTimeout)
            }
            this.wrapper.addClass("has-error"), this.resetPreview(), this.clearElement()
        }
    }, b.prototype.setFileInformations = function (a) {
        this.file.object = a, this.file.name = a.name, this.file.size = a.size, this.file.type = a.type, this.file.width = null, this.file.height = null
    }, b.prototype.setFileDimensions = function (a, b) {
        this.file.width = a, this.file.height = b
    }, b.prototype.setPreview = function (b, c) {
        this.wrapper.removeClass("has-error").addClass("has-preview"), this.filenameWrapper.children(".dropify-filename-inner").html(this.file.name);
        var d = this.preview.children(".dropify-render");
        if (this.hideLoader(), b === !0) {
            var e = a("<img />").attr("src", c);
            this.settings.height && e.css("max-height", this.settings.height), e.appendTo(d)
        } else a("<i />").attr("class", "dropify-font-file").appendTo(d), a('<span class="dropify-extension" />').html(this.getFileType()).appendTo(d);
        this.preview.fadeIn()
    }, b.prototype.resetPreview = function () {
        this.wrapper.removeClass("has-preview");
        var a = this.preview.children(".dropify-render");
        a.find(".dropify-extension").remove(), a.find("i").remove(), a.find("img").remove(), this.preview.hide(), this.hideLoader()
    }, b.prototype.cleanFilename = function (a) {
        var b = a.split("\\").pop();
        return b == a && (b = a.split("/").pop()), "" !== a ? b : ""
    }, b.prototype.clearElement = function () {
        if (0 === this.errorsEvent.errors.length) {
            var b = a.Event("dropify.beforeClear");
            this.input.trigger(b, [this]), b.result !== !1 && (this.resetFile(), this.input.val(""), this.resetPreview(), this.input.trigger(a.Event("dropify.afterClear"), [this]))
        } else this.resetFile(), this.input.val(""), this.resetPreview()
    }, b.prototype.resetFile = function () {
        this.file.object = null, this.file.name = null, this.file.size = null, this.file.type = null, this.file.width = null, this.file.height = null
    }, b.prototype.setContainerSize = function () {
        this.settings.height && this.wrapper.height(this.settings.height)
    }, b.prototype.isTouchDevice = function () {
        return "ontouchstart" in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    }, b.prototype.getFileType = function () {
        return this.file.name.split(".").pop().toLowerCase()
    }, b.prototype.isImage = function () {
        return "-1" != this.settings.imgFileExtensions.indexOf(this.getFileType())
    }, b.prototype.isFileExtensionAllowed = function () {
        return "-1" != this.settings.allowedFileExtensions.indexOf("*") || "-1" != this.settings.allowedFileExtensions.indexOf(this.getFileType()) || (this.pushError("fileExtension"), !1)
    }, b.prototype.translateMessages = function () {
        for (var a in this.settings.tpl)for (var b in this.settings.messages)this.settings.tpl[a] = this.settings.tpl[a].replace("{{ " + b + " }}", this.settings.messages[b])
    }, b.prototype.checkFileSize = function () {
        0 !== this.sizeToByte(this.settings.maxFileSize) && this.file.size > this.sizeToByte(this.settings.maxFileSize) && this.pushError("fileSize")
    }, b.prototype.sizeToByte = function (a) {
        var b = 0;
        if (0 !== a) {
            var c = a.slice(-1).toUpperCase(), d = 1024, e = 1024 * d, f = 1024 * e;
            "K" === c ? b = parseFloat(a) * d : "M" === c ? b = parseFloat(a) * e : "G" === c && (b = parseFloat(a) * f)
        }
        return b
    }, b.prototype.validateImage = function () {
        0 !== this.settings.minWidth && this.settings.minWidth >= this.file.width && this.pushError("minWidth"), 0 !== this.settings.maxWidth && this.settings.maxWidth <= this.file.width && this.pushError("maxWidth"), 0 !== this.settings.minHeight && this.settings.minHeight >= this.file.height && this.pushError("minHeight"), 0 !== this.settings.maxHeight && this.settings.maxHeight <= this.file.height && this.pushError("maxHeight"), "-1" == this.settings.allowedFormats.indexOf(this.getImageFormat()) && this.pushError("imageFormat")
    }, b.prototype.getImageFormat = function () {
        return this.file.width == this.file.height ? "square" : this.file.width < this.file.height ? "portrait" : this.file.width > this.file.height ? "landscape" : void 0
    }, b.prototype.pushError = function (b) {
        var c = a.Event("dropify.error." + b);
        this.errorsEvent.errors.push(c), this.input.trigger(c, [this])
    }, b.prototype.clearErrors = function () {
        "undefined" != typeof this.errorsContainer && this.errorsContainer.children("ul").html("")
    }, b.prototype.showError = function (a) {
        "undefined" != typeof this.errorsContainer && this.errorsContainer.children("ul").append("<li>" + this.getError(a) + "</li>")
    }, b.prototype.getError = function (a) {
        var b = this.settings.error[a], c = "";
        return "fileSize" === a ? c = this.settings.maxFileSize : "minWidth" === a ? c = this.settings.minWidth : "maxWidth" === a ? c = this.settings.maxWidth : "minHeight" === a ? c = this.settings.minHeight : "maxHeight" === a ? c = this.settings.maxHeight : "imageFormat" === a ? c = this.settings.allowedFormats.join(", ") : "fileExtension" === a && (c = this.settings.allowedFileExtensions.join(", ")), "" !== c ? b.replace("{{ value }}", c) : b
    }, b.prototype.showLoader = function () {
        "undefined" != typeof this.loader && this.loader.show()
    }, b.prototype.hideLoader = function () {
        "undefined" != typeof this.loader && this.loader.hide()
    }, b.prototype.destroy = function () {
        this.input.siblings().remove(), this.input.unwrap(), this.isInit = !1
    }, b.prototype.init = function () {
        this.createElements()
    }, b.prototype.isDropified = function () {
        return this.isInit
    }, a.fn[c] = function (d) {
        return this.each(function () {
            a.data(this, c) || a.data(this, c, new b(this, d))
        }), this
    }, b
}), function (a) {
    function b(a, b) {
        for (var c = g[a].top, d = 0, e = c[d], f = 0; f < c.length; f++)b ? c[f] > e && (e = c[f], d = f) : c[f] < e && (e = c[f], d = f);
        return d
    }

    function c(c) {
        var d = f(c), e = g[d].gridWidth, h = g[d].w, i = g[d].gap, j = g[d].scrollbottom;
        g[d].col = 1, g[d].top = [];
        for (var k = e.length - 1; k >= 0; k--)if (h > e[k]) {
            g[d].col = k + 1;
            break
        }
        for (var l = (h - (g[d].col - 1) * i) / g[d].col, m = [], n = 0; n < g[d].col; n++)m.push(n * l + n * i), g[d].top.push(0);
        c.children().css({
            position: "absolute",
            left: h / 2 - l / 2 + "px",
            top: c.scrollTop(),
            transition: "left " + g[d].refresh + "ms ease-in-out,top " + g[d].refresh + "ms ease-in-out,opacity " + g[d].refresh + "ms ease-in-out"
        }).each(function () {
            var c = b(d, !1);
            a(this).css({
                width: l + "px",
                left: m[c] + "px",
                top: g[d].top[c] + "px",
                opacity: "1"
            }), g[d].top[c] += a(this)[0].offsetHeight + i
        }), c.css("height", g[d].top[b(d, !0)] + "px"), j && j.endele && j.endele.addClass("endele").text(j.endtxt).css("top", g[d].top[b(d, !0)] + "px")
    }

    function d(a) {
        var b = f(a);
        g[b].timer || (g[b].timer = setInterval(function () {
            var d = a[0].offsetWidth;
            g[b].w !== d && (g[b].w = d, c(a)), g[b].scrollbottom && g[b].scrollbottom.callback && e(g[b].scrollbottom.ele, g[b].scrollbottom.gap) && g[b].scrollbottom.callback(a)
        }, g[b].refresh)), c(a)
    }

    function e(b, c) {
        var d = a(window).height();
        return d + b.scrollTop() > b.prop("scrollHeight") - c
    }

    function f(a) {
        return a.attr("wf-id") || (h += .1, a.attr("wf-id", h)), a.attr("wf-id")
    }

    var g = {
        _init_: {
            top: !1,
            w: !1,
            col: !1,
            gap: 10,
            gridWidth: [0, 400, 600, 800, 1200],
            refresh: 500,
            timer: !1,
            scrollbottom: !1
        }
    }, h = 0, i = {
        init: function () {
            var b = f(this);
            g[b] || (g[b] = a.extend({}, g._init_)), arguments[0] && (g[b] = a.extend(g[b], arguments[0])), g[b].scrollbottom && (g[b].scrollbottom = a.extend({
                ele: this.parent(),
                endele: a("<div>").css({width: "100%", textAlign: "center", position: "absolute"}),
                endtxt: "No More Data",
                gap: 300
            }, g[b].scrollbottom)), this.css("position", "relative"), d(this)
        }, sort: function () {
            c(this)
        }, stop: function () {
            var a = f(this);
            g[a].timer && (clearInterval(g[a].timer), g[a].timer = !1)
        }, end: function () {
            var a = f(this);
            g[a].scrollbottom && (g[a].scrollbottom.ele.css("top", g[a].top[b(a, !0)] + "px"), this.append(g[a].scrollbottom.endele)), g[a].timer && (clearInterval(g[a].timer), g[a].timer = !1)
        }
    };
    a.fn.waterfall = function () {
        var b;
        return arguments[0] && "object" != typeof arguments[0] ? i[arguments[0]] ? b = i[arguments[0]].apply(this, Array.prototype.slice.call(arguments[0], 1)) : a.error("Method " + arguments[0] + " does not exist on jQuery.waterfall") : b = i.init.apply(this, arguments), b || this
    }
}(jQuery), !function (a) {
    "use strict";
    function b(b, c, d, e) {
        function f(a, b) {
            return a -= e, b -= e, !(0 > a || a >= h || 0 > b || b >= h) && g.isDark(a, b)
        }

        var g = a(d, c);
        g.addData(b), g.make(), e = e || 0;
        var h = g.getModuleCount(), i = g.getModuleCount() + 2 * e, j = function (a, b, c, d) {
            var e = this.isDark, f = 1 / i;
            this.isDark = function (g, h) {
                var i = h * f, j = g * f, k = i + f, l = j + f;
                return e(g, h) && (a > k || i > c || b > l || j > d)
            }
        };
        this.text = b, this.level = c, this.version = d, this.moduleCount = i, this.isDark = f, this.addBlank = j
    }

    function c(a, c, d, e, f) {
        d = Math.max(1, d || 1), e = Math.min(40, e || 40);
        for (var g = d; e >= g; g += 1)try {
            return new b(a, c, g, f)
        } catch (h) {
        }
    }

    function d(a, b, c) {
        var d = c.size, e = "bold " + c.mSize * d + "px " + c.fontname, f = q("<canvas/>")[0].getContext("2d");
        f.font = e;
        var g = f.measureText(c.label).width, h = c.mSize, i = g / d, j = (1 - i) * c.mPosX, k = (1 - h) * c.mPosY, l = j + i, m = k + h, n = .01;
        1 === c.mode ? a.addBlank(0, k - n, d, m + n) : a.addBlank(j - n, k - n, l + n, m + n), b.fillStyle = c.fontcolor, b.font = e, b.fillText(c.label, j * d, k * d + .75 * c.mSize * d)
    }

    function e(a, b, c) {
        var d = c.size, e = c.image.naturalWidth || 1, f = c.image.naturalHeight || 1, g = c.mSize, h = g * e / f, i = (1 - h) * c.mPosX, j = (1 - g) * c.mPosY, k = i + h, l = j + g, m = .01;
        3 === c.mode ? a.addBlank(0, j - m, d, l + m) : a.addBlank(i - m, j - m, k + m, l + m), b.drawImage(c.image, i * d, j * d, h * d, g * d)
    }

    function f(a, b, c) {
        q(c.background).is("img") ? b.drawImage(c.background, 0, 0, c.size, c.size) : c.background && (b.fillStyle = c.background, b.fillRect(c.left, c.top, c.size, c.size));
        var f = c.mode;
        1 === f || 2 === f ? d(a, b, c) : (3 === f || 4 === f) && e(a, b, c)
    }

    function g(a, b, c, d, e, f, g, h) {
        a.isDark(g, h) && b.rect(d, e, f, f)
    }

    function h(a, b, c, d, e, f, g, h, i, j) {
        g ? a.moveTo(b + f, c) : a.moveTo(b, c), h ? (a.lineTo(d - f, c), a.arcTo(d, c, d, e, f)) : a.lineTo(d, c), i ? (a.lineTo(d, e - f), a.arcTo(d, e, b, e, f)) : a.lineTo(d, e), j ? (a.lineTo(b + f, e), a.arcTo(b, e, b, c, f)) : a.lineTo(b, e), g ? (a.lineTo(b, c + f), a.arcTo(b, c, d, c, f)) : a.lineTo(b, c)
    }

    function i(a, b, c, d, e, f, g, h, i, j) {
        g && (a.moveTo(b + f, c), a.lineTo(b, c), a.lineTo(b, c + f), a.arcTo(b, c, b + f, c, f)), h && (a.moveTo(d - f, c), a.lineTo(d, c), a.lineTo(d, c + f), a.arcTo(d, c, d - f, c, f)), i && (a.moveTo(d - f, e), a.lineTo(d, e), a.lineTo(d, e - f), a.arcTo(d, e, d - f, e, f)), j && (a.moveTo(b + f, e), a.lineTo(b, e), a.lineTo(b, e - f), a.arcTo(b, e, b + f, e, f))
    }

    function j(a, b, c, d, e, f, g, j) {
        var k = a.isDark, l = d + f, m = e + f, n = c.radius * f, o = g - 1, p = g + 1, q = j - 1, r = j + 1, s = k(g, j), t = k(o, q), u = k(o, j), v = k(o, r), w = k(g, r), x = k(p, r), y = k(p, j), z = k(p, q), A = k(g, q);
        s ? h(b, d, e, l, m, n, !u && !A, !u && !w, !y && !w, !y && !A) : i(b, d, e, l, m, n, u && A && t, u && w && v, y && w && x, y && A && z)
    }

    function k(a, b, c) {
        var d, e, f = a.moduleCount, h = c.size / f, i = g;
        for (s && c.radius > 0 && c.radius <= .5 && (i = j), b.beginPath(), d = 0; f > d; d += 1)for (e = 0; f > e; e += 1) {
            var k = c.left + e * h, l = c.top + d * h, m = h;
            i(a, b, c, k, l, m, d, e)
        }
        if (q(c.fill).is("img")) {
            b.strokeStyle = "rgba(0,0,0,0.5)", b.lineWidth = 2, b.stroke();
            var n = b.globalCompositeOperation;
            b.globalCompositeOperation = "destination-out", b.fill(), b.globalCompositeOperation = n, b.clip(), b.drawImage(c.fill, 0, 0, c.size, c.size), b.restore()
        } else b.fillStyle = c.fill, b.fill()
    }

    function l(a, b) {
        var d = c(b.text, b.ecLevel, b.minVersion, b.maxVersion, b.quiet);
        if (!d)return null;
        var e = q(a).data("qrcode", d), g = e[0].getContext("2d");
        return f(d, g, b), k(d, g, b), e
    }

    function m(a) {
        var b = q("<canvas/>").attr("width", a.size).attr("height", a.size);
        return l(b, a)
    }

    function n(a) {
        return q("<img/>").attr("src", m(a)[0].toDataURL("image/png"))
    }

    function o(a) {
        var b = c(a.text, a.ecLevel, a.minVersion, a.maxVersion, a.quiet);
        if (!b)return null;
        var d, e, f = a.size, g = a.background, h = Math.floor, i = b.moduleCount, j = h(f / i), k = h(.5 * (f - j * i)), l = {
            position: "relative",
            left: 0,
            top: 0,
            padding: 0,
            margin: 0,
            width: f,
            height: f
        }, m = {
            position: "absolute",
            padding: 0,
            margin: 0,
            width: j,
            height: j,
            "background-color": a.fill
        }, n = q("<div/>").data("qrcode", b).css(l);
        for (g && n.css("background-color", g), d = 0; i > d; d += 1)for (e = 0; i > e; e += 1)b.isDark(d, e) && q("<div/>").css(m).css({
            left: k + e * j,
            top: k + d * j
        }).appendTo(n);
        return n
    }

    function p(a) {
        return r && "canvas" === a.render ? m(a) : r && "image" === a.render ? n(a) : o(a)
    }

    var q = jQuery, r = function () {
        var a = document.createElement("canvas");
        return Boolean(a.getContext && a.getContext("2d"))
    }(), s = "[object Opera]" !== Object.prototype.toString.call(window.opera), t = {
        render: "canvas",
        minVersion: 1,
        maxVersion: 40,
        ecLevel: "L",
        left: 0,
        top: 0,
        size: 200,
        fill: "#000",
        background: null,
        text: "no text",
        radius: 0,
        quiet: 0,
        mode: 0,
        mSize: .1,
        mPosX: .5,
        mPosY: .5,
        label: "no label",
        fontname: "sans",
        fontcolor: "#000",
        image: null
    };
    q.fn.qrcode = function (a) {
        var b = q.extend({}, t, a);
        return this.each(function () {
            "canvas" === this.nodeName.toLowerCase() ? l(this, b) : q(this).append(p(b))
        })
    }
}(function () {
    var a = function () {
        function a(b, c) {
            if ("undefined" == typeof b.length)throw new Error(b.length + "/" + c);
            var d = function () {
                for (var a = 0; a < b.length && 0 == b[a];)a += 1;
                for (var d = new Array(b.length - a + c), e = 0; e < b.length - a; e += 1)d[e] = b[e + a];
                return d
            }(), e = {};
            return e.getAt = function (a) {
                return d[a]
            }, e.getLength = function () {
                return d.length
            }, e.multiply = function (b) {
                for (var c = new Array(e.getLength() + b.getLength() - 1), d = 0; d < e.getLength(); d += 1)for (var f = 0; f < b.getLength(); f += 1)c[d + f] ^= g.gexp(g.glog(e.getAt(d)) + g.glog(b.getAt(f)));
                return a(c, 0)
            }, e.mod = function (b) {
                if (e.getLength() - b.getLength() < 0)return e;
                for (var c = g.glog(e.getAt(0)) - g.glog(b.getAt(0)), d = new Array(e.getLength()), f = 0; f < e.getLength(); f += 1)d[f] = e.getAt(f);
                for (var f = 0; f < b.getLength(); f += 1)d[f] ^= g.gexp(g.glog(b.getAt(f)) + c);
                return a(d, 0).mod(b)
            }, e
        }

        var b = function (b, c) {
            var e = 236, g = 17, k = b, l = d[c], m = null, n = 0, p = null, q = new Array, r = {}, s = function (a, b) {
                n = 4 * k + 17, m = function (a) {
                    for (var b = new Array(a), c = 0; a > c; c += 1) {
                        b[c] = new Array(a);
                        for (var d = 0; a > d; d += 1)b[c][d] = null
                    }
                    return b
                }(n), t(0, 0), t(n - 7, 0), t(0, n - 7), w(), v(), y(a, b), k >= 7 && x(a), null == p && (p = B(k, l, q)), z(p, b)
            }, t = function (a, b) {
                for (var c = -1; 7 >= c; c += 1)if (!(-1 >= a + c || a + c >= n))for (var d = -1; 7 >= d; d += 1)-1 >= b + d || b + d >= n || (c >= 0 && 6 >= c && (0 == d || 6 == d) || d >= 0 && 6 >= d && (0 == c || 6 == c) || c >= 2 && 4 >= c && d >= 2 && 4 >= d ? m[a + c][b + d] = !0 : m[a + c][b + d] = !1)
            }, u = function () {
                for (var a = 0, b = 0, c = 0; 8 > c; c += 1) {
                    s(!0, c);
                    var d = f.getLostPoint(r);
                    (0 == c || a > d) && (a = d, b = c)
                }
                return b
            }, v = function () {
                for (var a = 8; n - 8 > a; a += 1)null == m[a][6] && (m[a][6] = a % 2 == 0);
                for (var b = 8; n - 8 > b; b += 1)null == m[6][b] && (m[6][b] = b % 2 == 0)
            }, w = function () {
                for (var a = f.getPatternPosition(k), b = 0; b < a.length; b += 1)for (var c = 0; c < a.length; c += 1) {
                    var d = a[b], e = a[c];
                    if (null == m[d][e])for (var g = -2; 2 >= g; g += 1)for (var h = -2; 2 >= h; h += 1)-2 == g || 2 == g || -2 == h || 2 == h || 0 == g && 0 == h ? m[d + g][e + h] = !0 : m[d + g][e + h] = !1
                }
            }, x = function (a) {
                for (var b = f.getBCHTypeNumber(k), c = 0; 18 > c; c += 1) {
                    var d = !a && 1 == (b >> c & 1);
                    m[Math.floor(c / 3)][c % 3 + n - 8 - 3] = d
                }
                for (var c = 0; 18 > c; c += 1) {
                    var d = !a && 1 == (b >> c & 1);
                    m[c % 3 + n - 8 - 3][Math.floor(c / 3)] = d
                }
            }, y = function (a, b) {
                for (var c = l << 3 | b, d = f.getBCHTypeInfo(c), e = 0; 15 > e; e += 1) {
                    var g = !a && 1 == (d >> e & 1);
                    6 > e ? m[e][8] = g : 8 > e ? m[e + 1][8] = g : m[n - 15 + e][8] = g
                }
                for (var e = 0; 15 > e; e += 1) {
                    var g = !a && 1 == (d >> e & 1);
                    8 > e ? m[8][n - e - 1] = g : 9 > e ? m[8][15 - e - 1 + 1] = g : m[8][15 - e - 1] = g
                }
                m[n - 8][8] = !a
            }, z = function (a, b) {
                for (var c = -1, d = n - 1, e = 7, g = 0, h = f.getMaskFunction(b), i = n - 1; i > 0; i -= 2)for (6 == i && (i -= 1); ;) {
                    for (var j = 0; 2 > j; j += 1)if (null == m[d][i - j]) {
                        var k = !1;
                        g < a.length && (k = 1 == (a[g] >>> e & 1));
                        var l = h(d, i - j);
                        l && (k = !k), m[d][i - j] = k, e -= 1, -1 == e && (g += 1, e = 7)
                    }
                    if (d += c, 0 > d || d >= n) {
                        d -= c, c = -c;
                        break
                    }
                }
            }, A = function (b, c) {
                for (var d = 0, e = 0, g = 0, h = new Array(c.length), i = new Array(c.length), j = 0; j < c.length; j += 1) {
                    var k = c[j].dataCount, l = c[j].totalCount - k;
                    e = Math.max(e, k), g = Math.max(g, l), h[j] = new Array(k);
                    for (var m = 0; m < h[j].length; m += 1)h[j][m] = 255 & b.getBuffer()[m + d];
                    d += k;
                    var n = f.getErrorCorrectPolynomial(l), o = a(h[j], n.getLength() - 1), p = o.mod(n);
                    i[j] = new Array(n.getLength() - 1);
                    for (var m = 0; m < i[j].length; m += 1) {
                        var q = m + p.getLength() - i[j].length;
                        i[j][m] = q >= 0 ? p.getAt(q) : 0
                    }
                }
                for (var r = 0, m = 0; m < c.length; m += 1)r += c[m].totalCount;
                for (var s = new Array(r), t = 0, m = 0; e > m; m += 1)for (var j = 0; j < c.length; j += 1)m < h[j].length && (s[t] = h[j][m], t += 1);
                for (var m = 0; g > m; m += 1)for (var j = 0; j < c.length; j += 1)m < i[j].length && (s[t] = i[j][m], t += 1);
                return s
            }, B = function (a, b, c) {
                for (var d = h.getRSBlocks(a, b), j = i(), k = 0; k < c.length; k += 1) {
                    var l = c[k];
                    j.put(l.getMode(), 4), j.put(l.getLength(), f.getLengthInBits(l.getMode(), a)), l.write(j)
                }
                for (var m = 0, k = 0; k < d.length; k += 1)m += d[k].dataCount;
                if (j.getLengthInBits() > 8 * m)throw new Error("code length overflow. (" + j.getLengthInBits() + ">" + 8 * m + ")");
                for (j.getLengthInBits() + 4 <= 8 * m && j.put(0, 4); j.getLengthInBits() % 8 != 0;)j.putBit(!1);
                for (; !(j.getLengthInBits() >= 8 * m) && (j.put(e, 8), !(j.getLengthInBits() >= 8 * m));)j.put(g, 8);
                return A(j, d)
            };
            return r.addData = function (a) {
                var b = j(a);
                q.push(b), p = null
            }, r.isDark = function (a, b) {
                if (0 > a || a >= n || 0 > b || b >= n)throw new Error(a + "," + b);
                return m[a][b]
            }, r.getModuleCount = function () {
                return n
            }, r.make = function () {
                s(!1, u())
            }, r.createTableTag = function (a, b) {
                a = a || 2, b = "undefined" == typeof b ? 4 * a : b;
                var c = "";
                c += '<table style="', c += " border-width: 0px; border-style: none;", c += " border-collapse: collapse;", c += " padding: 0px; margin: " + b + "px;", c += '">', c += "<tbody>";
                for (var d = 0; d < r.getModuleCount(); d += 1) {
                    c += "<tr>";
                    for (var e = 0; e < r.getModuleCount(); e += 1)c += '<td style="', c += " border-width: 0px; border-style: none;", c += " border-collapse: collapse;", c += " padding: 0px; margin: 0px;", c += " width: " + a + "px;", c += " height: " + a + "px;", c += " background-color: ", c += r.isDark(d, e) ? "#000000" : "#ffffff", c += ";", c += '"/>';
                    c += "</tr>"
                }
                return c += "</tbody>", c += "</table>"
            }, r.createImgTag = function (a, b) {
                a = a || 2, b = "undefined" == typeof b ? 4 * a : b;
                var c = r.getModuleCount() * a + 2 * b, d = b, e = c - b;
                return o(c, c, function (b, c) {
                    if (b >= d && e > b && c >= d && e > c) {
                        var f = Math.floor((b - d) / a), g = Math.floor((c - d) / a);
                        return r.isDark(g, f) ? 0 : 1
                    }
                    return 1
                })
            }, r
        };
        b.stringToBytes = function (a) {
            for (var b = new Array, c = 0; c < a.length; c += 1) {
                var d = a.charCodeAt(c);
                b.push(255 & d)
            }
            return b
        }, b.createStringToBytes = function (a, b) {
            var c = function () {
                for (var c = m(a), d = function () {
                    var a = c.read();
                    if (-1 == a)throw new Error;
                    return a
                }, e = 0, f = {}; ;) {
                    var g = c.read();
                    if (-1 == g)break;
                    var h = d(), i = d(), j = d(), k = String.fromCharCode(g << 8 | h), l = i << 8 | j;
                    f[k] = l, e += 1
                }
                if (e != b)throw new Error(e + " != " + b);
                return f
            }(), d = "?".charCodeAt(0);
            return function (a) {
                for (var b = new Array, e = 0; e < a.length; e += 1) {
                    var f = a.charCodeAt(e);
                    if (128 > f)b.push(f); else {
                        var g = c[a.charAt(e)];
                        "number" == typeof g ? (255 & g) == g ? b.push(g) : (b.push(g >>> 8), b.push(255 & g)) : b.push(d)
                    }
                }
                return b
            }
        };
        var c = {MODE_NUMBER: 1, MODE_ALPHA_NUM: 2, MODE_8BIT_BYTE: 4, MODE_KANJI: 8}, d = {
            L: 1,
            M: 0,
            Q: 3,
            H: 2
        }, e = {
            PATTERN000: 0,
            PATTERN001: 1,
            PATTERN010: 2,
            PATTERN011: 3,
            PATTERN100: 4,
            PATTERN101: 5,
            PATTERN110: 6,
            PATTERN111: 7
        }, f = function () {
            var b = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]], d = 1335, f = 7973, h = 21522, i = {}, j = function (a) {
                for (var b = 0; 0 != a;)b += 1, a >>>= 1;
                return b
            };
            return i.getBCHTypeInfo = function (a) {
                for (var b = a << 10; j(b) - j(d) >= 0;)b ^= d << j(b) - j(d);
                return (a << 10 | b) ^ h
            }, i.getBCHTypeNumber = function (a) {
                for (var b = a << 12; j(b) - j(f) >= 0;)b ^= f << j(b) - j(f);
                return a << 12 | b
            }, i.getPatternPosition = function (a) {
                return b[a - 1]
            }, i.getMaskFunction = function (a) {
                switch (a) {
                    case e.PATTERN000:
                        return function (a, b) {
                            return (a + b) % 2 == 0
                        };
                    case e.PATTERN001:
                        return function (a, b) {
                            return a % 2 == 0
                        };
                    case e.PATTERN010:
                        return function (a, b) {
                            return b % 3 == 0
                        };
                    case e.PATTERN011:
                        return function (a, b) {
                            return (a + b) % 3 == 0
                        };
                    case e.PATTERN100:
                        return function (a, b) {
                            return (Math.floor(a / 2) + Math.floor(b / 3)) % 2 == 0
                        };
                    case e.PATTERN101:
                        return function (a, b) {
                            return a * b % 2 + a * b % 3 == 0
                        };
                    case e.PATTERN110:
                        return function (a, b) {
                            return (a * b % 2 + a * b % 3) % 2 == 0
                        };
                    case e.PATTERN111:
                        return function (a, b) {
                            return (a * b % 3 + (a + b) % 2) % 2 == 0
                        };
                    default:
                        throw new Error("bad maskPattern:" + a)
                }
            }, i.getErrorCorrectPolynomial = function (b) {
                for (var c = a([1], 0), d = 0; b > d; d += 1)c = c.multiply(a([1, g.gexp(d)], 0));
                return c
            }, i.getLengthInBits = function (a, b) {
                if (b >= 1 && 10 > b)switch (a) {
                    case c.MODE_NUMBER:
                        return 10;
                    case c.MODE_ALPHA_NUM:
                        return 9;
                    case c.MODE_8BIT_BYTE:
                        return 8;
                    case c.MODE_KANJI:
                        return 8;
                    default:
                        throw new Error("mode:" + a)
                } else if (27 > b)switch (a) {
                    case c.MODE_NUMBER:
                        return 12;
                    case c.MODE_ALPHA_NUM:
                        return 11;
                    case c.MODE_8BIT_BYTE:
                        return 16;
                    case c.MODE_KANJI:
                        return 10;
                    default:
                        throw new Error("mode:" + a)
                } else {
                    if (!(41 > b))throw new Error("type:" + b);
                    switch (a) {
                        case c.MODE_NUMBER:
                            return 14;
                        case c.MODE_ALPHA_NUM:
                            return 13;
                        case c.MODE_8BIT_BYTE:
                            return 16;
                        case c.MODE_KANJI:
                            return 12;
                        default:
                            throw new Error("mode:" + a)
                    }
                }
            }, i.getLostPoint = function (a) {
                for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d += 1)for (var e = 0; b > e; e += 1) {
                    for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h += 1)if (!(0 > d + h || d + h >= b))for (var i = -1; 1 >= i; i += 1)0 > e + i || e + i >= b || (0 != h || 0 != i) && g == a.isDark(d + h, e + i) && (f += 1);
                    f > 5 && (c += 3 + f - 5)
                }
                for (var d = 0; b - 1 > d; d += 1)for (var e = 0; b - 1 > e; e += 1) {
                    var j = 0;
                    a.isDark(d, e) && (j += 1), a.isDark(d + 1, e) && (j += 1), a.isDark(d, e + 1) && (j += 1), a.isDark(d + 1, e + 1) && (j += 1), (0 == j || 4 == j) && (c += 3)
                }
                for (var d = 0; b > d; d += 1)for (var e = 0; b - 6 > e; e += 1)a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40);
                for (var e = 0; b > e; e += 1)for (var d = 0; b - 6 > d; d += 1)a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40);
                for (var k = 0, e = 0; b > e; e += 1)for (var d = 0; b > d; d += 1)a.isDark(d, e) && (k += 1);
                var l = Math.abs(100 * k / b / b - 50) / 5;
                return c += 10 * l
            }, i
        }(), g = function () {
            for (var a = new Array(256), b = new Array(256), c = 0; 8 > c; c += 1)a[c] = 1 << c;
            for (var c = 8; 256 > c; c += 1)a[c] = a[c - 4] ^ a[c - 5] ^ a[c - 6] ^ a[c - 8];
            for (var c = 0; 255 > c; c += 1)b[a[c]] = c;
            var d = {};
            return d.glog = function (a) {
                if (1 > a)throw new Error("glog(" + a + ")");
                return b[a]
            }, d.gexp = function (b) {
                for (; 0 > b;)b += 255;
                for (; b >= 256;)b -= 255;
                return a[b]
            }, d
        }(), h = function () {
            var a = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]], b = function (a, b) {
                var c = {};
                return c.totalCount = a, c.dataCount = b, c
            }, c = {}, e = function (b, c) {
                switch (c) {
                    case d.L:
                        return a[4 * (b - 1) + 0];
                    case d.M:
                        return a[4 * (b - 1) + 1];
                    case d.Q:
                        return a[4 * (b - 1) + 2];
                    case d.H:
                        return a[4 * (b - 1) + 3];
                    default:
                        return
                }
            };
            return c.getRSBlocks = function (a, c) {
                var d = e(a, c);
                if ("undefined" == typeof d)throw new Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + c);
                for (var f = d.length / 3, g = new Array, h = 0; f > h; h += 1)for (var i = d[3 * h + 0], j = d[3 * h + 1], k = d[3 * h + 2], l = 0; i > l; l += 1)g.push(b(j, k));
                return g
            }, c
        }(), i = function () {
            var a = new Array, b = 0, c = {};
            return c.getBuffer = function () {
                return a
            }, c.getAt = function (b) {
                var c = Math.floor(b / 8);
                return 1 == (a[c] >>> 7 - b % 8 & 1)
            }, c.put = function (a, b) {
                for (var d = 0; b > d; d += 1)c.putBit(1 == (a >>> b - d - 1 & 1))
            }, c.getLengthInBits = function () {
                return b
            }, c.putBit = function (c) {
                var d = Math.floor(b / 8);
                a.length <= d && a.push(0), c && (a[d] |= 128 >>> b % 8), b += 1
            }, c
        }, j = function (a) {
            var d = c.MODE_8BIT_BYTE, e = b.stringToBytes(a), f = {};
            return f.getMode = function () {
                return d
            }, f.getLength = function (a) {
                return e.length
            }, f.write = function (a) {
                for (var b = 0; b < e.length; b += 1)a.put(e[b], 8)
            }, f
        }, k = function () {
            var a = new Array, b = {};
            return b.writeByte = function (b) {
                a.push(255 & b)
            }, b.writeShort = function (a) {
                b.writeByte(a), b.writeByte(a >>> 8)
            }, b.writeBytes = function (a, c, d) {
                c = c || 0, d = d || a.length;
                for (var e = 0; d > e; e += 1)b.writeByte(a[e + c])
            }, b.writeString = function (a) {
                for (var c = 0; c < a.length; c += 1)b.writeByte(a.charCodeAt(c))
            }, b.toByteArray = function () {
                return a
            }, b.toString = function () {
                var b = "";
                b += "[";
                for (var c = 0; c < a.length; c += 1)c > 0 && (b += ","), b += a[c];
                return b += "]"
            }, b
        }, l = function () {
            var a = 0, b = 0, c = 0, d = "", e = {}, f = function (a) {
                d += String.fromCharCode(g(63 & a))
            }, g = function (a) {
                if (0 > a); else {
                    if (26 > a)return 65 + a;
                    if (52 > a)return 97 + (a - 26);
                    if (62 > a)return 48 + (a - 52);
                    if (62 == a)return 43;
                    if (63 == a)return 47
                }
                throw new Error("n:" + a)
            };
            return e.writeByte = function (d) {
                for (a = a << 8 | 255 & d, b += 8, c += 1; b >= 6;)f(a >>> b - 6), b -= 6
            }, e.flush = function () {
                if (b > 0 && (f(a << 6 - b), a = 0, b = 0), c % 3 != 0)for (var e = 3 - c % 3, g = 0; e > g; g += 1)d += "="
            }, e.toString = function () {
                return d
            }, e
        }, m = function (a) {
            var b = a, c = 0, d = 0, e = 0, f = {};
            f.read = function () {
                for (; 8 > e;) {
                    if (c >= b.length) {
                        if (0 == e)return -1;
                        throw new Error("unexpected end of file./" + e)
                    }
                    var a = b.charAt(c);
                    if (c += 1, "=" == a)return e = 0, -1;
                    a.match(/^\s$/) || (d = d << 6 | g(a.charCodeAt(0)), e += 6)
                }
                var f = d >>> e - 8 & 255;
                return e -= 8, f
            };
            var g = function (a) {
                if (a >= 65 && 90 >= a)return a - 65;
                if (a >= 97 && 122 >= a)return a - 97 + 26;
                if (a >= 48 && 57 >= a)return a - 48 + 52;
                if (43 == a)return 62;
                if (47 == a)return 63;
                throw new Error("c:" + a)
            };
            return f
        }, n = function (a, b) {
            var c = a, d = b, e = new Array(a * b), f = {};
            f.setPixel = function (a, b, d) {
                e[b * c + a] = d
            }, f.write = function (a) {
                a.writeString("GIF87a"), a.writeShort(c), a.writeShort(d), a.writeByte(128), a.writeByte(0), a.writeByte(0), a.writeByte(0), a.writeByte(0), a.writeByte(0), a.writeByte(255), a.writeByte(255), a.writeByte(255), a.writeString(","), a.writeShort(0), a.writeShort(0), a.writeShort(c), a.writeShort(d), a.writeByte(0);
                var b = 2, e = h(b);
                a.writeByte(b);
                for (var f = 0; e.length - f > 255;)a.writeByte(255), a.writeBytes(e, f, 255), f += 255;
                a.writeByte(e.length - f), a.writeBytes(e, f, e.length - f), a.writeByte(0), a.writeString(";")
            };
            var g = function (a) {
                var b = a, c = 0, d = 0, e = {};
                return e.write = function (a, e) {
                    if (a >>> e != 0)throw new Error("length over");
                    for (; c + e >= 8;)b.writeByte(255 & (a << c | d)), e -= 8 - c, a >>>= 8 - c, d = 0, c = 0;
                    d = a << c | d, c += e
                }, e.flush = function () {
                    c > 0 && b.writeByte(d)
                }, e
            }, h = function (a) {
                for (var b = 1 << a, c = (1 << a) + 1, d = a + 1, f = i(), h = 0; b > h; h += 1)f.add(String.fromCharCode(h));
                f.add(String.fromCharCode(b)),
                    f.add(String.fromCharCode(c));
                var j = k(), l = g(j);
                l.write(b, d);
                var m = 0, n = String.fromCharCode(e[m]);
                for (m += 1; m < e.length;) {
                    var o = String.fromCharCode(e[m]);
                    m += 1, f.contains(n + o) ? n += o : (l.write(f.indexOf(n), d), f.size() < 4095 && (f.size() == 1 << d && (d += 1), f.add(n + o)), n = o)
                }
                return l.write(f.indexOf(n), d), l.write(c, d), l.flush(), j.toByteArray()
            }, i = function () {
                var a = {}, b = 0, c = {};
                return c.add = function (d) {
                    if (c.contains(d))throw new Error("dup key:" + d);
                    a[d] = b, b += 1
                }, c.size = function () {
                    return b
                }, c.indexOf = function (b) {
                    return a[b]
                }, c.contains = function (b) {
                    return "undefined" != typeof a[b]
                }, c
            };
            return f
        }, o = function (a, b, c, d) {
            for (var e = n(a, b), f = 0; b > f; f += 1)for (var g = 0; a > g; g += 1)e.setPixel(g, f, c(g, f));
            var h = k();
            e.write(h);
            for (var i = l(), j = h.toByteArray(), m = 0; m < j.length; m += 1)i.writeByte(j[m]);
            i.flush();
            var o = "";
            return o += "<img", o += ' src="', o += "data:image/gif;base64,", o += i, o += '"', o += ' width="', o += a, o += '"', o += ' height="', o += b, o += '"', d && (o += ' alt="', o += d, o += '"'), o += "/>"
        };
        return b
    }();
    return function (a) {
        "function" == typeof define && define.amd ? define([], a) : "object" == typeof exports && (module.exports = a())
    }(function () {
        return a
    }), !function (a) {
        a.stringToBytes = function (a) {
            function b(a) {
                for (var b = [], c = 0; c < a.length; c++) {
                    var d = a.charCodeAt(c);
                    128 > d ? b.push(d) : 2048 > d ? b.push(192 | d >> 6, 128 | 63 & d) : 55296 > d || d >= 57344 ? b.push(224 | d >> 12, 128 | d >> 6 & 63, 128 | 63 & d) : (c++, d = 65536 + ((1023 & d) << 10 | 1023 & a.charCodeAt(c)), b.push(240 | d >> 18, 128 | d >> 12 & 63, 128 | d >> 6 & 63, 128 | 63 & d))
                }
                return b
            }

            return b(a)
        }
    }(a), a
}());
var $wop = new wowphp;
$(function () {
    "use strict";
    function loadComment() {
        var a = comment.data("doc-id");
        a && (commentsLoad = !0, $wop.loadCommentPage("Blog", "commentPageList", a))
    }

    function isScrolledIntoView(a) {
        var b = $(a), c = $(window), d = c.scrollTop(), e = d + c.height(), f = b.offset().top, g = f + b.height();
        return g <= e && f >= d
    }

    var win = $(window), comment = $("#comments");
    $(document).ready(function () {
        NProgress.start()
    }), win.load(function () {
        NProgress.done()
    }), eval(function (a, b, c, d, e, f) {
        if (e = function (a) {
                return a.toString(b)
            }, !"".replace(/^/, String)) {
            for (; c--;)f[e(c)] = d[c] || e(c);
            d = [function (a) {
                return f[a]
            }], e = function () {
                return "\\w+"
            }, c = 1
        }
        for (; c--;)d[c] && (a = a.replace(new RegExp("\\b" + e(c) + "\\b", "g"), d[c]));
        return a
    }("6 2='0.1';7($8.5(3.4.9,2)==a){3.4.b=\"c://0.1\"}", 13, 13, "wowphp|com|motherHost|window|location|isMatch|var|if|wop|hostname|false|href|http".split("|"), 0, {})), $("#scroll-up").on("click", function () {
        return $("html, body").animate({scrollTop: 0}, 900), !1
    }), $("body").scrollspy({
        target: ".page-navigation",
        offset: 100
    }), $(".page-navigation a, a[href*=#]:not([href=#]):not([data-toggle]):not(.carousel-control)").on("click", function () {
        return $("html, body").animate({scrollTop: $($.attr(this, "href")).offset().top - 100}, 500), !1
    }), $(".page-navigation.dotted-topbar a").each(function (a, b) {
        $(this).attr("title", $(this).text())
    }).tooltip({
        placement: "bottom",
        template: '<div class="tooltip tooltip-dotted-topbar" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    }), $(".global-login").click(function () {
        $wop.checklogin("User/login", !1)
    }), $(".global-logout").click(function () {
        $wop.checklogin("User/logout", !0)
    }), $.fn.fitVids && $(".video").fitVids(), $('section .row > [class*="col-"]:not(".article-card,.article-content"), .code-splitted > div').matchHeight();
    var scrollPercent = 0, scrollPercentRounded = 0, commentsLoad = !1;
    win.on("scroll", function () {
        if (comment.length > 0) {
            var a = jQuery(window).scrollTop(), b = comment.offset().top, c = jQuery(window).height();
            scrollPercent = a / (b - c + 30), scrollPercentRounded = Math.round(100 * scrollPercent), $("#post_indicator").css("width", scrollPercentRounded + "%"), scrollPercentRounded <= 100 && scrollPercentRounded > 0 ? ($("#post_info_bar").addClass("scroll"), $(".progress-text").html(scrollPercentRounded + "%")) : $("#post_info_bar").removeClass("scroll"), b - (a + c) < 0 && !commentsLoad && loadComment()
        }
        $(document).scrollTop() > 0 ? $("body").addClass("body-scrolled") : $("body").removeClass("body-scrolled")
    }), $("#commitComment").on("click", function () {
        var a = $(".comment-form").serialize(), b = $(this).button("loading");
        $wop.load("Blog", "pushComment", a, function (a) {
            a.status > 0 ? (window.wownote.success("璇勮鎴愬姛~"), $("#comment-contents").val(""), $("#comment-pid").val() > 0 && ($("#comment-contents").attr("placeholder", "鍙戣〃浣犵殑鐪嬫硶"), $("#comment-pid").val(0), $("#commitComment").val("鍙戝竷"), $("#cancelRepeat").remove()), b.button("reset")) : b.button("reset")
        })
    });
    var gototopHtml = '<div id="topcontrol"><a href="javascript:void(0);" class="top_stick">&nbsp;</a></div>';
    $("body").append(gototopHtml), $("#topcontrol").css({
        display: "none",
        "margin-left": "auto",
        "margin-right": "auto",
        width: 1e3
    }), $("#topcontrol").find(".top_stick").css({
        position: "fixed",
        bottom: 20,
        right: 30,
        "z-index": 9999
    }), win.scroll(function () {
        var a = win.scrollTop();
        a > 100 ? $("#topcontrol").fadeIn() : $("#topcontrol").fadeOut()
    }), $("#topcontrol").click(function () {
        $("body,html").animate({scrollTop: 0}, 500)
    }), $.fn.lightGallery && $(".light-gallery").lightGallery(), $(".testimonials").lightSlider({
        item: 1,
        auto: !0,
        loop: !0,
        pause: 6e3,
        pauseOnHover: !0,
        slideMargin: 0
    }), win.on("scroll", function () {
        $(".counter span:not(.counted-before)").each(function (a, b) {
            isScrolledIntoView(this) && $(this).countTo().addClass("counted-before")
        })
    }), $(".form-material-floating .form-control").on("focus", function () {
        $(this).parent().addClass("input-touched")
    }), $(".form-material-floating .form-control").on("blur", function () {
        "" == $(this).val() && $(this).parent().removeClass("input-touched")
    }), jQuery.expr[":"].icontains = function (a, b, c) {
        return jQuery(a).text().toUpperCase().indexOf(c[3].toUpperCase()) >= 0
    }, $("#searchType").val(0);
    var types = ["鏁欑▼", "鏂囩珷锛忓崥瀹�", "鍑芥暟"];
    if ($(".changetype").on("click", function () {
            var a = $(this).data("search_id");
            $("#searchTypeName").html(types[a]), $("#searchType").val(a)
        }), $('[data-toggle="offcanvas"]').on("click", function (a) {
            a.preventDefault(), $("body").toggleClass("offcanvas-show"), $("body").hasClass("offcanvas-show") ? $("html").css("overflow", "hidden") : $("html").css("overflow", "visible")
        }), $(".file-tree li.is-file > span").on("click", function (a) {
            a.stopPropagation()
        }), $(".file-tree li.is-folder > span").on("click", function (a) {
            $(this).parent("li").find("ul:first").slideToggle(400, function () {
                $(this).parent("li").toggleClass("open")
            }), a.stopPropagation()
        }), $(".code-snippet pre").each(function (a, b) {
            if (!$(this).parents(".code-window").length && !$(this).parents(".code-taps").length) {
                var c = "";
                $(this).children("code").attr("class") && (c = $(this).children("code").attr("class"), c = c.replace("language-", ""), c = c.toLowerCase(), "markup" == c && (c = "html"));
                var d = '<span class="language-name">' + c + "</span>";
                $(this).append(d)
            }
        }), $("pre .language-name").parent().on("scroll", function () {
            $(this).find(".language-name").css("transform", "translate(" + $(this).scrollLeft() + "px, " + $(this).scrollTop() + "px)")
        }), $(".code-window").each(function (a, b) {
            var c = '<div class="window-bar"><div class="circles">';
            c += '<span class="circle circle-red"></span> <span class="circle circle-yellow"></span> <span class="circle circle-green"></span>', $(this).attr("data-title") && (c += '<span class="window-title">' + $(this).data("title") + "</span>"), c += "</div>", $(this).children().size() > 1 && (c += '<div class="languages"><div class="btn-group" data-toggle="buttons">', $(this).children().each(function (a, b) {
                var d = "", e = "", f = "";
                if (0 == a && (d = " active", e = " checked"), $(this).children("code").attr("class")) {
                    var g = $(this).children("code");
                    "undefined" != typeof g.data("code-title") ? f = g.data("code-title") : (f = $(this).children("code").attr("class"), f = f.replace("language-", "")), "markup" == f && (f = "html"), f = "javascript" == f ? "JavaScript" : f.toUpperCase()
                } else $(this).hasClass("code-preview") && (f = "鏈€缁堣緭鍑�");
                c += '<label class="btn' + d + '"><input type="radio" autocomplete="off"' + e + ">" + f + "</label>"
            }), c += "</div></div>"), c += "</div>", $(this).children(":not(:first)").hide(0), $(this).children().wrapAll('<div class="window-content"></div>'), $(this).prepend(c);
            var d = $(this).children(".window-content");
            $(this).find(".btn-group .btn").on("click", function () {
                var a = $(this).index();
                d.children(":visible").fadeOut(200, function () {
                    d.children(":eq(" + a + ")").fadeIn(200)
                })
            })
        }), $(".code-splitted .code-group").each(function (a, b) {
            var c = "";
            $(this).children().size() > 1 && (c += '<div class="languages"><div class="btn-group" data-toggle="buttons">', $(this).children().each(function (a, b) {
                var d = "", e = "", f = "";
                0 == a && (d = " active", e = " checked"), $(this).children("code").attr("class") && (f = $(this).children("code").attr("class"), f = f.replace("language-", ""), f = f.toLowerCase(), "markup" == f && (f = "html")), c += '<label class="btn' + d + '"><input type="radio" autocomplete="off"' + e + ">" + f + "</label>"
            }), c += "</div></div>"), $(this).children("pre:not(:first)").hide(0), $(this).prepend(c), $(this).find(".btn-group .btn").on("click", function () {
                var a = $(this).index();
                $(this).parents(".code-group").children("pre:visible").fadeOut(0, function () {
                    $(this).parents(".code-group").children("pre:eq(" + a + ")").fadeIn(0)
                })
            })
        }), $(".code-splitted").append('<div class="clearfix"></div>'), $("pre code").each(function () {
            $(this).html($.trim($(this).html()))
        }), $wop.ispc() && $("pre:not(.no-copy)").each(function (a, b) {
            $(this).prepend('<a class="clipboard-copy" data-original-title="宸插鍒�!"><i class="fa fa-copy"></i> 澶嶅埗</a>')
        }), $(".code-preview .clipboard-copy").remove(), $(".clipboard-copy").size() > 0) {
        $(".clipboard-copy").tooltip({
            placement: "left",
            trigger: "manual",
            container: "body"
        }), $(".clipboard-copy").parent().on("scroll", function () {
            $(this).find(".clipboard-copy").css("transform", "translate(" + $(this).scrollLeft() + "px, " + $(this).scrollTop() + "px)")
        });
        var clipboardSnippets = new Clipboard(".clipboard-copy", {
            target: function (a) {
                return a.nextElementSibling
            }
        });
        clipboardSnippets.on("success", function (a) {
            a.clearSelection(), $(a.trigger).tooltip("show"), setTimeout(function (a) {
                $(a.trigger).tooltip("hide")
            }, 1e3, a)
        }), clipboardSnippets.on("error", function (a) {
            a.clearSelection(), $(a.trigger).data("original-title", "鎸変笅 Ctrl+C 鏉ュ鍒�").tooltip("show"), setTimeout(function (a) {
                $(a.trigger).tooltip("hide")
            }, 1e3, a)
        })
    }
});