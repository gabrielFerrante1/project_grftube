declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any
    }
}

export default global;
