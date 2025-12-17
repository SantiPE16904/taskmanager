const API_URL = "http://localhost:8080/api/tasks";

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");

function loadTasks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(tasks => {
            taskList.innerHTML = "";

            tasks.forEach(task => {
                const li = document.createElement("li");

                if (task.completed) {
                    li.classList.add("completed");
                }

                // Checkbox
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed;

                checkbox.addEventListener("change", () => {
                    updateTask(task.id, checkbox.checked);
                });

                // Texto
                const span = document.createElement("span");
                span.textContent = task.title;
                span.style.marginLeft = "10px";

                if (task.completed) {
                    span.style.textDecoration = "line-through";
                    span.style.color = "gray";
                }

                // Botón eliminar
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Eliminar";
                deleteBtn.style.marginLeft = "10px";

                deleteBtn.addEventListener("click", () => {
                    deleteTask(task.id);
                });

                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);

                taskList.appendChild(li);
            });
        });
}

function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(() => {
        loadTasks();
    });
}

function updateTask(id, completed) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: completed
        })
    }).then(() => {
        loadTasks();
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = {
        title: titleInput.value
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    }).then(() => {
        titleInput.value = "";
        loadTasks();
    });
});

// Carga inicial
loadTasks();