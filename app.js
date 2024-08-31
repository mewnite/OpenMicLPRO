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
    try {
        console.log("Datos enviados a Firestore:", { name, aka, photoURL });  // Agrega este log
        await addDoc(collection(db, "participants"), {
            name: name,
            aka: aka,
            photoURL: photoURL
        });
        console.log("Inscripción completada con éxito");  // Log de éxito
    } catch (error) {
        console.error("Error al agregar el documento: ", error);
    }
}


// Manejar el envío del formulario
// Manejar el envío del formulario
document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const aka = document.getElementById('aka').value;
    const photo = document.getElementById('photo').files[0];

    // Mostrar el spinner
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    // Limpiar cualquier mensaje de estado anterior
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = '';

    if (!name || !aka || !photo) {
        loadingSpinner.style.display = 'none'; // Ocultar spinner en caso de error
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        // Subir la foto y obtener la URL con la nueva estructura de carpeta
        const photoURL = await uploadPhoto(name, aka, photo);

        // Guardar los datos del participante en Firestore
        await saveParticipant(name, aka, photoURL);

        // Mostrar mensaje de éxito
        statusMessage.textContent = '¡Inscripción completada con éxito!';
        statusMessage.style.color = 'green';
    } catch (error) {
        console.error("Error al inscribir al participante: ", error);
        statusMessage.textContent = 'Hubo un error al procesar tu inscripción. Intenta nuevamente.';
        statusMessage.style.color = 'red';
    } finally {
        // Ocultar el spinner
        loadingSpinner.style.display = 'none';

        // Resetear el formulario
        document.getElementById('signupForm').reset();
    }
});
