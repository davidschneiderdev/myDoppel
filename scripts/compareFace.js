
const referenceImage = document.getElementById('referenceImage');


function loadModel() {
    const mainModel = faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    const landmarkModel = faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    const recModel = faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    // await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
    // await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    return Promise.all([mainModel, landmarkModel, recModel])
    // getCastImages(theOfficeCast);
}

async function fetchQueryImage(imageUrl) {
    const queryImage = await faceapi.fetchImage(imageUrl);
    // console.log(image);
    compareFaces(referenceImage, queryImage)
}

// const testURL = 'http://static.tvmaze.com/uploads/images/original_untouched/0/1813.jpg';


async function compareFaces(referenceImage, queryImage) {
    const results = await faceapi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor()
    // console.log(results)

    if (!results) {
        console.log("no face")
        return
    }
    
    const singleResult = await faceapi.detectSingleFace(queryImage).withFaceLandmarks().withFaceDescriptor()
    // console.log(singleResult)
    const dist = faceapi.euclideanDistance(results.descriptor, singleResult.descriptor)
    console.log(`Euclidean distance: ${dist}`)
}


// async function compareFaces() {
//     const results = await faceapi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor()
//     // console.log(results)

//     if (!results) {
//         console.log("no face")
//         return
//     }
    
//     const singleResult = await faceapi.detectSingleFace(queryImage1).withFaceLandmarks().withFaceDescriptor()
//     const dist = faceapi.euclideanDistance(results.descriptor, singleResult.descriptor)
//     console.log(`Euclidean distance: ${dist}`)
// }

// loadModel()
//     .then(console.log('Models loaded'))
//     .then(compareFaces)


// async function getDetection() {
//     const detection = await faceapi.detectSingleFace(referenceImage)
//     console.log(detection)
// }