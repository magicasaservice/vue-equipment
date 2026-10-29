import type { DotMatrixEmojiMotion } from '../../types/index'

export type EmojiMotionPick = {
  name: DotMatrixEmojiMotion
  heading: number
  tint: string | undefined
}

type Range = [from: number, to: number]

type FallbackRule = {
  name: DotMatrixEmojiMotion
  ranges: Array<Range>
}

const curated: Record<DotMatrixEmojiMotion, string> = {
  beat: '❤🧡💛💚💙💜🖤🤍🤎🩷🩵🩶💓💗💖💘💝💞💕❣💔🫀♥💪',
  flicker: '🔥🕯🪔🧨',
  swing: '🔔🛎🎐🏮🪇',
  wave: '👋🖐✋🤚🙋🫱🫲',
  fly: '🚀✈🛩🛸🚁🛫🪂🦅🕊🐦🦆🦉🐉🧹☄',
  drive: '🚗🚕🚙🚌🚎🏎🚓🚑🚒🚐🛻🚚🚛🚜🏍🛵🚲🛴🛹🚂🚆🚄🚅🚈🚝🚃🚋🚞🚖🚘🚍🚔🛺🦽🦼',
  bounce: '⚽🏀🏈⚾🥎🎾🏐🏉🎱🪀🏓🥏',
  hop: '🐸🐇🐰🦘',
  spin: '🌀💿📀⚙🎡🍥🔄🔃🧿🛞🎠♻❄😵‍💫',
  flip: '🪙🃏🎴🀄💰🔮',
  float: '👻🎈☁🫧🪁🌍🌎🌏🌙🌛🌜🌚🌝🪐🛟😇👽🧑‍🚀👨‍🚀👩‍🚀',
  twinkle: '⭐🌟✨💫🌠💡🔆☀🌞',
  shake: '😡🤬😠🥶😱📳⏰📱🫨⚡🌋👊🤜🤛🎁',
  rain: '🌧⛈🌨☔🌦',
  snow: '☃⛄🏔🎿⛷🏂',
  sleep: '😴💤🛌🥱😪',
  rock: '😂🤣🍮🫠🎸🎷🥁🎹🎺🪗🎻🪕🎤🎧🎶🎵🕺💃💩🤪😜😝🙃🤢🤮💀🤖',
  burst: '🎉🎊💥🎆🎇🍾🎂🤯🥳',
  stamp: '👍👎✅☑✔💯🆗🆒🏆🥇🥈🥉🎖🏅👌🤝🙌',
  gleam: '😎💎👑🪩💍',
  flag: '🏳🏴🏁🎌🚩🌊',
  sway: '🌴🌵🌷🌹🌸🌺🌼🌻🌱🌿☘🍀🎋🪴🌾🌲🌳🍁🍂🎄',
  love: '😍🥰😘💌🫶😻💏💑',
  steam: '☕🍵🍜🍲♨🫖🥘🍝🫕',
  look: '👀👁🔍🔎🕵👉👈🙂‍↔️',
  nod: '🙏👆👇☝🙂‍↕️',
  tilt: '🤔🤨😏🧐🙄😕🫤',
  swim: '🐟🐠🐡🦈🐳🐋🐬🦭🐙🦑🦐🦞🦀🪼🐊🐢',
  flap: '🦋🐝🪰🦟🪽🦇',
  clap: '👏',
  bob: '',
  pop: '',
}

const headings: Record<string, number> = {
  '🚀': -45,
  '✈': -30,
  '🛩': -30,
  '🛫': -30,
  '🛸': 0,
  '🪂': 90,
  '☄': 135,
}

const tints: Record<string, string> = {
  '🌨': '#fff',
}

const fallbacks: Array<FallbackRule> = [
  { name: 'flag', ranges: [[0x1f1e6, 0x1f1ff]] },
  {
    name: 'bob',
    ranges: [
      [0x1f600, 0x1f64f],
      [0x1f910, 0x1f92f],
      [0x1f970, 0x1f97a],
      [0x1fae0, 0x1faef],
      [0x1f9d0, 0x1f9d0],
    ],
  },
  {
    name: 'wave',
    ranges: [
      [0x1f44a, 0x1f450],
      [0x1f590, 0x1f596],
      [0x1f918, 0x1f91f],
      [0x1faf0, 0x1faf8],
      [0x270a, 0x270d],
    ],
  },
  {
    name: 'hop',
    ranges: [
      [0x1f400, 0x1f43f],
      [0x1f980, 0x1f9ae],
      [0x1fab0, 0x1fabf],
      [0x1face, 0x1facf],
    ],
  },
  {
    name: 'bob',
    ranges: [
      [0x1f466, 0x1f487],
      [0x1f9d1, 0x1f9dd],
      [0x1f3c3, 0x1f3cc],
      [0x1f6b4, 0x1f6b6],
      [0x1f93c, 0x1f93e],
    ],
  },
  { name: 'drive', ranges: [[0x1f680, 0x1f6c5]] },
  {
    name: 'rock',
    ranges: [
      [0x1f32d, 0x1f37f],
      [0x1f950, 0x1f96f],
      [0x1f9c0, 0x1f9cb],
      [0x1fad0, 0x1fadf],
    ],
  },
  {
    name: 'float',
    ranges: [
      [0x1f300, 0x1f32c],
      [0x2600, 0x26ff],
    ],
  },
]

const people = /^[\u{1F466}-\u{1F469}\u{1F9D1}\u{1F471}\u{1F46E}\u{1F477}]/u

let lookup: Map<string, DotMatrixEmojiMotion> | undefined

function normalize(emoji: string) {
  return emoji.replace(/[\u{FE0F}\u{1F3FB}-\u{1F3FF}]/gu, '')
}

function isMotion(name: string): name is DotMatrixEmojiMotion {
  return name in curated
}

function getLookup() {
  if (lookup) {
    return lookup
  }

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

  lookup = new Map(
    Object.entries(curated).flatMap(([name, list]) =>
      isMotion(name)
        ? [...segmenter.segment(list)].map(
            ({ segment }): [string, DotMatrixEmojiMotion] => [
              normalize(segment),
              name,
            ]
          )
        : []
    )
  )

  return lookup
}

function matchCurated(emoji: string) {
  const entries = getLookup()
  const exact = entries.get(emoji)

  if (exact || people.test(emoji)) {
    return exact
  }

  return emoji
    .split('‍')
    .reverse()
    .map((part) => entries.get(part))
    .find((name) => name !== undefined)
}

function matchRange(emoji: string) {
  const codePoint = emoji.codePointAt(0) ?? 0

  return fallbacks.find(({ ranges }) =>
    ranges.some(([from, to]) => codePoint >= from && codePoint <= to)
  )?.name
}

export function pickMotion(emoji: string): EmojiMotionPick {
  const base = normalize(emoji)
  const name = matchCurated(base) ?? matchRange(base) ?? 'pop'

  return {
    name,
    heading: headings[base] ?? (name === 'drive' ? 180 : 0),
    tint: tints[base],
  }
}
