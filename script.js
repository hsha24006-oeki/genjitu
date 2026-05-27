document.addEventListener('DOMContentLoaded', () => {
    const goDrawBtn = document.getElementById('go-draw-btn');
    const backHomeBtn = document.getElementById('back-home-btn');
    const escapeBtn = document.getElementById('escape-btn');
    const homeView = document.getElementById('home-view');
    const resultView = document.getElementById('result-view');
    const escapeModal = document.getElementById('escape-modal');
    const realityShockModal = document.getElementById('reality-shock-modal'); // 真っ暗画面
    const video = document.getElementById('video');

    let localStream = null;

    const fortunes = [
        {
            badge: '凶',
            comment: 'あなたの感情は完全に非生産的です。データ上、何の成果も生み出していません。',
            ronpa: 98, muda: 85, seizon: 40,
            eval: 'お、おう。',
            face: '感情分析：動揺、わずかな絶望。',
            advice: 'その顔で夢を見るのは不可能です。現実から目を逸らさないでください。'
        },
        {
            badge: '大凶',
            comment: '想定しうる最悪のタイムラインを歩んでいます。早急な軌道修正を推奨します。',
            ronpa: 100, muda: 95, seizon: 12,
            eval: 'お、おう. ',
            face: '感情分析：思考停止、完全な虚無。',
            advice: 'かける言葉も見当たりません。鏡を見て現実を受け止めてください。'
        },
        {
            badge: 'いいね',
            comment: '珍しくまともな数値です。……本当に実力ですか？ 運の無駄遣いですね。',
            ronpa: 15, muda: 20, seizon: 99,
            eval: 'いいね（※ただし明日死ぬかもしれません）',
            face: '感情分析：微小な慢心、ニヤケ顔。',
            advice: '一度の幸運で調子に乗らないでください。明日には元通りです。'
        }
    ];

    // 【大幅強化】現実逃避ボタンのタイマー連携処理
    escapeBtn.addEventListener('click', () => {
        // ステップ1: 優しいピンク画面を1秒表示
        escapeModal.classList.remove('hide');

        setTimeout(() => {
            // ステップ2: 1秒後、ピンク画面を隠して「真っ暗画面に赤文字」を2秒表示
            escapeModal.classList.add('hide');
            realityShockModal.classList.remove('hide');

            setTimeout(() => {
                // ステップ3: さらに2秒後（合計3秒後）、真っ暗画面を隠してホームへ完全帰還
                realityShockModal.classList.add('hide');
            }, 2000); // 2秒間表示

        }, 1000); // 1秒間表示
    });

    // おみくじ画面へ
    goDrawBtn.addEventListener('click', async () => {
        homeView.classList.add('hide');
        resultView.classList.remove('hide');

        document.getElementById('bar-ronpa').style.width = '0%';
        document.getElementById('bar-muda').style.width = '0%';
        document.getElementById('bar-seizon').style.width = '0%';

        const rand = Math.random();
        let selected = rand < 0.1 ? fortunes[2] : (rand < 0.5 ? fortunes[1] : fortunes[0]);

        document.getElementById('fortune-badge').innerText = selected.badge;
        document.getElementById('system-comment').innerText = selected.comment;
        document.getElementById('total-eval-val').innerText = selected.eval;
        
        document.getElementById('val-ronpa').innerText = `${selected.ronpa}%`;
        document.getElementById('val-muda').innerText = `${selected.muda}%`;
        document.getElementById('val-seizon').innerText = `${selected.seizon}%`;

        try {
            localStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' }, 
                audio: false 
            });
            video.srcObject = localStream;
        } catch (err) {
            console.error('カメラの起動に失敗しました:', err);
            document.getElementById('ai-face-analysis').innerText = 'カメラへのアクセスが拒否されました';
            document.getElementById('ai-advice').innerText = '現実逃避のためにカメラを隠しましたか？';
            return;
        }

        setTimeout(() => {
            document.getElementById('bar-ronpa').style.width = `${selected.ronpa}%`;
            document.getElementById('bar-muda').style.width = `${selected.muda}%`;
            document.getElementById('bar-seizon').style.width = `${selected.seizon}%`;
            
            document.getElementById('ai-face-analysis').innerText = selected.face;
            document.getElementById('ai-advice').innerText = selected.advice;
        }, 500);
    });

    // ホームに戻る
    backHomeBtn.addEventListener('click', () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }
        resultView.classList.add('hide');
        homeView.classList.remove('hide');
    });

    document.getElementById('share-btn').addEventListener('click', () => {
        alert('この画面をスクリーンショットして、友達にあなたの現実を突きつけましょう。');
    });
});