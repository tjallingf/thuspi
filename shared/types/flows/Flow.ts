export interface FlowProps {
    id: number;
    name: string;
    icon: string;
    program: {
        blocks: {
            [key: string]: any;
        };
    };
}