// ─── Enums ────────────────────────────────────────────────────────────────────

export enum DrawerId {
  // api.test.ts
  ApiDrawer = 'api-drawer',
  Drawer1 = 'drawer-1',
  Drawer2 = 'drawer-2',
  InitialDrawer = 'initial-drawer',
  NoTransitionDrawer = 'no-transition-drawer',
  SnapDrawer = 'snap-drawer',
  // edge-cases.test.ts
  Default = 'default-drawer',
  WarnSnap = 'warn-snap',
  OvershootWarn = 'overshoot-warn',
  RapidDrawer = 'rapid-drawer',
  DoubleOpen = 'double-open',
  DoubleClose = 'double-close',
  UnmountDrawer = 'unmount-drawer',
  CleanupScroll = 'cleanup-scroll',
  OvershootPx = 'overshoot-px',
  OvershootRem = 'overshoot-rem',
  Concurrent1 = 'concurrent-1',
  Concurrent2 = 'concurrent-2',
  Concurrent3 = 'concurrent-3',
  // events.test.ts
  EventOpen = 'event-open',
  EventClose = 'event-close',
  EventOrder = 'event-order',
  EventLeaveOrder = 'event-leave-order',
  EventPayload = 'event-payload',
  EventDrag = 'event-drag',
  EventDragPayload = 'event-drag-payload',
  EventAfterDrag = 'event-after-drag',
  // interactions.test.ts
  Interact = 'interact-drawer',
  Disabled = 'disabled-drawer',
  Key = 'key-drawer',
  // options.test.ts
  PositionTop = 'position-top',
  PositionRight = 'position-right',
  PositionBottom = 'position-bottom',
  PositionLeft = 'position-left',
  BackdropTrue = 'backdrop-true',
  BackdropFalse = 'backdrop-false',
  TagDialog = 'tag-dialog',
  TagDiv = 'tag-div',
  TeleportDisabled = 'teleport-disabled',
  TeleportCustom = 'teleport-custom',
  DisabledTrue = 'disabled-true',
  DisabledFalse = 'disabled-false',
  SnapPercent = 'snap-percent',
  SnapPx = 'snap-px',
  SnapMixed = 'snap-mixed',
  ScrollLock = 'scroll-lock',
  NoScrollLock = 'no-scroll-lock',
  CustomTransition = 'custom-transition',
  InitialOpen = 'initial-open',
  InitialClosed = 'initial-closed',
  InitialNoAnim = 'initial-no-anim',
  NoWheel = 'no-wheel',
  // rendering.test.ts
  TestDrawer = 'rend-test-drawer',
  TestDrawerSlot = 'rend-test-drawer-slot',
}

export enum TestId {
  // shared across multiple files
  OpenBtn = 'open-btn',
  CloseBtn = 'close-btn',
  IsActive = 'is-active',
  DrawerContent = 'drawer-content',
  // api.test.ts
  ProgressX = 'progress-x',
  ProgressY = 'progress-y',
  Open1 = 'open-1',
  Open2 = 'open-2',
  Active1 = 'active-1',
  Active2 = 'active-2',
  // edge-cases.test.ts
  SnapBtn = 'snap-btn',
  RapidBtn = 'rapid-btn',
  DoubleOpenBtn = 'double-open-btn',
  DoubleCloseBtn = 'double-close-btn',
  ToggleBtn = 'toggle-btn',
  OpenAll = 'open-all',
  Active3 = 'active-3',
  // events.test.ts
  ClearEvents = 'clear-events',
  Events = 'events',
  LastPayload = 'last-payload',
  // rendering.test.ts
  CustomBackdrop = 'custom-backdrop',
}
