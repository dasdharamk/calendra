(function(){
  const monthLabel = document.getElementById('monthLabel');
  const yearLabel = document.getElementById('yearLabel');
  const grid = document.getElementById('calendarGrid');

  const sampleEvents = {
    "2025-10-01": [{title: "Project Due", type: "work"}],
    "2025-10-05": [{title: "Friend's Birthday", type: "event"}],
    "2025-10-13": [{title: "Public Holiday", type: "holiday"}],
    "2025-10-20": [{title: "Doctor", type: "reminder"}],
  };

  let viewDate = new Date();
  viewDate.setHours(0,0,0,0);

  function isoDate(d){
    const y=d.getFullYear(), m=d.getMonth()+1, day=d.getDate();
    return `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }

  function render(){
    grid.innerHTML = '';
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    monthLabel.textContent = months[month];
    yearLabel.textContent = year;

    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const prevLast = new Date(year, month, 0).getDate();

    const totalCells = 42;
    for (let i=0; i<totalCells; i++){
      const cell = document.createElement('div');
      cell.className = 'day';
      cell.setAttribute('role','gridcell');

      const index = i - startWeekday + 1;
      let cellDate;
      let outside = false;
      if (index <= 0) {
        cellDate = new Date(year, month-1, prevLast + index);
        outside = true;
      } else if (index > daysInMonth) {
        cellDate = new Date(year, month+1, index - daysInMonth);
        outside = true;
      } else {
        cellDate = new Date(year, month, index);
      }

      if (outside) cell.classList.add('outside');

      const dateSpan = document.createElement('div');
      dateSpan.className = 'date';
      dateSpan.textContent = cellDate.getDate();
      cell.appendChild(dateSpan);

      const today = new Date();
      today.setHours(0,0,0,0);
      if (cellDate.getTime() === today.getTime()) cell.classList.add('today');

      const iso = isoDate(cellDate);
      if (sampleEvents[iso]) {
        const eventsWrap = document.createElement('div');
        eventsWrap.className = 'events';
        sampleEvents[iso].forEach(ev => {
          const evEl = document.createElement('div');
          evEl.className = 'ev ' + (ev.type || 'event');
          evEl.textContent = ev.title;
          eventsWrap.appendChild(evEl);
        });
        cell.appendChild(eventsWrap);
      } else {
        const spacer = document.createElement('div');
        spacer.style.height = '6px';
        cell.appendChild(spacer);
      }

      cell.addEventListener('click', ()=> {
        const plays = sampleEvents[iso];
        if (plays) {
          const list = plays.map(p => `• ${p.title} (${p.type})`).join('\n');
          alert(`${iso}\n\nEvents:\n${list}`);
        } else {
          alert(`${iso}\n\nNo events. Add one!`);
        }
      });

      grid.appendChild(cell);
    }
  }

  document.getElementById('prevBtn').addEventListener('click', ()=>{
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1);
    render();
  });

  document.getElementById('nextBtn').addEventListener('click', ()=>{
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1);
    render();
  });

  document.getElementById('todayBtn').addEventListener('click', ()=>{
    viewDate = new Date();
    viewDate.setHours(0,0,0,0);
    render();
  });

  render();
  window.calendarSampleEvents = sampleEvents;
})();
