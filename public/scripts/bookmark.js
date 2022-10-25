// function viewBookmarksForUser(fields) {
//     fetch(`/api/bookmarks?userId=${fields.userId}`)
//       .then(showResponse)
//       .catch(showResponse);
//   }

  function viewBookmarksForUser(fields) {
    fetch(`/api/bookmarks?userId=${fields.userId}`)
      .then(showResponse)
      .catch(showResponse);
  }

  function addBookmarks(fields) {
    fetch('/api/bookmarks', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
  }