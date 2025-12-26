const API_URL = "http://localhost:8080/api/tasks";

/* =========================
   SESIÓN DE USUARIO
========================= */

const storedUser = localStorage.getItem("user");
const currentUser = storedUser ? JSON.parse(storedUser) : null;

// Protección: no entrar a tasks sin login
if (window.location.pathname.includes("/html/tasks.html") && !currentUser) {
    window.location.href = "/html/index.html";
}

// Mostrar bienvenida
document.addEventListener("DOMContentLoaded", () => {
    if (currentUser) {
        const welcome = document.getElementById("welcome-user");
        if (welcome) {
            welcome.textContent = `Bienvenido, ${currentUser.username}`;
        }

        const profileUsername = document.getElementById("profile-username");
        const profileEmail = document.getElementById("profile-email");

        if (profileUsername) profileUsername.textContent = currentUser.username;
        if (profileEmail) profileEmail.textContent = currentUser.email;
    }
});

/* =========================
   LOGIN
========================= */

function login() {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!email || !password) return;

    fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(res => {
            if (!res.ok) throw new Error();
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
    const username = document.getElementById("register-username")?.value;
    const email = document.getElementById("register-email")?.value;
    const password = document.getElementById("register-password")?.value;

    if (!username || !email || !password) return;

    fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(user => {
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "/html/tasks.html";
        })
        .catch(() => alert("Email o usuario ya existente"));
}

/* =========================
   DASHBOARD
========================= */

function updateDashboard(tasks) {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "PENDING").length;
    const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
    const done = tasks.filter(t => t.status === "DONE").length;

    const totalEl = document.getElementById("total-tasks");
    if (!totalEl) return;

    document.getElementById("total-tasks").textContent = total;
    document.getElementById("pending-tasks").textContent = pending;
    document.getElementById("progress-tasks").textContent = inProgress;
    document.getElementById("done-tasks").textContent = done;
}

/* =========================
   TAREAS
========================= */

let currentFilter = "ALL";

function loadTasks() {

    console.log("LOAD TASKS EJECUTADO");
    fetch(API_URL)
        .then(res => res.json())
        .then(tasks => {
            // Dashboard SIEMPRE
            updateDashboard(tasks);

            const taskList = document.getElementById("task-list");
            if (!taskList) return;

            taskList.innerHTML = "";

            let filteredTasks = tasks;
            if (currentFilter !== "ALL") {
                filteredTasks = tasks.filter(t => t.status === currentFilter);
            }

            filteredTasks.forEach(task => {
                const li = document.createElement("li");

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

                const span = document.createElement("span");
                span.textContent = task.title;

                const date = document.createElement("small");
                date.textContent = new Date(task.createdAt).toLocaleString();
                date.style.color = "#6c757d";

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Eliminar";
                deleteBtn.addEventListener("click", () => deleteTask(task.id));

                li.append(select, span, date, deleteBtn);
                taskList.appendChild(li);
            });
        });
}

function updateTask(id, status) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    }).then(loadTasks);
}

function deleteTask(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(loadTasks);
}

/* =========================
   LOGOUT
========================= */

function logout() {
    localStorage.removeItem("user");
    window.location.href = "/html/index.html";
}

/* =========================
   INICIALIZACIÓN
========================= */

document.addEventListener("DOMContentLoaded", () => {

    // Login
    document.getElementById("login-btn")?.addEventListener("click", login);

    // Register
    document.getElementById("register-btn")?.addEventListener("click", register);

    // Sidebar navegación
    document.querySelectorAll(".sidebar button").forEach(btn => {
        btn.addEventListener("click", () => {
            const view = btn.dataset.view;

            document.querySelectorAll(".view")
                .forEach(v => v.classList.remove("active"));

            document.getElementById(`view-${view}`)?.classList.add("active");
        });
    });

    // Filtros y creación de tareas
    document.querySelectorAll(".filters button").forEach(button => {
        button.addEventListener("click", () => {
            currentFilter = button.dataset.status;

            document.querySelectorAll(".filters button")
                .forEach(b => b.classList.remove("active"));
            button.classList.add("active");

            loadTasks();
        });
    });

    document.getElementById("task-form")?.addEventListener("submit", e => {
        e.preventDefault();

        const titleInput = document.getElementById("title");
        if (!titleInput.value) return;

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: titleInput.value,
                status: "PENDING"
            })
        }).then(() => {
            titleInput.value = "";
            loadTasks();
        });
    });

    // Carga inicial (dashboard + tareas)
    loadTasks();
});