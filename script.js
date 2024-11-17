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
                        <div class="edit-form" style="display: none;">
                            <input type="text" class="edit-title" value="${kids.name}">
                            <input type="number" class="edit-views" value="${kids.age}">
                            <input type="text" class="edit-likes" value="${kids.behavior}">
                            <button class="smallbutton" onclick="saveEdit('${kids.id}')">S</button>
                            <button class="smallbutton" onclick="cancelEdit('${kids.id}')">X</button>
                        </div>
                        <div class="button-group">
                            <button class="smallbutton mx-1" onclick="addBooks('${kids.id}')"><i class="fa-solid fa-book"></i></button>
                            <button class="smallbutton mx-1" onclick='addClothes("${kids.id}")'><i class="fa-solid fa-shirt"></i></button>
                            <button class="smallbutton mx-1" onclick="addDolls('${kids.id}')"><i class="fa-solid fa-person"></i></button>
                            <button class="smallbutton mx-1" onclick="addCars('${kids.id}')"><i class="fa-solid fa-car-side"></i></button>
                            <button class="redbutton2 smallbutton mx-1" onclick="addCoals('${kids.id}')"><i class="fa-solid fa-poop"></i></button>
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
    const newPost = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        behavior: document.getElementById('behavior').value
        // timestamp: Date.now() // Add timestamp when creating new post
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
        fetchdata();
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
        document.getElementById('behavior').value = '';
    })
    .catch(e => console.error('Error adding kid:', e));
});




// Initial load
fetchdatakid();
fetchdatatoy();