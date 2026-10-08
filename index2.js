const API_URL = 'http://212.193.11.210:3000';
const STUDENT_ID = 1;

async function request(path, options = {}) {
  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      'X-Student-Id': String(STUDENT_ID),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = (data && (data.error || data.message)) || `Ошибка сервера (${response.status})`;
    throw new Error(message);
  }
  return data;
}

const getTodos = () => request('/todos');
const createTodo = (title) => request('/todos', { method: 'POST', body: JSON.stringify({ title }) });
const updateTodo = (id, data) => request(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
const deleteTodo = (id) => request(`/todos/${id}`, { method: 'DELETE' });

const state = {
  todos: [],
  filter: 'all',
  query: '',
  loading: true,
  adding: false,
  pending: new Set(),
  clearing: false,
};

const els = {
  form: document.querySelector('#add-form'),
  title: document.querySelector('#title'),
  addBtn: document.querySelector('#add-btn'),
  search: document.querySelector('#search'),
  list: document.querySelector('#list'),
  status: document.querySelector('#status'),
  stats: document.querySelector('#stats'),
  filters: document.querySelectorAll('[data-filter]'),
  clearDone: document.querySelector('#clear-done'),
};

function getVisibleTodos() {
  const q = state.query.trim().toLowerCase();
  return state.todos
    .filter((t) => {
      if (state.filter === 'active') return !t.completed;
      if (state.filter === 'done') return t.completed;
      return true;
    })
    .filter((t) => q === '' || t.title.toLowerCase().includes(q));
}

function getStats(todos) {
  const done = todos.filter((t) => t.completed).length;
  return { total: todos.length, done, active: todos.length - done };
}

function showMessage(text, isError = false) {
  els.status.textContent = text;
  els.status.classList.toggle('error', isError);
}

function showError(err) {
  const text = err.name === 'TypeError' ? 'Сервер недоступен. Проверьте подключение.' : err.message;
  showMessage('Ошибка: ' + text, true);
}

function render() {
  els.list.innerHTML = '';
  const visible = getVisibleTodos();

  if (state.loading) {
  } else if (visible.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = state.todos.length === 0 ? 'Задач пока нет' : 'Ничего не найдено';
    els.list.appendChild(li);
  }

  for (const todo of visible) {
    const busy = state.pending.has(todo.id);
    const li = document.createElement('li');
    li.className = (todo.completed ? 'done' : '') + (busy ? ' busy' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.disabled = busy;
    checkbox.addEventListener('change', () => toggleTodo(todo.id, checkbox.checked));

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = todo.title;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = busy ? 'Удаляем...' : '✕';
    removeBtn.disabled = busy;
    removeBtn.addEventListener('click', () => removeTodo(todo.id));

    li.append(checkbox, title, removeBtn);
    els.list.appendChild(li);
  }

  const stats = getStats(state.todos);
  els.stats.textContent = `Всего: ${stats.total}, активных: ${stats.active}, выполненных: ${stats.done}`;

  els.addBtn.disabled = state.adding;
  els.addBtn.textContent = state.adding ? 'Сохраняем...' : 'Добавить';
  els.clearDone.disabled = state.clearing || stats.done === 0;
  els.filters.forEach((btn) => btn.classList.toggle('active', btn.dataset.filter === state.filter));
}

async function loadTodos() {
  state.loading = true;
  showMessage('Загрузка...');
  render();
  try {
    state.todos = await getTodos();
    showMessage('');
  } catch (err) {
    showError(err);
  } finally {
    state.loading = false;
    render();
  }
}

async function addTodo() {
  const title = els.title.value.trim();
  if (title === '' || state.adding) return;

  state.adding = true;
  showMessage('');
  render();
  try {
    const created = await createTodo(title);
    state.todos = [...state.todos, created];
    els.title.value = '';
  } catch (err) {
    showError(err);
  } finally {
    state.adding = false;
    render();
  }
}

async function removeTodo(id) {
  if (state.pending.has(id)) return;
  state.pending.add(id);
  showMessage('');
  render();
  try {
    await deleteTodo(id);
    state.todos = state.todos.filter((t) => t.id !== id);
  } catch (err) {
    showError(err);
  } finally {
    state.pending.delete(id);
    render();
  }
}

async function toggleTodo(id, completed) {
  if (state.pending.has(id)) return;
  state.pending.add(id);
  showMessage('');
  render();
  try {
    const updated = await updateTodo(id, { completed });
    state.todos = state.todos.map((t) => (t.id === id ? updated : t));
  } catch (err) {
    showError(err);
  } finally {
    state.pending.delete(id);
    render();
  }
}

async function clearCompleted() {
  const doneIds = state.todos.filter((t) => t.completed).map((t) => t.id);
  if (doneIds.length === 0 || state.clearing) return;

  state.clearing = true;
  doneIds.forEach((id) => state.pending.add(id));
  showMessage('Удаляем выполненные...');
  render();

  const results = await Promise.allSettled(doneIds.map((id) => deleteTodo(id)));
  const deleted = doneIds.filter((id, i) => results[i].status === 'fulfilled');
  state.todos = state.todos.filter((t) => !deleted.includes(t.id));

  const failed = results.find((r) => r.status === 'rejected');
  if (failed) {
    showError(failed.reason);
  } else {
    showMessage('');
  }

  doneIds.forEach((id) => state.pending.delete(id));
  state.clearing = false;
  render();
}

els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo();
});

els.search.addEventListener('input', () => {
  state.query = els.search.value;
  render();
});

els.filters.forEach((btn) =>
  btn.addEventListener('click', () => {
    state.filter = btn.dataset.filter;
    render();
  })
);

els.clearDone.addEventListener('click', clearCompleted);

loadTodos();