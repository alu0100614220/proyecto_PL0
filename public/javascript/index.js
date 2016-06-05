let editor = ace.edit("textArea");
editor.setTheme("ace/theme/cobalt");
editor.getSession().setMode("ace/mode/javascript");
editor.setShowPrintMargin(true);
editor.session.setUseWorker(false);

document.getElementById('textArea').style.fontSize = '16px';
function loadFile(fileName) {
    $.ajax({
        url: fileName,
        dataType: "text",
        success: function(data) {
            editor.session.setValue(data);

            if (window.localStorage) {
                localStorage.original = data;
            }
        }
    });
};

$(document).ready(function() {
    if (window.localStorage.original) {
        editor.session.setValue(localStorage.original);
    }
    $('#parseButton').click(function() {

        if (window.localStorage) {
            localStorage.original = editor.getValue();
        }

        try {
            let myVar = editor.getValue();
            let result = pl0.parse(myVar);
            semantic(result);
            $('#exit').html(JSON.stringify(result, undefined, 2));
        } catch (e) {
            console.log(e)
            $('#exit').html('<div class="error"><pre>\n' + JSON.stringify(e, null, 4) + '\n</pre></div>');
        }
    });
});
