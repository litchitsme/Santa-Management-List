const urlkid ='http://localhost:3000/kids'
const urltoy = 'http://localhost:3000/toys'
const output = document.getElementById('output')
const savedOutput = document.getElementById('savedOutput')
const toyOutput = document.getElementById('toyOutput')
const hiddenButtons = {};

// Fetch and display kids
function fetchdatakid() {
    // Empty output
    output.innerHTML = '';
    // Get right data
    fetch(urlkid)
        .then(res => res.json())
        .then(data => {
            // Check if data is empty
            if (data.length === 0) {
                const noKidsMessage = document.createElement('div');
                noKidsMessage.className = 'no-kids-message';
                noKidsMessage.textContent = 'No kids available. Add your first kid!';
                output.appendChild(noKidsMessage);
                return;
            }
            
            // Sort kids by timestamp in descending order
            const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedData.forEach(kids => {
                const giftStates = kids.giftStates || {};
                // Fill output (info about kid, edit kid, buttons to add toys, edit/save/delete kid)
                output.innerHTML += `
                    <div class="kid-item" id="kid-${kids.id}">
                        <span class="kid-content">${kids.name} : ${kids.age} years old, is a ${kids.behavior} kid</span>
                        <form>
                            <div class="edit-form" style="display: none;">
                                <input type="text" class="edit-name" value="${kids.name}" required>
                                <input type="number" class="edit-age" value="${kids.age}" required>
                                <input type="text" class="edit-behavior" value="${kids.behavior}" required>
                                <button class="smallbutton" onclick="saveEdit('${kids.id}')">S</button>
                                <button class="smallbutton" onclick="cancelEdit('${kids.id}')">X</button>
                            </div>
                        </form>
                        <div class="actions-container">
                            <div class="button-group" id="button-group-${kids.id}">
                                <button class="smallbutton mx-1 addbook" style="display: ${giftStates.books ? 'none' : 'block'};" onclick="addBooks(event, '${kids.id}')"><i class="fa-solid fa-book"></i></button>
                                <button class="smallbutton deletebutton mx-1 removebook" style="display: ${giftStates.books ? 'block' : 'none'};" onclick="removeBooks(event, '${kids.id}')"><i class="fa-solid fa-book"></i></button>
                                <button class="smallbutton mx-1" style="display: ${giftStates.clothes ? 'none' : 'block'};" onclick="addClothes(event, '${kids.id}')"><i class="fa-solid fa-shirt"></i></button>
                                <button class="smallbutton deletebutton mx-1" style="display: ${giftStates.clothes ? 'block' : 'none'};" onclick="removeClothes(event, '${kids.id}')"><i class="fa-solid fa-shirt"></i></button>
                                <button class="smallbutton mx-1" style="display: ${giftStates.dolls ? 'none' : 'block'};" onclick="addDolls(event, '${kids.id}')"><i class="fa-solid fa-person"></i></button>
                                <button class="smallbutton deletebutton mx-1" style="display : ${giftStates.dolls ? 'block' : 'none'};" onclick="removeDolls(event, '${kids.id}')"><i class="fa-solid fa-person"></i></button>
                                <button class="smallbutton mx-1" style="display : ${giftStates.cars ? 'none' : 'block'};" onclick="addCars(event, '${kids.id}')"><i class="fa-solid fa-car-side"></i></button>
                                <button class="smallbutton deletebutton mx-1" style="display : ${giftStates.cars ? 'block' : 'none'};" onclick="removeCars(event, '${kids.id}')"><i class="fa-solid fa-car-side"></i></button>
                                <button class="redbutton2 smallbutton mx-1" style="display : ${giftStates.coals ? 'none' : 'block'};" onclick="addCoals(event, '${kids.id}')"><i class="fa-solid fa-poop"></i></button>
                                <button class="deletebutton2 smallbutton mx-1" style="display : ${giftStates.coals ? 'block' : 'none'};" onclick="removeCoals(event, '${kids.id}')"><i class="fa-solid fa-poop"></i></button>
                            </div>
                        </div>
                        <div class="button-group">
                            <button onclick="editKid('${kids.id}')">Edit</button>
                            <button onclick="saveToLocal('${kids.id}', '${kids.name}', ${kids.age}, '${kids.behavior}', ${kids.timestamp}, '${encodeURIComponent(JSON.stringify(kids.giftStates))}')">Save</button>
                            <button class="redbutton" onclick="deleteKid('${kids.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching kids:', e));
}

// Fetch and display toys
function fetchdatatoy() {
    // Clear existing toys
    toyOutput.innerHTML = '';
    // Get toys
    fetch(urltoy)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                const noKidsMessage = document.createElement('div');
                noKidsMessage.className = 'no-kids-message';
                noKidsMessage.textContent = 'No kids available. Add your first kid!';
                output.appendChild(noKidsMessage);
                return;
            }
            
            // Sort kids by timestamp in descending order
            const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedData.forEach(toys => {
                toyOutput.innerHTML += `
                    <div class="kid-item2" id="kid-${toys.id}">
                        <span class="mx-1">${toys.icon}</span>
                        <span class="mx-1">${toys.type}</span>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching toys:', e));
}

// Add new kid
document.getElementById('addKidsButton').addEventListener('click', () => {
    // Add data to newKid
    const name = document.getElementById('name').value.charAt(0).toUpperCase() + document.getElementById('name').value.slice(1).toLowerCase();
    const behavior = document.getElementById('behavior').value.toLowerCase();

    const newKid = {
        name: name,
        age: parseInt(document.getElementById('age').value),
        behavior: behavior,
        timestamp: Date.now() // Add timestamp when creating new kid
    };

    // Add new kid
    fetch(urlkid, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newKid)
    })
    .then(res => res.json())
    .then(() => {
        fetchdatakid();
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
        document.getElementById('behavior').value = '';
    })
    .catch(e => console.error('Error adding kid:', e));
});

// Add a gift to a kid
function addGift(event, kidId, giftType) {
    // Prevent default form submission 
    event.preventDefault();
    fetch(`${urlkid}/${kidId}`)
        .then(res => res.json())
        .then(kid => {            
            // Update gift states
            let updatedGiftStates = { ...kid.giftStates };
            let updatedBehavior = kid.behavior;
            
            if (giftType === 'Coals') {
                // Reset all gift states to false
                const keys = Object.keys(updatedGiftStates);
                for(let key of keys) {
                    updatedGiftStates[key] = false;
                }
                // Set coals to true and behavior to 'bad'
                updatedGiftStates.coals = true;
                updatedBehavior = 'bad';
            }
            else {
                // Set the right gift state to true
                updatedGiftStates = {
                    ...kid.giftStates,
                    [giftType.toLowerCase()]: true,
                    // Make sure coals is false
                    coals: false
                };
                // Make sure behavior is 'good'
                updatedBehavior = 'good';
            }
            
            // Update kid
            fetch(`${urlkid}/${kidId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    giftStates: updatedGiftStates,
                    behavior: updatedBehavior
                })            
            })
            .then(() => {
                fetchdatakid();
            })
            .catch(e => console.error('Error updating kid with gift:', e));
        })
        .catch(e => console.error('Error fetching kid data:', e));
}

// Remove a gift from a kid
function removeGift(event, kidId, giftType) {
    // Prevent default form submission
    event.preventDefault();
    fetch(`${urlkid}/${kidId}`)
        .then(res => res.json())
        .then(kid => {            
            // Update gift states
            const updatedGiftStates = {
                ...kid.giftStates,
                [giftType.toLowerCase()]: false
            };
            
            // Update kid
            fetch(`${urlkid}/${kidId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    giftStates: updatedGiftStates
                })
            })
            .then(() => {
                fetchdatakid();
            })
            .catch(e => console.error('Error updating kid with gift:', e));
        })
        .catch(e => console.error('Error fetching kid data:', e));
}

