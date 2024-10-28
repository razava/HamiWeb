import {
  HttpTransportType,
  HubConnectionBuilder,
  JsonHubProtocol,
  LogLevel,
} from "@microsoft/signalr";
import { getCookie } from "cookies-next";

const token = getCookie("Hami_Admin_Token");

const connection = new HubConnectionBuilder()
  .withUrl("https://sootzaniapi.shetabdahi.ir/notifhub", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .withAutomaticReconnect()
  .withHubProtocol(new JsonHubProtocol())
  .configureLogging(LogLevel.Debug)
  .build();

// Optional: Configure connection options, such as access token or headers
// connection.on("your-event", (data) => {
//    // Handle incoming events
// });

export default connection;
