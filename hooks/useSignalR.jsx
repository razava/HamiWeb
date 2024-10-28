import { useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HttpTransportType,
  HubConnectionBuilder,
  JsonHubProtocol,
  LogLevel,
} from "@microsoft/signalr";
import connection from "../utils/signalrConnection";
import { postConnectionId } from "@/utils/inspectorApi";
import { toast } from "sonner";
import { useParams, usePathname } from "next/navigation";

const useSignalR = () => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const param = useParams();
  const isInComplaintDetailPage = pathname.includes(
    "/UserPanel/ControllerDashboard/Complaints/"
  );
  const postConnectionIdMutation = useMutation({
    mutationKey: ["connectionId"],
    mutationFn: postConnectionId,
    onSuccess: (res) => {},
    onError: (err) => {},
  });
  useEffect(() => {
    const role = localStorage.getItem("Hami_Role");
    if (role != "Admin") {
      const startConnection = async () => {
        try {
          await connection.start();
          
          postConnectionIdMutation.mutate(connection.connectionId);
          connection.on("Created", (message) => {
            queryClient.invalidateQueries(["ComplaintsList"]);
            toast.info("یک گزارش جدید دارید.");
          });
          connection.on("Updated", (message, id) => {
            toast.info(`${message}`);
            if (param.id == id) {
              queryClient.invalidateQueries(["Complaint", id]);
            }
          });
        } catch (err) {
          console.error("SignalR connection failed: ", err);
        }
      };

      startConnection();
    }

   

    // return () => {
    //   if (connection.state === "Connected") {
    //     connection.stop();
    //     console.log("SignalR disconnected");
    //   }
    // };
  }, []);

  useEffect(() => {
    if (connection.connectionId) {
      console.log(connection.connectionId);
    }
  }, [connection]);
  // console.log(connection.state);
  // useEffect(() => {
  //   console.log(11111);
  //   console.log(connection.state);
  //   // Subscribe to events and update query data accordingly
  //   // Example: Listen for a "newMessage" event and update a query with the new message data

  //   console.log(connection.state);

  // }, [queryClient]);

  // return connection;
};

export default useSignalR;
