document.addEventListener('DOMContentLoaded', function() {
    const ftList = document.getElementById('ft_list');
    const newButton = document.getElementById('newButton');

    // --- Cookie Management Functions ---
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // --- To-Do Item Management Functions ---
    function saveTodosToCookie() {
        const todos = [];
        // Iterate through all todo-item divs and collect their text content
        ftList.querySelectorAll('.todo-item').forEach(item => {
            todos.push(item.textContent);
        });
        setCookie('todos', JSON.stringify(todos), 7); // Save for 7 days
    }

    function loadTodosFromCookie() {
        const todosString = getCookie('todos');
        if (todosString) {
            try {
                const todos = JSON.parse(todosString);
                // Add each todo from cookie to the DOM
                todos.forEach(todoText => createTodoElement(todoText, false)); // Don't save to cookie again on load
            } catch (e) {
                console.error("Error parsing todos from cookie:", e);
            }
        }
    }

    function createTodoElement(text, save = true) {
        if (text === null || text.trim() === "") {
            return; // Do not create empty todo
        }

        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        todoItem.textContent = text.trim();

        // Add click listener for deletion
        todoItem.addEventListener('click', function() {
            const confirmDelete = confirm(`Do you want to remove "${text.trim()}"?`);
            if (confirmDelete) {
                ftList.removeChild(todoItem); // Remove from DOM
                saveTodosToCookie(); // Save updated list to cookie
            }
        });

        // Add to the top of the list
        ftList.prepend(todoItem);
        
        if (save) {
            saveTodosToCookie(); // Save the new todo list to cookie
        }
    }

    // --- Event Listeners ---
    newButton.addEventListener('click', function() {
        const newTodoText = prompt("Enter a new TO DO:");
        if (newTodoText !== null && newTodoText.trim() !== "") {
            createTodoElement(newTodoText);
        }
    });

    // Load todos when the page loads
    loadTodosFromCookie();
});