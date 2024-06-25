export function isString(atributo: any) {
    return atributo !== undefined && typeof atributo === 'string' ?
        atributo : ''
}