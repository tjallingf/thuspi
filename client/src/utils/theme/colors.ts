export interface IColor {
    name: string,
    intensity?: number
}

export class Color implements IColor {
    name: string;
    intensity?: number;

    constructor(name: string, intensity?: number) {
        this.name = name;
        this.intensity = intensity;
    }

    toString(): string {
        if(typeof this.intensity == 'number')
            return `var(--${this.name}-${this.intensity})`;
        
        return `var(--${this.name})`;
    }
}


export const textLight = new Color('text-light');
export const textDark = new Color('text-dark');
export const transparent = new Color('transparent');
export const textPrimary = new Color('text-primary');
export const textPrimaryInverse = new Color('text-primary-inverse');
export const textMuted = new Color('text-muted');

interface IColors {
    [index: string]: IColor
}

export default { 
    textLight, textDark, textMuted, textPrimary, textPrimaryInverse,
    transparent
} as IColors;