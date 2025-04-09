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
    
    // If you're using separate date and time inputs in your form
    // combine them into a single Date object
    if ($scope.event.dateInput && $scope.event.timeInput) {
      const dateStr = $scope.event.dateInput;
      const timeStr = $scope.event.timeInput;
      $scope.event.date = new Date(`${dateStr}T${timeStr}`);
      
      // Remove the temporary input fields
      delete $scope.event.dateInput;
      delete $scope.event.timeInput;
    }
    
    $http.post('http://localhost:3000/api/events/create', $scope.event)
      .then(res => {
        if (res.data.success) {
          $scope.message = "Event created!";
          window.location.href = 'dashboard.html';
        } else {
          $scope.message = "Failed to create event";
        }
      })
      .catch(err => {
        $scope.message = "Error: " + (err.data?.message || err.message || "Failed to create event");
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
  // Fix parsing the event ID from the URL
  let eventId = null;
  
  // First attempt: Check if hash contains event ID
  if (window.location.hash) {
    const hashParts = window.location.hash.split('/');
    // Try different positions depending on your URL structure
    eventId = hashParts[hashParts.length - 1]; // Get the last segment, which should be the ID
  }
  
  // If no eventId found in hash, check query parameters
  if (!eventId || eventId === "event") {
    const urlParams = new URLSearchParams(window.location.search);
    eventId = urlParams.get('id');
  }
  
  $scope.event = {};
  $scope.user = JSON.parse(localStorage.getItem('user'));
  $scope.error = "";
  $scope.message = "";
  $scope.alreadyJoined = false;

  // Add debug output
  console.log("Event ID extracted:", eventId);

  if (!eventId || eventId === "event") {
    $scope.error = "Valid event ID missing in URL. Please go back and select an event.";
    return;
  }

  $http.get(`http://localhost:3000/api/events/${eventId}`)
    .then(res => {
      console.log("Event data received:", res.data);
      $scope.event = res.data;
      
      // Convert date string to Date object if needed
      if ($scope.event && typeof $scope.event.date === 'string') {
        $scope.event.date = new Date($scope.event.date);
      }
      
      // Check if user has already joined
      if ($scope.user && $scope.event.participants) {
        $scope.alreadyJoined = $scope.event.participants.some(
          participant => participant === $scope.user._id || participant._id === $scope.user._id
        );
      }
    })
    .catch(err => {
      console.error("Full error details:", err);
      $scope.error = "Failed to load event details: " + (err.data?.message || err.message || "Error fetching event details");
    });

  // Rest of your controller remains the same...
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
