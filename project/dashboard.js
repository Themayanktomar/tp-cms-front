let next = document.querySelector('.next')
let prev = document.querySelector('.prev')
 
next.addEventListener('click', function () {
    let items = document.querySelectorAll('.item')
    document.querySelector('.slide').appendChild(items[0])
})
prev.addEventListener('click', function () {
    let items = document.querySelectorAll('.item')
    document.querySelector('.slide').prepend(items[items.length-1]) //here the length of items=6
})


// dashboard.js

async function logout() {
    try {
      const response = await fetch('http://localhost:8080/api/logout', {
        method: 'POST', // or 'GET', 'PUT', 'DELETE', etc.
        headers: {
          'Content-Type': 'application/json'
          // You might need to include additional headers depending on your server requirements
        },
        // You can include a body if needed, for example, if your server expects some data
        // body: JSON.stringify({ /* data if needed */ })
      });
  
      // Check if the logout was successful
      if (response.ok) {
        // Redirect to welcome.html
        window.location.href = 'welcome.html';
      } else {
        // Handle the error, maybe display a message to the user
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      // Handle any network errors
      console.error('Error during logout:', error);
    }
  }
  
  // Attach the logout function to the logout link
  document.querySelector('.navigation a[href="welcome.html"]').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default link behavior
    await logout(); // Call the logout function
  });
  