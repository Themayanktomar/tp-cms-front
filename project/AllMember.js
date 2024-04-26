document.addEventListener('DOMContentLoaded', function () {
    getAllMembers(); // Call the function to fetch all members when the page loads
});

async function getAllMembers() {
    try {
        const response = await fetch('http://localhost:8080/members/getAllMember');
        const data = await response.json();
        populateMemberTable(data); // Call the function to populate the member table with the fetched data
    } catch (error) {
        console.error('Error fetching all members:', error);
    }
}

function populateMemberTable(memberData) {
    const memberTableBody = document.getElementById('memberData');
    memberTableBody.innerHTML = ''; // Clear existing data

    memberData.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.memberId}</td>
            <td>${member.firstName}</td>
            <td>${member.lastName}</td>
            <td>${member.dateOfBirth}</td>
            <td>${member.address}</td>
            <td>${member.contactNo}</td>
            <td>${member.email}</td>
            <td>${member.gender}</td>
            <td>${member.nomineeCount}</td>
            <td>${member.insuranceType}</td>
            <td>${member.maxClaimAmount}</td>
            <td><button onclick="editMember('${member.memberId}')">Edit</button></td>
        `;
        memberTableBody.appendChild(row);
    });
}

async function editMember(memberId) {
    try {
        const response = await fetch(`http://localhost:8080/members/getById/${memberId}`);
        const data = await response.json();
        populateModalForm(data);
        openModal();
    } catch (error) {
        console.error('Error fetching member by ID:', error);
    }
}

async function populateModalForm(memberData) {
    document.getElementById('memberId').value = memberData.memberId;
    document.getElementById('firstName').value = memberData.firstName;
    document.getElementById('lastName').value = memberData.lastName;
    document.getElementById('DOB').value = memberData.dateOfBirth;
    document.getElementById('Contact').value = memberData.contactNo;
    document.getElementById('Address').value = memberData.address;
    document.getElementById('mail').value = memberData.email;
    document.getElementById('gender').value = memberData.gender;
    document.getElementById('insurance').value = memberData.insuranceType;
    document.getElementById('insured-amount').value = memberData.maxClaimAmount;
    document.getElementById('nomineeCount').value = memberData.nomineeCount;
    document.getElementById('max-claim-amount').value = memberData.maxClaimAmount;

    const insuranceSelect = document.getElementById('insurance');
    const insuranceOptions = insuranceSelect.options;
    let optionFound = false;
    for (let i = 0; i < insuranceOptions.length; i++) {
        if (insuranceOptions[i].value === memberData.insuranceType) {
            insuranceSelect.selectedIndex = i;
            optionFound = true;
            break;
        }
    }
    // If the option is not found, add it to the select field
    if (!optionFound) {
        const newOption = document.createElement('option');
        newOption.text = memberData.insuranceType;
        newOption.value = memberData.insuranceType;
        insuranceSelect.add(newOption);
        insuranceSelect.selectedIndex = insuranceOptions.length - 1; // Select the newly added option
    }
    
    // Auto-populate insured amount and max claim amount based on insurance type
    await updateInsuredAmount();
}

async function updateInsuredAmount() {
    const insuranceType = document.getElementById("insurance").value;
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


function openModal() {
    // Show the modal
    document.getElementById('editModal').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    getAllMembers(); // Call the function to fetch all members when the page loads

    // Close the modal when clicking on the close button
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close')) {
            closeModal();
        }
    });

    // Close the modal when clicking outside the modal
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('editModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Add event listener to the form submit event
    document.getElementById('editForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Gather form field values
        const payload = {
            memberId: document.getElementById('memberId').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            dateOfBirth: document.getElementById('DOB').value,
            contactNo: document.getElementById('Contact').value,
            address: document.getElementById('Address').value,
            email: document.getElementById('mail').value,
            gender: document.getElementById('gender').value,
            insuranceType: document.getElementById('insurance').value,
            nomineeCount: document.getElementById('nomineeCount').value,
            maxClaimAmount: document.getElementById('max-claim-amount').value // Corrected ID
        };

        // Send payload to API
        updateMemberData(payload);
    });
});

function closeModal() {
    // Hide the modal
    document.getElementById('editModal').style.display = 'none';
}

async function updateMemberData(payload) {
    try {
        const response = await fetch('http://localhost:8080/members/updateMember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            const responseData = await response.text(); // Get response as text
            console.log('Response data:', responseData); // Log the response data for debugging
            // Show response message in a popup or alert
            alert('Member data updated successfully: ' + responseData);
            closeModal(); // Close modal after successful update
            // Reload or redirect to update the member list
            window.location.reload(); // Reload the current page
        } else {
            console.error('Failed to update member data:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating member data:', error);
    }
}



