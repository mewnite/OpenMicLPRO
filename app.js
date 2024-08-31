document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const name = document.getElementById('name').value;
    const aka = document.getElementById('aka').value;
    const photo = document.getElementById('photo').files[0];

    // Referencia a Firestore y Storage
    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();

    // Subir la foto a Firebase Storage
    const photoRef = storageRef.child(`photos/${aka}-${Date.now()}`);
    photoRef.put(photo).then(function(snapshot) {
        snapshot.ref.getDownloadURL().then(function(downloadURL) {
            // Guardar los datos en Firestore
            db.collection('signups').add({
                name: name,
                aka: aka,
                photoURL: downloadURL
            }).then(function(docRef) {
                // Mostrar los datos guardados
                const submittedData = document.getElementById('submittedData');
                submittedData.innerHTML = `
                    <h2>Datos Inscritos:</h2>
                    <p><strong>Nombre:</strong> ${name}</p>
                    <p><strong>AKA:</strong> ${aka}</p>
                    <p><strong>Foto:</strong></p>
                    <img src="${downloadURL}" alt="Foto de ${aka}">
                `;
            }).catch(function(error) {
                console.error("Error al guardar la inscripción: ", error);
            });
        });
    }).catch(function(error) {
        console.error("Error al subir la foto: ", error);
    });
});
