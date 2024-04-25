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

function populateModalForm(memberData) {
    document.getElementById('memberId').value = memberData.memberId;
    document.getElementById('firstName').value = memberData.firstName;
    document.getElementById('lastName').value = memberData.lastName;
    document.getElementById('DOB').value = memberData.dateOfBirth;
    document.getElementById('Contact').value = memberData.contactNo;
    document.getElementById('Address').value = memberData.address;
    document.getElementById('mail').value = memberData.email;
    document.getElementById('gender').value = memberData.gender;
    document.getElementById('insurance').value = memberData.insuranceType;
    document.getElementById('amount').value = memberData.maxClaimAmount;
    document.getElementById('nomineeCount').value = memberData.nomineeCount;
    document.getElementById('maxAmount').value = memberData.maxClaimAmount;
    
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
            document.getElementById('editModal').style.display = 'none';
        }
    });

    // Close the modal when clicking outside the modal
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('editModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Add event listener to the form submit event
    document.getElementById('editForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Gather form field values
        const memberId = document.getElementById('memberId').value; // Assuming you have a hidden input field for memberId
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const dateOfBirth = document.getElementById('DOB').value;
        const contactNo = document.getElementById('Contact').value;
        const address = document.getElementById('Address').value;
        const email = document.getElementById('mail').value;
        const gender = document.getElementById('gender').value;
        const insuranceType = document.getElementById('insurance').value;
        const nomineeCount = document.getElementById('nomineeCount').value;
        const maxClaimAmount = document.getElementById('maxAmount').value;

        // Construct payload
        const payload = {
           memberId,
            firstName,
            lastName,
            dateOfBirth,
            contactNo,
            address,
            email,
            gender,
            insuranceType,
            nomineeCount,
            maxClaimAmount
        };

        // Send payload to API
        updateMemberData(payload);
    });
});

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
            console.log('Member data updated successfully');
            // Optionally, close the modal or perform other actions
        } else {
            console.error('Failed to update member data:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating member data:', error);
    }
}

