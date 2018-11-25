

exports.GET = function(){

    http.get('http://nodejs.org/dist/index.json', (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        return res.on('end', () => {
            return rawData
        })   
    });
}