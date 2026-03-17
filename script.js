// Supabase setup
const SUPABASE_URL = 'https://bjqcnvgunbljvradvoco.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcWNudmd1bmJsanZyYWR2b2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTg3MjIsImV4cCI6MjA4OTMzNDcyMn0.lt5OQCuawVNb2I0s3cezs8Dhk8XEfoxZgx0nusy4WRA';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

// Load comments from Supabase
async function loadComments() {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error loading comments:', error);
        return;
    }
    
    commentsContainer.innerHTML = '';
    data.forEach(comment => {
        displayComment(comment);
    });
}

// Display a single comment
function displayComment(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    const date = new Date(comment.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    commentDiv.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${comment.name}</span>
            <span class="comment-date">${date}</span>
        </div>
        <div class="comment-text">${comment.text}</div>
    `;
    commentsContainer.appendChild(commentDiv);
}

// Add new comment
submitBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const text = commentInput.value.trim();
    
    if (name && text) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';
        
        const { error } = await supabase
            .from('comments')
            .insert([{ name, text }]);
        
        if (error) {
            console.error('Error posting comment:', error);
            alert('Error posting comment. Please try again.');
        } else {
            nameInput.value = '';
            commentInput.value = '';
            await loadComments();
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Message';
    }
});

// Load comments on page load
loadComments();
