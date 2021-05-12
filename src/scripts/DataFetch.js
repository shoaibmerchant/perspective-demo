import perspective from "@finos/perspective";
import { DATA } from './data';
import { DataService } from './DataService';

let hiCount = 0;

class HierarichalParser {
  table = null;
  view = null;
  dataService = null;

  static init () {
    console.log('Initializing Hierarchical Parser');

    // Load the perspective table & view
    const worker = perspective.worker();
    HierarichalParser.table = worker.table(DATA);
    

    console.log('Perspective table & view ready');

    HierarichalParser.dataService = new DataService(HierarichalParser.cb);
    HierarichalParser.dataService.init();

    // load parser
    document.getElementById("parse-btn").addEventListener("click", HierarichalParser.toJSON);
    document.getElementById("hello-btn").addEventListener("click", HierarichalParser.sayHi);
  }

  static cb(rows) {
    document.querySelector("#rows-fetched").innerHTML = HierarichalParser.dataService.rowCount;
    console.log('Updating new rows in perspective table', new Date().getTime());
    HierarichalParser.table.update(rows);
    console.log('New rows updated in perspective table', new Date().getTime());
    // console.log('Ending process', new Date().getTime());
  }

  static toJSON() {
    console.log('Serializing view started', new Date().getTime());
    HierarichalParser.view = HierarichalParser.table.view({
      columns: ["Total_Revenue"],
      aggregates: { "Total_Revenue": "sum" },
      row_pivots: ["Item_Type"],
      column_pivots: ["Region", "Country"]
      // Agg
      // columns: ["Total Cost", "Total Revenue" ],
      // aggregates: { "Total Cost": "sum", "Total Revenue": "sum" },
      // row_pivots: ["Region", "Country"],
      // column_pivots: ["Item Type"]
    });
    HierarichalParser.view.to_json().then(json => {
      console.log(json);
      console.log('Serializing view done', new Date().getTime());
    });
    // HierarichalParser.view.to_columns().then(json => console.log(json));
  }

  static sayHi() {
    hiCount += 1;
    document.querySelector("#hello-count").innerHTML = hiCount;
    console.log('Hi Count!', hiCount);
  }
}

console.log('Starting process', new Date().getTime());
HierarichalParser.init();
