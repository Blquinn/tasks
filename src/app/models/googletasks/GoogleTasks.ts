export interface GoogleTasksResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  items: Array<GoogleTask>;
}

export interface GoogleTask {
  kind: string; // "tasks#task"
  id: string;
  etag: string; // etag;
  title: string;
  updated: string; // datetime;
  selfLink: string;
  parent: string;
  position: string;
  notes?: string;
  status: string;
  due?: string; // datetime;
  completed?: string; // datetime;
  deleted: boolean;
  hidden: boolean;
  links: Array<GoogleTaskLink>;
}

export interface GoogleTaskLink {
  type: string;
  description: string;
  link: string;
}
