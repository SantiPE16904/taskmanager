const API_URL = "http://localhost:8080/api/tasks";

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
let currentFilter = "ALL";

//Maquetador de tareas en front
function loadTasks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(tasks => {
            taskList.innerHTML = "";

            let filteredTasks = tasks;

            if (currentFilter !== "ALL") {
                filteredTasks = tasks.filter(task => task.status === currentFilter);
            }

            filteredTasks.forEach(task => {
                const date = document.createElement("small");
                date.textContent = new Date(task.createdAt).toLocaleString();
                date.style.marginLeft = "10px";
                date.style.color = "#6c757d";
                const li = document.createElement("li");

                // Clase CSS según estado
                li.classList.add(task.status.toLowerCase());
                li.appendChild(date);

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

document.querySelectorAll(".filters button").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.status;

        document.querySelectorAll(".filters button")
            .forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        loadTasks();
    });
});

// Crea tareas
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

//Actualiza el estado de tareas
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

// Elimina tareas
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(() => {
        loadTasks();
    });
}

// Carga inicial
loadTasks();