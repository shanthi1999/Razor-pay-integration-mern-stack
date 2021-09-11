const express = require("express");

const routes = express.Router();
const Razorpay = require("razorpay");

require("dotenv").config();

const axios = require("axios");

routes.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 500, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

routes.post("/success", async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

/*--getting the payments as per the dates given in the instance--*/

routes.get("/paymentsByOrders", async (req, res) => {
  let reqObj = req.body;
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  instance.payments
    .all({
      from: "2021-09-01",
      to: "2021-09-20",
    })
    .then((response) => {
      // handle success
      res.status(200).json({
        message: "payment details fetched successfully",
        result: response,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
      console.log(error);
    });
});

/*--getting the payments as per the orderid given in the instance--*/

routes.get("/paymentsByOrderid", async (req, res) => {
  let reqObj = req.body;
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  instance.orders
    .fetch("order_HwB0VgyJio91Ap")
    .then((response) => {
      // handle success
      res.status(200).json({
        message: "payment details fetched successfully",
        result: response,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
      console.log(error);
    });
});

/*--Creating the customer--*/

routes.post("/customer-create", async (req, res) => {
    let reqObj = req.body;
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  
    instance.customers.create({name:reqObj.name,email:reqObj.email, contact:reqObj.contact, notes:reqObj.notes})
      .then((response) => {
        // handle success
        res.status(200).json({
          message: "customer created successfully",
          result: response,
        });
      })
      .catch((error) => {
        res.status(500).send(error);
        console.log(error);
      });
  });

  
/*--retriving the customer--*/

routes.post("/customer-retrive", async (req, res) => {
    let reqObj = req.body;
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  
    instance.customers.fetch({customer_id:reqObj.customer_id})
      .then((response) => {
        // handle success
        res.status(200).json({
          message: "customer retrived successfully",
          result: response,
        });
      })
      .catch((error) => {
        res.status(500).send(error);
        console.log(error);
      });
  });

module.exports = routes;
