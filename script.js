const urlkid ='http://localhost:3000/kids'
const urltoy = 'http://localhost:3000/toys'
const output = document.getElementById('output')
const savedOutput = document.getElementById('savedOutput')
const toyOutput = document.getElementById('toyOutput')



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
                            <div class="button-group">
                                <button class="smallbutton mx-1" onclick="addBooks('${kids.id}')"><i class="fa-solid fa-book"></i></button>
                                <button class="smallbutton mx-1" onclick='addClothes("${kids.id}")'><i class="fa-solid fa-shirt"></i></button>
                                <button class="smallbutton mx-1" onclick="addDolls('${kids.id}')"><i class="fa-solid fa-person"></i></button>
                                <button class="smallbutton mx-1" onclick="addCars('${kids.id}')"><i class="fa-solid fa-car-side"></i></button>
                                <button class="redbutton2 smallbutton mx-1" onclick="addCoals('${kids.id}')"><i class="fa-solid fa-poop"></i></button>
                            </div>
                        </div>
                        <div class="button-group">
                            <button onclick="editPost('${kids.id}')">Edit</button>
                            <button onclick="saveToLocal('${kids.id}', '${kids.name}', ${kids.age}, ${kids.behavior}, ${kids.timestamp})">Save</button>
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
                    <div class="post-item" id="post-${toys.id}">
                        <span>${toys.type}</span>
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
    fetch(`${urlkid}/${kidId}`)
        .then(res => res.json())
        .then(kid => {
            const updatedGifts = kid.gifts ? [...kid.gifts, giftType] : [giftType];

            fetch(`${urlkid}/${kidId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gifts: updatedGifts })
            })
            .then(() => {
                fetchdatakid(); // Refresh the kids list to show updated gifts
            })
            .catch(e => console.error('Error updating kid with gift:', e));
        })
        .catch(e => console.error('Error fetching kid data:', e));
}

function editPost(id) {
    // Show edit form and hide content for the selected post
    const postDiv = document.getElementById(`post-${id}`);
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


// Specific functions for each gift type
function addBooks(kidId) {
    addGift(kidId, 'Book');
}

function addClothes(kidId) {
    addGift(kidId, 'Clothes');
}

function addDolls(kidId) {
    addGift(kidId, 'Doll');
}

function addCars(kidId) {
    addGift(kidId, 'Car');
}

function addCoals(kidId) {
    addGift(kidId, 'Coal');
}


// Initial load
fetchdatakid();
fetchdatatoy();