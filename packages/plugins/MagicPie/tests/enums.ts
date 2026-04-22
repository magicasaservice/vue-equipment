// ─── PieId ────────────────────────────────────────────────────────────────────
// Merged from all MagicPie test files

export enum PieId {
  // api.test.ts
  ApiShape = 'api-shape',
  ApiSet = 'api-set',
  ApiClampMin = 'api-clamp-min',
  ApiClampMax = 'api-clamp-max',
  ApiPathUpdate = 'api-path-update',
  ApiInterp = 'api-interp',
  ApiCancelPrev = 'api-cancel-prev',
  ApiCancel = 'api-cancel',
  // edge-cases.test.ts
  EdgeDiffPaths = 'edge-diff-paths',
  Edge2550 = 'edge-25-50',
  EdgeFull = 'edge-full',
  EdgeEasing = 'edge-easing',
  EdgeFlipNormal = 'edge-flip-normal',
  EdgeFlipFlipped = 'edge-flip-flipped',
  EdgeMulti1 = 'edge-multi-1',
  EdgeMulti2 = 'edge-multi-2',
  // rendering.test.ts
  RenderDataId = 'render-data-id',
  RenderSvg = 'render-svg',
  RenderMask = 'render-mask',
  RenderPath = 'render-path',
  RenderNoFlip = 'render-no-flip',
  RenderFlip = 'render-flip',
}

// ─── TestId ───────────────────────────────────────────────────────────────────

export enum TestId {
  // api.test.ts
  Percentage = 'percentage',
  Set50 = 'set-50',
  SetNeg = 'set-neg',
  SetOver = 'set-over',
  Set75 = 'set-75',
}
