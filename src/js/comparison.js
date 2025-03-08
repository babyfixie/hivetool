document
  .getElementById('fileInput')
  .addEventListener('change', handleFileUpload);
document.getElementById('compareBtn').addEventListener('click', compareStats);

let playerDataList = [];

function handleFileUpload(event) {
  const files = event.target.files;

  if (files.length === 0) return;

  Array.from(files).forEach(file => {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        playerDataList.push(data);
      } catch (error) {
        alert('Error reading file: ' + file.name);
      }
    };

    reader.readAsText(file);
  });
}

function compareStats() {
  if (playerDataList.length < 2) {
    alert('Please select at least two files to compare.');
    return;
  }

  const comparisonResultDiv = document.getElementById('comparisonResult');
  comparisonResultDiv.innerHTML = '';

  let tableHTML =
    '<table class="table table-bordered"><thead><tr><th>Stat</th>';

  playerDataList.forEach((data, index) => {
    tableHTML += `<th>${new Date(data.date).toLocaleDateString()}</th>`;
  });

  tableHTML += '</tr></thead><tbody>';

  const stats = Object.keys(playerDataList[0].playerData).filter(
    stat => stat !== 'first_played'
  );

  tableHTML += '<tr><td><strong>Username</strong></td>';
  playerDataList.forEach(data => {
    tableHTML += `<td><strong>${data.playerName}</strong></td>`;
  });
  tableHTML += '</tr>';

  stats.forEach(stat => {
    tableHTML += `<tr><td>${stat}</td>`;

    let values = playerDataList.map(data => data.playerData[stat]);
    let max = Math.max(...values);
    let min = Math.min(...values);

    playerDataList.forEach(data => {
      let value = data.playerData[stat];
      let cellColor = '';

      if (value === max) {
        cellColor = 'style="background-color: #ADFFA0; color: black;"';
      } else if (value === min) {
        cellColor = 'style="background-color: #FF6860; color: black;"';
      }

      tableHTML += `<td ${cellColor}>${value}</td>`;
    });

    tableHTML += '</tr>';
  });

  tableHTML += '</tbody></table>';

  comparisonResultDiv.innerHTML = tableHTML;
}
