/**
 * #PACKAGE: answer
 * #MODULE: topic-answer
 */
/**
 * @license Copyright (c) 2016 CT1905
 * Created by Nguyen Ba Chi Cong<nbchicong@gmail.com>
 *         on 20/04/2016.
 * -------------------------------------------
 * @project base-ui
 * @author nbchicong
 */
$(function () {
    var i;
    var colorLog = 'color: #009800';
    var licenseText = '@license ';
    var copyText = 'Copyright (c) ';
    var orgText = ' CT1905';
    var createdText = 'Created by ';
    var authorText = 'Chi Cong Nguyen(nbchicong@gmail.com)';
    var currentYear = new Date().getFullYear();
    var htmlDoc = 'html';
    var scriptTag = 'script';
    var wrapper = '#wrapper';
    var button = '#btn_nopbai';
    var searchJqDocument = '$(document)';
    var searchBeginAnswerScript = 'var _answer="';
    var searchBeginAnswerScriptSpace = 'var _answer =';
    var searchEndAnswerScript = '";';
    var breakEscape = unescape || function () {};
    var delayTime = setTimeout || function () {};
    var getLength = function (str) {
        return (str && str.length) || 0;
    };
    var getTextHtml = function ($el) {
        return $el.text();
    };
    var getJqDocumentScriptTag = function ($listScript) {
        for (i = 0; i < getLength($listScript); i++) {
            if (getTextHtml($($listScript[i])).indexOf(searchJqDocument) != -1) {
                return $($listScript[i]);
            }
        }
    };
    var checkAndReplaceStartIndex = function (start, text) {
        if (start == -1)
            return text.indexOf(searchBeginAnswerScriptSpace);
        return start;
    };
    var getInputAnswer = function (value) {
        return 'input[value="' + value + '"]';
    };
    var $script = $(htmlDoc).find(scriptTag);
    var $found = getJqDocumentScriptTag($script);
    var foundText = getTextHtml($found);
    var start = foundText.indexOf(searchBeginAnswerScript);
    var end = foundText.indexOf(searchEndAnswerScript);
    var txtAnswer = foundText.substr(checkAndReplaceStartIndex(start, foundText), (end-checkAndReplaceStartIndex(start, foundText)));
    var tmpAns = txtAnswer.split('=')[1];
    var ans = breakEscape(tmpAns.trim().substr(1, tmpAns.length)).split(',');
    var $wrap = $(wrapper);
    var count = 0;
    var delay = 1000 * 60 * (getLength(ans)-5);
    for (i = 0; i < ans.length - 1; i++) {
        var $input = $wrap.find(getInputAnswer(ans[i]));
        if ($input[0] != undefined) {
            $input[0].checked = true;
        } else {
            count++;
            console.log('%cNot found answer value: ' + ans[i], '#E41515');
        }
    }
    if (count > 0) {
        console.log('%cNot choose ' + count + ' questions', '#E41515');
    }
    delayTime(function () {
        $(button).click();
    }, delay);
    console.log('%c' + licenseText + copyText + currentYear + orgText, colorLog);
    console.log('%c' + createdText + authorText, colorLog);
    return '';
});