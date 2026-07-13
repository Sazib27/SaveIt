async function register() {

  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const response = await fetch(
    "http://localhost:5000/api/auth/register",
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        name,
        email,
        password
      })
    }
  );

  const data = await response.json();

  if(data.token){

    localStorage.setItem("token", data.token);

    window.location.href = "dashboard.html";

  }else{

    alert(data.message);

  }

}

async function login(){

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const response = await fetch(
    "http://localhost:5000/api/auth/login",
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await response.json();

  if(data.token){

    localStorage.setItem("token", data.token);

    window.location.href = "dashboard.html";

  }else{

    alert(data.message);

  }

}

function logout(){

  localStorage.removeItem("token");

  window.location.href = "login.html";

}