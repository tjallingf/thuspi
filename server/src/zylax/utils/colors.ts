export type Colors = {
    BLUE: string;
    CYAN: string;
    GREEN: string;
    ORANGE: string;
    PINK: string;
    PURPLE: string;
    RED: string;
    YELLOW: string;
};
export type Color = Colors[keyof Colors];

const colors: Colors = {
    BLUE: 'blue',
    CYAN: 'cyan',
    GREEN: 'green',
    ORANGE: 'orange',
    PINK: 'pink',
    PURPLE: 'purple',
    RED: 'red',
    YELLOW: 'yellow',
};

export default colors;
