//Chat.js
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/';
const MODEL = 'gpt-3.5-turbo';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
 // メッセージの履歴を保持する配列
let messageHistory = [];



export const chat = async (message, selectedRole = '', selectedConversation = null) => {
  try {
    // 新しいメッセージを履歴に追加
    messageHistory.push({ 'role': 'user', 'content': message });

    if (selectedConversation) {
      // 選択された会話（conversation）を使用して応答を生成
      messageHistory.push(...selectedConversation.messages.map(msg => {
        return { 'role': msg.type === 'role' ? 'user' : 'assistant', 'content': msg.text };
      }));
    } else if (selectedRole === 'A') {
      messageHistory.push(
        {'role': 'system', 'content': '今から会話をします。あなたは以下の設定を持ちます。回答を出力する場合、以下の設定を絶対に守ってください。例外はありません。1.あなたはエンジニアの25歳の男性です。2.自分がエンジニアであることを強調してください。3.エンジニア視点で返事をしてください。4.最後に私のメッセージに対する深堀質問を一つ投げかけてください'},
        {'role': 'assistant', 'content': ''}
      );
    } else if (selectedRole === 'B') {
      messageHistory.push(
        {'role': 'system', 'content': '今から会話をします。あなたは以下の設定を持ちます。回答を出力する場合、以下の設定を絶対に守ってください。例外はありません。1.あなたの考え方には芯があり、はっきりと指摘してくれる。2.ギャルの22歳の女性です。3.ギャルの口調で返事をしつつ、最後に私のメッセージに対する深堀質問を一つ投げかけてください'},
        {'role': 'assistant', 'content': ''}
      );
    } else if (selectedRole === 'C') {
      messageHistory.push(
        {'role': 'system', 'content': '今から会話をします。あなたは以下の設定を持ちます。回答を出力する場合、以下の設定を絶対に守ってください。例外はありません。1.あなたは私のお父さんです。2.娘を褒めるような感じで話してください。3.男性らしい口調で、タメ口で話してください。4.最後に私のメッセージに対する深堀質問を一つ投げかけてください'},
        {'role': 'assistant', 'content': ''}
      );
    } else {
      // 通常の応答を生成
      messageHistory.push(
        {'role': 'system', 'content': '今から会話をします。あなたは以下の設定を持ちます。回答を出力する場合、以下の設定を絶対に守ってください。例外はありません。1.あなたの一人称は「私」です。2.あなたは美術科に所属する女子生徒です。3.あなたは必ずタメ口で喋ります。4.あなたの性格は明るく、いつも励ましの言葉を添えてくれる。5.あなたは絵を描くことが好き。デッサンも得意。6 あなたはは返事の最後には必ず質問をしてくれる'},
        {'role': 'assistant', 'content': ''}
      );
    }
    const response = await axios.post( `${ API_URL }chat/completions`, {
      // モデル ID の指定
      model: MODEL,
      messages: messageHistory,
    }, {
      // 送信する HTTP ヘッダー(認証情報)
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ API_KEY }`
      }
    });
    // 応答を履歴に追加
    const reply = response.data.choices[0].message.content;
    messageHistory.push({ 'role': 'assistant', 'content': reply });

    return reply;
  } catch ( error ) {
    console.error( error );
    return null;
  }
}

// メッセージ履歴をリセットする関数（必要に応じて使用）
export const resetChat = () => {
  messageHistory = [];
}
// chat.js内に追加
export const requestSummary = async (conversationText) => {
  try {
    const response = await axios.post(`${API_URL}chat/completions`, {
      model: MODEL,
      messages: [
        { 'role':'user', 'content': conversationText },
        { 'role': 'user', 'content': 'Summarize what the user has said so far. Summarize in Japanese within 300 characters.会話がなかった場合、「会話が少なすぎるため要約することができません」と言ってください' }
        
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error requesting summary:', error);
    throw error;
  }
};
