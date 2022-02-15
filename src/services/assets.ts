export function getAssetUrl(folder: string, name: string) : string { 
    return new URL(`../assets/${folder}/${name}`, import.meta.url).href
}