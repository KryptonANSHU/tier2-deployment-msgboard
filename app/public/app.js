const list = document.getElementById('list');
const input = document.getElementById('msg');

async function load() {
  const res = await fetch('/api/messages');
  const msgs = await res.json();
  list.innerHTML = '';
  for (const m of msgs) {
    const li = document.createElement('li');
    li.textContent = m.message;
    const small = document.createElement('small');
    small.textContent = new Date(m.created_at).toLocaleString();
    li.appendChild(small);
    list.appendChild(li);
  }
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input.value }),
  });
  input.value = '';
  load();
});

load();
