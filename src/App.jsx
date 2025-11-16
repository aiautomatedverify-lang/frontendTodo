import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask, patchTask } from './services/taskService';
import './App.css';

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      if (Array.isArray(data)) setTasks(data);
      else setTasks([]);
    } catch (err) {
      setError('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const onAdd = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const taskData = { ...newTask };
      const res = await createTask(taskData);
      if (res && res.task) setTasks(prev => [res.task, ...prev]);
      setNewTask({ title: '', description: '', priority: 'Medium' });
    } catch {
      setError('Failed to create task');
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch {
      setError('Failed to delete task');
    }
  };

  const onToggleComplete = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      const res = await patchTask(task._id, { status: newStatus });
      if (res && res.task) {
        setTasks(prev => prev.map(t => t._id === res.task._id ? res.task : t));
      }
    } catch {
      setError('Failed to update task');
    }
  };

  if (loading) return <div className="container loading">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h1 className="app-title">My Todo List</h1>

      <form onSubmit={onAdd} className="add-form">
        <h2 className="form-title">Add New Task</h2>

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={newTask.title}
          onChange={handleInputChange}
          className="input"
          required
        />

        <textarea
          name="description"
          placeholder="Task description"
          value={newTask.description}
          onChange={handleInputChange}
          className="textarea"
        />

        <select
          name="priority"
          value={newTask.priority}
          onChange={handleInputChange}
          className="select"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button type="submit" className="btn-add">+ Add Task</button>
      </form>

      <div className="tasks-list">
        <h2 className="section-title">Tasks ({tasks.length})</h2>

        {tasks.length === 0 ? (
          <p className="empty-message">No tasks found.</p>
        ) : (
          <ul className="task-ul">
            {tasks.map(task => (
              <li key={task._id} className={`task-item ${task.status === 'Completed' ? 'completed' : ''}`}>
                <div className="task-left">
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-desc">{task.description}</p>

                  <div className="task-meta">
                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className={`status-tag ${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                <div className="task-actions">
                  <button 
                    onClick={() => onToggleComplete(task)}
                    className={`btn-toggle ${task.status === 'Completed' ? 'undo' : 'complete'}`}
                  >
                    {task.status === 'Completed' ? 'Undo' : 'Complete'}
                  </button>

                  <button 
                    onClick={() => onDelete(task._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TodoApp;
