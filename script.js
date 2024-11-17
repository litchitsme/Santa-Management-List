const urlkid ='http://localhost:3000/kids'
const urltoy = 'http://localhost:3000/toys'
const output = document.getElementById('output')
const savedOutput = document.getElementById('savedOutput')
const toyOutput = document.getElementById('toyOutput')




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
                        <span class="post-content">${kids.name} (${kids.age}) (${kids.behavior || 0})</span>
                        <div class="edit-form" style="display: none;">
                            <input type="text" class="edit-title" value="${kids.name}">
                            <input type="number" class="edit-views" value="${kids.age}">
                            <input type="number" class="edit-likes" value="${kids.behavior || 0}">
                            <button class="smallbutton" onclick="saveEdit('${kids.id}')">S</button>
                            <button class="smallbutton" onclick="cancelEdit('${kids.id}')">X</button>
                        </div>
                        <div class="button-group">
                            <button onclick="editPost('${kids.id}')">Edit</button>
                            <button onclick="saveToLocal('${kids.id}', '${kids.name}', ${kids.age}, ${kids.behavior || 0}, ${kids.timestamp})">Save</button>
                            <button onclick="deletePost('${kids.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching kids:', e));
}
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
                        <span class="post-content">${toys.type}</span>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching toys:', e));
}






// Initial load
fetchdatakid();
fetchdatatoy();
// loadSavedPosts();