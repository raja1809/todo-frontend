import { useEffect, useState } from 'react';
import './App.css';
import { todoAPI } from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      let data;
      
      if (filter === 'completed') {
        data = await todoAPI.getCompletedTodos();
      } else if (filter === 'incomplete') {
        data = await todoAPI.getIncompleteTodos();
      } else {
        data = await todoAPI.getAllTodos();
      }
      
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos. Make sure backend is running!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setError('');
      await todoAPI.createTodo({
        title: title.trim(),
        description: description.trim()
      });
      
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (err) {
      setError('Failed to create todo');
      console.error(err);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      setError('');
      await todoAPI.updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed
      });
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      setError('');
      await todoAPI.deleteTodo(id);
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  const filteredTodos = todos;

  return (
    <div className="app">
      <div className="container">
        <h1>📝 My Todo App</h1>
        
        {error && <div className="error">{error}</div>}
        
        {/* Add Todo Form */}
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            placeholder="Todo title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn btn-primary">
            Add Todo
          </button>
        </form>

        {/* Filter Buttons */}
        <div className="filters">
          <button
            className={`btn ${filter === 'all' ? 'btn-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`btn ${filter === 'incomplete' ? 'btn-active' : ''}`}
            onClick={() => setFilter('incomplete')}
          >
            Active
          </button>
          <button
            className={`btn ${filter === 'completed' ? 'btn-active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* Todos List */}
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="todos-list">
            {filteredTodos.length === 0 ? (
              <p className="empty">No todos yet. Add one above!</p>
            ) : (
              filteredTodos.map((todo) => (
                <div key={todo.id} className="todo-item">
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                      className="checkbox"
                    />
                    <div>
                      <h3 className={todo.completed ? 'completed' : ''}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="description">{todo.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;