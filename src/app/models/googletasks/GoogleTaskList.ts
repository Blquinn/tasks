export interface GoogleTaskListResponse {
  items: Array<GoogleTaskList>;
}

export interface GoogleTaskList {
  id: string;
  title: string;
  updated: string;
  selfLink: string;
}
