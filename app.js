// Inicialización de Firebase y configuración
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


// Función para subir la foto a Firebase Storage en la estructura nombre (aka)/imagen
async function uploadPhoto(name, aka, photo) {
  const folderPath = `${name} (${aka})/${photo.name}`;
  const storageRef = ref(storage, folderPath);
  
  console.log('Subiendo foto a Firebase Storage...');
  
  await uploadBytes(storageRef, photo);
  
  console.log('Foto subida exitosamente. Obteniendo URL...');
  
  const photoURL = await getDownloadURL(storageRef);
  
  console.log('URL obtenida:', photoURL);
  
  return photoURL;
}

// Función para guardar los datos del participante en Firestore
async function saveParticipant(name, aka, photoURL) {
  console.log('Guardando participante en Firestore...');
  
  await addDoc(collection(db, "participants"), {
    name: name,
    aka: aka,
    photoURL: photoURL
  });
  
  console.log('Participante guardado en Firestore');
}

// Manejar el envío del formulario
document.getElementById("signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const aka = document.getElementById('aka').value.trim();
  const photo = document.getElementById('photo').files[0];
  const spinner = document.getElementById('spinner');
  const message = document.getElementById('message');

  // Validar campos
  if (!name || !aka || !photo) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  spinner.style.display = 'block'; // Mostrar el spinner
  message.style.display = 'none';  // Ocultar cualquier mensaje previo

  try {
    console.log('Comenzando proceso de inscripción...');

    // Subir la foto y obtener la URL con la nueva estructura de carpeta
    const photoURL = await uploadPhoto(name, aka, photo);

    // Guardar los datos del participante en Firestore
    await saveParticipant(name, aka, photoURL);

    // Mostrar mensaje de éxito
    message.textContent = "Registro completado";
    message.className = "success";
    message.style.display = 'block';

    // Resetear el formulario
    document.getElementById('signupForm').reset();

    console.log('Proceso de inscripción completado con éxito.');
  } catch (error) {
    console.error("Error al inscribir al participante: ", error);

    // Mostrar mensaje de error
    message.textContent = "Falló";
    message.className = "error";
    message.style.display = 'block';
  } finally {
    console.log('Finalizando proceso, ocultando spinner...');
    spinner.style.display = 'none'; // Ocultar el spinner
  }
});


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
