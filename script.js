const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightboxImg.src = item.src;
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
    }
});

// Comments functionality
const nameInput = document.getElementById('name-input');
const commentInput = document.getElementById('comment-input');
const submitBtn = document.getElementById('submit-comment');
const commentsContainer = document.getElementById('comments-container');

// Load comments from localStorage
function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    commentsContainer.innerHTML = '';
    comments.forEach(comment => {
        displayComment(comment);
    });
}

// Display a single comment
function displayComment(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${comment.name}</span>
            <span class="comment-date">${comment.date}</span>
        </div>
        <div class="comment-text">${comment.text}</div>
    `;
    commentsContainer.appendChild(commentDiv);
}

// Add new comment
submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const text = commentInput.value.trim();
    
    if (name && text) {
        const comment = {
            name: name,
            text: text,
            date: new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            })
        };
        
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.unshift(comment);
        localStorage.setItem('comments', JSON.stringify(comments));
        
        nameInput.value = '';
        commentInput.value = '';
        
        loadComments();
    }
});

// Load comments on page load
loadComments();
