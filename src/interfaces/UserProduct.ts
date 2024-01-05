
export interface UserComponent {
    componentSpec: string;
    mounted: Record<string, string>;
}

export interface UserProduct {
    base: string;
    components: Record<string, UserComponent>;
}
