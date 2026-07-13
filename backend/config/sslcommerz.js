const SSLCommerzPayment =
  require("sslcommerz-lts");

const store_id =
  process.env.SSL_STORE_ID;

const store_passwd =
  process.env.SSL_STORE_PASSWORD;

const is_live =
  process.env.SSL_IS_LIVE === "true";

const sslcz = new SSLCommerzPayment(
  store_id,
  store_passwd,
  is_live
);

module.exports = sslcz;