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

    $('#ShareEditor').Editor({EditorTitle:'共享笔记'});
    var calcSharedBoxHeight = function () {
        var windowHeight = $(this).height();
        var sharedTopHeight = $('#SharedTop').height();
        $('#SharedBox').height(windowHeight-sharedTopHeight-TopBarHeight);
        $('#SharedBox .md_editor_container').height(windowHeight-sharedTopHeight-TopBarHeight);
    }();
    $('#DraftEditor').Editor({EditorTitle:'我的笔记'});
    var calMyDraftBoxHeight = function () {
        var windowHeight = $(this).height();
        var tasksHeight =$('#TaskContainer').height();
        $('#MyDraftBox').height(windowHeight-tasksHeight-TopBarHeight);
        $('#MyDraftBox .md_editor_container').height(windowHeight-tasksHeight-TopBarHeight);
    }();


    $(window).resize(function () {
        resizeRestHeightDivs();
    });
    $('#logo').on('click', function () {
       window.location= 'http://mingdao.com';
    });


});