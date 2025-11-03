import axios from 'axios';

const API_BASE_URL = 'https://todo-backend-30nv.onrender.com';

export const todoAPI = {
  // Get all todos
  getAllTodos: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  // Get todo by ID
  getTodoById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Create new todo
  createTodo: async (todo) => {
    const response = await axios.post(API_BASE_URL, todo);
    return response.data;
  },

  // Update todo
  updateTodo: async (id, todo) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, todo);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  // Get completed todos
  getCompletedTodos: async () => {
    const response = await axios.get(`${API_BASE_URL}/completed`);
    return response.data;
  },

  // Get incomplete todos
  getIncompleteTodos: async () => {
    const response = await axios.get(`${API_BASE_URL}/incomplete`);
    return response.data;
  }
};