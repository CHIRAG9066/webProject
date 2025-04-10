$(document).ready(function() {
    let events = [];
    let currentFilter = 'all';

    // Load events data
    $.ajax({
        url: 'data/events.json',
        dataType: 'json',
        success: function(data) {
            events = data.events;
            displayEvents(events);
        },
        error: function() {
            console.error('Error loading events data');
        }
    });

    // Search functionality
    $('#searchButton').click(function() {
        performSearch();
    });

    $('#searchInput').keypress(function(e) {
        if (e.which == 13) {
            performSearch();
        }
    });

    // Filter functionality
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('type');
        performSearch();
    });

    function performSearch() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        let filteredEvents = events;

        // Apply type filter
        if (currentFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.type === currentFilter);
        }

        // Apply search term filter
        if (searchTerm) {
            filteredEvents = filteredEvents.filter(event => 
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm) ||
                event.location.toLowerCase().includes(searchTerm)
            );
        }

        displayEvents(filteredEvents);
    }

    function displayEvents(eventsToDisplay) {
        const $results = $('#searchResults');
        const $noResults = $('#noResults');
        
        $results.empty();

        if (eventsToDisplay.length === 0) {
            $noResults.show();
            return;
        }

        $noResults.hide();

        eventsToDisplay.forEach(event => {
            const eventCard = `
                <div class="col-md-4">
                    <div class="card event-card">
                        <div class="position-relative">
                            <img src="${event.image}" class="card-img-top event-image" alt="${event.title}">
                            <div class="price-tag">$${event.price}</div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text" style="color: black;">${event.description}</p>
                            <div class="event-details">
                                <p style="color: black;"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                                <p style="color: black;"><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                                <p style="color: black;"><i class="fas fa-users"></i> ${event.details.guests}</p>
                                <p style="color: black;"><i class="fas fa-clock"></i> ${event.details.duration}</p>
                                <div class="mt-2">
                                    <strong>Includes:</strong>
                                    <ul class="list-unstyled
                                        ${event.details.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $results.append(eventCard);
        });
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
}); 