const urlkid ='http://localhost:3000/kids'
const urltoy = 'http://localhost:3000/toys'
const output = document.getElementById('output')
const savedOutput = document.getElementById('savedOutput')
const toyOutput = document.getElementById('toyOutput')
const hiddenButtons = {};

// Fetch and display kids
function fetchdatakid() {
    output.innerHTML = '';
    fetch(urlkid)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                const noPostsMessage = document.createElement('div');
                noPostsMessage.className = 'no-posts-message';
                noPostsMessage.textContent = 'No posts available. Add your first post!';
                output.appendChild(noPostsMessage);
                return;
            }
            
            // Sort posts by timestamp in descending order
            const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedData.forEach(kids => {
                const giftStates = kids.giftStates || {};
                output.innerHTML += `
                    <div class="post-item" id="post-${kids.id}">
                        <span class="post-content">${kids.name} : ${kids.age} years old, is a ${kids.behavior} kid</span>
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
                                <button class="smallbutton mx-1 addbook" style="display: ${giftStates.books ? 'none' : 'block'};" onclick="addBooks('${kids.id}')"><i class="fa-solid fa-book"></i></button>
                                <button class="smallbutton deletebutton mx-1 removebook" style="display: ${giftStates.books ? 'block' : 'none'};" onclick="removeBooks('${kids.id}')"><i class="fa-solid fa-book"></i></button>
                                <button class="smallbutton mx-1" style="display: ${giftStates.clothes ? 'none' : 'block'};" onclick="addClothes('${kids.id}')"><i class="fa-solid fa-shirt"></i></button>
                                <button class="smallbutton deletebutton mx-1" style="display: ${giftStates.clothes ? 'block' : 'none'};" onclick="removeClothes('${kids.id}')"><i class="fa-solid fa-shirt"></i></button>
                                <button class="smallbutton mx-1" style="display: ${giftStates.dolls ? 'none' : 'block'};" onclick="addDolls('${kids.id}')"><i class="fa-solid fa-person"></i></button>
                                <button class="smallbutton deletebutton mx-1" style="display : ${giftStates.dolls ? 'block' : 'none'};" onclick="removeDolls('${kids.id}')"><i class="fa-solid fa-person"></i></button>
                                <button class="smallbutton mx-1" style="display : ${giftStates.cars ? 'none' : 'block'};" onclick="addCars('${kids.id}')"><i class="fa-solid fa-car-side"></i></button>
                                <button class="smallbutton deletebutton mx-1" style="display : ${giftStates.cars ? 'block' : 'none'};" onclick="removeCars('${kids.id}')"><i class="fa-solid fa-car-side"></i></button>
                                <button class="redbutton2 smallbutton mx-1" style="display : ${giftStates.coals ? 'none' : 'block'};" onclick="addCoals('${kids.id}')"><i class="fa-solid fa-poop"></i></button>
                                <button class="deletebutton2 smallbutton mx-1" style="display : ${giftStates.coals ? 'block' : 'none'};" onclick="removeCoals('${kids.id}')"><i class="fa-solid fa-poop"></i></button>
                            </div>
                        </div>
                        <div class="button-group">
                            <button onclick="editPost('${kids.id}')">Edit</button>
                            <button onclick="saveToLocal('${kids.id}', '${kids.name}', ${kids.age}, '${kids.behavior}', ${kids.timestamp}, '${encodeURIComponent(JSON.stringify(kids.giftStates))}')">Save</button>
                            <button class="redbutton" onclick="deletePost('${kids.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching kids:', e));
}
// Fetch and display toys
function fetchdatatoy() {
    toyOutput.innerHTML = '';
    fetch(urltoy)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                const noPostsMessage = document.createElement('div');
                noPostsMessage.className = 'no-posts-message';
                noPostsMessage.textContent = 'No posts available. Add your first post!';
                output.appendChild(noPostsMessage);
                return;
            }
            
            // Sort posts by timestamp in descending order
            const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedData.forEach(toys => {
                toyOutput.innerHTML += `
                    <div class="post-item2" id="post-${toys.id}">
                        <span class="mx-1">${toys.icon}</span>
                        <span class="mx-1">${toys.type}</span>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching toys:', e));
}

// Add new kid
document.getElementById('addPostButton').addEventListener('click', () => {
    // e.preventDefault();
    const name = document.getElementById('name').value.charAt(0).toUpperCase() + document.getElementById('name').value.slice(1).toLowerCase();
    const newPost = {
        name: name,
        age: parseInt(document.getElementById('age').value),
        behavior: document.getElementById('behavior').value.toLowerCase(),
        timestamp: Date.now() // Add timestamp when creating new post
    };
    
    fetch(urlkid, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
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
function addGift(kidId, giftType) {
    console.log(kidId, giftType);
    fetch(`${urlkid}/${kidId}`)
        .then(res => res.json())
        .then(kid => {            
            // Update gift states
            const updatedGiftStates = {
                ...kid.giftStates,
                [giftType.toLowerCase()]: true
            };
            
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

function removeGift(kidId, giftType) {
    fetch(`${urlkid}/${kidId}`)
        .then(res => res.json())
        .then(kid => {            
            // Update gift states
            const updatedGiftStates = {
                ...kid.giftStates,
                [giftType.toLowerCase()]: false
            };
            
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

function editPost(id) {
    // Show edit form and hide content for the selected post
    const postDiv = document.getElementById(`post-${id}`);
    console.log(postDiv);
    postDiv.querySelector('.post-content').style.display = 'none';
    postDiv.querySelector('.edit-form').style.display = 'block';
    postDiv.querySelector('.button-group').style.display = 'none';
}

function cancelEdit(id) {
    // Hide edit form and show content
    const postDiv = document.getElementById(`post-${id}`);
    postDiv.querySelector('.post-content').style.display = 'block';
    postDiv.querySelector('.edit-form').style.display = 'none';
    postDiv.querySelector('.button-group').style.display = 'block';
}

function saveEdit(id) {
    // Get the edited values
    const postDiv = document.getElementById(`post-${id}`);
    const newName = postDiv.querySelector('.edit-name').value;
    const newAge = parseInt(postDiv.querySelector('.edit-age').value);
    const newBehavior = (postDiv.querySelector('.edit-behavior').value);

    // Create updated post object
    const updatedPost = {
        name: newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase(),
        age: newAge,
        behavior: newBehavior.toLowerCase(),
        timestamp: Date.now() // Update timestamp
    };

    // Send PUT request to update the post
    fetch(`${urlkid}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
    })
    .then(res => res.json())
    .then(() => {
        // Refresh the posts display
        fetchdatakid();
        fetchdatatoy();
    })
    .catch(e => console.error('Error updating post:', e));
}

function loadSavedPosts() {
    try {
        const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
        savedOutput.innerHTML = '';
        
        if (savedPosts.length === 0) {
            const noPostsMessage = document.createElement('div');
            noPostsMessage.className = 'no-posts-message';
            noPostsMessage.textContent = 'No saved posts yet!';
            savedOutput.appendChild(noPostsMessage);
            return;
        }


        // Sort saved posts by timestamp in descending order
        savedPosts.sort((a, b) => b.timestamp - a.timestamp);
        savedPosts.forEach(kid => {
                        // Format the giftStates into a readable list of gifts
                        const gifts = Object.keys(kid.giftStates)
                        .filter(key => kid.giftStates[key]) // Include only true values
                        // .map(gift => gift.charAt(0).toUpperCase() + gift.slice(1)) // Capitalize gift names
                        .join(', ') || 'nothing'; // Default to 'nothing' if no gifts
            const postDiv = document.createElement('div');
            postDiv.className = 'post-item';
            postDiv.innerHTML = `
                <span>${kid.name} has been a ${kid.behavior} and gets ${gifts}</span>
                <button onclick="removeFromSaved('${kid.id}')">Remove</button>
            `;
            savedOutput.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Error loading saved posts:', error);
        localStorage.setItem('savedPosts', '[]');
    }
}

// Save post to localStorage
function saveToLocal(kidId, kidName, kidAge, kidBehavior, timestamp, kidGiftStates) {
    try {
        // Decode and parse the giftStates string
        const giftStatesObject = JSON.parse(decodeURIComponent(kidGiftStates));
        
        const post = {
            id: kidId,
            name: kidName,
            age: kidAge,
            behavior: kidBehavior,
            timestamp: timestamp,
            giftStates: giftStatesObject
        };
        
        const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
        
        if (!savedPosts.some(p => p.id === post.id)) {
            savedPosts.push(post);
            localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
            loadSavedPosts();
        } else {
            alert('This kid is already saved!');
        }
    } catch (error) {
        console.error('Error saving kid:', error);
    }
}


// Remove post from saved posts
function removeFromSaved(kidId) {
    try {
        const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
        // Convert postId to string for consistent comparison
        const kidIdString = String(kidId);
        const updatedPosts = savedPosts.filter(kid => kid.id !== kidIdString);
        localStorage.setItem('savedPosts', JSON.stringify(updatedPosts));
        loadSavedPosts();
    } catch (error) {
        console.error('Error removing saved kid:', error);
    }
}

// Delete post
function deletePost(id) {
    fetch(`${urlkid}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchdatakid())
    .catch(e => console.error('Error deleting post:', e));
}

// Clear localStorage
document.getElementById('clearStorage').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved posts?')) {
        localStorage.removeItem('savedPosts');
        loadSavedPosts();
    }
});

function addBooks(kidId) {
    addGift(kidId, 'Books');
}

function removeBooks(kidId) {
    removeGift(kidId, 'Books');
}

function addClothes(kidId) {
    addGift(kidId, 'Clothes');
}

function removeClothes(kidId) {
    removeGift(kidId, 'Clothes');
}

function addDolls(kidId) {
    addGift(kidId, 'Dolls');
}

function removeDolls(kidId) {
    removeGift(kidId, 'Dolls');
}

function addCars(kidId) {
    addGift(kidId, 'Cars');
}

function removeCars(kidId) {
    removeGift(kidId, 'Cars');
}

function addCoals(kidId) {
    addGift(kidId, 'Coals');
}

function removeCoals(kidId) {
    removeGift(kidId, 'Coals');
}


// Initial load
fetchdatakid();
fetchdatatoy();
loadSavedPosts();