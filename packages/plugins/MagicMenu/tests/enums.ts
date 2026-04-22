// ─── MenuId ───────────────────────────────────────────────────────────────────
// Merged from all MagicMenu test files

export enum MenuId {
  // api.test.ts
  ApiShape = 'api-shape',
  ApiChannel = 'api-channel',
  ApiSelect = 'api-select',
  ApiUnselect = 'api-unselect',
  ApiChSelect = 'api-ch-select',
  // edge-cases.test.ts
  EdgeNested = 'edge-nested',
  EdgeMulti1 = 'edge-multi-1',
  EdgeMulti2 = 'edge-multi-2',
  EdgeUnmount = 'edge-unmount',
  EdgeRapid = 'edge-rapid',
  EdgeSlotProp = 'edge-slot-prop',
  EdgeItemSlot = 'edge-item-slot',
  EdgeChannel = 'edge-channel',
  EdgeRemoteAttr = 'edge-remote-attr',
  // interactions.test.ts
  IntTriggerClick = 'int-trigger-click',
  IntTriggerToggle = 'int-trigger-toggle',
  IntTriggerActive = 'int-trigger-active',
  IntItemHover = 'int-item-hover',
  IntItemLeave = 'int-item-leave',
  IntItemClick = 'int-item-click',
  IntItemDisabled = 'int-item-disabled',
  IntContext = 'int-context',
  IntEscape = 'int-escape',
  // keyboard.test.ts
  KbEscape = 'kb-escape',
  KbEscapeAttr = 'kb-escape-attr',
  KbEnter = 'kb-enter',
  KbTab = 'kb-tab',
  // options.test.ts
  OptDropdown = 'opt-dropdown',
  OptMenubar = 'opt-menubar',
  OptContext = 'opt-context',
  OptNav = 'opt-nav',
  OptTeleportDisabled = 'opt-teleport-disabled',
  OptPlacement = 'opt-placement',
  // rendering.test.ts
  RenderDataId = 'render-data-id',
  RenderTriggerActive = 'render-trigger-active',
  RenderTriggerDisabled = 'render-trigger-disabled',
  RenderTriggerTab = 'render-trigger-tab',
  RenderTriggerSlot = 'render-trigger-slot',
  RenderViewId = 'render-view-id',
  RenderContentClosed = 'render-content-closed',
  RenderContentOpen = 'render-content-open',
  RenderContentId = 'render-content-id',
  RenderContentInner = 'render-content-inner',
  RenderItem = 'render-item',
  RenderItemActive = 'render-item-active',
  RenderItemDisabled = 'render-item-disabled',
  RenderItemSlot = 'render-item-slot',
  RenderFloat = 'render-float',
  RenderDisabledTrigger = 'render-disabled-trigger',
}

// ─── ViewId ───────────────────────────────────────────────────────────────────

export enum ViewId {
  // api.test.ts / interactions.test.ts / keyboard.test.ts / options.test.ts
  V0 = 'v0',
  // edge-cases.test.ts
  V1 = 'v1',
  // rendering.test.ts (different value from V0!)
  RenderV0 = 'view-0',
}

// ─── ItemId ───────────────────────────────────────────────────────────────────

export enum ItemId {
  // interactions.test.ts / options.test.ts
  Item1 = 'item-1',
  Item2 = 'item-2',
  // interactions.test.ts
  Item3 = 'item-3',
  // edge-cases.test.ts
  ParentItem = 'parent-item',
  SubItem = 'sub-item',
  SlotItem = 'slot-item',
  // keyboard.test.ts
  KbItem1 = 'kb-item-1',
  KbItem2 = 'kb-item-2',
  KbItem3 = 'kb-item-3',
}

// ─── TestId ───────────────────────────────────────────────────────────────────

export enum TestId {
  // shared across multiple files
  Trigger = 'trigger',
  // api.test.ts
  Open = 'open',
  Close = 'close',
  Item = 'item',
  RemoteA = 'remote-a',
  ChannelA = 'channel-a',
  // edge-cases.test.ts
  SubTrigger = 'sub-trigger',
  Parent = 'parent',
  Toggle = 'toggle',
  Trigger1 = 'trigger-1',
  Trigger2 = 'trigger-2',
  ItemM1 = 'item-m1',
  ItemM2 = 'item-m2',
  Remote1 = 'remote-1',
  ChannelContent = 'channel-content',
  ActiveState = 'active-state',
  ItemActive = 'item-active',
  // interactions.test.ts / options.test.ts
  Area = 'area',
  Item1 = 'item-1',
  Item2 = 'item-2',
  // interactions.test.ts
  Item3 = 'item-3',
  // edge-cases.test.ts
  SubItem = 'sub-item',
}
