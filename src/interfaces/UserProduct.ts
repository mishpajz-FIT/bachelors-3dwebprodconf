export interface UserComponent {
  componentSpec: string;
  materials: Record<string, string>;
  mounted: Record<string, string>;
}

export interface UserProduct {
  base: string;
  components: Record<string, UserComponent>;
}
