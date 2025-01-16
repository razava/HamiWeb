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
            queryClient.invalidateQueries(["PatientsList"]);
            toast.info("یک بیمار جدید دارید.");
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

  }, []);

  useEffect(() => {
    if (connection.connectionId) {
      console.log(connection.connectionId);
    }
  }, [connection]);
 
};

export default useSignalR;
