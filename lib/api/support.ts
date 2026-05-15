import { apiData } from "@/lib/api";

export interface SupportTicketInput {
  name: string;
  email: string;
  message: string;
}

export const supportApi = {
  /**
   * Send a support message/ticket to the backend
   */
  sendTicket: async (data: SupportTicketInput): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>("/api/support", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
