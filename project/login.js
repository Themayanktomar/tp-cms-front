document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    
    // Get username and password from input fields
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    // Prepare the request body
    var requestBody = {
        "adminId": username,
        "password": password
    };
    
    // Make a POST request to the API
    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        // Check if response is true
        if (data === true) {
            // Redirect to dashboard.html
            window.location.href = 'dashboard.html';
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while logging in.');
    });
});
