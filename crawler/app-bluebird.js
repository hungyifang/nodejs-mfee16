const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const Promise = require("bluebird");
const readFileBlueBird = Promise.promisify(fs.readFile);

// let year = new Date().getFullYear();
// let month = new Date().getMonth() + 1;
// if (month < 10) {
//   month = "0" + month;
// }
// let date = new Date().getDate();
// if (date < 10) {
//   date = "0" + date;
// }
// let dateTime = year + month + date;

// function getStock() {
//   return new Promise(function (resolve, reject) {
//     fs.readFile("stock.txt", "utf8", function (err, data) {
//       if (err) {
//         reject(err);
//       }
//       resolve(data);
//     });
//   });
// }
async function crawler() {
  try {
    let stockNo = await readFileBlueBird("stock.txt", "utf8");
    let response = await axios.get(
      "https://www.twse.com.tw/exchangeReport/STOCK_DAY?",
      {
        params: {
          response: "json",
          date: moment().format("YYYYMMDD"),
          stockNo: stockNo,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.stat === "OK") {
      console.log(response.data.date);
      console.log(response.data.title);
    }
  } catch {
    console.error(error);
  }
}
crawler();

// getStock()
//   .then(function (data) {
//     return axios.get(
//       "https://www.twse.com.tw/exchangeReport/STOCK_DAY?",
//       {
//         params: {
//           response: "json",
//           date: dateTime,
//           stockNo: data,
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   })
//   .then(function (response) {
//     if (response.data.stat === "OK") {
//       console.log(response.data.date);
//       console.log(response.data.title);
//     }
//   })
//   .catch(function (error) {
//     console.log("讀檔錯誤" + error);
//   });

// axios
//   .get(
//     "https://www.twse.com.tw/exchangeReport/STOCK_DAY?",
//     {
//       params: {
//         response: "json",
//         date: dateTime,
//         stockNo: "2330",
//       },
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   )
//   .then(function (response) {
//     console.log(response.data);
//     let tableContent = "";
//           for (let i = 0; i < response.data.length; i++) {
//             tableContent += `
//             <tr>
//                 <td>${response.data[i][1]}</td>
//                 <td>${response.data[i][2]}</td>
//                 <td>${response.data[i][3]}</td>
//                 <td>${response.data[i][4]}</td>
//                 <td>${response.data[i][5]}</td>
//                 <td>${response.data[i][6]}</td>
//                 <td>${response.data[i][7]}</td>
//                 <td>${response.data[i][8]}</td>
//                 <td>${response.data[i][9]}</td>
//             </tr>
//             `;
//           }
//           $("#deal").append(tableContent);
//   })
//   .catch(function (error) {
//     console.log(error);
//     console.log(error.response);
//   });
