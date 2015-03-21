'use strict';

describe('Controller: InterestCtrl', function () {

  // load the controller's module
  beforeEach(module('hack4CongressApp'));

  var InterestCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InterestCtrl = $controller('InterestCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
