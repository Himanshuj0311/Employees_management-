const API_BASE = 'http://localhost:5000'; // your backend URL
const token = localStorage.getItem('token');
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const data = Object.fromEntries(new FormData(e.target));
  
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.message || 'Login failed');
      }
  
      if (result.token) {
        localStorage.setItem('token', result.token);
        location.href = 'dashboard.html';
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  });
  



// Fetch Tasks
fetch(`${API_BASE}/tasks`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(tasks => {
    const list = document.getElementById('taskList');
    if (!Array.isArray(tasks)) {
      list.innerHTML = '<li>No tasks found</li>';
      return;
    }
    list.innerHTML = tasks.map(task =>
      `<li><strong>${task.title}</strong> - ${task.description} (Due: ${new Date(task.dueDate).toLocaleDateString()})</li>`
    ).join('');
  });

// Submit Task (Managers)
document.getElementById('taskForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert('Task created!');
    window.location.reload();
  } else {
    const err = await res.json();
    alert(err.message || 'Task creation failed.');
  }
});

// Submit Work Log
document.getElementById('logForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  data.tasksWorkedOn = data.tasksWorkedOn.split(',').map(task => task.trim());

  const res = await fetch(`${API_BASE}/worklogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert('Log submitted!');
    window.location.reload();
  } else {
    const err = await res.json();
    alert(err.message || 'Log submission failed.');
  }
});

// Fetch Work Logs
fetch(`${API_BASE}/worklogs`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(logs => {
    const list = document.getElementById('logList');
    if (!Array.isArray(logs)) {
      list.innerHTML = '<li>No logs found</li>';
      return;
    }
    list.innerHTML = logs.map(log =>
      `<li>${new Date(log.startTime).toLocaleString()} - ${new Date(log.endTime).toLocaleString()} | Tasks: ${log.tasksWorkedOn.join(', ')}</li>`
    ).join('');
  });

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}
