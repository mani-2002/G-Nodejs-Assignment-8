function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);

    if (data.link) {
      const downloadLink = document.createElement('a');
      downloadLink.href = data.link; 
      downloadLink.download = file.name;
      downloadLink.innerText = 'Download File';
      document.getElementById('downloadLinkContainer').innerHTML = ''; 
      document.getElementById('downloadLinkContainer').appendChild(downloadLink);
    } else {
      console.error('Error: No file link available.');
    }
  })
  .catch(error => console.error('Error:', error));
}
