// ============================================
// DATA EXPLORER
// Loads CSV, lets user pick 2 variables,
// generates cross-tabulation chart + table
// ============================================

(function() {
  'use strict';

  let csvData = [];
  let headers = [];
  let currentChart = null;

  // MiC brand colors for chart
  const COLORS = [
    '#224099', '#10BEE8', '#009E59', '#FF6719',
    '#8B5CF6', '#EC4899', '#F59E0B', '#6366F1',
    '#14B8A6', '#EF4444', '#84CC16', '#0EA5E9'
  ];

  const datasetSelect = document.getElementById('dataset-select');
  const varX = document.getElementById('var-x');
  const varY = document.getElementById('var-y');
  const btnGenerate = document.getElementById('btn-generate');
  const chartContainer = document.getElementById('chart-container');
  const emptyState = document.getElementById('empty-state');
  const tableContainer = document.getElementById('table-container');

  // Load dataset on page load and when changed
  datasetSelect.addEventListener('change', loadCSV);
  btnGenerate.addEventListener('click', generateChart);

  // Initial load
  loadCSV();

  function loadCSV() {
    const url = datasetSelect.value;
    fetch(url)
      .then(r => r.text())
      .then(text => {
        parseCSV(text);
        populateSelectors();
      })
      .catch(err => {
        console.error('Error loading CSV:', err);
        varX.innerHTML = '<option value="">Error al cargar datos</option>';
        varY.innerHTML = '<option value="">Error al cargar datos</option>';
      });
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n');
    headers = lines[0].split(',').map(h => h.trim());
    csvData = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((h, idx) => row[h] = values[idx]);
        csvData.push(row);
      }
    }
  }

  function formatLabel(s) {
    return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function populateSelectors() {
    varX.innerHTML = '';
    varY.innerHTML = '';
    headers.forEach((h, i) => {
      const label = formatLabel(h);
      varX.innerHTML += `<option value="${h}" ${i === 0 ? 'selected' : ''}>${label}</option>`;
      varY.innerHTML += `<option value="${h}" ${i === 1 ? 'selected' : ''}>${label}</option>`;
    });
  }

  function generateChart() {
    const xVar = varX.value;
    const yVar = varY.value;

    if (!xVar || !yVar) return;
    if (xVar === yVar) {
      alert('Selecciona dos variables diferentes.');
      return;
    }

    // Cross-tabulate
    const xValues = [...new Set(csvData.map(r => r[xVar]))];
    const yValues = [...new Set(csvData.map(r => r[yVar]))];

    // Count occurrences
    const counts = {};
    xValues.forEach(x => {
      counts[x] = {};
      yValues.forEach(y => counts[x][y] = 0);
    });
    csvData.forEach(row => {
      counts[row[xVar]][row[yVar]]++;
    });

    // Calculate percentages (row-wise)
    const percentages = {};
    xValues.forEach(x => {
      const total = Object.values(counts[x]).reduce((a, b) => a + b, 0);
      percentages[x] = {};
      yValues.forEach(y => {
        percentages[x][y] = total > 0 ? Math.round((counts[x][y] / total) * 100) : 0;
      });
    });

    // Build Chart.js datasets
    const datasets = yValues.map((yVal, i) => ({
      label: yVal,
      data: xValues.map(x => percentages[x][yVal]),
      backgroundColor: COLORS[i % COLORS.length],
      borderRadius: 6,
      borderSkipped: false,
    }));

    // Show chart, hide empty state
    chartContainer.style.display = 'block';
    emptyState.style.display = 'none';

    // Destroy old chart
    if (currentChart) currentChart.destroy();

    // Create chart
    const ctx = document.getElementById('explorer-canvas').getContext('2d');
    currentChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: xValues,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${formatLabel(yVar)} por ${formatLabel(xVar)} (%)`,
            font: { size: 16, weight: 'bold', family: "'Sailec', sans-serif" },
            color: '#1a1a2e',
            padding: { bottom: 24 }
          },
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12, family: "'Sailec', sans-serif" },
              padding: 16,
              usePointStyle: true,
              pointStyle: 'rectRounded'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 12, family: "'Sailec', sans-serif" },
              color: '#666680'
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: v => v + '%',
              font: { size: 12, family: "'Sailec', sans-serif" },
              color: '#666680'
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });

    // Build HTML table
    let tableHTML = `<table class="data-table">
      <thead><tr><th>${formatLabel(xVar)}</th>`;
    yValues.forEach(y => tableHTML += `<th>${y}</th>`);
    tableHTML += `<th>N</th></tr></thead><tbody>`;
    xValues.forEach(x => {
      const total = Object.values(counts[x]).reduce((a, b) => a + b, 0);
      tableHTML += `<tr><td><strong>${x}</strong></td>`;
      yValues.forEach(y => tableHTML += `<td>${percentages[x][y]}%</td>`);
      tableHTML += `<td>${total}</td></tr>`;
    });
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
  }

})();
