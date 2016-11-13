/**
 * Created by kangjungu1 on 2016. 11. 12..
 */

var encode={};

//암호화 모듈
var crypto = require("crypto");
//해쉬맵 모듈
var HashMap = require("hashmap");
//URL 값을 임시 저장할 HashMap
var urlMap = new HashMap();
//암호화에 사용될 키
var key = "skhu@ac.kr";
// (암호화방식,키)로 cipher객체 생성
var cipher = crypto.createCipher('aes256',key);
//랜덤 값
var salt = Math.round((new Date().valueOf() * Math.random()))+"";

//비밀번호 찾기 URL 만드는 함수
encode.MakeURL = function (login_id,category_id,callback) {

    //(암호화할 값,인풋타입,아웃풋타입)으로 암호화된 url 생성
    var hashURL = cipher.update(login_id+category_id+salt,'ascii','hex');

    //(key,value)로 hashmap에 저장
    urlMap.set(hashURL,login_id+category_id);
    callback(hashURL);
};

//login_id로 urlMap에 저장되어있는 hash URL을 찾는다.
encode.searchURL = function(hashURL,login_id,category_id,callback){
    //잘못된 URL로 접근한 경우
    if(!urlMap.get(hashURL)){
        callback("error");
    }
    //login_id와 hashMap에 저장되어있는 value값이 같은경우
    if(urlMap.get(hashURL) == login_id+category_id){
        callback(true);
    }else{
        //다른경우
        callback(false);
    }
};
//urlMap에서 hash URL을 없앤다.
encode.removeURL = function(url){
  urlMap.remove(url);
};

module.exports =  encode;