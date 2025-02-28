document.addEventListener('DOMContentLoaded', function () {
  // File upload form handling
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      fetch('/api/upload/file', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert('Error: ' + data.error);
          } else {
            alert('Upload successful! Dump ID: ' + data.dumpId);
            window.location.reload();
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred during upload.');
        });
    });
  }

  // JSON data upload form handling
  const jsonUploadForm = document.getElementById('jsonUploadForm');
  if (jsonUploadForm) {
    jsonUploadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const jsonTextarea = document.getElementById('jsonData');
      let jsonData;

      try {
        // Parse the JSON to validate it
        jsonData = JSON.parse(jsonTextarea.value);
      } catch (error) {
        alert('Invalid JSON format: ' + error.message);
        return;
      }

      fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: jsonData })
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert('Error: ' + data.error);
          } else {
            alert('Upload successful! Dump ID: ' + data.dumpId);
            window.location.reload();
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred during upload.');
        });
    });
  }

  // Toggle between upload methods
  const uploadMethodToggle = document.getElementById('uploadMethodToggle');
  if (uploadMethodToggle) {
    const fileUploadCard = document.getElementById('fileUploadCard');
    const jsonUploadCard = document.getElementById('jsonUploadCard');

    uploadMethodToggle.addEventListener('change', function () {
      if (this.checked) {
        fileUploadCard.classList.add('d-none');
        jsonUploadCard.classList.remove('d-none');
      } else {
        fileUploadCard.classList.remove('d-none');
        jsonUploadCard.classList.add('d-none');
      }
    });
  }
}); 