const API_BASE =
  "http://localhost:5000/api";

const token =
  localStorage.getItem("token");

async function fetchStats() {

  try {

    const response =
      await fetch(
        `${API_BASE}/admin/stats`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    if (data.success) {

      document.getElementById(
        "totalUsers"
      ).innerText =
        data.stats.totalUsers;

      document.getElementById(
        "totalDownloads"
      ).innerText =
        data.stats.totalDownloads;

      document.getElementById(
        "premiumUsers"
      ).innerText =
        data.stats.premiumUsers;

      document.getElementById(
        "totalRevenue"
      ).innerText =
        `৳${data.stats.totalRevenue}`;

    }

  } catch (error) {

    console.log(error);

  }

}

async function fetchUsers() {

  try {

    const response =
      await fetch(
        `${API_BASE}/admin/users`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    const table =
      document.getElementById(
        "usersTable"
      );

    table.innerHTML = "";

    data.users.forEach(user => {

      table.innerHTML += `

        <tr>

          <td>${user.name}</td>

          <td>${user.email}</td>

          <td>
            ${
              user.isPremium
                ? "Yes"
                : "No"
            }
          </td>

          <td>
            ${
              user.isAdmin
                ? "Admin"
                : "User"
            }
          </td>

          <td>

            <button
              class="action-btn delete-btn"
              onclick="deleteUser('${user._id}')">

              Delete

            </button>

            <button
              class="action-btn premium-btn"
              onclick="togglePremium('${user._id}')">

              Toggle Premium

            </button>

          </td>

        </tr>

      `;

    });

  } catch (error) {

    console.log(error);

  }

}

async function fetchDownloads() {

  try {

    const response =
      await fetch(
        `${API_BASE}/admin/downloads`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    const table =
      document.getElementById(
        "downloadsTable"
      );

    table.innerHTML = "";

    data.downloads.forEach(item => {

      table.innerHTML += `

        <tr>

          <td>${item.title}</td>

          <td>${item.sourcePlatform}</td>

          <td>${item.user?.email}</td>

          <td>${item.format}</td>

        </tr>

      `;

    });

  } catch (error) {

    console.log(error);

  }

}

async function deleteUser(id) {

  if (
    !confirm(
      "Delete this user?"
    )
  ) return;

  try {

    await fetch(
      `${API_BASE}/admin/users/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    fetchUsers();

  } catch (error) {

    console.log(error);

  }

}

async function togglePremium(id) {

  try {

    await fetch(
      `${API_BASE}/admin/users/premium/${id}`,
      {
        method: "PUT",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    fetchUsers();

  } catch (error) {

    console.log(error);

  }

}

function logoutAdmin() {

  localStorage.removeItem("token");

  window.location.href =
    "login.html";

}

fetchStats();

fetchUsers();

fetchDownloads();