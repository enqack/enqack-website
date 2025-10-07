import DataTable from 'datatables.net-bs5';

document.addEventListener('DOMContentLoaded', () => {
  const dtInstances = [];

  const parseValue = (val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (/^\d+$/.test(val)) return parseInt(val, 10);
    if (/^\d+(\.\d+)?$/.test(val)) return parseFloat(val);
    if (val.includes(',')) return val.split(',').map(v => v.trim());
    return val;
  };

  document.querySelectorAll('.DataTables').forEach((tableEl) => {
    const datasetOptions = {};
    for (const [key, value] of Object.entries(tableEl.dataset)) {
      datasetOptions[key] = parseValue(value);
    }

    // Parse embedded JSON config (if any)
    let jsonOptions = {};
    const jsonEl = tableEl.parentElement.querySelector('.dt-config');
    if (jsonEl) {
      try {
        jsonOptions = JSON.parse(jsonEl.textContent);
      } catch (err) {
        console.error('Invalid JSON in DataTable config:', err);
      }
    }

    // Handle `order` array properly
    if (datasetOptions.order && Array.isArray(datasetOptions.order) && datasetOptions.order.length === 2) {
      datasetOptions.order = [[parseInt(datasetOptions.order[0], 10), datasetOptions.order[1]]];
    }

    const dt = new DataTable(tableEl, {
      ordering: true,
      pageLength: 50,
      pagingType: 'full_numbers',
      responsive: true,
      ...datasetOptions,
      ...jsonOptions,
      language: {
        search: 'Filter records:',
        lengthMenu: 'Display _MENU_ records per page',
        info: 'Showing page _PAGE_ of _PAGES_',
      },
      drawCallback: function () {
        if (this.columns?.adjust) this.columns.adjust();
      },
      initComplete: function () {
        if (this.columns?.adjust) this.columns.adjust();
      },
    });

    dtInstances.push(dt);
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      dtInstances.forEach((dt) => dt.columns.adjust());
    }, 250);
  });
});
