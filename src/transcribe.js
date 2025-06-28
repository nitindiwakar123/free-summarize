const transcribe = async (videoId = "") => {
    try {

        const url = `https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`;

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '6565fe87cemshf0bb3d6416a713dp1b03e0jsn8cbbbe44050b',
                'X-RapidAPI-Host': 'youtube-transcript3.p.rapidapi.com'
            }
        };

        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        return result;
    } catch (error) {
        console.error(error);
    }
}


export default transcribe;