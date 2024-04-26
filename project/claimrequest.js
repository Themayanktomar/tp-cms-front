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
            document.getElementById("requestDate").value = new Date().toISOString().split("T")[0]; // Default to today
            document.getElementById("maxClaimAmount").value = data.maxClaimAmount;
            document.getElementById("insurance-amount").value = data.nomineeCount;
            
            var insuranceTypeSelect = document.getElementById("insuranceType");
            insuranceTypeSelect.value = data.insuranceType;

            updateClaimReasons(); // Ensure claim reasons are updated based on the insurance type

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
        claimReason: claimReason,
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
        return response.text(); // Get response as text
    })
    .then(data => {
        console.log('Claim submitted successfully:', data);
        alert(data); // Show response message in a popup or alert
        window.location.href = 'dashboard.html'; // Redirect to dashboard.html
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}


function updateClaimReasons() {
    var insuranceType = document.getElementById("insuranceType").value;
    var claimReasonSelect = document.getElementById("claimReason");

    // Reset existing options
    claimReasonSelect.innerHTML = "";

    var claimReasons = [];
    if (insuranceType === "CAR_INSURANCE") {
        claimReasons = ["Repair", "Stolen"];
    } else if (insuranceType === "LIFE_INSURANCE") {
        claimReasons = ["Treatment Claim", "Death Claim"];
    } else if (insuranceType === "HOME_INSURANCE") {
        claimReasons = ["Renovate", "Destroyed"];
    }

    // Populate claim reasons based on the selected insurance type
    claimReasons.forEach(function (reason) {
        var option = document.createElement("option");
        option.text = reason;
        claimReasonSelect.add(option);
    });
}
