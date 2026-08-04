// EXPORTS: IConfusingPair, IMinimalPair, MOCK_CONFUSING_PAIRS
export interface IMinimalPair {
  word1: string
  word2: string
  phonetic1: string
  phonetic2: string
}

export interface IConfusingPair {
  id: string
  phonetic1: string
  phonetic2: string
  nickname: string
  mouthDifference: string
  keyDifference: string
  minimalPairs: IMinimalPair[]
}

export const MOCK_CONFUSING_PAIRS: IConfusingPair[] = [
  {
    id: '1',
    phonetic1: 'iː',
    phonetic2: 'ɪ',
    nickname: '长衣 vs 短衣',
    mouthDifference: '左：嘴角咧到耳根，肌肉紧张；右：嘴稍松，肌肉放松',
    keyDifference: '长度不同，长音拖长，短音短促有力',
    minimalPairs: [
      { word1: 'sheep', word2: 'ship', phonetic1: '/ʃiːp/', phonetic2: '/ʃɪp/' },
      { word1: 'leave', word2: 'live', phonetic1: '/liːv/', phonetic2: '/lɪv/' },
      { word1: 'seat', word2: 'sit', phonetic1: '/siːt/', phonetic2: '/sɪt/' },
    ],
  },
  {
    id: '2',
    phonetic1: 'uː',
    phonetic2: 'ʊ',
    nickname: '长乌 vs 短乌',
    mouthDifference: '左：嘴唇收圆收紧，舌后缩明显；右：嘴稍松，舌位略低',
    keyDifference: '长音饱满，短音短促轻快',
    minimalPairs: [
      { word1: 'food', word2: 'foot', phonetic1: '/fuːd/', phonetic2: '/fʊt/' },
      { word1: 'pool', word2: 'pull', phonetic1: '/puːl/', phonetic2: '/pʊl/' },
      { word1: 'cool', word2: 'cook', phonetic1: '/kuːl/', phonetic2: '/kʊk/' },
    ],
  },
  {
    id: '3',
    phonetic1: 'θ',
    phonetic2: 's',
    nickname: '咬舌 vs 平舌',
    mouthDifference: '左：舌尖夹在上下齿之间；右：舌尖接近上齿龈，不咬舌',
    keyDifference: '咬舌音要伸舌头，平舌音舌头在口腔内',
    minimalPairs: [
      { word1: 'think', word2: 'sink', phonetic1: '/θɪŋk/', phonetic2: '/sɪŋk/' },
      { word1: 'three', word2: 'see', phonetic1: '/θriː/', phonetic2: '/siː/' },
      { word1: 'tooth', word2: 'too', phonetic1: '/tuːθ/', phonetic2: '/tuː/' },
    ],
  },
  {
    id: '4',
    phonetic1: 'ð',
    phonetic2: 'z',
    nickname: '咬舌浊 vs 平舌浊',
    mouthDifference: '左：舌尖夹在齿间，声带振动；右：舌尖抵齿龈，声带振动',
    keyDifference: '都振动，但一个咬舌一个平舌',
    minimalPairs: [
      { word1: 'this', word2: 'zips', phonetic1: '/ðɪs/', phonetic2: '/zɪps/' },
      { word1: 'that', word2: 'zap', phonetic1: '/ðæt/', phonetic2: '/zæp/' },
      { word1: 'mother', word2: 'muzzle', phonetic1: '/ˈmʌðə/', phonetic2: '/ˈmʌzl/' },
    ],
  },
  {
    id: '5',
    phonetic1: 'n',
    phonetic2: 'ŋ',
    nickname: '前鼻 vs 后鼻',
    mouthDifference: '左：舌尖抵上齿龈，前鼻音；右：舌后部抬抵软腭，后鼻音',
    keyDifference: '鼻音位置不同，一个靠前一个靠后',
    minimalPairs: [
      { word1: 'sin', word2: 'sing', phonetic1: '/sɪn/', phonetic2: '/sɪŋ/' },
      { word1: 'ton', word2: 'tongue', phonetic1: '/tʌn/', phonetic2: '/tʌŋ/' },
      { word1: 'ban', word2: 'bang', phonetic1: '/bæn/', phonetic2: '/bæŋ/' },
    ],
  },
  {
    id: '6',
    phonetic1: 'e',
    phonetic2: 'æ',
    nickname: '小口哎 vs 大口哎',
    mouthDifference: '左：嘴形扁平，一指宽；右：嘴角拉到最大，三指宽',
    keyDifference: '嘴巴张开大小不同，/æ/嘴张更大',
    minimalPairs: [
      { word1: 'bed', word2: 'bad', phonetic1: '/bed/', phonetic2: '/bæd/' },
      { word1: 'pen', word2: 'pan', phonetic1: '/pen/', phonetic2: '/pæn/' },
      { word1: 'head', word2: 'had', phonetic1: '/hed/', phonetic2: '/hæd/' },
    ],
  },
  {
    id: '7',
    phonetic1: 'l',
    phonetic2: 'r',
    nickname: '边音 vs 卷舌',
    mouthDifference: '左：舌尖抵上齿龈，气流从两侧出；右：舌尖上卷，不碰任何部位',
    keyDifference: '/l/舌尖贴牙龈，/r/舌尖悬空卷起',
    minimalPairs: [
      { word1: 'light', word2: 'right', phonetic1: '/laɪt/', phonetic2: '/raɪt/' },
      { word1: 'long', word2: 'wrong', phonetic1: '/lɒŋ/', phonetic2: '/rɒŋ/' },
      { word1: 'collect', word2: 'correct', phonetic1: '/kəˈlekt/', phonetic2: '/kəˈrekt/' },
    ],
  },
]