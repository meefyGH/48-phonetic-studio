// EXPORTS: IMouthDiagram, MOCK_MOUTH_DIAGRAMS
export interface IMouthDiagram {
  id: string
  symbol: string
  lipShape: string
  tonguePosition: string
  mouthOpenness: 'small' | 'medium' | 'large'
  emoji: string
  tips: string
}

export const MOCK_MOUTH_DIAGRAMS: IMouthDiagram[] = [
  {
    id: 'iː',
    symbol: '/iː/',
    lipShape: '嘴角向两边拉开，呈微笑状',
    tonguePosition: '舌尖抵下齿，舌前部向硬腭抬起',
    mouthOpenness: 'small',
    emoji: '😀',
    tips: '长音，保持两秒，像说"一"',
  },
  {
    id: 'ɪ',
    symbol: '/ɪ/',
    lipShape: '嘴唇稍松，比/iː/开口略大',
    tonguePosition: '舌尖抵下齿，舌位比/iː/稍低',
    mouthOpenness: 'small',
    emoji: '😐',
    tips: '短音，短促有力，像喊"一"',
  },
  {
    id: 'æ',
    symbol: '/æ/',
    lipShape: '嘴角向两边拉到最大，下巴下沉',
    tonguePosition: '舌尖抵下齿，舌身平放',
    mouthOpenness: 'large',
    emoji: '😮',
    tips: '大口型，三指宽，像咬苹果',
  },
]