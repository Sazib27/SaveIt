async function buyPremium(
  premiumPlanId
) {

  const token =
    localStorage.getItem("token");

  const response = await fetch(

    "http://localhost:5000/api/payment/sslcommerz",

    {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`

      },

      body: JSON.stringify({
        premiumPlanId
      })

    }

  );

  const data =
    await response.json();

  if (data.success) {

    window.location.href =
      data.paymentUrl;

  } else {

    alert(data.message);

  }

}