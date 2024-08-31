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

// Función para subir la foto a Firebase Storage
async function uploadPhoto(photo) {
  const storageRef = ref(storage, 'images/' + photo.name);
  await uploadBytes(storageRef, photo);
  const photoURL = await getDownloadURL(storageRef);
  return photoURL;
}

// Función para guardar los datos del participante en Firestore
async function saveParticipant(name, aka, photoURL) {
  try {
    await addDoc(collection(db, "participants"), {
      name: name,
      aka: aka,
      photoURL: photoURL
    });
    alert('¡Inscripción completada con éxito!');
  } catch (error) {
    console.error("Error al agregar el documento: ", error);
  }
}

// Manejar el envío del formulario
document.getElementById('signupForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const aka = document.getElementById('aka').value;
  const photo = document.getElementById('photo').files[0];

  if (!name || !aka || !photo) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    // Subir la foto y obtener la URL
    const photoURL = await uploadPhoto(photo);

    // Guardar los datos del participante en Firestore
    await saveParticipant(name, aka, photoURL);

    // Resetear el formulario
    document.getElementById('registrationForm').reset();
  } catch (error) {
    console.error("Error al inscribir al participante: ", error);
    alert('Hubo un error al procesar tu inscripción. Intenta nuevamente.');
  }
});
