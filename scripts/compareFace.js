
const referenceImage = document.getElementById('referenceImage')
const queryImage1 = document.getElementById('queryImage1')

// console.log(faceapi.nets)

async function loadModel() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    // await faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
}


// async function getDetection() {
//     const detection = await faceapi.detectSingleFace(referenceImage)
//     console.log(detection)
// }

async function compareFaces() {
    const useTinyModel = true;
    const results = await faceapi.detectSingleFace(referenceImage, new faceapi.TinyFaceDetectorOptions).withFaceLandmarks(useTinyModel).withFaceDescriptor()
    // console.log(results)

    if (!results) {
        console.log("no face")
        return
    }

    // const faceMatcher = new faceapi.FaceMatcher(results)

    const singleResult = await faceapi.detectSingleFace(queryImage1, new faceapi.TinyFaceDetectorOptions).withFaceLandmarks(useTinyModel).withFaceDescriptor()
    // console.log(results)
    // console.log(singleResult)

    // if (singleResult) {
    //     const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
    //     console.log(bestMatch.toString())
    // }

    const dist = faceapi.euclideanDistance(results.descriptor, singleResult.descriptor)
    console.log(dist)
}

loadModel()
    .then(console.log('loaded'))
    .then(compareFaces)
    // .then(getDetection)