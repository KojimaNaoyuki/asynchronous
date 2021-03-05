// 非同期処理とはapi通信などの時間がかかる処理の場合、そこで全体の処理を止めるのではなく
// その関数だけ別スレッドで実行されていて、全体の処理は止まらないこと
console.log('index.js');

(function() {
    //重い処理が行われ、その結果が返って来る前にresultにプロミスが代入され処理が進んでしまうから、logで表示できない
    const result = fetch('https://api.jikan.moe/v3/search/anime?q=kimetu$limit=10'); //重い処理なので非同期処理となる(結果が返る前にプロミスを返す)
    console.log(result); //プロミスしか入ってない
}).call(this);


(function() {
    //重い通信をした結果得られた値を使用して何か処理をしたい場合、重い処理の終了を待たなければならない
    //thenメソッドを使用する事で、重い処理が終了するのを待って実行させることができる(プロミス(引換券)が返されている物でthenが使える)
    const result = fetch('https://api.jikan.moe/v3/search/anime?q=kimetu$limit=10'); //重い処理なので非同期処理となる(結果が返る前にプロミスを返す)

    result.then(response => {
        //resultの値(promise以外)が返ってきたら実行される(成功の場合)
        //その値はresponseに入っている
        console.log(response);
    });
    result.catch(e => {
        //resultの値(promise以外)が返ってきたら実行される(失敗の場合)
        //eにはエラーコードが入っている
        console.log('エラー');
        console.log(e);
    });
    console.log(result);
}).call(this);


(function() {
    //thenもプロミス(引換券)を返すのでthenにthenをつなげることもできる(thenチェーン)
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms)); //Promiseで手動で非同期処理にしている

    sleep(2000)
    .then(() => console.log('2秒'))
    .then(() => sleep(1000))
    .then(() => console.log('1秒'))
    .catch(e => {
        //thenチェーンの中のどこかでエラーが発生したら以降のthenは無視してココに飛ぶ
        console.log(e);
    });
}).call(this);


(function() {
    //非同期処理同士で依存関係があるときはPromise.allを使用する
    const result1 = fetch('https://api.jikan.moe/v3/search/anime?q=kimetu$limit=10'); //重い処理なので非同期処理となる(結果が返る前にプロミスを返す)
    const result2 = fetch('https://api.jikan.moe/v3/search/anime?q=geass$limit=10'); //重い処理なので非同期処理となる(結果が返る前にプロミスを返す)

    Promise.all([result1, result2]).then(([kimetu, geass]) => {
        console.log('どっちの非同期処理も終了した');
        console.log(kimetu);
        console.log(geass);
    });
}).call(this);


(function() {
    //プロミスを返さないメソッドを手動でプロミスを返す非同期メソッドにする
    function test() {
        //すぐにプロミスを返す関数を作成する
        return new Promise((resolve, reject) => {
            //プロミスのコンストラクタの引数に実行したい非同期の処理を記述する
            setTimeout(() => {
                resolve('成功') //非同期処理の結果得たものをresolveに格納する
            }, 2000);
        });
    }

    //testメソッドはプロミスを返すようになり、thenメソッドも使用できるようになる
    test().then((resolve) => console.log(resolve)); //resolveに格納したものはthenメソッドの引数で受け取れる
}).call(this);