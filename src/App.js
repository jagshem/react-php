import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState('')

  useEffect(() => {
    const formData = new FormData()
    formData.append('action', 'todos')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => setTodos(data))
  }, [])

  const addTodo = () => {
    if (!todo) {
      alert('Todo boş olamaz')
      return
    }
    const formData = new FormData()
    formData.append('todo', todo)
    formData.append('action', 'add-todo')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
        } else {
          setTodos([...todos, data])
          setTodo('')
        }
      })
  }

  const deleteTodo = () => {
    const formData = new FormData()
    formData.append('action', 'delete-todo')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
        } else {
          setTodos([])
        }
      })
  }

  const deleteTodoById = (id) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('action', 'delete-todo-by-id')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
        } else {
          // Filter the todos and remove the deleted one
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
        }
      })
  }

  const doneTodo = (id, done) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('done', parseInt(done) === 1 ? 0 : 1) // done değerini integer olarak kontrol et ve set et
    formData.append('action', 'done-todo')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
        } else {
          setTodos(
            todos.map((todo) => {
              if (todo.id === id) {
                return { ...todo, done: parseInt(done) === 1 ? 0 : 1 } // done değerini integer olarak kontrol et ve set et
              }
              return todo
            })
          )
        }
      })
  }

  const updateTodo = (id, done) => {
    const yeniTodoDegeri = prompt(
      'Todo',
      todos.find((todo) => todo.id === id).todo
    )
    if (yeniTodoDegeri === null) return // Eğer kullanıcı iptal butonuna basarsa işlemi iptal et

    const formData = new FormData()
    formData.append('id', id)
    formData.append('todo', yeniTodoDegeri) // yeni todo değerini de gönder
    formData.append('done', parseInt(done)) // done değerini integer olarak gönder
    formData.append('action', 'update-todo')

    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
        } else {
          setTodos(
            todos.map((todo) => {
              if (todo.id === id) {
                return { ...todo, todo: yeniTodoDegeri, done: parseInt(done) } // yeni todo ve done değerleriyle güncelle
              }
              return todo
            })
          )
        }
      })
  }

  return (
    <>
      <div className="container">
        {' '}
        <h1>Todo Uygulaması</h1>
        <div>
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') addTodo()
            }}
            placeholder="Todo Yazınız..."
          />
          <button onClick={addTodo}>EKLE</button>
          <button onClick={deleteTodo}>SİL</button>
        </div>
        {todos && (
          <ul>
            {todos.map((todo) => (
              <>
                <hr />
                <li
                  className={todo.done === 1 ? 'done' : ''}
                  key={todo.id}
                  onClick={() => doneTodo(todo.id, todo.done)}
                >
                  <span onClick={() => doneTodo(todo.id, todo.done)}>
                    {todo.todo}
                  </span>
                  <button onClick={() => deleteTodoById(todo.id)}>Sil</button>
                </li>
                <button onClick={() => updateTodo(todo.id)}>Düzenle</button>
                <hr />
              </>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default App
