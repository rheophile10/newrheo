
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify';
import { listTodos } from './graphql/queries';
import { createTodo as createTodoMutation, updateTodo as updateTodoMutation } from './graphql/mutations';
import { useEffect, useState } from 'react';

const initialFormState = { action: '' }

function App() {
  const [Todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos });
    setTodos(apiData.data.listTodos.items);
  }

  async function createDo() {
    if (!formData.action) return;
    formData.donot = true;
    formData.active = true;
    console.log(formData)
    await API.graphql({ query: createTodoMutation, variables: { input: formData }});
    setTodos([ ...Todos, formData ]);
    setFormData(initialFormState);
  }

  async function createDoNot() {
    if (!formData.action) return;
    formData.donot = false;
    formData.active = true;
    console.log(formData)
    await API.graphql({ query: createTodoMutation, variables: { input: formData }});
    setTodos([ ...Todos, formData ]);
    setFormData(initialFormState);
  }

  async function updateTodo({ id }) {
    const newTodosArray = Todos.filter(Todo => Todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({ query: updateTodoMutation, variables: { input: { id } }});
  }


  return (
    <div className="App">
      <a href= "https://youtu.be/rn9lTpD-yKc?t=2525"><h1>Choose</h1></a>
      <input
        onChange={e => setFormData({ ...formData, 'action': e.target.value})}
        placeholder="What do you want to do?"
        value={formData.action}
      />
      <button onClick={createDo}>Aspire To Do</button>
      <button onClick={createDoNot}>Aspire Not To Do</button>
      <div style={{marginBottom: 30}}>
        <h1>Do</h1>
        {
          Todos.filter(Todo => Todo.donot===true).map(Todo => (
            <div key={Todo.id || Todo.action}>
              <p>{Todo.action}</p>
              <button onClick={() => updateTodo(Todo)}>Forget</button>
            </div>
          ))
        }
      </div>
      <div style={{marginBottom: 30}}>
        <h1>Don't Do</h1>
        {
          Todos.filter(Todo => Todo.donot===false).map(Todo => (
            <div key={Todo.id || Todo.action}>
              <p>{Todo.action}</p>
              <button onClick={() => updateTodo(Todo)}>Forget</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
    
  );
}

export default withAuthenticator(App);