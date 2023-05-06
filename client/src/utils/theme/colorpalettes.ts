import { IColor, Color } from './colors';

export interface IColorPalette extends Array<IColor> {};
export interface IColorPalettes {
    [key: string]: IColorPalette
}

function createColorPalette(name: string, count: number = 10): IColorPalette {
    const palette = [];

    for (let i = 0; i < count; i++) {
        palette[i] = new Color(name, i);
    }

    return palette;
}

export const blue = createColorPalette('blue');
export const cyan = createColorPalette('cyan');
export const green = createColorPalette('green');
export const magenta = createColorPalette('magenta');
export const neutral = createColorPalette('neutral', 20);
export const orange = createColorPalette('orange');
export const purple = createColorPalette('purple');
export const red = createColorPalette('red');
export const violet = createColorPalette('violet');
export const yellow = createColorPalette('yellow');

export default { 
    blue, cyan, green, magenta, neutral, orange, purple, red, violet, yellow 
} as IColorPalettes;