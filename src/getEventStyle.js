const getEventStyle = (event) => {
    // "HH:mm"形式の文字列を分単位に変換する関数
    const timeToMinutes = (time) => {
        if (!time) return 0; // timeがnullまたはundefinedの場合、0を返す
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const startMinutes = timeToMinutes(event.start); // 開始時間を分単位に変換
    const endMinutes = timeToMinutes(event.end); // 終了時間を分単位に変換
    const durationMinutes = endMinutes - startMinutes; // 持続時間を分単位で計算

    // 1時間あたり50pxを使用して位置と高さを計算
    const top = (startMinutes / 60) * 50; // 開始時間に基づくトップ位置
    const height = (durationMinutes / 60) * 50; // 持続時間に基づく高さ

    return {
        top: `${top}px`,
        height: `${height}px`,
        width: '200px', // 任意の幅
        backgroundColor: 'lightblue', // 背景色
        // 他のスタイル属性...
    };
};
export { getEventStyle };
