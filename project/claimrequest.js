function searchMember() {
    var memberId = document.getElementById("memberId").value;
    // Assuming you're using fetch for API calls
    fetch(`http://localhost:8080/members/getById/${memberId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate form fields with fetched data
            document.getElementById("fName").value = data.firstName;
            document.getElementById("LName").value = data.lastName;
            document.getElementById("requestDate").value = data.dateOfBirth;
            document.getElementById("maxClaimAmount").value = data.maxClaimAmount;
            document.getElementById("nomineeCount").value = data.nomineeCount;
            document.getElementById("insuranceType").value = data.insuranceType; // Populate insurance type

            // Populate other fields as needed
            
            // Optional: Disable the Member ID field after fetching data
            document.getElementById("memberId").disabled = true;
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function submitForm(event) {
    event.preventDefault();

    var memberId = document.getElementById("memberId").value;
    var insuranceAmount = document.getElementById("insurance-amount").value;
    var maxClaimAmount = document.getElementById("maxClaimAmount").value;
    var insuranceType = document.getElementById("insuranceType").value;
    var requestDate = document.getElementById("requestDate").value;
    var claimReason = document.getElementById("claimReason").value;
    var body = {
        memberId: memberId,
        insuranceAmount: insuranceAmount,
        maxClaimAmount: maxClaimAmount,
        insuranceType: insuranceType,
        requestDate: requestDate,
        claimReason: claimReason
    };

    
    var jsonData = JSON.stringify(body);
    fetch('http://localhost:8080/claim/createClaim', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        
    })
    .then(data => {
        console.log('Claim submitted successfully:', data);
        document.getElementById("update").reset();
        document.getElementById("memberId").disabled = false;
        window.location.reload(); 
    })
    
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

