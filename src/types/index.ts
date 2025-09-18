export interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}
export interface User {
  id: string;
  email: string;
  name?: string | null;
}
