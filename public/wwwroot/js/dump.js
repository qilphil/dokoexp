document.addEventListener('DOMContentLoaded', function () {
  const dumpId = document.getElementById('dumpId').value;

  // Load data when tab is shown
  document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function (event) {
      const targetId = event.target.getAttribute('aria-controls');
      loadTabData(targetId, dumpId);
    });
  });

  // Load initial tab data
  loadTabData('spiel', dumpId);
});

function loadTabData(tabId, dumpId) {
  const container = document.getElementById(`${tabId}Data`);

  // Check if data is already loaded
  if (container.getAttribute('data-loaded') === 'true') {
    return;
  }

  fetch(`/api/dumps/${dumpId}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        container.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        return;
      }

      try {
        const jsonData = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;

        if (tabId === 'spiel' && jsonData.Spiel) {
          renderSpielData(container, jsonData.Spiel);
        } else if (tabId === 'spielrunde' && jsonData.Spielrunde) {
          renderSpielrundeData(container, jsonData.Spielrunde);
        } else if (tabId === 'spieler' && jsonData.Spieler) {
          renderSpielerData(container, jsonData.Spieler);
        } else {
          container.innerHTML = `<div class="alert alert-warning">No ${tabId} data found in this dump.</div>`;
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        container.innerHTML = `<div class="alert alert-danger">Error parsing JSON data: ${error.message}</div>`;
      }

      container.setAttribute('data-loaded', 'true');
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      container.innerHTML = `<div class="alert alert-danger">Error fetching data: ${error.message}</div>`;
    });
}

function renderSpielData(container, spielData) {
  if (!spielData.length) {
    container.innerHTML = '<div class="alert alert-info">No game data available.</div>';
    return;
  }

  console.log('Rendering Spiel data:', spielData);

  let html = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Geber</th>
            <th>Spielorder</th>
            <th>Score</th>
            <th>Results</th>
            <th>Solo</th>
            <th>Spielrunde</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>`;

  spielData.forEach(spiel => {
    // Parse hasWon array if it's a string
    let hasWonArray = [];
    try {
      console.log('hasWon raw value:', spiel.hasWon);

      if (spiel.hasWon) {
        if (typeof spiel.hasWon === 'string') {
          // Try to parse as JSON
          hasWonArray = JSON.parse(spiel.hasWon);
          console.log('Parsed hasWon from string:', hasWonArray);
        } else if (Array.isArray(spiel.hasWon)) {
          // Already an array
          hasWonArray = spiel.hasWon;
          console.log('hasWon is already an array:', hasWonArray);
        } else {
          console.log('hasWon is not a string or array:', typeof spiel.hasWon);
        }
      } else {
        console.log('hasWon is empty or null');
      }
    } catch (e) {
      console.error('Error parsing hasWon:', e, spiel.hasWon);
    }

    // Generate pips HTML
    let pipsHtml = '';
    if (Array.isArray(hasWonArray) && hasWonArray.length > 0) {
      console.log('Generating pips for:', hasWonArray);
      hasWonArray.forEach(won => {
        const pipClass = won ? 'pip-green' : 'pip-red';
        pipsHtml += `<span class="pip ${pipClass}" title="${won ? 'Won' : 'Lost'}"></span>`;
      });
    } else {
      pipsHtml = '<span class="text-muted">No data</span>';
      console.log('No hasWon data to display');
    }

    html += `
      <tr>
        <td>${spiel.id}</td>
        <td>${spiel.geber}</td>
        <td>${spiel.spielorder}</td>
        <td>${spiel.score}</td>
        <td class="pips-container">${pipsHtml}</td>
        <td>${spiel.solo ? 'Yes' : 'No'}</td>
        <td>${spiel.spielrunde}</td>
        <td>${new Date(spiel.startTime).toLocaleString()}</td>
        <td>${new Date(spiel.endTime).toLocaleString()}</td>
      </tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>`;

  container.innerHTML = html;
  console.log('Rendered Spiel data table');
}

function renderSpielrundeData(container, spielrundeData) {
  if (!spielrundeData.length) {
    container.innerHTML = '<div class="alert alert-info">No game round data available.</div>';
    return;
  }

  let html = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Finished</th>
            <th>Players</th>
            <th>Number of Games</th>
          </tr>
        </thead>
        <tbody>`;

  spielrundeData.forEach(spielrunde => {
    let players;
    try {
      players = JSON.parse(spielrunde.spieler).join(', ');
    } catch (e) {
      players = spielrunde.spieler;
    }

    html += `
      <tr>
        <td>${spielrunde.id}</td>
        <td>${new Date(spielrunde.startTime).toLocaleString()}</td>
        <td>${new Date(spielrunde.endTime).toLocaleString()}</td>
        <td>${spielrunde.finished ? 'Yes' : 'No'}</td>
        <td>${players}</td>
        <td>${spielrunde.numSpiele}</td>
      </tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>`;

  container.innerHTML = html;
}

function renderSpielerData(container, spielerData) {
  if (!spielerData.length) {
    container.innerHTML = '<div class="alert alert-info">No player data available.</div>';
    return;
  }

  let html = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Short Name</th>
            <th>Initials</th>
          </tr>
        </thead>
        <tbody>`;

  spielerData.forEach(spieler => {
    html += `
      <tr>
        <td>${spieler.id}</td>
        <td>${spieler.name}</td>
        <td>${spieler.kurzName}</td>
        <td>${spieler.initials}</td>
      </tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>`;

  container.innerHTML = html;
} 