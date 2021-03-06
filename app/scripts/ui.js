// In here shall go all UI related modules that contain directives
// Directives are a way of manipulating the DOM or how the angular developers
// put it, "it's a way to teach HTML some new tricks".
//
// Basically by registering a directive you are then able to set the attribute
// of a tag to a directive defined here and then you will be able to interact
// with it.
// To learn more see: http://docs.angularjs.org/guide/directive
angular.module('submissionUI', []).
  // XXX this needs some major refactoring.
  directive('fileUpload', function(){

    // The purpose of this directive is to register the jquery-fileupload
    // plugin

    return {

      templateUrl: 'views/widgets/fileupload.html',

      scope: {
        // This tells to create a two way data binding with what is passed
        // inside of the element attributes (ex. file-upload="someModel")
        submission_gus: '=href',
        uploadedFiles: '=src'
      },

      link: function(scope, element, attrs) {
        function add(e, data) {
          for (var file in data.files) {
            var file_info,
              file_id = scope.uploadedFiles.length + file;

            file_info = {'name': data.files[file].name,
              'filesize': data.files[file].size,
              'error': 'None',
              'type': data.files[file].type,
              'last_modified_date': data.files[file].lastModifiedDate,
              'file_id': file_id
            };
          }
          data.submit();
        };

        function progressMeter(e, data) {
          var progress_percent = parseInt(data.loaded / data.total * 100, 10);
          console.log(e);
          $(element[0]).find('.progress .bar').css('width', progress_percent + '%');
        };

        function done(e, data) {
          var file_info = data.result[0],
            textStatus = data.textStatus,
            item_id;

          scope.uploadedFiles.push(file_info);
          scope.$digest();

        };

        $(element[0]).fileupload({progress: progressMeter,
          progressall: progressMeter, add: add, done: done});
      }
    }
}).
  directive('latenzaBox', ['$timeout', function($timeout){
    return function(scope, element, attrs) {
      // This directive serves for making our latenza box work.
      //
      // Basically you are able to set the loading variable in
      // global scope to either true or false. When it is set
      // to true the loading box will be displayed and a
      // message containing some trivia on whistleblowing will
      // be displayed.
      //
      // Basically you must just do as follows:
      // $scope.loading = true (if loading is in progress)
      // $scope.loading = false (if loading has completed)
      //
      // XXX in future there may acutally be a cleaner way of
      // doing this.

      $timeout(function(){
        // XXX this is a hack to avoid calling the watch while
        // there is an apply in progress. Basically $timeout will
        // execute what is contained in the function when
        // everything that needs to happen in a digest cycle has
        // happened. This was the solution that people interested
        // in doing things like this have reached. See:
        // http://stackoverflow.com/questions/11135864/scope-watch-is-not-updating-value-fetched-from-resource-on-custom-directive
        // http://jsfiddle.net/jtowell/j8hnr/
        // https://github.com/angular/angular.js/issues/1250
        scope.$watch('loading', function() {
            if (scope.loading === true) {
              element.modal('show');
            } else if (scope.loading === false){
              element.modal('hide');
            } else {
              element.modal('show');
            }
          }, true);
      });

    }

}]).
  directive('bsPopover', function(){
      return function(scope, element, attrs) {
        // We watch to see when the bsPopover attribute is sets
        scope.$watch(attrs.bsPopover, function(value){
          if (attrs.bsPopover) {
            element.popover({'title': attrs.bsPopover});
            scope.$destroy();
          }
        });
      };
}).
  directive('holder', function(){
      return function(scope, element, attrs) {
        var size = attrs.holder;
        Holder.run();
      };
});

