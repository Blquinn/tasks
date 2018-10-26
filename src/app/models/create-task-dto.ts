import {GoogleTaskLink} from './googletasks/GoogleTasks';

export interface CreateTaskDto {
  title: string;
  parent?: string;
  notes?: string;
  due?: string; // datetime;
  links: Array<GoogleTaskLink>;
}
