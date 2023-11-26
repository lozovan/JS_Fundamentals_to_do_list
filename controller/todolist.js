import Todo from '../controller/todo.js';

class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.editTodoId = -1;
        this.currentFilter = 'all';
        this.todoForm = document.getElementById('todoform');
        this.todoInput = document.getElementById('newtodo');
        this.todosListEl = document.getElementById('todos-list');
        this.clearBtn = document.getElementById('clearBtn');

        this.renderTodos();
        this.setupEventListeners();
    }
  
    // метод для зберігання нового завдання в списку
    
    saveTodo() {
        const todoValue = this.todoInput.value;
        const isEmpty = todoValue === '';
        const isDuplicate = this.todos.some(todo => todo.value.toUpperCase() === todoValue.toUpperCase());
    // перевірка чи список не порожній  і чи немає дублікатів справ
        if (isEmpty) {
            alert("You need to add a task to the list, it is empty!");
        } else if (isDuplicate) {
            alert('The entered task already exists in the list of tasks, you need to enter another task.');
        } else {
            if (this.editTodoId >= 0) {
                this.todos = this.todos.map((todo, index) => ({
                    ...todo,
                    value: index === this.editTodoId ? todoValue : todo.value,
                }));
                this.editTodoId = -1;
            } else {
                this.todos.push(new Todo(todoValue));
            }

            this.todoInput.value = '';
            this.renderTodos();
            localStorage.setItem('todos', JSON.stringify(this.todos));
        }
    }
    // метод виводу списку завдань 
    renderTodos() {
        const filteredTodos = this.filterTodos();

        if (filteredTodos.length === 0) {
            alert("Task list is empty, add new tasks!");
            return;
        }

        this.todosListEl.innerHTML = '';
    // додаємо html фрагмент для кожного завдання
        filteredTodos.forEach((todo, index) => {
            this.todosListEl.innerHTML += `
                <div class="todo ${todo.checked ? 'completed' : ''}" id=${index}>
                    <i 
                        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
                        style="color : ${todo.color}"
                        data-action="check"
                    ></i>
                    <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
                    <i class="bi bi-pencil-square" data-action="edit"></i>
                    <i class="bi bi-trash" data-action="delete"></i>
                </div>
            `;
        });
    }
   // фільтр завдань виконані не виконані і всі
    filterTodos() {
        if (this.currentFilter === 'completed') {
            return this.todos.filter(todo => todo.checked);
        } else if (this.currentFilter === 'uncompleted') {
            return this.todos.filter(todo => !todo.checked);
        } else {
            return this.todos;
        }
    }
    // метод для позначення галочки готово чи не готово
    checkTodo(todoId) {
        this.todos = this.todos.map((todo, index) => ({
            ...todo,
            checked: index === todoId ? !todo.checked : todo.checked,
        }));

        this.renderTodos();
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    // метод для редагування завдання
    editTodo(todoId) {
        this.todoInput.value = this.todos[todoId].value;
        this.editTodoId = todoId;
    }

    deleteTodo(todoId) {
        this.todos = this.todos.filter((todo, index) => index !== todoId);
        this.editTodoId = -1;

        this.renderTodos();
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    setupEventListeners() {
        this.todoForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.saveTodo();
            this.renderTodos();
            localStorage.setItem('todos', JSON.stringify(this.todos));
        });
    // обробка події для для фільтра виконані не виконані
        document.querySelectorAll('.filter button').forEach((button) => {
            button.addEventListener('click', () => {
                this.currentFilter = button.dataset.filter;
                this.renderTodos();
            });
        });
    // обробка події очистити список завдань
        this.clearBtn.addEventListener('click', () => {
            this.todos = [];
            localStorage.setItem('todos', JSON.stringify(this.todos));
            this.renderTodos();
        });
    
        this.todosListEl.addEventListener('click', (event) => {
            const target = event.target.closest('.todo');
    
            if (!target) return;
    
            const todoId = Number(target.id);
            const action = event.target.dataset.action;
    
            action === 'check' && this.checkTodo(todoId);
            action === 'edit' && this.editTodo(todoId);
            action === 'delete' && this.deleteTodo(todoId);
        });
    
        const filterButtons = document.querySelectorAll('.filter button');
    // додавання активного класу для фільтра 
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
    
}

export default TodoList;