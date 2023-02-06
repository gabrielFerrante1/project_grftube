export function formatCurrentTime(seconds: number): string {
    let minutes: any = Math.floor(seconds / 60);
    let secs: any = Math.floor(seconds % 60);

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    if (secs < 10) {
        secs = '0' + secs;
    }

    return minutes + ':' + secs;
}

export function formatToSeconds(time: string): number {
    let timeArray = time.split(':')

    return (+timeArray[0] * 60) + (+timeArray[1])
}