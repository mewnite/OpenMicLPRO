// Inicialización de Firebase y configuración
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Configuración de Firebase para tu aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyAaa-uuPE8QicBc_KSGxFON1LdR3d_MmTY",
  authDomain: "lrpo-b68c0.firebaseapp.com",
  projectId: "lrpo-b68c0",
  storageBucket: "lrpo-b68c0.appspot.com",
  messagingSenderId: "940081426852",
  appId: "1:940081426852:web:b4835c294c0232ace29131"
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
document.getElementById('signupForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const aka = document.getElementById('aka').value;
  const photo = document.getElementById('photo').files[0];
  const spinner = document.getElementById('spinner');
  const message = document.getElementById('message');

  if (!name || !aka || !photo) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Mostrar spinner mientras se procesa la solicitud
  spinner.style.display = 'block';
  message.style.display = 'none';

  try {
    const photoURL = await uploadPhoto(name, aka, photo);
    await saveParticipant(name, aka, photoURL);

    message.textContent = 'Registro completado';
    message.className = 'success';
    document.getElementById('signupForm').reset();
  } catch (error) {
    console.error("Error al inscribir al participante: ", error);
    message.textContent = 'Falló';
    message.className = 'error';
  } finally {
    // Ocultar spinner y mostrar mensaje
    spinner.style.display = 'none';
    message.style.display = 'block';
  }
});
