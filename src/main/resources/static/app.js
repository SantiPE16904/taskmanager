const API_URL = "http://localhost:8080/api/tasks";

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");

/**
 * Carga todas las tareas y las pinta en la web
 */
function loadTasks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(tasks => {
            taskList.innerHTML = "";

            tasks.forEach(task => {
                const li = document.createElement("li");

                // Clase CSS según estado
                li.classList.add(task.status.toLowerCase());

                // Select de estado
                const select = document.createElement("select");

                ["PENDING", "IN_PROGRESS", "DONE"].forEach(status => {
                    const option = document.createElement("option");
                    option.value = status;
                    option.textContent = status.replace("_", " ");
                    if (task.status === status) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });

                select.addEventListener("change", () => {
                    updateTask(task.id, select.value);
                });

                // Texto de la tarea
                const span = document.createElement("span");
                span.textContent = task.title;
                span.style.marginLeft = "10px";

                // Botón eliminar
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Eliminar";
                deleteBtn.style.marginLeft = "10px";
                deleteBtn.addEventListener("click", () => {
                    deleteTask(task.id);
                });

                li.appendChild(select);
                li.appendChild(span);
                li.appendChild(deleteBtn);

                taskList.appendChild(li);
            });
        });
}

/**
 * Crea una nueva tarea
 */
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = {
        title: titleInput.value,
        status: "PENDING"
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

/**
 * Actualiza el estado de una tarea
 */
function updateTask(id, status) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: status
        })
    }).then(() => {
        loadTasks();
    });
}

/**
 * Elimina una tarea
 */
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(() => {
        loadTasks();
    });
}

// Carga inicial
loadTasks();