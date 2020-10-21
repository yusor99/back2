import { ok } from "assert";
import { errRes, okRes } from "../helpers/tools";
import { Method } from "./../src/entity/Method";

const request = require("request");
const jwt = require("jsonwebtoken");
const ZC = require("zaincash");
const Secret = "$2y$10$xlGUesweJh93EosHlaqMFeHh2nTOGxnGKILKCQvlSgKfmhoHzF12G";
const initUrl = "https://test.zaincash.iq/transaction/init";
const time = Date.now();
    const data = {
      amount: 5000, // The amount you need the customer to pay. 250 is the minimum.
      serviceType: "Amorii website", // This is a free text and it's will appear to the customer in the payment page.
      msisdn: "9647835077880", // The merchant wallet number in string form
      orderId: "12345ID", // Free text, you need to write your invoice id from your DB, U will use in the redirection
      redirectUrl:"http://localhost:3001/v1/redirect", // Your GET URL that ZC will redirect to after the payment got completed
      iat: time, // Time for the JWT token
      exp: time + 60 * 60 * 4, // Time for the JWT token
    };
    const token = jwt.sign(data, Secret); // Create the token

const paymentData = {
    amount: 250,
    orderId: 'some id',
    serviceType: "yusor",
    redirectUrl: 'example.com/redirect',
    production: false,
    msisdn: '+9647835077880',
    merchantId:"5dac4a31c98a8254092da3d8",
    secret: '$2y$10$xlGUesweJh93EosHlaqMFeHh2nTOGxnGKILKCQvlSgKfmhoHzF12G',
    lang: 'en'
  }
  const postData = {
    'token': token,
    'merchantId': '5dac4a31c98a8254092da3d8',
    'lang': 'ar' // ZC support 3 languages ar, en, ku
  };
  const requestOptions = {
    uri: initUrl,
    body: JSON.stringify(postData),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
export default class ZcController {
  // preparing payment data
  static async pay (req, res) {
    let zc = new ZC(paymentData);
    zc.init().then(transactionId => {
      //  Save the transactionId in your DB
      //console.log(transactionId);
      zc.pay(`https://test.zaincash.iq/transaction/pay?id=${transactionId}`, res);
     res.status(200).send(transactionId)
    }).catch(err => {
      res.status(400).send(err);
    });
   
      console.log(postData);
     
      request(requestOptions, function (error, response) {
        if(error) return res.send(error)
        //  Getting the operation id
          const OperationId = JSON.parse(response.body).id; // The id will look like 5e4d7ff765742b77601c6566
        // You can redirect to the page usint the below code 
      /**  res.writeHead(302, {
          'Location': requestUrl + OperationId
        });
        res.end();
        res.send(OperationId); */
        console.log(OperationId);
      });
    return res;
  }
 
  static async redirect(req, res) {
    const token = req.body.token;
    if (token) {
      try {
        var decoded = jwt.verify(token, process.env.SECRET);

        return okRes(res, decoded);
      } catch (err) {
        // err
        return errRes(res, "error");
      }
      if (decoded.status == "success") {
        // Do whatever you like
        return okRes(res, {status:decoded.status});
      } else {
        return okRes(res,{status:decoded.status});
        //  Do other things
      }
    }
  }}
