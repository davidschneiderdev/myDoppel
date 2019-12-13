
let searchItem = 'portraits';
const APIaddress = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchItem}`;

function getObjectArray(APIaddress) {
    return fetch(APIaddress)
            .then(r => r.json())
            .then(result => { return result.objectIDs.slice(0, 50) } )
}

function getImage(objectID) {
    let ObjectAddress = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
    fetch(ObjectAddress)
        .then(r => r.json())
        .then(result => { return result.primaryImage } )
        .then(result => appendImgToPage(result))
}

function appendImgToPage(imgSrc) {
    let img = document.createElement('img');
    img.src = imgSrc;
    img.width = "300";
    img.height = "300";
    document.body.appendChild(img);
}

getObjectArray(APIaddress)
    .then(result => result.map(getImage))


// ----------------------------------------------------------

// Fetch Object Image URL and Append To Page

// function fetchAnImage(data) {
//     for(let item of data) {
//         console.log(item);
//     }
// }


// fetchAnImage(data);