// Add books
function addBooks(event, kidId) {
    addGift(event, kidId, 'Books');
}

// Remove books
function removeBooks(event, kidId) {
    removeGift(event, kidId, 'Books');
}

// Add clothes
function addClothes(event, kidId) {
    addGift(event, kidId, 'Clothes');
}

// Remove clothes
function removeClothes(event, kidId) {
    removeGift(event, kidId, 'Clothes');
}

// Add dolls
function addDolls(event, kidId) {
    addGift(event, kidId, 'Dolls');
}

// Remove dolls
function removeDolls(event, kidId) {
    removeGift(event, kidId, 'Dolls');
}

// Add cars
function addCars(event, kidId) {
    addGift(event, kidId, 'Cars');
}

// Remove cars
function removeCars(event, kidId) {
    removeGift(event, kidId, 'Cars');
}

// Add coals
function addCoals(event, kidId) {
    addGift(event, kidId, 'Coals');
}

// Remove coals
function removeCoals(event, kidId) {
    removeGift(event, kidId, 'Coals');
}

// Edit a kid
function editKid(id) {
    // Show edit form and hide content for the selected kid
    const kidDiv = document.getElementById(`kid-${id}`);
    kidDiv.querySelector('.kid-content').style.display = 'none';
    kidDiv.querySelector('.edit-form').style.display = 'block';
    kidDiv.querySelector('.button-group').style.display = 'none';
}

// Cancel edit
function cancelEdit(id) {
    // Hide edit form and show content
    const kidDiv = document.getElementById(`kid-${id}`);
    kidDiv.querySelector('.kid-content').style.display = 'block';
    kidDiv.querySelector('.edit-form').style.display = 'none';
    kidDiv.querySelector('.button-group').style.display = 'block';
}

