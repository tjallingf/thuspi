function replaceById(arr: any[], searchId: string | number, replace: any): void {
    let i;
    for (i = 0; i < arr.length && arr[i].id != searchId; i++) {}
    i < arr.length ? (arr[i] = replace) : arr.push(replace);
}

function moveKeyToProperty<T extends Object>(object: { [key: string]: T }, keyPropertyName = 'key'): T[] {
    let array = [];

    Object.entries(object).forEach(([key, value]) => {
        const item = { ...value };
        item[keyPropertyName] = key;
        array.push(item);
    });

    return array;
}

export { replaceById, moveKeyToProperty };
