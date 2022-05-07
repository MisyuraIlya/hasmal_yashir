import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import ManagerEntry from './footer/ManagerEntry';


export default class Footer extends Component {
	constructor(props){
		super(props);
		this.state = {
			userEntryModal: false,
			agentModal: false,
			accessibilityOpen: false,
			removeAccessibility: false,
      ManagerEntryModal:false
		}
		this.closeEntryModal = this.closeEntryModal.bind(this);
		this.exit = this.exit.bind(this);
		this.loadAccessibility = this.loadAccessibility.bind(this);
		this.openAccessibility = this.openAccessibility.bind(this);
		this.closeAccessibility = this.closeAccessibility.bind(this);
	}
	componentWillMount(){}
	componentDidMount(){
		this.loadAccessibility();
	}
	componentWillReceiveProps(nextProps){}
	loadAccessibility(){
		! function(a) {
		a.fn.inlineStyle = function(b) {
			var d, c = this.attr("style");
			return c && c.split(";").forEach(function(c) {
				var e = c.split(":");
					a.trim(e[0]) === b && (d = e[1])
				}), d
				}, a.fn.pxToEm = function() {
					var b = a(this).css("fontSize"),
					c = parseInt(b),
					d = 16,
					e = 1,
					f = e * c / d;
					a(this).css("fontSize", f + "em")
				}
			}($);
		$(document).ready(function() {
			function g() {
				var a = ["a", "p", "span", "li", "tr > th", "tr > td", "h1", "h2", "h3", "h4", "h5", "input", "textarea", "button"],
					b = a.length;
				for (var i = 0; i < b; i++) {
					var c = $("body").find($(a[i]));
					void 0 !== c.css("fontSize") && c.each(function(a) {
						var b = $(this).css("fontSize"),
							d = parseInt(b);
						void 0 !== c.css("fontSize") && (d <= 36 ? void 0 !== $(this).inlineStyle("font-size") && null !== $(this).inlineStyle("font-size") ? $(this).pxToEm() : "h1" == $(this).prop("tagName").toLowerCase() ? d > 32 && d < 36 ? $(this).pxToEm() : $(this).css("fontSize", "2em") : "h2" == $(this).prop("tagName").toLowerCase() ? d > 24 && d < 34 ? $(this).pxToEm() : $(this).css("fontSize", "1.5em") : "h3" == $(this).prop("tagName").toLowerCase() ? d > 18 && d < 32 ? $(this).pxToEm() : $(this).css("fontSize", "1.17em") : "h4" == $(this).prop("tagName").toLowerCase() ? d > 17 && d < 31 ? $(this).pxToEm() : $(this).css("fontSize", "1.12em") : d > 16 && d <= 25 ? $(this).pxToEm() : $(this).css("fontSize", "1em") : "h1" == $(this).prop("tagName").toLowerCase() ? d > 100 ? $(this).css("fontSize", "120px") : $(this).css("fontSize", "2em") : "h2" == $(this).prop("tagName").toLowerCase() ? d > 80 ? $(this).css("fontSize", "80px") : $(this).css("fontSize", "1.5em") : "h3" == $(this).prop("tagName").toLowerCase() ? d > 60 ? $(this).css("fontSize", "60px") : $(this).css("fontSize", "1.17em") : "h4" == $(this).prop("tagName").toLowerCase() && (d > 40 ? $(this).css("fontSize", "60px") : $(this).css("fontSize", "1.12em")))
					})
				}
			}
			if (void 0 !== $.cookie("bodyClass") && null !== $.cookie("bodyClass")) {
				var a = $.cookie("bodyClass");
				$("body").addClass(a)
			}
			if (void 0 !== $.cookie("bodyZoom") && null !== $.cookie("bodyZoom")) {
				var b = $.cookie("bodyZoom");
				$("body").addClass(b)
			}
			if (void 0 !== $.cookie("bodyGrayscale") && null !== $.cookie("bodyGrayscale")) {
				var c = $.cookie("bodyGrayscale");
				$("body").addClass(c)
			}
			if (void 0 !== $.cookie("bodyInvert") && null !== $.cookie("bodyInvert")) {
				var d = $.cookie("bodyInvert");
				$("body").addClass(d)
			}
			if (void 0 !== $.cookie("bodyLinks") && null !== $.cookie("bodyLinks")) {
				var e = $.cookie("bodyLinks");
				$("#increase_links").addClass("underlined"), $("body").find("a").addClass(e)
			}
			if (void 0 !== $.cookie("bodyLinksBold") && null !== $.cookie("bodyLinksBold")) {
				var f = $.cookie("bodyLinksBold");
				$("#decrease_links").addClass("bolded"), $("body").find("a").addClass(f)
			}
			$("#open-accessibility").click(function(a) {
			}), void 0 !== $.cookie("resizeFonts") && null !== $.cookie("resizeFonts") && g(), $("body").on("click", "#increase_links", function(a) {
				$(this).toggleClass("underlined"), $(this).hasClass("underlined") ? ($("body").find("a").addClass("underline_links"), $.cookie("bodyLinks", "underline_links")) : ($("body").find("a").removeClass("underline_links"), $.removeCookie("bodyLinks"))
			}), $("body").on("click", "#decrease_links", function(a) {
				$(this).toggleClass("bolded"), $(this).hasClass("bolded") ? ($("body").find("a").addClass("links_bolder"), $.cookie("bodyLinksBold", "links_bolder")) : ($("body").find("a").removeClass("links_bolder"), $.removeCookie("bodyLinksBold"))
			}), $("body").on("click", "#restore_links", function(a) {
				void 0 !== $.cookie("bodyLinks") && null !== $.cookie("bodyLinks") && ($("body").find("a").removeClass("underline_links"), $.removeCookie("bodyLinks")), void 0 !== $.cookie("bodyLinksBold") && null !== $.cookie("bodyLinksBold") && ($("body").find("a").removeClass("links_bolder"), $.removeCookie("bodyLinksBold"))
			}), $("body").on("click", "#grayscale_body", function(a) {
				$("body").hasClass("invert_body") && ($("body").removeClass("invert_body"), $.removeCookie("bodyInvert")), $("body").addClass("grayscale_body"), $.cookie("bodyGrayscale", "grayscale_body")
			}), $("body").on("click", "#invert_body", function(a) {
				$("body").hasClass("grayscale_body") && ($("body").removeClass("grayscale_body"), $.removeCookie("bodyGrayscale")), $("body").addClass("invert_body"), $.cookie("bodyInvert", "invert_body")
			}), $("body").on("click", "#restore_color_body", function(a) {
				$("body").hasClass("grayscale_body") ? ($("body").removeClass("grayscale_body"), $.removeCookie("bodyGrayscale")) : $("body").hasClass("invert_body") && ($("body").removeClass("invert_body"), $.removeCookie("bodyInvert"))
			}), $("body").on("click", "#zoom_in_body", function(a) {
				$("body").hasClass("zoomL") || $("body").hasClass("zoomXL") || $("body").hasClass("zoomXXL") ? $("body").hasClass("zoomL") ? ($("body").removeClass("zoomL").addClass("zoomXL"), $.cookie("bodyZoom", "zoomXL")) : $("body").hasClass("zoomXL") && ($("body").removeClass("zoomXL").addClass("zoomXXL"), $.cookie("bodyZoom", "zoomXXL")) : ($("body").addClass("zoomL"), $.cookie("bodyZoom", "zoomL"))
			}), $("body").on("click", "#zoom_out_body", function(a) {
				$("body").hasClass("zoomXXL") ? ($("body").removeClass("zoomXXL").addClass("zoomXL"), $.removeCookie("bodyZoom"), $.cookie("bodyZoom", "zoomXL")) : $("body").hasClass("zoomXL") ? ($("body").removeClass("zoomXL").addClass("zoomL"), $.removeCookie("bodyZoom"), $.cookie("bodyZoom", "zoomL")) : $("body").hasClass("zoomL") && ($("body").removeClass("zoomL"), $.removeCookie("bodyZoom"))
			}), $("body").on("click", "#restore_zoom_body", function(a) {
				($("body").hasClass("zoomL") || $("body").hasClass("zoomXL") || $("body").hasClass("zoomXXL")) && ($("body").hasClass("zoomXXL") ? $("body").removeClass("zoomXXL") : $("body").hasClass("zoomXL") ? $("body").removeClass("zoomXL") : $("body").hasClass("zoomL") && $("body").removeClass("zoomL")), $.removeCookie("bodyZoom")
			}), $("body").on("click", "#increase_fs", function(a) {
				void 0 !== $.cookie("resizeFonts") && null !== $.cookie("resizeFonts") || ($.cookie("resizeFonts", "resized"), g()), $("body").hasClass("sizeL") || $("body").hasClass("sizeXL") || $("body").hasClass("sizeXXL") || $("body").hasClass("sizeXXL") || $("body").hasClass("sizeXXXL") ? $("body").hasClass("sizeL") ? ($("body").removeClass("sizeL").addClass("sizeXL"), $.cookie("bodyClass", "sizeXL")) : $("body").hasClass("sizeXL") ? ($("body").removeClass("sizeXL").addClass("sizeXXL"), $.cookie("bodyClass", "sizeXXL")) : $("body").hasClass("sizeXXL") && ($("body").removeClass("sizeXXL").addClass("sizeXXXL"), $.cookie("bodyClass", "sizeXXXL")) : ($("body").addClass("sizeL"), $.cookie("bodyClass", "sizeL"))
			}), $("body").on("click", "#decrease_fs", function(a) {
				$("body").hasClass("sizeXXXL") ? ($("body").removeClass("sizeXXXL").addClass("sizeXXL"), $.removeCookie("bodyClass"), $.cookie("bodyClass", "sizeXXL")) : $("body").hasClass("sizeXXL") ? ($("body").removeClass("sizeXXL").addClass("sizeXL"), $.removeCookie("bodyClass"), $.cookie("bodyClass", "sizeXL")) : $("body").hasClass("sizeXL") ? ($("body").removeClass("sizeXL").addClass("sizeL"), $.removeCookie("bodyClass"), $.cookie("bodyClass", "sizeL")) : $("body").hasClass("sizeL") && ($("body").removeClass("sizeL"), $.removeCookie("bodyClass"), $.removeCookie("resizeFonts"))
			}), $("body").on("click", "#restore_fs", function(a) {
				($("body").hasClass("sizeL") || $("body").hasClass("sizeXL") || $("body").hasClass("sizeXXL") || $("body").hasClass("sizeXXL") || $("body").hasClass("sizeXXXL")) && ($("body").hasClass("sizeXXXL") ? $("body").removeClass("sizeXXXL") : $("body").hasClass("sizeXXL") ? $("body").removeClass("sizeXXL") : $("body").hasClass("sizeXL") ? $("body").removeClass("sizeXL") : $("body").hasClass("sizeL") && $("body").removeClass("sizeL")), $.removeCookie("bodyClass"), $.removeCookie("resizeFonts"), location.reload()
			})
		});
		(function (factory) {
			if (typeof define === 'function' && define.amd) {
				define(['jquery'], factory);
			} else if (typeof exports === 'object') {
				module.exports = factory(require('jquery'));
			} else {
				factory(jQuery);
			}
		}(function ($) {
			var pluses = /\+/g;
			function encode(s) {
				return config.raw ? s : encodeURIComponent(s);
			}
			function decode(s) {
				return config.raw ? s : decodeURIComponent(s);
			}
			function stringifyCookieValue(value) {
				return encode(config.json ? JSON.stringify(value) : String(value));
			}
			function parseCookieValue(s) {
				if (s.indexOf('"') === 0) {
					s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
				}
				try {
					s = decodeURIComponent(s.replace(pluses, ' '));
					return config.json ? JSON.parse(s) : s;
				} catch(e) {}
			}
			function read(s, converter) {
				var value = config.raw ? s : parseCookieValue(s);
				return $.isFunction(converter) ? converter(value) : value;
			}
			var config = $.cookie = function (key, value, options) {
				if (arguments.length > 1 && !$.isFunction(value)) {
					options = $.extend({}, config.defaults, options);
					if (typeof options.expires === 'number') {
						var days = options.expires, t = options.expires = new Date();
						t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
					}
					return (document.cookie = [
						encode(key), '=', stringifyCookieValue(value),
						options.expires ? '; expires=' + options.expires.toUTCString() : '',
						options.path    ? '; path=' + options.path : '',
						options.domain  ? '; domain=' + options.domain : '',
						options.secure  ? '; secure' : ''
					].join(''));
				}
				var result = key ? undefined : {},
					cookies = document.cookie ? document.cookie.split('; ') : [],
					i = 0,
					l = cookies.length;
				for (; i < l; i++) {
					var parts = cookies[i].split('='),
						name = decode(parts.shift()),
						cookie = parts.join('=');
					if (key === name) {
						result = read(cookie, value);
						break;
					}
					if (!key && (cookie = read(cookie)) !== undefined) {
						result[name] = cookie;
					}
				}
				return result;
			};
			config.defaults = {};
			$.removeCookie = function (key, options) {
				$.cookie(key, '', $.extend({}, options, { expires: -1 }));
				return !$.cookie(key);
			};

		}));
	}
	openAccessibility(){
		this.state.accessibilityOpen ? $('.accessibility').slideUp() : $('.accessibility').slideDown();
		this.setState({accessibilityOpen: !this.state.accessibilityOpen});
	}
	closeAccessibility(){
		this.setState({removeAccessibility: true});
    localStorage.setItem('accessibility', true);
	}
	exit(){
		let t_z = localStorage.t_z;
		let pass = localStorage.pass;
		let rememberMe = localStorage.rememberMe;
		localStorage.clear();
		this.props.history.push('/');
		if (rememberMe) {
			localStorage.setItem('t_z', t_z);
			localStorage.setItem('pass', pass);
		}
	}
	closeEntryModal(){
		this.setState({
			userEntryModal: false,
			agentModal: false,
      ManagerEntryModal: false
		});
	}
  
