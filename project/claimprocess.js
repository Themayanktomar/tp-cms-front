document.getElementById('search-button').addEventListener('click', function() {
    var memberId = document.getElementById('search-bar').value;
    var apiUrl = 'http://localhost:8080/claim/getAllClaimsByMemberId/' + memberId;

    // Make AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                displaySearchResults(response);
            } else {
                // Handle error
                console.error('Error:', xhr.statusText);
            }
        }
    };
    xhr.send();
});

function displaySearchResults(results) {
    var searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = ''; // Clear previous results

    if (results && results.length > 0) {
        var table = document.createElement('table');
        table.border = '1'; // Add borders to the table

        // Create table header
        var headerRow = table.insertRow();
        for (var key in results[0]) {
            if (results[0].hasOwnProperty(key)) {
                var headerCell = document.createElement('th');
                headerCell.textContent = key.toUpperCase();
                headerRow.appendChild(headerCell);
            }
        }
        // Add additional header cell for action buttons
        var actionHeaderCell = document.createElement('th');
        actionHeaderCell.textContent = 'ACTIONS';
        headerRow.appendChild(actionHeaderCell);

        // Create table rows and cells for each result
        results.forEach(function(result, index) {
            var row = table.insertRow();
            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    var cell = row.insertCell();
                    cell.textContent = result[key];
                    // Add ID to each cell based on the column name
                    cell.id = key + '_row_' + index;
                }
            }
            // Add ID to each row
            row.id = 'claimRow_' + index;

            // Add cell to span across the entire row for action buttons
            var actionCell = row.insertCell();
            actionCell.colSpan = Object.keys(result).length + 1; // Span across all columns + 1 for action column

            // Add action buttons for approve and reject
            var approveButton = document.createElement('button');
            approveButton.textContent = 'Approve';
            approveButton.id = 'approveButton_row_' + index; // Assign a unique ID to each approve button
            approveButton.onclick = function() {
                // Open the approval modal when the Approve button is clicked
                showApprovalModal();
            };
            actionCell.appendChild(approveButton);

            var rejectButton = document.createElement('button');
            rejectButton.textContent = 'Reject';
            rejectButton.id = 'rejectButton_row_' + index; // Assign a unique ID to each reject button
            rejectButton.onclick = function() {
                // Get the index of the row
                var rowIndex = parseInt(row.id.split('_')[1]);
                // Pass the index to the function to handle rejection
                rejectClaim(rowIndex);
            };
            actionCell.appendChild(rejectButton);
        });

        searchResultsDiv.appendChild(table);
    } else {
        searchResultsDiv.textContent = 'No claims found for this Member ID.';
    }
}


function rejectClaim(rowIndex, buttonId) {
    // Find the claim request number using the rowIndex
    var claimRequestNoCell = document.getElementById('claimRequestNo_row_' + rowIndex);
    if (claimRequestNoCell) {
        var claimRequestNo = claimRequestNoCell.textContent.trim();
        console.log("Claim Request No:", claimRequestNo);
        // Now you have the claim request number, you can use it as needed

        // Open the rejection modal and pass the claim request number
        var rejectionReasonInput = document.getElementById('rejectionReason');
        rejectionReasonInput.dataset.claimRequestId = claimRequestNo; // Set a custom attribute to store the claim request number
        showRejectionModal();
    } else {
        console.error('Claim request number cell not found.');
    }
}



