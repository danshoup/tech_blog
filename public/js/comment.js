const commentFormHandler = async (event) => {
    event.preventDefault();
  
    const comment = document.querySelector('#new-comment').value.trim();
    const post_id = document.querySelector('data-post_id');
  
    if (comment && post_id) {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ comment, post_id }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }
  };

  document
  .querySelector('.comment-form')
  .addEventListener('submit', commentFormHandler);