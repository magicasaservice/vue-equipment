// ─── MarqueeId ────────────────────────────────────────────────────────────────
// Merged from all MagicMarquee test files

export enum MarqueeId {
  // api.test.ts
  ApiShape = 'api-shape',
  ApiDefaultPlay = 'api-default-play',
  ApiPause = 'api-pause',
  ApiPlay = 'api-play',
  ApiIncSpeed = 'api-inc-speed',
  ApiIncFactor = 'api-inc-factor',
  ApiDecSpeed = 'api-dec-speed',
  ApiDecFloor = 'api-dec-floor',
  ApiReverse = 'api-reverse',
  ApiReverseBack = 'api-reverse-back',
  ApiCssPause = 'api-css-pause',
  ApiCssPlay = 'api-css-play',
  ApiCssReverse = 'api-css-reverse',
  ApiCssSpeed = 'api-css-speed',
  // options.test.ts
  OptDirDefault = 'opt-dir-default',
  OptDirReverse = 'opt-dir-reverse',
  OptSpeedDefault = 'opt-speed-default',
  OptSpeedCustom = 'opt-speed-custom',
  // rendering.test.ts
  RenderSlot = 'render-slot',
  RenderDup = 'render-dup',
  RenderAria = 'render-aria',
  // state.test.ts
  StateShared = 'state-shared',
  StateMutate = 'state-mutate',
  StateInd1 = 'state-ind-1',
  StateInd2 = 'state-ind-2',
}

// ─── TestId ───────────────────────────────────────────────────────────────────

export enum TestId {
  // api.test.ts
  Play = 'play',
  Pause = 'pause',
  Reverse = 'reverse',
  IncSpeed = 'inc-speed',
  IncSpeed5 = 'inc-speed-5',
  DecSpeed = 'dec-speed',
  DecSpeed10 = 'dec-speed-10',
  IsPlaying = 'is-playing',
  Direction = 'direction',
  Speed = 'speed',
  // state.test.ts
  Id = 'id',
  Playing = 'playing',
}
