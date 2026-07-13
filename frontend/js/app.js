async function fetchMedia(){

  const url = document.getElementById("mediaUrl").value;

  const result = await apiRequest(
    "/download/fetch",
    "POST",
    { url }
  );

  const preview = document.getElementById("mediaPreview");

  if(result.success){

    preview.innerHTML = `
      <img src="${result.thumbnail}" />

      <h3>${result.title}</h3>

      <p>Duration: ${result.duration}s</p>

      <button onclick="startDownload()">
        Download Now
      </button>
    `;

  }else{

    preview.innerHTML = `
      <p>Failed to fetch media</p>
    `;

  }

}

async function startDownload(){

  const url = document.getElementById("mediaUrl").value;

  const typeElement = document.getElementById("downloadType");

  const type = typeElement ? typeElement.value : "mp4";

  const result = await apiRequest(
    "/download/start",
    "POST",
    {
      url,
      type
    }
  );

  const output = document.getElementById("downloadResult");

  if(result.success){

    output.innerHTML = window.location.href =
  `http://localhost:5000/api/download/file/${result.download._id}`;

  }else{

    output.innerHTML = `
      <p>Download failed</p>
    `;

  }

}