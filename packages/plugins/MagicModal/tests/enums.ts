// ─── ModalId ──────────────────────────────────────────────────────────────────
// Merged from all MagicModal test files

export enum ModalId {
  // api.test.ts
  ApiOpen = 'api-open',
  ApiClose = 'api-close',
  ApiInitial = 'api-initial',
  ApiReflect = 'api-reflect',
  Multi1 = 'multi-1',
  Multi2 = 'multi-2',
  // edge-cases.test.ts
  Default = 'default-modal',
  Rapid = 'rapid-modal',
  DoubleOpen = 'double-open-modal',
  DoubleClose = 'double-close-modal',
  Unmount = 'unmount-modal',
  CleanupScroll = 'cleanup-scroll-modal',
  Concurrent1 = 'concurrent-m1',
  Concurrent2 = 'concurrent-m2',
  Concurrent3 = 'concurrent-m3',
  // events.test.ts
  EventOpen = 'event-modal-open',
  EventClose = 'event-modal-close',
  EventOrder = 'event-modal-order',
  EventLeaveOrder = 'event-modal-leave-order',
  EventPayload = 'event-modal-payload',
  // interactions.test.ts
  Interact = 'interact-modal',
  Key = 'key-modal',
  // options.test.ts
  OptBackdropTrue = 'opt-backdrop-true',
  OptBackdropFalse = 'opt-backdrop-false',
  OptTagDialog = 'opt-tag-dialog',
  OptTagDiv = 'opt-tag-div',
  OptTeleportBody = 'opt-teleport-body',
  OptTeleportCustom = 'opt-teleport-custom',
  OptTeleportDisabled = 'opt-teleport-disabled',
  OptKeyDefault = 'opt-key-default',
  OptKeyDisabled = 'opt-key-disabled',
  OptScroll = 'opt-scroll',
  OptScrollFalse = 'opt-scroll-false',
  OptTransition = 'opt-transition',
  OptFocusFalse = 'opt-focus-false',
  // rendering.test.ts
  TestModal = 'rend-test-modal',
  TestModalSlot = 'rend-test-modal-slot',
}

// ─── TestId ───────────────────────────────────────────────────────────────────

export enum TestId {
  // shared across multiple files
  OpenBtn = 'open-btn',
  CloseBtn = 'close-btn',
  IsActive = 'is-active',
  ModalContent = 'modal-content',
  // api.test.ts
  Open1 = 'open-1',
  Open2 = 'open-2',
  Active1 = 'active-1',
  Active2 = 'active-2',
  // edge-cases.test.ts
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
