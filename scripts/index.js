
const theOfficeCast = 'http://api.tvmaze.com/shows/526/cast';
const gameOfThronesCast = 'http://api.tvmaze.com/shows/82/cast';
const walkingDeadCast = 'http://api.tvmaze.com/shows/73/cast';
const referenceImage = document.getElementById('referenceImage');

function loadModel() {
    const mainModel = faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    const landmarkModel = faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    const recModel = faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    // await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
    // await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    return Promise.all([mainModel, landmarkModel, recModel])
}


function createUrlArray(dataObject) {
    let characterArray = [];
    for (let item of dataObject) {
        // characterArray.push(item.person.image.original)
        characterArray.push(item)
    }
    // console.log(`URL Array: ${characterArray}`);
    return characterArray;
}

async function fetchQueryImage(characterObject) {
    console.log(characterObject)
    const queryImage = await faceapi.fetchImage(characterObject.character.image.original);
    // console.log(queryImage);
    appendImgToPage(characterObject.character.image.original);
    let euc = await compareFaces(referenceImage, queryImage)
    // compareFaces(referenceImage, queryImage)
    let characterCard = {
        characterName: characterObject.character.name,
        imgSrc: characterObject.character.image.original,
        distance: euc
    }
    console.log(characterCard);
    return characterCard;
}


function appendImgToPage(imgSrc) {
    let img = document.createElement('img');
    img.src = imgSrc;
    img.width = "300";
    img.height = "300";
    document.body.appendChild(img);
}


function getCastImages(castURL) {
    fetch(castURL)
        .then(r => r.json())
        .then(result => createUrlArray(result))
        .then(result => result.map(fetchQueryImage))
}


async function compareFaces(referenceImage, queryImage) {
    const results = await faceapi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor()
    // console.log(results)

    if (!results) {
        console.log("no face")
        return
    }
    
    const singleResult = await faceapi.detectSingleFace(queryImage).withFaceLandmarks().withFaceDescriptor()
    // console.log(singleResult)
    const dist = faceapi.euclideanDistance(results.descriptor, singleResult.descriptor);
    return dist;
}

loadModel()
    .then(console.log(`Models loaded`))
    .then(resultArray => {
        getCastImages(theOfficeCast)   
    })
    .then(console.log)

// Promise.all([
//     faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//     faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
// ])
//     .then(getCastImages(theOfficeCast))
