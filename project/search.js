function searchClaims() {
    const memberId = document.getElementById('memberId').value;
    const firstName = document.getElementById('firstName').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    if (memberId) {
        // Call the function to fetch claims by memberId
        getClaimsByMemberId(memberId);
    } else if (firstName) {
        // Call the function to fetch claims by firstName
        getClaimsByFirstName(firstName);
    } else if (fromDate && toDate) {
        // Call the function to fetch claims by date range
        getClaimsByDateRange(fromDate, toDate);
    } else {
        console.log('No search criteria provided.');
    }

    // Reset the form fields
    resetFormFields();
}

async function getClaimsByMemberId(memberId) {
    try {
        const response = await fetch(`http://localhost:8080/claim/getAllClaimsByMemberId/${memberId}`);
        const data = await response.json();
        console.log('Claims by member ID:', data);
        displayClaims(data);
    } catch (error) {
        console.error('Error fetching claims by member ID:', error);
    }
}

async function getClaimsByFirstName(firstName) {
    try {
        const response = await fetch(`http://localhost:8080/claim/getAllClaimsByFirstName/${firstName}`);
        const data = await response.json();
        console.log('Claims by first name:', data);
        displayClaims(data);
    } catch (error) {
        console.error('Error fetching claims by first name:', error);
    }
}

async function getClaimsByDateRange(fromDate, toDate) {
    try {
        const response = await fetch(`http://localhost:8080/claim/getAllClaimsByDateRange/${fromDate}/${toDate}`);
        const data = await response.json();
        console.log('Claims by date range:', data);
        displayClaims(data);
    } catch (error) {
        console.error('Error fetching claims by date range:', error);
    }
}

function displayClaims(data) {
    const tableDiv = document.getElementById('responseTable');

    // Clear previous table if exists
    tableDiv.innerHTML = '';

    // Create table element
    const table = document.createElement('table');

    // Create table header row
    const headerRow = table.insertRow();
    for (const key in data[0]) {
        const headerCell = document.createElement('th');
        headerCell.textContent = key;
        headerRow.appendChild(headerCell);
    }

    // Create table body rows
    data.forEach(item => {
        const row = table.insertRow();
        for (const key in item) {
            const cell = row.insertCell();
            cell.textContent = item[key];
        }
    });

    // Append table to the div
    tableDiv.appendChild(table);
}

function resetFormFields() {
    document.getElementById('memberId').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
}
