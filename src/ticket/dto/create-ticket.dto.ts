export class CreateTicketDto {
  title: string;
  issueType: string;
  description: string;
  priority: string;
  assignee: string;
  status: string;
  reporter: string;
  projectId: string;
  sprint: string;
}
