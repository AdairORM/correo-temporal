const backendUrl = 'https://correo-temporal.onrender.com'; // más adelante lo usaremos

let currentEmail = "";

function generateEmail() {
  fetch(`${backendUrl}/generate`)
    .then(res => res.json())
    .then(data => {
      currentEmail = data.email;
      document.getElementById("emailDisplay").value = currentEmail;
      loadInbox();
    })
    .catch(err => {
      console.error("Error al generar correo:", err);
    });
}

function refreshInbox() {
  loadInbox();
}

function loadInbox() {
  if (!currentEmail) return;

  fetch(`${backendUrl}/inbox?email=${currentEmail}`)
    .then(res => res.json())
    .then(data => {
      const inbox = document.getElementById("inbox");
      inbox.innerHTML = "";

      if (!data.messages || data.messages.length === 0) {
        inbox.innerHTML = "<p class='text-gray-300'>Sin correos nuevos.</p>";
        return;
      }

      data.messages.forEach(msg => {
        const div = document.createElement("div");
        div.className = "bg-gray-600 p-2 my-2 rounded";
        div.innerHTML = `<strong>${msg.from}</strong><br>${msg.subject}<br><small>${msg.date}</small>`;
        inbox.appendChild(div);
      });
    })
    .catch(err => {
      const inbox = document.getElementById("inbox");
      inbox.innerHTML = `<p class='text-red-500'>Error al cargar los correos.</p>`;
      console.error("Error al cargar bandeja:", err);
    });
}


function deleteEmail() {
  if (!currentEmail) return;
  fetch(`${backendUrl}/delete?email=${currentEmail}`, { method: 'DELETE' })
    .then(() => {
      currentEmail = "";
      document.getElementById("emailDisplay").value = "Eliminado";
      document.getElementById("inbox").innerHTML = "<p class='text-gray-300'>Correo eliminado.</p>";
    });
}

function copyEmail() {
  navigator.clipboard.writeText(document.getElementById("emailDisplay").value);
}

window.onload = () => {
  generateEmail();
};