function sendRejectionReason(claimRequestNo, reason) {
    var formData = new FormData();
    formData.append('claimRequestNo', claimRequestNo);
    formData.append('reason', reason);

    fetch('http://localhost:8080/claim/rejectClaim', {
        method: 'PUT',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Parse the response body as JSON
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .then(data => {
        // Assuming the response contains a message field
        var message = data.message;
        // Display response message in success modal
        var successModalContent = document.querySelector('#successModal .modal-content');
        successModalContent.innerHTML = '<h2>' + message + '</h2>';
        showSuccessModal();
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error scenario here, show error message in a modal or log it
    });
}






    function showSuccessModal() {
        var modal = document.getElementById('successModal');
        modal.style.display = 'block';
    }
    
    // Function to hide the success modal popup
    function hideSuccessModal() {
        var modal = document.getElementById('successModal');
        modal.style.display = 'none';
    }
    
    var successModalClose = document.querySelector('#successModal .close');
    successModalClose.addEventListener('click', function() {
        hideSuccessModal();
    });
    
    
    
       // Function to show the rejection modal popup
    function showRejectionModal() {
        var modal = document.getElementById('rejectionModal');
        modal.style.display = 'block';
    }
    
    // Function to hide the rejection modal popup
    function hideRejectionModal() {
        var modal = document.getElementById('rejectionModal');
        modal.style.display = 'none';
    }
    
    // Function to show the approval modal popup
    function showApprovalModal() {
        var modal = document.getElementById('approvalModal');
        modal.style.display = 'block';
    }
    
    // Function to hide the approval modal popup
    function hideApprovalModal() {
        var modal = document.getElementById('approvalModal');
        modal.style.display = 'none';
    }
    
    // Function to show the success modal popup
    function showSuccessModal() {
        var modal = document.getElementById('successModal');
        modal.style.display = 'block';
    }
    
    // Function to hide the success modal popup
    function hideSuccessModal() {
        var modal = document.getElementById('successModal');
        modal.style.display = 'none';
    }
   
    var approveButtons = document.querySelectorAll('.approve-button');
    approveButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            showApprovalModal();
        });
    });
    
    
    var rejectionModalClose = document.querySelector('#rejectionModal .close');
    rejectionModalClose.addEventListener('click', function() {
        hideRejectionModal();
    });
    
    var approvalModalClose = document.querySelector('#approvalModal .close');
    approvalModalClose.addEventListener('click', function() {
        hideApprovalModal();
    });
    
// When the "Submit Rejection" button is clicked inside the rejection modal
var submitRejectionButton = document.getElementById('submitRejection');
submitRejectionButton.addEventListener('click', function() {
    // Get the claim request number and rejection reason from the rejection modal
    var claimRequestNo = document.getElementById('rejectionReason').dataset.claimRequestId;
    var rejectionReason = document.getElementById('rejectionReason').value;

    // Send the rejection reason along with the claim request number to the API endpoint
    sendRejectionReason(claimRequestNo, rejectionReason);

    // Hide the rejection modal after submission
    hideRejectionModal();
});

// Function to send approval request to the server
// function sendApproval(claimRequestNo) {
//     var formData = new FormData();
//     formData.append('claimRequestNo', claimRequestNo);

//     fetch('http://localhost:8080/claim/approveClaim', {
//         method: 'PUT',
//         body: formData,
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json(); // Parse the response body as JSON
//         } else {
//             throw new Error('Network response was not ok.');
//         }
//     })
//     .then(data => {
//         // Assuming the response contains a message field
//         var message = data.message;
//         // Display response message in success modal
//         var successModalContent = document.querySelector('#successModal .modal-content');
//         successModalContent.innerHTML = '<h2>' + message + '</h2>';
//         showSuccessModal();
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         // Handle error scenario here, show error message in a modal or log it
//     });
// }

// // Event listener for the "Approve" button click
// function setApproveButtonListeners() {
//     var approveButtons = document.querySelectorAll('.approve-button');
//     approveButtons.forEach(function(button) {
//         button.addEventListener('click', function() {
//             // Get the index of the row
//             var rowIndex = parseInt(this.id.split('_')[1]);
//             // Pass the index to the function to handle approval
//             approveClaim(rowIndex);
//         });
//     });
// }

// // Function to handle approval of a claim
// function approveClaim(rowIndex) {
//     // Find the claim request number using the rowIndex
//     var claimRequestNoCell = document.getElementById('claimRequestNo_row_' + rowIndex);
//     if (claimRequestNoCell) {
//         var claimRequestNo = claimRequestNoCell.textContent.trim();
//         console.log("Claim Request No:", claimRequestNo);
//         // Now you have the claim request number, you can use it as needed

//         // Send the claim request number for approval
//         sendApproval(claimRequestNo);
//     } else {
//         console.error('Claim request number cell not found.');
//     }
// }

// Call the function to set approve button listeners
setApproveButtonListeners();


    
    
    var successModalClose = document.querySelector('#successModal .close');
    successModalClose.addEventListener('click', function() {
        hideSuccessModal();
    });
    
    
    
    
    
    
    
