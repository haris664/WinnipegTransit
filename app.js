const api = `zEE5nKn5wIFmy03pO7b`;
const search = document.querySelector('form');

search.onsubmit = event => {
  const input = event.target.querySelector('input');
  searchStreet(input.value);
  event.preventDefault();
}