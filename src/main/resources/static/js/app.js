const API_URL = "http://localhost:8080/api/tasks";

/* =========================
   SESIÓN DE USUARIO
========================= */

const storedUser = localStorage.getItem("user");
const currentUser = storedUser ? JSON.parse(storedUser) : null;

if (window.location.pathname.includes("/html/tasks.html") && currentUser) {
    document.addEventListener("DOMContentLoaded", () => {
        const welcome = document.getElementById("welcome-user");
        if (welcome) {
            welcome.textContent = `Bienvenido, ${currentUser.username}`;
        }
    });
}

// Protección: no entrar a tasks sin login
if (window.location.pathname.includes("/html/tasks.html") && !currentUser) {
    window.location.href = "/html/index.html";
}

/* =========================
   LOGIN
========================= */

function login() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value;
    const password = passwordInput.value;

    fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
        .then(res => {
            if (!res.ok) throw new Error("Login incorrecto");
            return res.json();
        })
        .then(user => {
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "/html/tasks.html";
        })
        .catch(() => alert("Login incorrecto"));
}

/* =========================
   REGISTER
========================= */

function register() {
    const usernameInput = document.getElementById("register-username");
    const emailInput = document.getElementById("register-email");
    const passwordInput = document.getElementById("register-password");

    if (!usernameInput || !emailInput || !passwordInput) return;

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    })
        .then(res => {
            if (!res.ok) throw new Error("Registro incorrecto");
            return res.json();
        })
        .then(() => {
            alert("Usuario registrado correctamente");
            window.location.href = "/html/tasks.html";
        })
        .catch(() => {
            alert("Ese email o username ya está registrado");
        });
}

/* =========================
   TAREAS
========================= */

let currentFilter = "ALL";

function loadTasks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(tasks => {
            const taskList = document.getElementById("task-list");
            if (!taskList) return;

            taskList.innerHTML = "";

            let filteredTasks = tasks;
            if (currentFilter !== "ALL") {
                filteredTasks = tasks.filter(t => t.status === currentFilter);
            }

            filteredTasks.forEach(task => {
                const li = document.createElement("li");
                li.classList.add(task.status.toLowerCase());

                // Select estado
                const select = document.createElement("select");
                ["PENDING", "IN_PROGRESS", "DONE"].forEach(status => {
                    const option = document.createElement("option");
                    option.value = status;
                    option.textContent = status.replace("_", " ");
                    if (task.status === status) option.selected = true;
                    select.appendChild(option);
                });

                select.addEventListener("change", () => {
                    updateTask(task.id, select.value);
                });

                // Título
                const span = document.createElement("span");
                span.textContent = task.title;
                span.style.marginLeft = "10px";

                // Fecha
                const date = document.createElement("small");
                date.textContent = new Date(task.createdAt).toLocaleString();
                date.style.marginLeft = "10px";
                date.style.color = "#6c757d";

                // Eliminar
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Eliminar";
                deleteBtn.style.marginLeft = "10px";
                deleteBtn.addEventListener("click", () => deleteTask(task.id));

                li.appendChild(select);
                li.appendChild(span);
                li.appendChild(date);
                li.appendChild(deleteBtn);

                taskList.appendChild(li);
            });
        });
}

function updateTask(id, status) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    }).then(loadTasks);
}

function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(loadTasks);
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "/html/index.html";
}

/* =========================
   INICIALIZACIÓN SEGURA
========================= */

document.addEventListener("DOMContentLoaded", () => {

    // Login
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", login);
    }

    // Register
    const registerBtn = document.getElementById("register-btn");
    if (registerBtn) {
        registerBtn.addEventListener("click", register);
    }

    // Tareas
    const taskForm = document.getElementById("task-form");
    const titleInput = document.getElementById("title");
    const taskList = document.getElementById("task-list");

    if (taskForm && titleInput && taskList) {

        // Filtros
        document.querySelectorAll(".filters button").forEach(button => {
            button.addEventListener("click", () => {
                currentFilter = button.dataset.status;

                document.querySelectorAll(".filters button")
                    .forEach(b => b.classList.remove("active"));
                button.classList.add("active");

                loadTasks();
            });
        });

        // Crear tarea
        taskForm.addEventListener("submit", e => {
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

        loadTasks();
    }
});