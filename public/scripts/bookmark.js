function viewBookmarksForUser(fields) {
  fetch(`/api/bookmarks?userId=${fields.userId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createBookmark(fields) {
  fetch('/api/bookmarks', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}