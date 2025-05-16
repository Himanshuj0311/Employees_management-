const API_BASE = 'http://localhost:5000'; // your backend URL
//http://localhost:5000/api/auth/login
const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const data = Object.fromEntries(new FormData(e.target));
  
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await res.json();

     // console.log(result)
  
      if (!res.ok) {
        throw new Error(result.message || 'Login failed');
      }

      
  
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('email', data.email);
        
        location.href = 'dashboard.html';
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  });

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const data = Object.fromEntries(new FormData(e.target));
  
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await res.json();

     // console.log(result)
  
      if (!res.ok) {
        throw new Error(result.message || 'register failed');
      }
  
      alert("You are successfully registered please login")
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  });
  



window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token'); 
  const email = localStorage.getItem('email'); 

  

  if (!token || !email) {
    alert('Token or email missing. Please log in.');
    return;
  }

 fetch(`http://localhost:5000/api/tasks?email=${email}`, {
  method: 'GET',
  headers: {
    'Authorization': `${token}`,
    'Content-Type': 'application/json'
  }
})
.then(async res => {
 

  // Try to parse JSON body (if any)
  let data;
  try {
    data = await res.clone().json(); // clone so we don't consume the original stream
   // console.log('Response JSON:', data);
  } catch (err) {
    console.log('No JSON body or parsing error:', err.message);
  }

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return data;
})
.then(tasks => {
  const list = document.getElementById('taskList');
  if (!Array.isArray(tasks) || tasks.length === 0) {
    list.innerHTML = '<li>No tasks found</li>';
    return;
  }

  list.innerHTML = tasks.map(task => `
    <li>
      <strong>${task.title}</strong> - ${task.description}
      (Due: ${new Date(task.dueDate).toLocaleDateString()})
    </li>`).join('');
})
.catch(err => {
  console.error('Error:', err.message);
  document.getElementById('taskList').innerHTML = '<li>Error loading tasks.</li>';
});

});



// Submit Task (Managers)
document.getElementById('taskForm').addEventListener('submit', async e => {
  e.preventDefault();

  // Get token from localStorage
  const token = localStorage.getItem('token'); // Make sure the key matches how you store it
//console.log(token)
  if (!token) {
    alert('Authentication token missing. Please log in again.');
    return;
  }

  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch(`${API_BASE}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
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

  const res = await fetch(`${API_BASE}/api/worklogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
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
fetch(`${API_BASE}/api/worklogs?email=${email}`, {
  headers: {
    'Authorization': `${token}`
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
