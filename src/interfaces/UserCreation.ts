export interface UserComponent {
  componentSpec: string;
  materials: Record<string, string>;
  mounted: Record<string, string>;
}

export interface UserCreation {
  base: string;
  components: Record<string, UserComponent>;
}
