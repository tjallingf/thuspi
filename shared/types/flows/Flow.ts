export interface FlowProps {
    name: string;
    icon: string;
    program: {
        blocks: {
            [key: string]: any;
        };
    };
}