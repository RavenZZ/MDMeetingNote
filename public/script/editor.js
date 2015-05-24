

(function ($) {
    //require("./css/editor.css");

    $.fn.Editor = function (options) {
        var editor = new EditorObj(options);
        editor.settings.$el = this;
        editor.init();
        return editor;
    };

    var EditorObj = function (options) {
        this._defaults = {
            EditorTitle:'',
            IsOnlyRead: false,//不可编辑
            $onlyReadIframe: null,
            cbCallback: null,//回调 ckbox
            ckCallback: null,//回调 点击
            IsBindEvent: true,
            $target: null,

            IsFontSize: true, //是否有字体大小设置功能
            IsFontFamily: false, //是否有字体设置功能
            IsFontColor: true, //是否有字体颜色设置功能
            IsBold: true, //是否有粗体设置功能
            IsItalics: true, //是否有斜体设置功能
            IsUnderline: true, //是否有下划线设置功能
            IsToDo: true, //是否有代办事项功能
            IsNumberLists: true, //是否有编号列表
            IsHorizontalLine: true, //是否有插入下划线功能
            IsAlignment: true, //是否有对齐方式功能
            IsClearFormat: true, //是否有清除格式功能
            IsHyperlinks: true, //是否有添加文本超链接功能
            IsFullScreen: true, //是否有全屏功能
            IsTensile: true, //是否可以拉伸
            IsDrag: true, //是否可以拖拽

            IsFullScreenOper: false,//是否展示全屏操作
            Title: "",//全屏显示标题
            Source: "",//
            Save: null,//保存按钮触发方法
            Cancel: null,//取消按钮触发方法

            IsAutoSave: false, //是否自动保存
            IsGetLocalStorage: false, //是否获取本地存储内容
            AutoSaveTimer: null,//自动保存定时器
            AutoSaveType: "local", //自动保存类型 local：本地localStorage
            AutoSaveInterval: 5, //自动保存间隔 秒
            AutoSaveFuncation: null, //自动保存调用方法  data为编辑器输入的html内容

            OnFocus: null, //获得焦点触发
            OnBlur: null, //失去焦点触发
            OnKeydown: null,//编辑器输入事件
            OnRemove: null//移除编辑器时发生
        };
        //保存类型
        this.saveTypeEnum = {
            local: "local", //本地
            server: "server" //服务

        };
        this.settings = $.extend({}, this._defaults, options);


    };

    $.extend(EditorObj.prototype, {
        //   导出方法
        //销毁    特例：取消编辑的时候需要传 true 不替换内容
        destroy: function (isCancel) {
            if (!this.settings.IsOnlyRead) {
                //清除计时器
                clearInterval(this.settings.AutoSaveTimer);
                //清除本地存储
                this.utils.clearLocalStorage(this.settings.$el.attr("id"));
                //显示当前元素
                if (isCancel) {
                    this.settings.$el.show();
                }
                else {
                    this.settings.$el.show().html(this.settings.$editor.html());
                }
            }
            //清除编辑器
            this.settings.$editor_container.remove();
        },
        //获取 编辑器内容
        getValue: function () {
            var val = this.settings.$editor.html();
            //val = filterXSS(val, {
            //    stripIgnoreTag: true
            //});
            return val;
        },
        //设置编辑器内容
        setValue: function (val) {
            this.settings.$editor.html(val);
            initIcoCheckboxEvent(this.settings.$editor);
        },
        //导出end

        //初始化方法
        init: function () {
            if (this.settings.IsOnlyRead) {
                //渲染html
                this.renderOnlyReadEditor();
            } else {
                //渲染html
                this.renderEditor();
            }
        },

        //生成只读的editor
        renderOnlyReadEditor: function () {
            var oldhtml = "";
            if (isInput(this.settings.$el)) {
                oldhtml = this.settings.$el.val();
            } else {
                oldhtml = this.settings.$el.html();
            }
            var iframeId = "mdEditorIndependentIframe" + new Date().getTime();
            if (this.settings.$target != null) {
                this.settings.$target.before('<iframe frameborder="0" hidefocus="true" style="width:100%;height:100%;line-height:1.5;" id=' + iframeId + ' ></iframe>');
            } else {
                this.settings.$el.before('<iframe frameborder="0" hidefocus="true" style="width:100%;height:100%;line-height:1.5;" id=' + iframeId + ' ></iframe>');
            }

            this.settings.$el.hide();

            var head = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>www.mingdao.com</title>';

            head += '<style type="text/css">';

            head += "body{ font-family:Helvetica Neue,Tahoma,Arial,'微软雅黑','宋体','黑体';font-size:13px;line-height:18px;padding:0; margin:10px;min-height:130px;word-break:break-all;} .ico_checkbox{cursor:pointer;height:12px}";

            head += '</style><base target="_blank" /></head></html>';

            var edit = $("#" + iframeId)[0].contentWindow.document;

            edit.open();

            //oldhtml = filterXSS(oldhtml, {
            //    stripIgnoreTag: true
            //});

            edit.write(head + "<body>" + oldhtml + "</body>");

            edit.close();

            var iframe = $("#" + iframeId);

            iframe.css("height", ($(edit).height()));
            //iframe.css("height",'100%');

            var that = this;

            var $iframe = $(iframe[0].contentWindow.document);

            if (this.settings.IsBindEvent) {
                //checkbox 点击事件
                $(edit).on("click", ".ico_checkbox,.icoCheckbox", function () {
                    if ($(this).attr("src") == "/Apps/taskcenter/images/ico_checked.gif") {
                        $(this).attr("src", "/Apps/taskcenter/images/ico_unchecked.gif");
                    }
                    else {
                        $(this).attr("src", "/Apps/taskcenter/images/ico_checked.gif");
                    }
                    //存在回调绑定事件
                    if ($.isFunction(that.settings.cbCallback)) {
                        that.settings.cbCallback();
                    }
                    return false;
                }).on("click", "a", function (event) {
                    event.stopPropagation();
                });

                //点击编辑器
                $iframe.on("click", function () {
                    if ($.isFunction(that.settings.ckCallback)) {
                        that.settings.ckCallback();
                    }
                }).on("click", "body", function () {
                    if ($.isFunction(that.settings.ckCallback)) {
                        that.settings.ckCallback();
                    }
                    return false;//阻止冒泡到document
                });

            } else {
                //存在回调绑定事件
                //checkbox 点击事件
                $(edit).on("click", ".ico_checkbox,.icoCheckbox", function () {
                    //存在回调绑定事件
                    if ($.isFunction(that.settings.cbCallback)) {
                        that.settings.cbCallback();
                    }
                    return false;
                });

                //点击编辑器
                $iframe.on("click", function () {
                    if ($.isFunction(that.settings.ckCallback)) {
                        that.settings.ckCallback();
                    }
                }).on("click", "body", function () {
                    if ($.isFunction(that.settings.ckCallback)) {
                        that.settings.ckCallback();
                    }
                    return false;//阻止冒泡到document
                });
            }

            this.settings.$editor_container = $("#" + iframeId);
            this.settings.$editor = $iframe.find("body");
        },
        //渲染编辑器
        renderEditor: function () {
            var lineGap = '<div class="separator"></div>';
            var sb = new StringBuilder();
            //总容器
            sb.Append('<div class="md_editor_container" style="display:none">');
            sb.Append('<div class="mdEditContainerAlert"></div>');
            //toolBar
            sb.Append('<div class="md_editor_toolbar">');

            //字体大小
            if (this.settings.IsFontSize) {
                sb.Append('<div title="' + '字体大小' + '" class="toolbar" data-name="fontSize"><span>大小</span><div class="moreOptions"></div></div>');
                sb.Append('<div class="options" style="display: none"><ul><li size="1" style="font-size: 10px; line-height: 20px; min-height: 20px">10px</li><li size="2" style="font-size: 13px; line-height: 20px; min-height: 20px">13px</li><li size="3" style="font-size: 16px; line-height: 20px; min-height: 20px">16px</li><li size="4" style="font-size: 19px; line-height: 20px; min-height: 20px">19px</li><li size="5" style="font-size: 25px; line-height: 24px; min-height: 24px">25px</li><li size="6" style="font-size: 33px; line-height: 36px; min-height: 36px">33px</li></ul></div>');
            }

            //字体
            if (this.settings.IsFontFamily) {
                sb.Append('<div title="字体" class="toolbar" data-name="fontName"><span>字体</span><div class="moreOptions"></div></div>');
                sb.Append('<div class="options" style="display: none"><ul><li style="font-family: 宋体">宋体</li><li style="font-family: 黑体">黑体</li><li style="font-family: 微软雅黑">微软雅黑</li><li style="font-family: Times New Roman">Times New Roman</li><li style="font-family: Georgia">Georgia</li></ul></div>');
            }

            //工具栏分类 |
            if (this.settings.IsFontSize || this.settings.IsFontFamily) {
                sb.Append(lineGap);
            }

            //是否加粗
            if (this.settings.IsBold) {
                sb.Append('<div class="toolbar" title="' + '粗体' + '" data-name="bold"><div class="bold"></div></div>');
            }

            //是否斜体
            if (this.settings.IsItalics) {
                sb.Append('<div class="toolbar" title="' + "斜体" + '" data-name="italic"><div class="italics"></div></div>');
            }

            //是否下划线
            if (this.settings.IsUnderline) {
                sb.Append('<div class="toolbar" title="' +"下划线" + '" data-name="underline"><div class="underline"></div></div>');
            }

            //字体颜色
            if (this.settings.IsFontColor) {
                sb.Append('<div class="toolbar" title="' +"字体颜色" + '" data-name="fontColor"><div class="color"><div style="background-color: rgb(0, 0, 0); height: 7px; left: 17px; position: absolute;top: 5px; width: 7px;"></div></div></div>');
                sb.Append('<div class="options" style="display: none">');
                sb.Append('<ul><li class="fontColor" style="background-color: rgb(0, 0, 0);"></li><li class="fontColor" style="background-color: rgb(153, 51, 0);"></li><li class="fontColor" style="background-color: rgb(51, 51, 0);"></li><li class="fontColor" style="background-color: rgb(0, 51, 0);"></li><li class="fontColor" style="background-color: rgb(0, 51, 102);"></li><li class="fontColor" style="background-color: rgb(0, 0, 128);"></li><li class="fontColor" style="background-color: rgb(51, 51, 153);"></li><li class="fontColor" style="background-color: rgb(51, 51, 51);"></li></ul>');
                sb.Append('<ul><li class="fontColor" style="background-color: rgb(128, 0, 0);"></li><li class="fontColor" style="background-color: rgb(255, 102, 0);"></li><li class="fontColor" style="background-color: rgb(128, 128, 0);"></li><li class="fontColor" style="background-color: rgb(0, 128, 0);"></li><li class="fontColor" style="background-color: rgb(0, 128, 128);"></li><li class="fontColor" style="background-color: rgb(0, 0, 255);"></li><li class="fontColor" style="background-color: rgb(102, 102, 153);"></li><li class="fontColor" style="background-color: rgb(128, 128, 128);"></li></ul>');
                sb.Append('<ul><li class="fontColor" style="background-color: rgb(255, 0, 0);"></li><li class="fontColor" style="background-color: rgb(255, 102, 0);"></li><li class="fontColor" style="background-color: rgb(153, 204, 0);"></li><li class="fontColor" style="background-color: rgb(51, 153, 102);"></li><li class="fontColor" style="background-color: rgb(51, 204, 204);"></li><li class="fontColor" style="background-color: rgb(51, 102, 255);"></li><li class="fontColor" style="background-color: rgb(128, 0, 128);"></li><li class="fontColor" style="background-color: rgb(153, 153, 153);"></li></ul>');
                sb.Append('<ul><li class="fontColor" style="background-color: rgb(255, 0, 255);"></li><li class="fontColor" style="background-color: rgb(255, 204, 0);"></li><li class="fontColor" style="background-color: rgb(255, 255, 0);"></li><li class="fontColor" style="background-color: rgb(0, 255, 0);"></li><li class="fontColor" style="background-color: rgb(0, 255, 255);"></li><li class="fontColor" style="background-color: rgb(0, 204, 255);"></li><li class="fontColor" style="background-color: rgb(153, 51, 102);"></li><li class="fontColor" style="background-color: rgb(192, 192, 192);"></li></ul>');
                sb.Append('<ul><li class="fontColor" style="background-color: rgb(255, 153, 204);"></li><li class="fontColor" style="background-color: rgb(255, 204, 153);"></li><li class="fontColor" style="background-color: rgb(255, 255, 153);"></li><li class="fontColor" style="background-color: rgb(204, 255, 204);"></li><li class="fontColor" style="background-color: rgb(204, 255, 255);"></li><li class="fontColor" style="background-color: rgb(153, 204, 255);"></li><li class="fontColor" style="background-color: rgb(204, 153, 255);"></li><li class="fontColor" style="background-color: rgb(255, 255, 255);"></li></ul>');
                sb.Append('</div>');
            }

            //分割线
            if (this.settings.IsBold || this.settings.IsItalics || this.settings.IsUnderline || this.settings.IsFontColor) {
                sb.Append(lineGap);
            }

            //插入待办事项
            if (this.settings.IsToDo) {
                sb.Append('<div class="toolbar" title="' + "插入待办事项" + '" data-name="to_do"><div class="to_do"></div></div>');
            }

            //编号列表
            if (this.settings.IsNumberLists) {
                sb.Append('<div class="toolbar" title="' + "编号列表"+ '" data-name="insertorderedlist"><div class="numberLists"></div></div>');
            }

            //插入水平分割线
            if (this.settings.IsHorizontalLine) {
                sb.Append('<div class="toolbar" title="' +"插入水平分割线" + '" data-name="horizontalline"><div class="horizontalline"></div></div>');
            }

            //分割线
            if (this.settings.IsToDo || this.settings.IsNumberLists || this.settings.IsHorizontalLine) {
                sb.Append(lineGap);
            }

            //对齐方式
            if (this.settings.IsAlignment) {
                sb.Append('<div class="toolbar" title="' + "对齐方式" + '"><div class="alignment" style="float: left"></div><div class="moreOptions\"></div></div>');
                sb.Append('<div class="options" style="display: none"><ul><li title="左对齐" class="alignmentLeft" data-name="justifyleft"></li><li title="居中对齐" class="alignmentCenter" data-name="justifycenter"></li><li title="右对齐" class="alignmentRight" data-name="justifyright"></li></ul></div>');
                sb.Append('<div class="separator"></div>');
            }

            //清除格式
            if (this.settings.IsClearFormat) {
                sb.Append('<div class="toolbar" title="' + "清除格式"+ '" data-name="removeformat"><div class="clearremoveformat"></div></div>');
            }

            //添加链接
            if (this.settings.IsHyperlinks) {
                sb.Append('<div class="toolbar" title="' + "添加链接"+ '" data-name="createLink"><div class="createLink"></div></div>');
            }

            //全屏
            if (this.settings.IsFullScreen) {
                sb.Append('<div class="toolbar" title="' + "全屏" + '" style="float:right;margin-right:10px"><div >'+this.settings.EditorTitle+'</div></div>');
            }

            sb.Append('</div>');

            //编辑器内容 必须动态创建 因为是 document 对象 html 加载不了
            sb.Append('<div class="md_editor_content"><iframe frameborder="0" class="md_editor_iframe">');
            sb.Append('</iframe></div>');

            //sb.Append('<div class="md_editor_statusbar"><span class="md_statusbar_centericon"></span></div>');
            //sb.Append('</div>');
            //创建html 隐藏当前元素
            if (this.settings.$target != null) {
                this.settings.$target.before(sb.toString());
                //容器
                this.settings.$editor_container = this.settings.$target.prev();
            } else {
                this.settings.$el.before(sb.toString());
                //容器
                this.settings.$editor_container = this.settings.$el.prev();
            }

            this.settings.$el.hide();

            //创建编辑器可输入对象
            var head = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>www.mingdao.com</title>';
            head += '<style type="text/css">';
            head += "body{ font-family:Helvetica Neue,Tahoma,Arial,'微软雅黑','宋体','黑体';font-size:13px;line-height:18px;padding:0; margin:10px;min-height:130px;word-break:break-all;} .ico_checkbox,.icoCheckbox{cursor:pointer;height:12px}";
            head += '</style><base target="_blank" /></head></html>';
            //工具栏
            this.settings.$editor_toolbar = this.settings.$editor_container.find(".md_editor_toolbar");
            //编辑器内容
            this.settings.$editor_content = this.settings.$editor_container.find(".md_editor_content");
            //写入内容
            this.settings.editor_iframe = this.settings.$editor_container.find(".md_editor_iframe")[0].contentWindow.document;
            this.settings.editor_iframe.designMode = "on";
            this.settings.editor_iframe.contentEditable = true;
            this.settings.editor_iframe.open();
            this.settings.editor_iframe.write(head + "<body></body>");
            this.settings.editor_iframe.close();
            this.settings.$editor = $(this.settings.editor_iframe).find("body");
            this.settings.$editor_tootal = this.settings.$editor_container.find(".md_editor_toolbar");

            if (this.settings.IsGetLocalStorage) {
                var val = this.utils.getLocalStorage(this.settings.$el.attr("id"));
                //val = filterXSS(val, {
                //    stripIgnoreTag: true
                //});
                if (val) {
                    this.settings.$editor.html(val);
                } else {
                    if (isInput(this.settings.$el)) {
                        val = this.settings.$el.val();
                        //val = filterXSS(val, {
                        //    stripIgnoreTag: true
                        //});
                        this.settings.$editor.html(val);
                    } else {
                        val = this.settings.$el.html();
                        //val = filterXSS(val, {
                        //    stripIgnoreTag: true
                        //});
                        this.settings.$editor.html(val);
                    }
                }
            } else {
                if (isInput(this.settings.$el)) {
                    var val = this.settings.$el.val();
                    //val = filterXSS(val, {
                    //    stripIgnoreTag: true
                    //});
                    this.settings.$editor.html(val);
                } else {
                    var val = this.settings.$el.html();
                    //val = filterXSS(val, {
                    //    stripIgnoreTag: true
                    //});
                    this.settings.$editor.html(val);
                }
            }
            //事件绑定
            this.bindEvent();
            this.settings.$editor_container.fadeIn(1000);
        },
        //初始化checkbox的单机事件， set执行checkbox选中变更后执行的方法
        initIcoCheckboxEvent: function (target, callback) {
            $(target).find(".ico_checkbox,.icoCheckbox").off().on("click", function () {
                if ($(this).attr("src") == "/Apps/taskcenter/images/ico_checked.gif") {
                    $(this).attr("src", "/Apps/taskcenter/images/ico_unchecked.gif");
                }
                else {
                    $(this).attr("src", "/Apps/taskcenter/images/ico_checked.gif");
                }
                if ($.isFunction(callback)) {
                    callback();
                    return false;
                }
            })
        },
        //全屏
        fullScreen: function () {
            if (this.settings.$editor_container.hasClass("md_editor_container_fullscreen md_editor_container_moderatescreen")) {
                this.settings.$editor_container.attr("style", this.settings.$editor_container.data("style")).removeClass("md_editor_container_fullscreen");
                $(".mdEditContainer .mdToolbar .toolbar[data-name='fullScreen']").css("display", "inline");
                this.settings.$editor_content.attr("style", this.settings.$editor_content.data("style"));
            }
            else {
                this.settings.$editor_container.data("style", this.settings.$editor_container.attr("style")).removeAttr("style").addClass("md_editor_container_moderatescreen");
                this.settings.$editor_tootal.find("[data-name='fullScreen']").hide()
                var lockScreenHtml = "";
                lockScreenHtml += '<div class="md_editor_title">';
                lockScreenHtml += '<div class="fullScreenMenu">';
                lockScreenHtml += '<div style="float:left;padding-left:5px"><span class="titleBarIco ThemeBGColor3 TxtMiddle"></span><span  class="titleBarWord Font18 TxtMiddle">任务描述</span></div>';
                lockScreenHtml += '<div style="float:right;"><a href="javascript:void(0)" class="closeFullScreen" title="关闭">x</a><a href="javascript:void(0)" title="最大化" class="changeEditorSize"></a></div>';
                lockScreenHtml += '</div>';
                if (this.settings.IsFullScreen && this.settings.IsFullScreenOper) {
                    lockScreenHtml += '<div class="operationContent"><span class="save">保存</span><span class="cancel">取消</span><span class="alertTitleName">' + this.settings.Title + '</span><span class="editorTaskNamePrompt">' + this.settings.Source + '：</span></div>';
                }
                this.settings.$editor_container.before('<div class="md_editor_lockscreen"></div>').prepend(lockScreenHtml);
                this.settings.$editor_content.data("style", this.settings.$editor_content.attr("style")).css("height", "100%");
                this.initFullScreenEvent();
                var that = this;
                if (this.settings.IsFullScreen && this.settings.IsFullScreenOper) {
                    //取消
                    this.settings.$editor_container.find(".operationContent .cancel").off().on("click", function () {
                        that.settings.$editor_container.find(".closeFullScreen").click();
                        that.settings.Cancel();
                    });
                    //保存
                    this.settings.$editor_container.find(".operationContent .save").off().on("click", function () {
                        that.settings.Save();
                        that.settings.$editor_container.prev(".md_editor_lockscreen").fadeOut(500);
                    });
                }
            }
        },
        //初始化全屏事件
        initFullScreenEvent: function () {
            var that = this;
            //关闭
            this.settings.$editor_container.find(".closeFullScreen").off().on("click", function () {
                that.settings.$editor_container.attr("style", that.settings.$editor_container.data("style")).removeClass("md_editor_container_fullscreen md_editor_container_moderatescreen");
                that.settings.$editor_container.find(".md_editor_title").remove();
                that.settings.$editor_tootal.find("[data-name='fullScreen']").fadeIn(1000);
                that.settings.$editor_container.prev(".md_editor_lockscreen").remove();
                that.settings.$editor_content.attr("style", that.settings.$editor_content.data("style"));
            })
            //大小切换
            $(this.settings.$editor_container).find(".changeEditorSize").off().on("click", function () {
                if (that.settings.$editor_container.hasClass("md_editor_container_fullscreen")) {
                    //居中显示
                    that.settings.$editor_container.removeClass("md_editor_container_fullscreen").addClass("md_editor_container_moderatescreen");
                    $(document.body).attr("style", $(document.body).data("style"));
                    that.settings.$editor_container.find(".changeEditorSize").attr("title", "最大化").css("background-image", "url('/Apps/taskcenter/images/maximize.png')");
                }
                else {
                    //全屏显示
                    that.settings.$editor_container.removeClass("md_editor_container_moderatescreen").addClass("md_editor_container_fullscreen");
                    that.settings.$editor_container.find(".changeEditorSize").attr("title", "还原").css("background-image", "url('/Apps/taskcenter/images/moderate.png')");
                }
            });
        },
        //绑定事件
        bindEvent: function () {
            var that = this;
            //更多选项绑定
            this.settings.$editor_tootal.find(".options ul li").on("click", function () {
                that.clickToolbar(this);
                return false;
            });

            //设置工具栏点击事件
            this.settings.$editor_tootal.find(".toolbar").on("click", function () {
                that.settings.$editor_tootal.find(".options").fadeOut("1500");
                $(this).next().fadeIn("1500");
                if ($(this).next().attr("class") == "options") {
                    $(this).next().css("left", $(this).position().left + "px");
                    $(this).next().mouseleave(function () {
                        that.settings.$editor_tootal.find(".options").fadeOut("slow");
                    });
                }
            });
            //设置所有拥有data-name属性的元素
            that.settings.$editor_tootal.find("[data-name]").on("click", function () {
                if ($(this).next().hasClass("options")) {
                    return;
                }
                that.clickToolbar(this);
            });
            //阻止超出编辑器的冒泡事件
            that.settings.$editor_container.on("click", function () { return false; });


            if (that.settings.IsDrag) {
                that.settings.$editor_container.find(".md_statusbar_centericon").on("mousedown.md_editor_event", function (e) {
                    $(that.settings.editor_iframe).off("mousemove.md_editor_event").on("mousemove.md_editor_event", function (event) {
                        that.utils.move(event, that.settings.$editor_content, false);
                    });
                    $(document).off("mousemove.md_editor_event").on("mousemove.md_editor_event", function (event) {
                        that.utils.move(event, that.settings.$editor_content, true);
                    });

                    $(that.settings.editor_iframe).off("mouseup.md_editor_event click.md_editor_event").on("mouseup.md_editor_event click.md_editor_event", function () {
                        $(document).off("mousemove.md_editor_event mouseup.md_editor_event mouseup.md_editor_event click.md_editor_event");
                        $(that.settings.editor_iframe).off("mousemove.md_editor_event mouseup.md_editor_event mouseup.md_editor_event click.md_editor_event");
                    });
                    $(document).off("mouseup.md_editor_event click.md_editor_event").on("mouseup.md_editor_event click.md_editor_event", function () {
                        $(that.settings.editor_iframe).off("mousemove.md_editor_event mouseup.md_editor_event mouseup.md_editor_event click.md_editor_event");
                        $(document).off("mousemove.md_editor_event mouseup.md_editor_event mouseup.md_editor_event click.md_editor_event");
                    });
                });
            }
            //绑定获取焦点事件
            if ($.isFunction(that.settings.OnFocus)) {
                that.settings.$editor.on("focus", function () {
                    that.settings.OnFocus();
                });
            }
            //绑定焦点离开事件
            if ($.isFunction(that.settings.OnBlur)) {
                that.settings.$editor.on("blur", function () {
                    that.settings.OnBlur();
                });
            }
            //编辑器输入事件
            this.settings.$editor.on("keydown.md_editor_event", function (e) {
                //if (!(that.settings.$editor_container.hasClass("md_editor_container_moderatescreen") || that.settings.$editor_container.hasClass("md_editor_container_fullscreen"))) {
                //    var height;
                //    height = that.settings.$editor.height() + 40;
                //    that.settings.$editor_content.stop().animate({ height: height }, 1000);
                //}
                //else {
                var parentHeight = $(that.settings.$editor_content).parent().height();
                var toolBarHeight =  $(that.settings.$editor_content).prev().height();
                that.settings.$editor_content.css("height", parentHeight-toolBarHeight-5);
                //}
            });
            //编辑器输入事件
            if ($.isFunction(that.settings.OnKeydown)) {
                that.settings.$editor.on("keydown", function () {
                    that.settings.OnKeydown();
                });
            }
            //绑定自动保存事件
            if (that.settings.IsAutoSave) {
                that.settings.AutoSaveTimer = setInterval(function () {
                    //绑定元素存在 移除则不再自动保存
                    if (that.settings.$el.parents("body").length > 0) {
                        if (that.settings.$editor.html()) {
                            if (that.settings.AutoSaveType == that.saveTypeEnum.local) {
                                that.utils.saveLocalStorage(escape("mdeditorcontent" + window.location.href + that.settings.$el.attr("id")), that.settings.$editor.html());
                            }
                            else {
                                if ($.isFunction(that.settings.AutoSaveFuncation)) {
                                    that.settings.AutoSaveFuncation();
                                }
                            }
                        }
                    } else {
                        //如果不存在则移除
                        clearInterval(that.settings.AutoSaveTimer);
                    }

                }, parseFloat(that.settings.AutoSaveInterval) * 1000);
            }
            else {
                //that.utils.clearLocalStorage(that.settings.$el.attr("id"));
            }

            this.initIcoCheckboxEvent(that.settings.$editor);

        },
        //点击工具栏事件
        clickToolbar: function (target) {
            //全部隐藏有更多选项
            this.settings.$editor_tootal.find(".options").fadeOut("slow");
            //去命令名称
            var dataname = $(target).closest("div .options").prev().attr("data-name");
            if (!dataname) {
                dataname = $(target).attr("data-name");
            }

            var value = null;
            var line_height;
            switch (dataname) {
                case "fontName":
                    value = $(target).css("font-family");
                    break;
                case "fontSize":
                    value = $(target).attr("size");
                    switch (value) {
                        case "1":
                        case "2":
                            line_height = "18px";
                            break;
                        case "3":
                            line_height = "22px";
                            break;
                        case "4":
                            line_height = "26px";
                            break;
                        case "5":
                            line_height = "32px";
                            break;
                        case "6":
                            line_height = "42px";
                            break;
                    }
                    //执行命令
                    this.utils.nativeCommand(this.settings.editor_iframe, dataname, value);
                    //检查选中对象的“起点”父元素是否符合要求
                    if (this.settings.editor_iframe.getSelection().anchorNode.parentNode.nodeName.toUpperCase() == "FONT") {//如果当前选中项的父元素的标签是FONT
                        if ($("font", this.settings.editor_iframe.getSelection().anchorNode.parentNode).length > 0) { //如果该元素的父元素之中还有多个FONT标签
                            $(this.settings.editor_iframe.getSelection().anchorNode.nextElementSibling).css("line-height", line_height); //设置该元素的下一个兄弟元素的属性
                        }
                        else { //如果该元素的父元素中没有其他的FONT对象了
                            $(this.settings.editor_iframe.getSelection().anchorNode.parentNode).css("line-height", line_height);
                        }
                    }
                    else {
                        if ("BODY" == this.settings.editor_iframe.getSelection().anchorNode.parentNode.nodeName.toUpperCase()) { //如果选择 的内容为body下的第一个子元素
                            $(this.settings.editor_iframe.getSelection().anchorNode).css("line-height", line_height);
                        }
                        else {
                            if ("HTML-TITLE-STYLE".lastIndexOf(this.settings.editor_iframe.getSelection().anchorNode.parentNode.nodeName.toUpperCase()) != -1) {//如果选择的内容超过了body
                                $("body", this.settings.editor_iframe.getSelection().anchorNode.parentNode).find("font:first").css("line-height", line_height); //获取body对象内的第一个FONT
                            }
                            else { //如果该元素的父元素是在BODY内，但不是FONT

                                //检查选中对象的“结束点”父元素是否符合要求
                                if (this.settings.editor_iframe.getSelection().focusNode.parentNode.nodeName.toUpperCase() == "FONT") {//如果当前选中项的“结束点”的父元素是FONT
                                    if ($("font", this.settings.editor_iframe.getSelection().focusNode.parentNode).length > 0) { //如果该元素的父元素之中还有多个FONT标签
                                        $(this.settings.editor_iframe.getSelection().focusNode.nextElementSibling).css("line-height", line_height); //设置该元素的下一个兄弟元素的属性
                                    }
                                    else { //如果该元素的父元素中没有其他的FONT对象了
                                        $(this.settings.editor_iframe.getSelection().focusNode.parentNode).css("line-height", line_height);
                                    }
                                }
                                else {
                                    //测试时加上调试BUG，正式可以删除
                                    console.log(this.settings.editor_iframe.getSelection().focusNode.parentNode.nodeName.toUpperCase() + "|" + this.settings.editor_iframe.getSelection().focusNode.parentNode.innerHTML + "|" + this.settings.editor_iframe.getSelection().anchorNode.parentNode.nodeName.toUpperCase() + "|" + this.settings.editor_iframe.getSelection().anchorNode.parentNode.innerHTML);
                                }
                            }
                        }
                    }
                    return;
                case "fontColor":
                    value = $(target).css("background-color");
                    value = this.utils.fixColor("color", value);
                    dataname = "ForeColor";
                    break;
                case "createLink":
                    value = prompt("请输入URL", "http://");
                    break;
                case "unlink":
                    value = null;
                    break;
                case "insertImage":
                    break;
                case "horizontalline":
                    dataname = "insertHTML";
                    value = "<hr>";
                    break;
                case "to_do":
                    dataname = "insertHTML";
                    value = '<input type="image" src="/Apps/taskcenter/images/ico_unchecked.gif" class="ico_checkbox">';
                    this.utils.nativeCommand(this.settings.editor_iframe, dataname, value);
                    this.initIcoCheckboxEvent(this.settings.$editor);
                    return;
                case "insertHTML":
                    break;
                case "fullScreen":
                    this.fullScreen();
                    return;
                default:
                    console.log("没有适配到data-name");
                    break;
            }
            this.utils.nativeCommand(this.settings.editor_iframe, dataname, value);
        },
        utils:
        {
            //移动  calculation是否计算  区别鼠标实在编辑器iframe内还是在父页面
            move: function (event, doc, calculation) {
                var mousex = 0, mousey = 0;
                mousey = event.pageY;
                mousex = event.pageX;
                var height = mousey;
                if (calculation) {
                    height = parseInt(mousey) - parseInt($(doc).offset().top);
                }
                if (height > 150) {
                    $(doc).stop().animate({ height: height }, 500);
                }
            },
            //执行命令
            nativeCommand: function (doc, dataname, value) {
                if (dataname) {
                    if (!doc.execCommand(dataname, false, value)) {
                        console.log("执行execCommand命令失败" + dataname + "|", value);
                    }
                }
            },
            //把rgb格式的颜色值转换成16进制格式
            fixColor: function (name, value) {
                if (/color/i.test(name) && /rgba?/.test(value)) {
                    var array = value.split(",");
                    if (array.length > 3)
                        return "";
                    value = "#";
                    for (var i = 0, color; color = array[i++];) {
                        color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
                        value += color.length == 1 ? "0" + color : color;
                    }
                    value = value.toUpperCase();
                }
                return value;
            },
            //保存内容到本地localStorage
            saveLocalStorage: function (key, value) {
                var storageObj = window.localStorage;
                if (storageObj) {
                    storageObj.removeItem(key);
                    storageObj.setItem(key, value);
                }
                else {
                    console.log("当前浏览器不支持本地localStorage存储")
                }
            },
            //清除该对象的本地存储
            clearLocalStorage: function (id, command) {
                console.log("清除本地存储|" + id + "|" + command);
                //id用来匹配该URL本页面页面，不同对象的的本地存储
                if (command && command.toUpperCase() == "ALL") {
                    for (var i = 0; i < window.localStorage.length; i++) {
                        var key = window.localStorage.key(i);
                        if (key.length > 15 && (key.substring(0, 15) == "mdeditorcontent")) {
                            window.localStorage.removeItem(key);
                        }
                    }
                }
                else {
                    window.localStorage.removeItem(escape("mdeditorcontent" + window.location.href + id));
                }
            },
            //获取本地存储历史数据
            getLocalStorage: function (id) {
                var value = window.localStorage.getItem(escape("mdeditorcontent" + window.location.href + id));
                if (value) {
                    return value;
                }
                else {
                    return "";
                }
            }
        }
    });


    //封装StringBuilder
    function StringBuilder() { this._string_ = new Array(); }
    StringBuilder.prototype.Append = function (str) { this._string_.push(str); }
    StringBuilder.prototype.toString = function () { return this._string_.join(""); }
    StringBuilder.prototype.AppendFormat = function () {
        if (arguments.length > 1) {
            var TString = arguments[0];
            if (arguments[1] instanceof Array) {
                for (var i = 0, iLen = arguments[1].length; i < iLen; i++) {
                    var jIndex = i;
                    var re = eval("/\\{" + jIndex + "\\}/g;");
                    TString = TString.replace(re, arguments[1][i]);
                }
            } else {
                for (var i = 1, iLen = arguments.length; i < iLen; i++) {
                    var jIndex = i - 1;
                    var re = eval("/\\{" + jIndex + "\\}/g;");
                    TString = TString.replace(re, arguments[i]);
                }
            }
            this.Append(TString);
        } else if (arguments.length == 1) {
            this.Append(arguments[0]);
        }
    };
    function isInput($ele) {
        var isInput = false;
        if ($ele[0].tagName == "TEXTAREA" || $ele[0].tagName == "INPUT") {
            isInput = true;
        }
        return isInput;
    }

})(jQuery);