import {GoogleTaskLink} from './googletasks/GoogleTasks';

export interface NewTask {
  title: string;
  notes?: string;
  parent?: string;
  dueDate?: Date;
  links?: Array<GoogleTaskLink>;
}
