// script.js

document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Clothing item uploaded successfully');
            this.reset();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Server error');
    }
});
