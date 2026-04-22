// ─── ToastId ──────────────────────────────────────────────────────────────────
// Merged from all MagicToast test files

export enum ToastId {
  // api.test.ts
  ApiAdd = 'api-add',
  ApiReturnId = 'api-return-id',
  ApiCustomId = 'api-custom-id',
  ApiWithProps = 'api-with-props',
  ApiStack = 'api-stack',
  ApiRemove = 'api-remove',
  ApiClear = 'api-clear',
  ApiExpand = 'api-expand',
  ApiCollapse = 'api-collapse',
  ApiToastsRef = 'api-toasts-ref',
  ApiCountZero = 'api-count-zero',
  // edge-cases.test.ts
  EdgeDefaults = 'edge-defaults',
  EdgeRapidAdd = 'edge-rapid-add',
  EdgeAddClear = 'edge-add-clear',
  EdgeRemoveInvalid = 'edge-remove-invalid',
  EdgeClearEmpty = 'edge-clear-empty',
  EdgeConcurrent1 = 'edge-concurrent-1',
  EdgeConcurrent2 = 'edge-concurrent-2',
  EdgeDurationOverride = 'edge-duration-override',
  EdgeSelfRemove = 'edge-self-remove',
  EdgeToggleRapid = 'edge-toggle-rapid',
  // events.test.ts
  EventEnter = 'event-enter',
  EventAfterEnter = 'event-after-enter',
  EventLeave = 'event-leave',
  EventOrder = 'event-order',
  // interactions.test.ts
  IntDragState = 'int-drag-state',
  IntDragReset = 'int-drag-reset',
  IntDragBottom = 'int-drag-bottom',
  IntDragBottomUp = 'int-drag-bottom-up',
  IntDragTop = 'int-drag-top',
  IntDismiss = 'int-dismiss',
  IntSnapBack = 'int-snap-back',
  IntClickExpand = 'int-click-expand',
  IntClickNoExpand = 'int-click-no-expand',
  IntEventBeforeDrag = 'int-event-before-drag',
  IntEventDrag = 'int-event-drag',
  IntEventAfterDrag = 'int-event-after-drag',
  IntTimeoutPause = 'int-timeout-pause',
  // options.test.ts
  OptMaxDefault = 'opt-max-default',
  OptMaxCustom = 'opt-max-custom',
  OptInitialExpanded = 'opt-initial-expanded',
  OptInitialDefault = 'opt-initial-default',
  OptDebug = 'opt-debug',
  OptDebugDefault = 'opt-debug-default',
  OptDurationZero = 'opt-duration-zero',
  OptDurationAuto = 'opt-duration-auto',
  OptTeleport = 'opt-teleport',
  // rendering.test.ts
  RenderDataId = 'render-data-id',
  RenderPosition = 'render-position',
  RenderDefaultPos = 'render-default-pos',
  RenderExpanded = 'render-expanded',
  RenderToastLi = 'render-toast-li',
  RenderContent = 'render-content',
  RenderViewId = 'render-view-id',
  RenderInner = 'render-inner',
  RenderTeleport = 'render-teleport',
  RenderTeleportCustom = 'render-teleport-custom',
  RenderTeleportDisabled = 'render-teleport-disabled',
}

// ─── TestId ───────────────────────────────────────────────────────────────────

export enum TestId {
  // shared across multiple files
  AddBtn = 'add-btn',
  Count = 'count',
  // api.test.ts
  RemoveBtn = 'remove-btn',
  ClearBtn = 'clear-btn',
  ExpandBtn = 'expand-btn',
  CollapseBtn = 'collapse-btn',
  Ids = 'ids',
  // edge-cases.test.ts
  RapidBtn = 'rapid-btn',
  Btn = 'btn',
  ToggleBtn = 'toggle-btn',
  Add1 = 'add-1',
  Add2 = 'add-2',
  Count1 = 'count-1',
  Count2 = 'count-2',
  AddShort = 'add-short',
  AddLong = 'add-long',
  CloseSelf = 'close-self',
  // events.test.ts
  ClearEvents = 'clear-events',
  Events = 'events',
  // rendering.test.ts
  ToastMsg = 'toast-msg',
}
