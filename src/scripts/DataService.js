const API_URL = 'http://localhost:3001';

export class DataService {
  rows = [];
  rowCount = 0;
  cb = () => {};

  constructor(cb) {
    this.cb = cb;
  }

  init() {
    const dataLimit = 1000;

    this.fetch(0, dataLimit)
      .then((response) => {
        // console.log("response:", response);
        const totalCount = response?.count;
        const rowsData = response?.rows;

        console.log(`Rows from 0 to ${dataLimit - 1}`, rowsData);

        // Trigger callback
        this.rowCount += rowsData.length;
        // this.rows = this.rows.concat(rowsData);
        this.cb(rowsData);

        // to fetch more data
        const leftData = totalCount - dataLimit;
        const numberOfPages = Math.ceil(leftData / dataLimit);

        // this.loadData(0, dataLimit, numberOfPages); // request
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  fetch = (offset, limit) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${API_URL}/api/sales-data/paginated/${offset}/${limit}`,
        {
          method: "GET",
          headers: {},
        }
      )
        .then((res) => res.json())
        .then((data) => {
          //   console.log(data);
          resolve(data.data);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  async loadData (pageNo, dataLimit, numberOfPages) {
    this.fetch((pageNo + 1) * dataLimit, dataLimit)
      .then((response) => {
        const rowsData = response?.rows;

        console.log(
          `Rows from ${(pageNo + 1) * dataLimit} to ${
            (pageNo + 2) * dataLimit - 1
          }`,
          rowsData
        );

        console.log(pageNo, "---", numberOfPages - 2);
        
        // Trigger callback
        this.rowCount += rowsData.length;
        // this.rows = this.rows.concat(rowsData);
        this.cb(rowsData);
        // this.rows = [...this.rows, ...rowsData];

        if (pageNo < numberOfPages - 1)  {
          this.loadData(pageNo + 1, dataLimit, numberOfPages);
        } else {
          // this.cb(rowsData);
          console.log("OUT of recursion:");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
}