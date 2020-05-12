const api = `zEE5nKn5wIFmy03pO7b`;
const search = document.querySelector('form');
const stEle = document.querySelector('.streets');
const headerEle = document.getElementById('street-name');
const bodyEle = document.querySelector('tbody');

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
      stEle.textContent = '';
      bodyEle.textContent = '';
      headerEle.textContent = '';
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

stEle.onclick = event => {
  const streetEle = event.target.closest('a');
  getStreet(streetEle.dataset.streetKey)
}

function getStreet(choosenStreet) {
  let allResults;
  let promiseArray = [];

  fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${choosenStreet}&api-key=${api}`)
  .then(response => {
    if(response.ok) {
      return response.json();
    } else {
      throw new Error('we have a problem');
    }
  })
  .then(busStops => {
    for(let stop of busStops.stops) {
      allResults = fetch(`https://api.winnipegtransit.com/v3/stops/${stop.key}/schedule.json?api-key=${api}`)
      .then(response => {
        if(response.ok) {
          return response.json();
        } else {
          throw new Error('we have a problem');
        } 
      })
      promiseArray.push(allResults);
    }
    insertStreetsIntoDom(promiseArray);
  })
}

function insertStreetsIntoDom(promiseArray) {
  Promise.all(promiseArray).then(scheduleStop => {
    headerEle.insertAdjacentHTML('afterbegin',`
    Displaying results for ${scheduleStop[0]["stop-schedule"].stop.street.name}`);
    for (let st of scheduleStop) {
      let time = new Date 
      (`${st['stop-schedule']['route-schedules'][0]['scheduled-stops'][0].times.departure.scheduled}`);
      const todayTime = time.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12:true,
      });

      bodyEle.insertAdjacentHTML(
        "afterbegin", `
          <tr>
            <td>${st["stop-schedule"].stop.street.name}</td>
            <td>${st["stop-schedule"].stop["cross-street"].name}</td>
            <td>${st["stop-schedule"].stop.direction}</td>
            <td>${st["stop-schedule"]["route-schedules"][0].route.key}</td>
            <td> ${todayTime}</td>
          </tr>`
      );
    }
  })
}