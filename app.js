document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const name = document.getElementById('name').value;
    const aka = document.getElementById('aka').value;
    const photo = document.getElementById('photo').files[0];

    // Convertir la imagen a base64 para almacenarla
    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onloadend = function() {
        const photoBase64 = reader.result;

        // Guardar los datos en LocalStorage
        const signupData = {
            name: name,
            aka: aka,
            photo: photoBase64
        };
        localStorage.setItem('signupData', JSON.stringify(signupData));

        // Mostrar los datos guardados
        const submittedData = document.getElementById('submittedData');
        submittedData.innerHTML = `
            <h2>Datos Inscritos:</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>AKA:</strong> ${aka}</p>
            <p><strong>Foto:</strong></p>
            <img src="${photoBase64}" alt="Foto de ${aka}">
        `;
    };
});
