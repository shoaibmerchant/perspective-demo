import perspective from "@finos/perspective";

class HierarichalParser {

  static async init () {
    console.log('perspective', perspective);
    // Bind to the server's worker instead of instantiating a Web Worker.
    const websocket = perspective.websocket("http://localhost:8081");
    const server_table = websocket.open_table("table_one");
    
    const worker = perspective.worker();
    const server_view = await server_table.view();
    const client_table = await worker.table(server_view);
    console.log('Server_Table', server_table, client_table);
  }

}

console.log('Starting process', new Date().getTime());
HierarichalParser.init();
