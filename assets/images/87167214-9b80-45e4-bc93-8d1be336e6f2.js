/**
 * Created by vladimir on 04.05.16.
 */
var sourceFileName = "./words24m.txt";
var prefFileName = "pref.txt";
var fs = require('fs');

var arWords = fs.readFileSync(sourceFileName).toString().split("\n").map(function(el){
    var obj={};
    var arEl = el.split(" ");
    obj.state = arEl[0];
    obj.word = arEl[1];
    return obj;
});

var arPref = fs.readFileSync(prefFileName).toString().split("\n").filter(function(el){return el.length>1;});

var resOk = 0, totalWords = 0;

arWords.forEach(function(el){
    var chkWord = el.word;

    var testRes = "0";
    arPref.forEach(function(pref){
        if (chkWord.substr(0, pref.length) == pref) {
            testRes = "1";
        }
    });

    if (el.state == testRes) {
       resOk++;
    }
    totalWords++;

    if (totalWords%1000==0) {
        console.log("words", totalWords, "res", resOk/totalWords*100);
    }
});