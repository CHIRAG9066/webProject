var app = angular.module('eventApp', []);

// Landing

app.controller('MainController', ['$scope', function($scope) {
    $scope.loginUser = function(event) {
      event.preventDefault();
      // Add your login logic here
      window.location.href = "login.html";
    };
  
    $scope.registerUser = function(event) {
      event.preventDefault();
      // Add your register logic here
      window.location.href = "register.html";
    };
  }]);

// Register/Login
app.controller('AuthController', function($scope, $http) {
  $scope.user = {};
  $scope.error = "";

  $scope.register = function () {
    $http.post('http://localhost:3000/api/auth/register', $scope.user)
      .then(res => {
        if (res.data.success) {
          window.location.href = 'login.html';
        } else {
          $scope.error = res.data.message || "Registration failed";
        }
      });
  };

  $scope.login = function () {
    $http.post('http://localhost:3000/api/auth/login', $scope.user)
      .then(res => {
        if (res.data.success) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          window.location.href = 'dashboard.html';
        } else {
          $scope.error = "Invalid credentials";
        }
      });
  };
});

// Dashboard (My Events)
app.controller('DashboardController', function($scope, $http) {
  $scope.user = JSON.parse(localStorage.getItem('user'));
  if (!$scope.user) {
    window.location.href = 'login.html';
    return;
  }

  $http.get(`http://localhost:3000/api/events/user/${$scope.user._id}`)
    .then(res => {
      $scope.events = res.data;
    });

  $scope.logout = function () {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  };
});

// Create Event
// Create Event
app.controller('EventController', function($scope, $http) {
  $scope.event = {};
  $scope.message = "";
  $scope.user = JSON.parse(localStorage.getItem('user'));

  if (!$scope.user) {
    window.location.href = 'login.html';
    return;
  }

  $scope.createEvent = function () {
    $scope.event.userId = $scope.user._id;
    $http.post('http://localhost:3000/api/events/create', $scope.event)
      .then(res => {
        if (res.data.success) {
          $scope.message = "Event created!";
          window.location.href = 'dashboard.html';
        } else {
          $scope.message = "Failed to create event";
        }
      });
  };
});


// 🔥 View All Public Events (including others')
app.controller('AllEventsController', function($scope, $http) {
  $scope.user = JSON.parse(localStorage.getItem('user'));
  $scope.allEvents = [];

  if (!$scope.user) {
    window.location.href = 'login.html';
    return;
  }

  $http.get('http://localhost:3000/api/events/all')
    .then(res => {
      $scope.allEvents = res.data;
    });

  $scope.viewDetails = function(eventId) {
    window.location.href = `event-details.html#/${eventId}`;
  };
});

// Event Details + Join Feature
app.controller('EventDetailsController', function($scope, $http) {
  const hashParts = window.location.hash.split('/');
  const eventId = hashParts[2];

  $scope.event = {};
  $scope.user = JSON.parse(localStorage.getItem('user'));
  $scope.error = "";
  $scope.joinMessage = "";

  if (!eventId) {
    $scope.error = "Event ID missing in URL";
    return;
  }

  $http.get(`http://localhost:3000/api/events/${eventId}`)
    .then(res => {
      $scope.event = res.data;
    })
    .catch(() => {
      $scope.error = "Failed to load event details";
    });

  $scope.joinEvent = function () {
    if (!$scope.user) {
      window.location.href = 'login.html';
      return;
    }

    $http.post(`http://localhost:3000/api/events/join/${eventId}`, {
      userId: $scope.user._id
    }).then(res => {
      $scope.joinMessage = res.data.message || "Joined successfully!";
    }).catch(() => {
      $scope.joinMessage = "Failed to join event.";
    });
  };
});

// Invite Page
app.controller('InviteController', function($scope, $http) {
  const hashParts = window.location.hash.split('/');
  const eventId = hashParts[2];

  $scope.invite = {};
  $scope.message = "";
  $scope.event = {};
  $scope.error = "";

  if (!eventId) {
    $scope.error = "Event ID missing in URL";
    return;
  }

  $http.get(`http://localhost:3000/api/events/${eventId}`)
    .then(res => {
      $scope.event = res.data;
    });

  $scope.sendInvite = function () {
    $http.post(`http://localhost:3000/api/events/invite/${eventId}`, {
      email: $scope.invite.email
    }).then(res => {
      $scope.message = res.data.message || "Invite sent!";
    }).catch(() => {
      $scope.message = "Failed to send invite";
    });
  };
});

// Check-in Page
app.controller('CheckinController', function($scope, $http) {
  $scope.checkin = {};
  $scope.message = "";

  $scope.doCheckin = function () {
    $http.post('http://localhost:3000/api/events/checkin', $scope.checkin)
      .then(res => {
        $scope.message = res.data.message || "Check-in complete!";
      })
      .catch(() => {
        $scope.message = "Check-in failed";
      });
  };
});
