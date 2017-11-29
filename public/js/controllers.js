var ctrl = angular.module('controllers', ['directives']);

  var socket = io();

ctrl.controller('indexController', function($scope) {
  new autoComplete({
        selector: 'input[id="input"]',
        minChars: 2,
        source: function(term, suggest){
            term = term.toLowerCase();
            var choices = commands;
            var matches = [];
            for (i=0; i<choices.length; i++)
                if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
            suggest(matches);
        }
    });

  $scope.sendCommand = function() {
    if ($scope.command != "") {
        socket.emit("input", $scope.command + "\n");
        $('#input').hide();
        $('#terminal').append("<div class='btn btn-primary btn-block btn-ghost'>" + $('#input').val() + "</div>");
        $('#input').val("");
    }
  }

  socket.on('output', function(output) {
    output = output.replace("\n", "<br>");
    output = output.replace("\r", "<br>");
    $('#terminal').append("<pre class='white'>" + output + "</pre>");
    $('#input').show().detach().appendTo('#terminal:last-child');
    $('#input').focus();
  });

  socket.on('error', function(error) {
    error = output.replace("\n", "<br>");
    error = output.replace("\r", "<br>");
    $('#terminal').append("<pre class='red'>" + error + "</pre>");
    $('#input').show().detach().appendTo('#terminal:last-child');
    $('#input').focus();
  });

  socket.on('ps-err', function(pserr) {
    pserr = output.replace("\n", "<br>");
    pserr = output.replace("\r", "<br>");
    $('#terminal').append("<pre class='red'>" + pserr + "</pre>");
    $('#input').show().detach().appendTo('#terminal:last-child');
    $('#input').focus();
  });
});

ctrl.controller('ideController', function($scope) {
  var langTools = ace.require("ace/ext/language_tools")
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/pastel_on_dark");
  editor.getSession().setMode("ace/mode/powershell");
  editor.setOptions({enableBasicAutocompletion: true});
  var customCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
      callback(null, commands.map(function (key) {
        return { name: key, value: key, score: "1", meta: key }
      }));
    }
  };
  langTools.addCompleter(customCompleter);

  $('#run').click(function() {
    $('#modalstuff').empty();
    socket.emit("input", editor.getValue() + "\n");
  });

  socket.on('output', function(output) {
    output = output.replace("\n", "<br>");
    output = output.replace("\r", "<br>");
    $('#modalstuff').append("<pre class='white'>" + output + "</pre>");
    $('#modal').show();
  });

  socket.on('error', function(error) {
    error = output.replace("\n", "<br>");
    error = output.replace("\r", "<br>");
    $('#modalstuff').append("<pre class='red'>" + error + "</pre>");
    $('#modal').show();
  });

  socket.on('ps-err', function(pserr) {
    pserr = output.replace("\n", "<br>");
    pserr = output.replace("\r", "<br>");
    $('#modalstuff').append("<pre class='red'>" + pserr + "</pre>");
    $('#modal').show();
  });

  $('body').click(function() {
    $('#modal').hide();
  });

  $('.close').click(function() {
    $('#modal').hide();
  });
});