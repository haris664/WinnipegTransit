const api = `zEE5nKn5wIFmy03pO7b`;
const search = document.querySelector('form');
const stEle = document.querySelector('.streets');

search.onsubmit = event => {
  const input = event.target.querySelector('input');
  searchStreet(input.value);
  event.preventDefault();
}

function searchStreet(query) {
  fetch(`https://api.winnipegtransit.com/v3/streets.json?name=${query}&usage=long&api-key=${api}`)
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw new Error('We have a problem');
      }
    })
    .then(data => {
      streetDetails(data.streets);
    })
}

function streetDetails(street) {
  if(street.length === 0) {
    stEle.textContent = 'No Result Found';
  }
  street.forEach(st => {
    stEle.insertAdjacentHTML(`afterbegin`,
    `<a href="#" data-street-key=${st.key}>${st.name}</a>`)
  });
}