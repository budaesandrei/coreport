export type WorkspaceInfoResponse = {
  id: number;
  name: string;
  slug: string;
  status: string;
};

export type WorkspaceResolveRequest = {
  name: string;
};
