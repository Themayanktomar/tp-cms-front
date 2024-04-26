
async function updateInsuredAmount() {
    const insuranceType = document.getElementById("insurance-type").value;
    let insuredAmount = 0;
    let claimAmount = 0;

    try {
        const response = await fetch(`http://localhost:8080/members/getInsuranceAmount/${insuranceType}`);
        const data = await response.json();
        insuredAmount = parseFloat(data); 
        switch (insuranceType) {
            case "LIFE_INSURANCE":
                claimAmount = insuredAmount * 1.00;
                break;
            case "HOME_INSURANCE":
                claimAmount = insuredAmount * 0.91; 
                break;
            case "CAR_INSURANCE":
                claimAmount = insuredAmount * 0.80; 
                break;
            default:
                claimAmount = 0;
                break;
        }
    } catch (error) {
        console.error("Error fetching insured amount:", error);
        insuredAmount = 0; 
        claimAmount = 0;
    }

    document.getElementById("insured-amount").value = insuredAmount;
    document.getElementById("max-claim-amount").value = claimAmount;
}

function registerMember(event) {
    event.preventDefault(); // Prevents default form submission
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('Name').value,
        lastName: document.querySelector('input[name="LName"]').value,
        dateOfBirth: document.querySelector('input[name="birthday"]').value,
        address: document.querySelector('input[name="Address"]').value,
        contactNo: parseInt(document.querySelector('input[name="phone"]').value),
        email: document.querySelector('input[name="email"]').value,
        gender: document.querySelector('select').value.toLowerCase(),
        nomineeCount: parseInt(document.querySelector('input#insurance-amount').value),
        insuranceType: document.querySelector('select#insurance-type').value
    };

    // Make API request to the given URL
    fetch("http://localhost:8080/members/createMember", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Convert form data to JSON
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // Return response text
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .then(data => {
        // Show SweetAlert2 pop-up with response message
        Swal.fire({
            icon: 'success',
            title: 'Member Registered',
            text: data,
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "dashboard.html"; // Redirect to dashboard
            }
        });
    })
    .catch(error => {
        // SweetAlert2 pop-up for unexpected errors
        Swal.fire({
            icon: 'error',
            title: 'Unexpected Error',
            text: 'An unexpected error occurred. Please try again later.',
            confirmButtonText: 'OK'
        });
        console.error("An error occurred:", error);
    });
}

