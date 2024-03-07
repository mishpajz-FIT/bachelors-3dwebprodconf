export interface SubmissionResponse {
  redirectUrl?: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  note?: string;
}