	render(){
		return (
			<footer id="footer">
				{/*{this.state.userEntryModal ? <AdminEntry parent={this}/> : null}
				{this.state.agentModal ? <AgentEntry {...this} /> : null}
        {this.state.ManagerEntryModal ? <ManagerEntry {...this}/> : null}*/}

      	<div className="copyright">
					<a href="https://statos.co.il/" target="_blank">
						<img src={globalFileServer + 'statos-logo.svg'} />
					</a>
					{/*{!localStorage.role && !localStorage.agent ?
						<div className="administrator" onClick={()=> this.setState({ManagerEntryModal: true})}>
							<span><img src={globalFileServer + 'icons/gear.svg'} /></span>
							<span className="login">מנהל</span>
						</div>
					: null}*/}
          <a className="privacy" href={globalFileServer + 'policy_form.pdf'} target="_blank">
            <span className="login">תנאי שימוש</span>
          </a>
				</div>
        {!localStorage.accessibility && !this.props.state.appId ?
  				<div className="accessibility-wrapper">
  					<div className="accessibility">
  						<div className="accessibility-contant flex-container">
  							<div className="col-lg-4">
  								<h3>גודל הגופן</h3>
  								<ul>
  									<li id="increase_fs"><span><img src={globalFileServer + "accessibility/increase-font.png"} alt="increase-font" /></span> <a>הגדל גופן</a></li>
  									<li id="decrease_fs"><span><img src={globalFileServer + "accessibility/decrease-font.png"} alt="decrease-font" /></span> <a>הקטן גופן</a></li>
  									<li id="restore_fs"><span><img src={globalFileServer + "accessibility/refresh.png"} alt="generic-text" /></span> <a>שחזר את גודל הגופן</a></li>
  								</ul>
  							</div>
  							<div className="col-lg-4 col-zoom">
  								<h3>תצוגה</h3>
  								<ul>
  									<li id="zoom_in_body"><span><img src={globalFileServer + "accessibility/zoom-in.png"} alt="" /></span> <a>הגדל את התצוגה</a></li>
  									<li id="zoom_out_body"><span><img src={globalFileServer + "accessibility/zoom-out.png"} alt="" /></span> <a>הקטן את התצוגה</a></li>
  									<li id="restore_zoom_body"><span><img src={globalFileServer + "accessibility/refresh.png"} alt="" /></span> <a>שחזר תצוגה</a></li>
  								</ul>
  							</div>
  							<div className="col-lg-4">
  								<h3>צבעוניות</h3>
  								<ul>
  									<li id="grayscale_body"><span><img src={globalFileServer + "accessibility/black-white.png"} alt="" /></span> <a>שחור לבן</a></li>
  									<li id="invert_body"><span><img src={globalFileServer + "accessibility/contrast.png"} alt="" /></span> <a>הפוך צבעים</a></li>
  									<li id="restore_color_body"><span><img src={globalFileServer + "accessibility/refresh.png"} alt="" /></span> <a>שחזר צבעים</a></li>
  								</ul>
  							</div>
  							<div className="col-lg-4">
  								<h3>לינקים</h3>
  								<ul>
  									<li id="increase_links"><span><img src={globalFileServer + "accessibility/underline.png"} alt="" /></span> <a>קו מתחת ללינקים</a></li>
  									<li id="decrease_links"><span><img src={globalFileServer + "accessibility/bold.png"} alt="" /></span> <a>הדגש לינקים</a></li>
  									<li id="restore_links"><span><img src={globalFileServer + "accessibility/refresh.png"} alt="" /></span> <a>שחזר לינקים</a></li>
  								</ul>
  							</div>
  						</div>
  						<div className="accessibility-footer"></div>
  					</div>
  					{!this.state.removeAccessibility ?
  						<div className='open-accessibility'>
  							<img onClick={this.closeAccessibility} className="close" src={globalFileServer + "icons/cross-white.svg"} alt="accessibility" />
  							<img onClick={this.openAccessibility} id="open-accessibility" src={globalFileServer + "wheelchair-access.png"} alt="accessibility" />
  						</div>
  					: null}
  				</div>
        :null}
			</footer>
		)
	}
}
