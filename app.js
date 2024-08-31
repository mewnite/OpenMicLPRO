 // Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
      import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
      import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyAaa-uuPE8QicBc_KSGxFON1LdR3d_MmTY",
        authDomain: "lrpo-b68c0.firebaseapp.com",
        projectId: "lrpo-b68c0",
        storageBucket: "lrpo-b68c0.appspot.com",
        messagingSenderId: "940081426852",
        appId: "1:940081426852:web:b4835c294c0232ace29131"
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      const db = getFirestore(app);

      // Manejar la inscripción
      const signupForm = document.getElementById('signupForm');
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const aka = document.getElementById('aka').value;
        const photo = document.getElementById('photo').files[0];

        if (photo) {
          // Subir la imagen a Firebase Storage
          const storageRef = ref(storage, 'images/' + photo.name);
          await uploadBytes(storageRef, photo);

          // Obtener la URL de descarga de la imagen
          const photoURL = await getDownloadURL(storageRef);

          // Guardar la información en Firestore
          try {
            await addDoc(collection(db, "participants"), {
              name: name,
              aka: aka,
              photoURL: photoURL
            });
            alert('¡Inscripción completada con éxito!');
          } catch (error) {
            console.error("Error adding document: ", error);
          }
        }
      });
