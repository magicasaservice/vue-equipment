// ─── Enums ────────────────────────────────────────────────────────────────────

export enum DraggableId {
  // api.test.ts
  Shape = 'api-shape',
  Snap = 'api-snap',
  SnapAnim = 'api-snap-anim',
  // interactions.test.ts
  PDown = 'int-pdown',
  Move = 'int-move',
  IntDisabled = 'int-disabled',
  // rendering.test.ts
  DataId = 'render-data-id',
  RenderSlot = 'render-slot',
  RenderTagDiv = 'render-tag-div',
  RenderTagDialog = 'render-tag-dialog',
  Dragging = 'render-dragging',
  NotDisabled = 'render-not-disabled',
  RenderDisabled = 'render-disabled',
  RenderSnap = 'render-snap',
  // options.test.ts
  OptDisabled = 'opt-disabled',
  Initial = 'opt-initial',
  DefaultSnap = 'opt-default-snap',
  CustomSnaps = 'opt-custom-snaps',
  OptTagDiv = 'opt-tag-div',
  OptTagDialog = 'opt-tag-dialog',
  // events.test.ts
  SnapPayload = 'ev-snap-payload',
  BeforeSnap = 'ev-before-snap',
  AfterSnap = 'ev-after-snap',
  DragPayload = 'ev-drag-payload',
  Offset = 'ev-offset',
  // edge-cases.test.ts
  Multi1 = 'edge-multi-1',
  Multi2 = 'edge-multi-2',
  Cycle = 'edge-cycle',
  Overlay = 'edge-overlay',
  Transform = 'edge-transform',
}

export enum TestId {
  // api.test.ts / options.test.ts / events.test.ts
  Snap = 'snap',
  // edge-cases.test.ts
  Snap1 = 'snap1',
  Tl = 'tl',
  Br = 'br',
  C = 'c',
}
