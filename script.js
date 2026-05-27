document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-btn');
    const startView = document.getElementById('start-view');
    const resultView = document.getElementById('result-view');
    const video = document.getElementById('video');

    // おみくじデータの定義
    const fortunes = [
        {
            badge: '凶',
            comment: 'あなたの感情は完全に非生産的です。データ上、何の成果も生み出していません。',
            ronpa: 98,
            muda: 85,
            seizon: 40,
            eval: 'お、おう。',
            face: '感情分析：動揺、わずかな絶望。',
            advice: 'その顔で夢を見るのは不可能です。現実から目を逸らさないでください。'
        },
        {
            badge: '大凶',
            comment: '想定しうる最悪のタイムラインを歩んでいます。早急な軌道修正を推奨します。',
            ronpa: 100,
            muda: 95,
            seizon: 12,
            eval: 'お、おう。',
            face: '感情分析：思考停止、完全な虚無。',
            advice: 'かける言葉も見当たりません。鏡を見て現実を受け止めてください。'
        },
        {
            badge: 'いいね',
            comment: '珍しくまともな数値です。……本当に実力ですか？ 運の無駄遣いですね。',
            ronpa: 15,
            muda: 20,
            seizon: 99,
            eval: 'いいね（※ただし明日死ぬかもしれません）',
            face: '感情分析：微小な慢心、ニヤケ顔。',
            advice: '一度の幸運で調子に乗らないでください。明日には元通りです。'
        }
    ];

    drawBtn.addEventListener('click', async () => {
        // 1. 画面切り替え
        startView.classList.add('hide');
        resultView.classList.remove('hide');

        // 2. おみくじ結果の抽選 (大凶・凶を多め、いいねを低確率に)
        const rand = Math.random();
        let selected;
        if (rand < 0.1) {
            selected = fortunes[2]; // いいね (10%)
        } else if (rand < 0.5) {
            selected = fortunes[1]; // 大凶 (40%)
        } else {
            selected = fortunes[0]; // 凶 (50%)
        }

        // 3. 結果の流し込み
        document.getElementById('fortune-badge').innerText = selected.badge;
        document.getElementById('system-comment').innerText = selected.comment;
        document.getElementById('total-eval-val').innerText = selected.eval;
        
        // パラメータ数値テキスト
        document.getElementById('val-ronpa').innerText = `${selected.ronpa}%`;
        document.getElementById('val-muda').innerText = `${selected.muda}%`;
        document.getElementById('val-seizon').innerText = `${selected.seizon}%`;

        // 4. カメラの起動（結果表示後に起動する仕様）
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' }, 
                audio: false 
            });
            video.srcObject = stream;
        } catch (err) {
            console.error('カメラの起動に失敗しました:', err);
            document.getElementById('ai-face-analysis').innerText = 'カメラへのアクセスが拒否されました';
            document.getElementById('ai-advice').innerText = '現実逃避のためにカメラを隠しましたか？';
            return;
        }

        // 5. アニメーション（ディレイをかけてメーターを伸ばし、AI判定を出す）
        setTimeout(() => {
            document.getElementById('bar-ronpa').style.width = `${selected.ronpa}%`;
            document.getElementById('bar-muda').style.width = `${selected.muda}%`;
            document.getElementById('bar-seizon').style.width = `${selected.seizon}%`;
            
            // AI表情分析の表示
            document.getElementById('ai-face-analysis').innerText = selected.face;
            document.getElementById('ai-advice').innerText = selected.advice;
        }, 500);
    });

    // シェアボタンのダミー動作
    document.getElementById('share-btn').addEventListener('click', () => {
        alert('【BeReal連携風】現実とあなたの絶望顔が合成されました。友達に現実を突きつけます。');
    });
});