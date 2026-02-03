import { InvitationResponse } from "@types";
import apiClient from "./client";

const ENDPOINT = "/invitations";

export const getInvitationByToken = async (token: string): Promise<InvitationResponse> => {
    const response = await apiClient.get(`${ENDPOINT}/${token}`);
    return response.data;
};

export const patchAcceptInvitationByToken = async (token: string): Promise<InvitationResponse> => {
    const response = await apiClient.patch(`${ENDPOINT}/${token}/accept`);
    return response.data;
};