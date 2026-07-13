async function loadHistory(){

  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/api/user/history",
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  const container =
    document.getElementById("historyContainer");

  container.innerHTML = "";

  data.forEach(item => {

    container.innerHTML += `
      <div class="history-card">

        <h3>${item.title}</h3>

        <p>${item.platform}</p>

        <a href="http://localhost:5000${item.fileUrl}" target="_blank">
          Download Again
        </a>

      </div>
    `;

  });

}

loadHistory();