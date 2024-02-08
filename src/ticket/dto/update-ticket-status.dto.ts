export class UpdateTicketStatusDto {
  status: string;
}

export class UpdateTicketDetailsDto {
  title: string;
  issueType: string;
  description: string;
  priority: string;
  assignee: string;
  status: string;
  reporter: string;
  sprint: string;
}
