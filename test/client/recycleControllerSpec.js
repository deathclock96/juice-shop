describe('controllers', function () {
  var scope, controller, $httpBackend

  beforeEach(module('juiceShop'))
  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend')
    $httpBackend.whenGET(/\/i18n\/.*\.json/).respond(200, {})
  }))

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  })

  describe('RecycleController', function () {
    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new()
      controller = $controller('RecycleController', {
        '$scope': scope
      })
    }))

    it('should be defined', inject(function () {
      $httpBackend.whenGET('/rest/user/whoami').respond(200, {user: {}})

      $httpBackend.flush()

      expect(controller).toBeDefined()
    }))

    it('should hold the user id of the currently logged in user', inject(function () {
      $httpBackend.whenGET('/rest/user/whoami').respond(200, {user: {id: 42}})

      $httpBackend.flush()

      expect(scope.recycle.UserId).toBe(42)
    }))

    it('should hold no email if current user is not logged in', inject(function () {
      $httpBackend.whenGET('/rest/user/whoami').respond(200, {user: {}})

      $httpBackend.flush()

      expect(scope.userEmail).toBeUndefined()
    }))

    it('should hold the user email of the currently logged in user', inject(function () {
      $httpBackend.whenGET('/rest/user/whoami').respond(200, {user: {email: 'x@x.xx'}})

      $httpBackend.flush()

      expect(scope.userEmail).toBe('x@x.xx')
    }))

    it('should display pickup message and reset recycle form on saving', inject(function () {
      $httpBackend.whenGET('/rest/user/whoami').respond(200, {user: {}})

      $httpBackend.whenPOST('/api/Recycles/').respond(200, {data: {isPickup: true, pickupDate: '2017-05-23'}})
      scope.recycle = {isPickup: true, pickupDate: '2017-05-23'}
      scope.form = {$setPristine: function () {}}

      scope.save()
      $httpBackend.flush()

      expect(scope.recycle).toEqual({})
      expect(scope.confirmation).toBe('Thank you for using our recycling service. We will pick up your pomace on 2017-05-23.')
    }))

    it('should display box delivery message and reset recycle form on saving', inject(function () {
      $httpBackend.whenGET('/rest/user/whoami').respond(200, {user: {}})

      $httpBackend.whenPOST('/api/Recycles/').respond(200, {data: {isPickup: false}})
      scope.recycle = {isPickup: false}
      scope.form = {$setPristine: function () {}}

      scope.save()
      $httpBackend.flush()

      expect(scope.recycle).toEqual({})
      expect(scope.confirmation).toBe('Thank you for using our recycling service. We will deliver your recycle box asap.')
    }))
  })
})