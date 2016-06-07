/**
 * Created by vladimir on 16.05.16.
 */
var fs = require('fs')
var request = require('request');

var arWords = [], lastObj = {};

function writeToFile(arWords) {
    var f = fs.createWriteStream('words5.txt');
    arWords.forEach(function(el){
        f.write(el+"\n");
    });
    f.end();
}

function requester () {
    request('https://hola.org/challenges/word_classifier/testcase', function(err, resp, body) {
        var obj = JSON.parse(body);
        if (obj != lastObj){
            lastObj = obj;
            for (var i in obj) {
                var answ = obj[i] ? "1" : "0";
                var res = answ+" "+i;
                arWords.push(res);
            }
            if (arWords.length % 1000 == 0) {
                console.log (arWords.length);
            }
            if (arWords.length>5000000) { //50000)
                console.log(arWords.length);
                writeToFile(arWords);
                return;
            }
        }
        setTimeout(requester, 100);
    });
}

setTimeout(requester, 100);

