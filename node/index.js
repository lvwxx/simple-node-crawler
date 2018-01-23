const path = require('path');
const request = require('request');
const fs = require('fs');

let movieDir = path.join(__dirname, '../movie-name/movie.txt');

// 读取文件名称
const readFiles = () => {
    return new Promise((reslove,reject) => {
        fs.readFile(movieDir, 'utf8', (err,data) => {
            if(err) throw err;
            reslove(data);
        })
    });
};

// 获取海报
const getPoster = (movieName) => {
    let url = `https://api.douban.com/v2/movie/search?q=${encodeURI(movieName)}`;

    return new Promise((reslove, reject) => {
        request({url,json:true}, (err,resp,body) => {
            if(err) return reject(err);

            reslove(body.subjects[0].images.large);
        });
    });
};

// 保存海报
const saveImg = (movieName, url) => {
    request.get(url).pipe(fs.createWriteStream(path.join(__dirname, '../movie-img/' + movieName +'.jpg')));
};



(async () => {
    let name = await readFiles();
    let nameList = name.split(',');

    for(let i = 0; i<nameList.length; i++) {
        console.log(`正在获取${nameList[i]}`);
        saveImg(nameList[i], await getPoster(nameList[i]));
    };

})();