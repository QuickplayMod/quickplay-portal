import store from '../src/store/index'

/**
 * Prettify a URL to convert it from a raw URL into an easier to read link.
 * To be specific, removes protocol from the start of the string and shortens long URLs with ellipsis.
 * @param url {string} URL to prettify
 * @return {string} Prettified URL to display for user.
 */
function prettifyUrl(url: string): string {
    let result: string
    // Remove protocol
    result = url.replace(/^\w+:\/\//gi, '')
    if(result.length > 30) {
        const start = result.slice(0, 12);
        const end = result.slice(result.length - 12, result.length)
        result = start + '...' + end
    }
    return result
}

/**
 * Translate a key into it's localized counterpart in English. If no translation exists, the original key
 * is returned.
 * @param key {string} Key to translate
 * @return {string} The translated string.
 */
function translate(key: string): string {
    if (!store.state.translations) {
        return key;
    } else if (!store.state.translations[key]) {
        return key;
    } else if (!store.state.translations[key]["en_us"]) {
        return key;
    }
    return store.state.translations[key]["en_us"];
}

export { prettifyUrl, translate }
