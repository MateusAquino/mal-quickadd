function buildTodoistURL() {
  const today = new Date();
  const toDate = (w, h, m) => new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + w, h - 9, m)).toLocaleString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric' })
  const getInfo = (query) => Array.from(document.querySelectorAll('.spaceit_pad')).map(el => el.textContent.trim().split('\n').map(el => el.trim())).filter(split => split.length == 2).find(el => el[0].toLowerCase().slice(0, -1) == query.toLowerCase());
  const isFinished = getInfo('status')[1].includes('Finished Airing')
  const aired = getInfo('aired')[1].split('to')
  const broadcast = (el => el && !el[1].split(' ')[0].includes('Unknown') && el[1].split(' '))(getInfo('broadcast'))
  const until = broadcast && !isFinished && aired.length > 1 && !aired[1].includes('?') ? ' until' + aired[1] : '';
  const weekDays = 'Sundays|Mondays|Tuesdays|Wednesdays|Thursdays|Fridays|Saturdays'.split('|')
  const recurrent = broadcast ? toDate(weekDays.indexOf(broadcast[0]), ...broadcast[2].split(':')) : ''
  const date = (broadcast ? (isFinished ? aired[1] : 'every ' + recurrent) : (aired[0].includes(',') ? aired[0] : 'Not available')).trim();
  const content = encodeURIComponent(document.querySelector('.title-name').textContent);
  const query = !date.includes('Not available') ? '&date=' + encodeURIComponent(`${date}${until}`) : '';
  const url = `https://todoist.com/add?content=${content}${query}`
  return url;
}

const statusBlock = document.querySelector('.user-status-block')
const todoistBtn = document.createElement('div');
const todoistIcon = document.createElement('img');
const todoistURL = statusBlock && buildTodoistURL();

if (statusBlock && todoistURL) {
  todoistIcon.src = 'https://todoist.com/static/favicon.ico';
  todoistIcon.style = 'padding-right: 6px; height: 14px; vertical-align: middle';
  todoistBtn.style.cursor = 'pointer';
  todoistBtn.className = 'btn-forum-episode fl-r mr8';
  todoistBtn.appendChild(todoistIcon);
  todoistBtn.appendChild(document.createTextNode('Add to Todoist'));
  todoistBtn.onclick = () => window.open(todoistURL, '_blank').focus();
  statusBlock.appendChild(todoistBtn);
}