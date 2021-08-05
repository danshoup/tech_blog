const updatePostHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#update-title').value.trim();
    const content = document.querySelector('#update-content').value.trim();
    const post = document.querySelector('.update-form');
    id = post.dataset.post_id;

    if (title && content) {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            document.location.replace('/dashboard');
        }   else {
            alert(response.statusText);
        };
    };
};

const deletePostHandler = async (event) => {
    event.preventDefault();

    const post = document.querySelector('.update-form');
    id = post.dataset.post_id;

    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    }   else {
        alert(response.statusText);
    };
};

document.
    querySelector('.delete-post').
    addEventListener('click', deletePostHandler);

document.
    querySelector('.update-post').
    addEventListener('click', updatePostHandler);
