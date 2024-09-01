// Inicialización de Firebase y configuración
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";



// Configuración de Firebase para tu aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyA3NbOrszfuDgQT_I0fda-rugxdeKurM_4",
  authDomain: "registerlpro.firebaseapp.com",
  projectId: "registerlpro",
  storageBucket: "registerlpro.appspot.com",
  messagingSenderId: "139406970618",
  appId: "1:139406970618:web:239599a6c56bcff6ee8343"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Función para subir la foto a Firebase Storage en la estructura nombre (aka)/imagen
async function uploadPhoto(name, aka, photo) {
  const folderPath = `${name} (${aka})/${photo.name}`;
  const storageRef = ref(storage, folderPath);
  await uploadBytes(storageRef, photo);
  const photoURL = await getDownloadURL(storageRef);
  return photoURL;
}

// Función para guardar los datos del participante en Firestore
async function saveParticipant(name, aka, photoURL) {
  await addDoc(collection(db, "participants"), {
    name: name,
    aka: aka,
    photoURL: photoURL
  });
}

// Manejar el envío del formulario
document.getElementById("signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const aka = document.getElementById('aka').value.trim();
  const photo = document.getElementById('photo').files[0];
  const spinner = document.getElementById('spinner');
  const message = document.getElementById('message');

  // Validar longitud de los campos
  if (name.length > 20 || aka.length > 20) {
    alert('El nombre y el aka deben tener menos de 20 caracteres.');
    return;
  }

  // Validar formato de la imagen
  const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validImageTypes.includes(photo.type)) {
    alert('Solo se permiten imágenes en formato PNG, JPG o JPEG.');
    return;
  }

  if (!name || !aka || !photo) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  spinner.style.display = 'block'; // Mostrar el spinner
  message.style.display = 'none';  // Ocultar cualquier mensaje previo

  try {
    const photoURL = await uploadPhoto(name, aka, photo);
    await saveParticipant(name, aka, photoURL);
    message.textContent = "Registro completado";
    message.className = "success";
    message.style.display = 'block';
    document.getElementById('signupForm').reset();
  } catch (error) {
    message.textContent = "Falló";
    message.className = "error";
    message.style.display = 'block';
  } finally {
    spinner.style.display = 'none'; // Ocultar el spinner
  }
});

// Mostrar nombre del archivo en la pantalla cuando se seleccione
document.addEventListener('DOMContentLoaded', function() {
  const photoInput = document.getElementById('photo');
  const fileNameDisplay = document.getElementById('fileName');

  photoInput.addEventListener('change', function() {
      const file = photoInput.files[0];
      if (file) {
          fileNameDisplay.textContent = `Has cargado el archivo: ${file.name}`;
      } else {
          fileNameDisplay.textContent = '';
      }
  });
});
