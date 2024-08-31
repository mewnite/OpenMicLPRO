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
    await addDoc(collection(db, "participants"), {
      name: name,
      aka: aka,
      photoURL: photoURL
    });
    console.log("Datos enviados a Firestore"); // Verificación adicional
  } catch (error) {
    console.error("Error al agregar el documento: ", error);
    throw error; // Lanza el error para manejarlo en la función de envío
  }
}

// Manejar el envío del formulario
document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const spinner = document.getElementById("spinner");
    const message = document.getElementById("message");

    // Verifica que los elementos existen antes de acceder a ellos
    if (spinner && message) {
        spinner.style.display = "block";  // Muestra el spinner
        message.style.display = "none";   // Oculta el mensaje durante el envío

        try {
            // Aquí realizas la lógica de envío a Firestore

            // Supongamos que los datos fueron enviados correctamente
            message.textContent = "Registro completado";
            message.className = "success";
            message.style.display = "block";  // Muestra el mensaje de éxito

        } catch (error) {
            console.error("Error al enviar los datos: ", error);

            message.textContent = "Falló";
            message.className = "error";
            message.style.display = "block";  // Muestra el mensaje de error
        } finally {
            spinner.style.display = "none";  // Oculta el spinner cuando finaliza el envío
        }
    } else {
        console.error("No se pudo encontrar el elemento spinner o message en el DOM.");
    }
});

  
  const name = document.getElementById('name').value;
  const aka = document.getElementById('aka').value;
  const photo = document.getElementById('photo').files[0];
  const spinner = document.getElementById('spinner');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');

  // Ocultar mensajes anteriores
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';

  if (!name || !aka || !photo) {
    alert('Por favor, completa todos los campos.');
  }

  spinner.style.display = 'block'; // Mostrar el spinner

  try {
    // Subir la foto y obtener la URL con la nueva estructura de carpeta
    const photoURL = await uploadPhoto(name, aka, photo);

    // Guardar los datos del participante en Firestore
    await saveParticipant(name, aka, photoURL);

    // Mostrar mensaje de éxito
    successMessage.style.display = 'block';

    // Resetear el formulario
    document.getElementById('signupForm').reset();
  } catch (error) {
    console.error("Error al inscribir al participante: ", error);
    
    // Mostrar mensaje de error
    errorMessage.style.display = 'block';
  } finally {
    spinner.style.display = 'none'; // Ocultar el spinner
  }
});
