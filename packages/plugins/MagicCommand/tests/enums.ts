// ─── Enums ────────────────────────────────────────────────────────────────────

export enum CommandId {
  // rendering.test.ts
  DataId = 'r-data-id',
  RenderSlot = 'r-slot',
  ViewId = 'r-view-id',
  ViewSlot = 'r-view-slot',
  TriggerAttrs = 'r-trigger-attrs',
  Item = 'r-item',
  ItemDisabled = 'r-item-disabled',
  ContentClosed = 'r-content-closed',
  ContentOpen = 'r-content-open',
  // api.test.ts
  ApiShape = 'api-shape',
  ApiOpen = 'api-open',
  ApiInitial = 'api-initial',
  ApiClose = 'api-close',
  ApiSv = 'api-sv',
  // interactions.test.ts
  Trigger = 'int-trigger',
  Hover = 'int-hover',
  Click = 'int-click',
  Initial = 'int-initial',
  CloseApi = 'int-close-api',
  // keyboard.test.ts
  Escape = 'kb-esc',
  ArrowDown = 'kb-arrow-down',
  ArrowCycle = 'kb-arrow-cycle',
  ArrowUp = 'kb-arrow-up',
  // options.test.ts
  NoKey = 'opt-no-key',
  InitialView = 'opt-initial-view',
  NoLoop = 'opt-no-loop',
  // edge-cases.test.ts
  Multi1 = 'edge-multi-1',
  Multi2 = 'edge-multi-2',
  Cycle = 'edge-cycle',
  Disabled = 'edge-disabled',
  Nested = 'edge-nested',
  EdgeSlot = 'edge-slot',
}

export enum ViewId {
  // rendering.test.ts
  V0 = 'v0',
  MyView = 'my-view',
  // api.test.ts
  MainView = 'main-view',
  ViewA = 'view-a',
  ViewB = 'view-b',
  // options.test.ts
  NonInitial = 'non-initial',
  TheInitial = 'the-initial',
  // edge-cases.test.ts
  ParentView = 'parent-view',
  ChildView = 'child-view',
}

export enum ItemId {
  // rendering.test.ts
  Item1 = 'item-1',
  DItem = 'd-item',
  // interactions.test.ts
  Item2 = 'item-2',
  ClickItem = 'click-item',
  First = 'first',
  Second = 'second',
  // keyboard.test.ts
  KbItem1 = 'kb-item-1',
  KbItem2 = 'kb-item-2',
  KbItem3 = 'kb-item-3',
  // options.test.ts
  LItem1 = 'l-item-1',
  LItem2 = 'l-item-2',
  // edge-cases.test.ts
  Enabled = 'enabled',
  Disabled = 'disabled',
  ParentItem = 'parent-item',
  ChildItem = 'child-item',
  SItem = 's-item',
}

export enum TestId {
  // rendering.test.ts
  Child = 'child',
  Active = 'active',
  Open = 'open',
  // api.test.ts
  Close = 'close',
  View = 'view',
  SelectB = 'select-b',
  // interactions.test.ts
  Trigger = 'trigger',
  // edge-cases.test.ts
  Active1 = 'active-1',
  Active2 = 'active-2',
  Open1 = 'open-1',
  SlotActive = 'slot-active',
  SlotDisabled = 'slot-disabled',
}
