const imageUpload = document.getElementById('imageUpload');
const dropdownMenu = document.getElementById('dropdown');

const theOffice = 'http://api.tvmaze.com/shows/526/cast';
const gameOfThrones = 'http://api.tvmaze.com/shows/82/cast';
const walkingDead = 'http://api.tvmaze.com/shows/73/cast';
const friends = 'http://api.tvmaze.com/shows/431/cast';
const bigBang = 'http://api.tvmaze.com/shows/66/cast';
const breakingBad = 'http://api.tvmaze.com/shows/169/cast';
const doctorWho = 'http://api.tvmaze.com/shows/210/cast';
const houseOfCards = 'http://api.tvmaze.com/shows/175/cast';
const downtonAbbey = 'http://api.tvmaze.com/shows/251/cast';
const ER = 'http://api.tvmaze.com/shows/547/cast';
const lost = 'http://api.tvmaze.com/shows/123/cast';
const thirtyRock = 'http://api.tvmaze.com/shows/537/cast';
const satLive = 'http://api.tvmaze.com/shows/361/cast';
const seinfeld = 'http://api.tvmaze.com/shows/530/cast';
const sopranos = 'http://api.tvmaze.com/shows/527/cast';

let showUrl = lost;

dropdownMenu.addEventListener('click', (event) => {
    console.log('Button has been clicked.')
});




Promise.all([
    // faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models')
])
    .then(start)

function start() {
    document.body.append('API Models Loaded')
    imageUpload.addEventListener('change', async function() {
        const referenceImage = await faceapi.bufferToImage(imageUpload.files[0])
        document.body.append(referenceImage)
        try {
            runComparison(showUrl);
        } 
        catch(err) {
            console.log(`Error has occured. ${err}`)
        }
    })
}




function createUrlArray(dataObject) {
    let characterArray = [];
    for (let item of dataObject) {
        characterArray.push(item)
    }
    return characterArray;
}


function getCalculations(characterArray) {
    return Promise.all(
        characterArray.map(fetchQueryImage)
    )
}

async function fetchQueryImage(characterObject) {
    try {
        const referenceImage = await faceapi.bufferToImage(imageUpload.files[0])
        // const queryImage = await faceapi.fetchImage(characterObject.character.image.original);
        const queryImage = await faceapi.fetchImage(characterObject.person.image.original);
        const calculation = await compareFaces(referenceImage, queryImage)
        let characterCard = {
            characterName: characterObject.character.name,
            imgSrc: characterObject.person.image.original,
            distance: calculation
        }
        console.log(characterCard);
        return characterCard;
    }
    catch(err) {
        console.log(`Error occured during fetchQueryImage. Error ${err}`);
        const queryImage = await faceapi.fetchImage(characterObject.person.image.original);
    }
}

function appendImgToPage(imgSrc) {
    let img = document.createElement('img');
    img.src = imgSrc;
    document.body.appendChild(img);
}

function appendMessageToPage(characterName) {
    let h3 = document.createElement('h3');
    h3.textContent = `Congrats! Your closest character match is ${characterName}.`;
    document.body.appendChild(h3);
}

function renderResultsToPage(characterCard) {
    appendImgToPage(characterCard.imgSrc)
    appendMessageToPage(characterCard.characterName)
    // console.log(characterCard.distance)
}


async function runComparison(showUrl) {
    try {
        const response = await fetch(showUrl);
        const myJson = await response.json();
        const characterArray = await createUrlArray(myJson);
        const objectArray = await getCalculations(characterArray);
        const sortedArray = objectArray.sort((a, b) => (a.distance > b.distance) ? 1 : -1).filter(function (el) {
            return el.distance != null;
        });
        console.log(sortedArray);
        renderResultsToPage(sortedArray[0]);
    }
    catch(err) {
        console.log('Error occured during runComparison.')
    }
}


async function compareFaces(referenceImage, queryImage) {
    try {
        const useTinyModel = true;
        const results = await faceapi.detectSingleFace(referenceImage, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(useTinyModel).withFaceDescriptor()
        // console.log(results)
    
        if (!results) {
            console.log("no face")
            return
        }
        
        const singleResult = await faceapi.detectSingleFace(queryImage, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(useTinyModel).withFaceDescriptor()
        // console.log(singleResult)
        const dist = faceapi.euclideanDistance(results.descriptor, singleResult.descriptor);
        // console.log(dist)
        return dist;
    }
    catch(err) {
        console.log("Couldn't calculate.")
    }
}


// function getCastImages(castURL) {
//     fetch(gameOfThronesCast)
//         .then(r => r.json())
//         .then(result => createUrlArray(result))
//         .then(result => result.map(fetchQueryImage))
//         // .then((result => result.sort((a, b) => (a.distance > b.distance) ? 1 : -1)))
//         // .then(result => renderResultsToPage(result[0]))
// }

// function loadModel() {
//     const mainModel = faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
//     const landmarkModel = faceapi.nets.faceLandmark68Net.loadFromUri('/models')
//     const recModel = faceapi.nets.faceRecognitionNet.loadFromUri('/models')
//     const tinyLandmark = faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models')
//     const tinyFace = faceapi.nets.tinyFaceDetector.loadFromUri('/models')
//     return Promise.all([mainModel, landmarkModel, recModel, tinyLandmark, tinyFace])
// }

