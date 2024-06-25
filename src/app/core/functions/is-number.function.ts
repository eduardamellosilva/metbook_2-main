
export function isNumber(atributo: any) {
    return atributo !== undefined
        && typeof atributo === 'number' ? atributo : NaN
}