// Save edit
function saveEdit(id) {
    fetch(`${urlkid}/${id}`)
        .then(res => res.json())
        .then(kid => {
    // Get the edited values
            const kidDiv = document.getElementById(`kid-${id}`);
            const newName = kidDiv.querySelector('.edit-name').value;
            const newAge = parseInt(kidDiv.querySelector('.edit-age').value);
            const newBehavior = (kidDiv.querySelector('.edit-behavior').value);

            // Create updated kid object
            const updatedKid = {
                name: newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase(),
                age: newAge,
                behavior: newBehavior.toLowerCase(),
                timestamp: Date.now(), // Update timestamp
                giftStates: {...kid.giftStates}
            };
        

    // Send PUT request to update the kid
            fetch(`${urlkid}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedKid)
            })
            .then(res => res.json())
            .then(() => {
                // Refresh the kids display
                fetchdatakid();
                fetchdatatoy();
            })
            .catch(e => console.error('Error updating kid:', e));
        }
        )
        .catch(e => console.error('Error fetching kid data:', e));
}

// Delete kid
function deleteKid(id) {
    fetch(`${urlkid}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchdatakid())
    .catch(e => console.error('Error deleting kid:', e));
}

function loadSavedKids() {
    try {
        // Get saved kids
        const savedKids = JSON.parse(localStorage.getItem('savedKids') || '[]');
        savedOutput.innerHTML = '';
        
        // Check if there are saved kids
        if (savedKids.length === 0) {
            const noKidsMessage = document.createElement('div');
            noKidsMessage.className = 'no-kids-message';
            noKidsMessage.textContent = 'No saved kids yet!';
            savedOutput.appendChild(noKidsMessage);
            return;
        }


        // Sort saved kids by timestamp in descending order
        savedKids.sort((a, b) => b.timestamp - a.timestamp);
        savedKids.forEach(kid => {
                        // Format the giftStates into a readable list of gifts
                        const gifts = Object.keys(kid.giftStates)
                        .filter(key => kid.giftStates[key]) // Include only true values
                        // .map(gift => gift.charAt(0).toUpperCase() + gift.slice(1)) // Capitalize gift names
                        .join(', ') || 'nothing'; // Default to 'nothing' if no gifts
            const kidDiv = document.createElement('div');
            kidDiv.className = 'kid-item';
            kidDiv.innerHTML = `
                <span>${kid.name} has been a ${kid.behavior} and gets ${gifts}</span>
                <button onclick="removeFromSaved('${kid.id}')">Remove</button>
            `;
            // Append kidDiv to savedOutput
            savedOutput.appendChild(kidDiv);
        });
    } catch (error) {
        console.error('Error loading saved kids:', error);
        localStorage.setItem('savedKids', '[]');
    }
}

// Save kid to localStorage
function saveToLocal(kidId, kidName, kidAge, kidBehavior, timestamp, kidGiftStates) {
    try {
        // Decode and parse the giftStates string
        const giftStatesObject = JSON.parse(decodeURIComponent(kidGiftStates));
        
        // Create kid object
        const kid = {
            id: kidId,
            name: kidName,
            age: kidAge,
            behavior: kidBehavior,
            timestamp: timestamp,
            giftStates: giftStatesObject
        };
        
        // Delete kid from database
        fetch(`${urlkid}/${kidId}`, {
            method: 'DELETE'            
        })
        .then(() => fetchdatakid())
        .catch(e => console.error('Error deleting kid:', e));
        
        // Get all saved kids
        const savedKids = JSON.parse(localStorage.getItem('savedKids') || '[]');
        
        // Check if kid is already saved
        if (!savedKids.some(p => p.id === kid.id)) {
            savedKids.push(kid);
            localStorage.setItem('savedKids', JSON.stringify(savedKids));
            loadSavedKids();
        } else {
            alert('This kid is already saved!');
        }
    } catch (error) {
        console.error('Error saving kid:', error);
    }
}

// Remove kid from saved Kids
function removeFromSaved(kidId) {
    try {
        const savedKids = JSON.parse(localStorage.getItem('savedKids') || '[]');
        // Convert kidId to string for consistent comparison
        const kidIdString = String(kidId);
        const updatedKids = savedKids.filter(kid => kid.id !== kidIdString);
        localStorage.setItem('savedKids', JSON.stringify(updatedKids));
        loadSavedKids();
    } catch (error) {
        console.error('Error removing saved kid:', error);
    }
}

// Clear localStorage
document.getElementById('clearStorage').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved kids?')) {
        localStorage.removeItem('savedKids');
        loadSavedKids();
    }
});

// Initial load
fetchdatakid();
fetchdatatoy();
loadSavedKids();