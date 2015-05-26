/**
 * handle the page damn effect
 * */


$(function () {
    var TopBarHeight = $('#TopBar').height();

    var resizeRestHeightDivs = function () {
        var h = $(this).height() - TopBarHeight;
        $('.rh').height(h);
    };
    resizeRestHeightDivs();

    var calcRightEditor = function () {
        var windowWidth = $(this).width();
        var leftMenuWidth = $('#LeftMenu').width();
        var leftEditorWidth = $('#LeftEditor').width();
        var $vtBar = $('#Vtbar');
        var verticalBarWidth = $vtBar.width();
        $('#RightEditor').width(windowWidth - leftMenuWidth - leftEditorWidth - verticalBarWidth - 8);

        $vtBar.css('left', $('#LeftEditor').position().left + leftEditorWidth + 4);
    }();


    var calcSharedEditorHeight = function () {
        var windowHeight = $(this).height();
        var sharedTopHeight = $('#SharedTop').height();
    }();

    $('#ShareEditor').Editor({EditorTitle: '共享笔记'});
    var calcSharedBoxHeight = function () {
        var windowHeight = $(this).height();
        var sharedTopHeight = $('#SharedTop').height();
        $('#SharedBox').height(windowHeight - sharedTopHeight - TopBarHeight);
        $('#SharedBox .md_editor_container').height(windowHeight - sharedTopHeight - TopBarHeight);
    }();
    $('#DraftEditor').Editor({EditorTitle: '我的笔记'});
    var calMyDraftBoxHeight = function () {
        var windowHeight = $(this).height();
        var tasksHeight = $('#TaskContainer').height();
        $('#MyDraftBox').height(windowHeight - tasksHeight - TopBarHeight);
        $('#MyDraftBox .md_editor_container').height(windowHeight - tasksHeight - TopBarHeight);
    }();


    $(window).resize(function () {
        resizeRestHeightDivs();
    });
    $('#logo').on('click', function () {
        window.location = 'http://mingdao.com';
    });

    $('#createBtn').on('click', function () {
        var dlg = new CreateDialog();
    });
});


var CreateDialog = function () {
    var _this = this;
     this.popDlg= $('#createDlg').bPopup({
       // modalClose: false,
        easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 450,
        transition: 'slideDown'
    });
    FetchCalendars(null, function (calendars) {
        var html = '';
        for (var i = 0; i < calendars.length; i++) {
            var cal = calendars[i];
            html+='<li data-id="'+cal.id+'"><span>'+cal.title+'</span></li>';
        }
        $('#dlgContainer .dlgBody ul').empty().append(html);
        $('#dlgContainer .dlgBody ul li').on('click', function () {
            var calendarid =  $(this).data('id');
            G.socket.InitNote(calendarid, function (isSuccess) {
                alert('isSuccess='+isSuccess);
            });
            _this.popDlg.close();
        })
    });
};



