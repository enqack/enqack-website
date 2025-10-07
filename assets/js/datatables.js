import DataTable from 'datatables.net-bs5';

document.addEventListener('DOMContentLoaded', () => {
  const dtInstances = [];

  document.querySelectorAll('.DataTables').forEach((tableEl) => {
    const dt = new DataTable(tableEl, {
      ordering: true,
      order: [[0, 'asc']],
      pageLength: 50,
      pagingType: 'full_numbers',
      responsive: true,
      language: {
        search: 'Filter records:',
        lengthMenu: 'Display _MENU_ records per page',
        info: 'Showing page _PAGE_ of _PAGES_',
      },
      // Use drawCallback for safer post-render adjustments
      drawCallback: function () {
        if (this.columns?.adjust) this.columns.adjust();
      },
      initComplete: function () {
        if (this.columns?.adjust) this.columns.adjust();
      },
    });

    dtInstances.push(dt);
  });

  // Throttle resize adjustment
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      dtInstances.forEach((dt) => dt.columns.adjust());
    }, 250);
  });
});
