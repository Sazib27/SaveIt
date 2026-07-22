// =====================================
// Fetch Media
// =====================================

async function fetchMedia() {

    const url =
        document.getElementById("mediaUrl").value.trim();

    if (!url) {

        alert("Enter a video URL");

        return;

    }

    const result =
        await apiRequest(
            "/download/fetch",
            "POST",
            { url }
        );

    const preview =
        document.getElementById("mediaPreview");

    if (!result.success) {

        preview.innerHTML =
            "<p>Unable to fetch media.</p>";

        return;

    }

    preview.innerHTML = `

        <img
            src="${result.thumbnail}"
            width="320"
        >

        <h3>${result.title}</h3>

        <p>
            Duration :
            ${result.duration} sec
        </p>

        <button
            onclick="startDownload()"
        >
            Download Now
        </button>

    `;

}



// =====================================
// Start Download
// =====================================

function startDownload() {

    const url =
        document.getElementById("mediaUrl").value;

    const typeSelect =
        document.getElementById("downloadType");

    const qualitySelect =
        document.getElementById("quality");

    const type =
        typeSelect
            ? typeSelect.value
            : "mp4";

    const quality =
        qualitySelect
            ? qualitySelect.value
            : "720";

    // Create a hidden form so the browser
    // handles the file download directly.
    const form =
        document.createElement("form");

    form.method = "POST";

    form.action =
        "http://localhost:5000/api/download/start";

    form.style.display = "none";


    const urlInput =
        document.createElement("input");

    urlInput.type = "hidden";

    urlInput.name = "url";

    urlInput.value = url;

    form.appendChild(urlInput);


    const typeInput =
        document.createElement("input");

    typeInput.type = "hidden";

    typeInput.name = "type";

    typeInput.value = type;

    form.appendChild(typeInput);


    const qualityInput =
        document.createElement("input");

    qualityInput.type = "hidden";

    qualityInput.name = "quality";

    qualityInput.value = quality;

    form.appendChild(qualityInput);


    document.body.appendChild(form);

    form.submit();

    form.remove();

}

async function pasteClipboard() {

    try {

        const text = await navigator.clipboard.readText();

        document.getElementById("mediaUrl").value = text;

    } catch (err) {

        alert("Clipboard permission denied.");

    }

}

function clearInput(){

    document.getElementById("mediaUrl").value="";

    document.getElementById("mediaPreview").innerHTML="";

}