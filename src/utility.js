/**
 * Establishes XMLHttpRequest and returns it
 * @returns {XMLHttpRequest}
 */
export function setupConn () {
    let xhr = new XMLHttpRequest();
    // get a callback when the server responds
    xhr.addEventListener('load', () => {
        // update the state of the component with the result here
        console.log(xhr.responseText);
    });
    return xhr;
}

