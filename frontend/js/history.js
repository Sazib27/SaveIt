async function loadHistory() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";
        return;

    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/user/history",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        const container =
            document.getElementById("historyContainer");

        container.innerHTML = "";

        if (!data.success) {

            container.innerHTML =
                "<h3>Failed to load history.</h3>";

            return;

        }

        if (data.downloads.length === 0) {

            container.innerHTML =
                "<h3>No download history yet.</h3>";

            return;

        }

        data.downloads.forEach(item => {

            container.innerHTML += `

            <div class="history-card">

                <h3>${item.title}</h3>

                <p>
                    Platform :
                    ${item.sourcePlatform}
                </p>

                <p>
                    Type :
                    ${item.mediaType}
                </p>

                <p>
                    Quality :
                    ${item.quality}
                </p>

                <a
                    href="http://localhost:5000${item.fileUrl}"
                    target="_blank"
                >
                    Download Again
                </a>

            </div>

            `;

        });

    }

    catch (err) {

        console.error(err);

    }

}

loadHistory();