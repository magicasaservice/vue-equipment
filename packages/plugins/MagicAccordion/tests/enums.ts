// ─── Enums ────────────────────────────────────────────────────────────────────

export enum AccordionId {
  // rendering.test.ts
  RenderDataId = 'render-data-id',
  RenderViews = 'render-views',
  RenderViewIds = 'render-view-ids',
  RenderActiveDefault = 'render-active-default',
  RenderSlot = 'render-slot',
  RenderTriggerBtn = 'render-trigger-btn',
  RenderTriggerId = 'render-trigger-id',
  RenderTriggerDisabled = 'render-trigger-disabled',
  RenderContentId = 'render-content-id',
  RenderContentHidden = 'render-content-hidden',
  RenderCssVar = 'render-css-var',
  // api.test.ts
  ApiSelect = 'api-select',
  ApiSingle = 'api-single',
  ApiMultiple = 'api-multiple',
  ApiUnselect = 'api-unselect',
  ApiInitial = 'api-initial',
  ApiShape = 'api-shape',
  // interactions.test.ts
  ClickOpen = 'int-click-open',
  ClickToggle = 'int-click-toggle',
  SingleSwitch = 'int-single-switch',
  MultiOpen = 'int-multi-open',
  Hover = 'int-hover',
  Disabled = 'int-disabled',
  DisabledAttr = 'int-disabled-attr',
  Keyboard = 'int-keyboard',
  ExternalTrigger = 'int-external-trigger',
  // options.test.ts
  DefaultMode = 'opt-default-mode',
  Single = 'opt-single',
  Multiple = 'opt-multiple',
  OptDisabled = 'opt-disabled',
  OptDisabledAttr = 'opt-disabled-attr',
  DisabledApi = 'opt-disabled-api',
  AnimDefault = 'opt-anim-default',
  AnimCustom = 'opt-anim-custom',
  ContentOverride = 'opt-content-override',
  TriggerDefault = 'opt-trigger-default',
  TriggerHover = 'opt-trigger-hover',
  InitialActive = 'opt-initial-active',
  DefaultInactive = 'opt-default-inactive',
  // events.test.ts
  BeforeEnter = 'evt-before-enter',
  Enter = 'evt-enter',
  AfterEnter = 'evt-after-enter',
  EnterOrder = 'evt-enter-order',
  BeforeLeave = 'evt-before-leave',
  Leave = 'evt-leave',
  AfterLeave = 'evt-after-leave',
  LeaveOrder = 'evt-leave-order',
  PayloadId = 'evt-payload-id',
  PayloadView = 'evt-payload-view',
  // edge-cases.test.ts
  AutoId = 'edge-auto-id',
  Rapid = 'edge-rapid',
  Dynamic = 'edge-dynamic',
  Cleanup = 'edge-cleanup',
  Multi1 = 'edge-multi-1',
  Multi2 = 'edge-multi-2',
  SingleView = 'edge-single-view',
  TriggerDisabled = 'edge-trigger-disabled',
}

export enum ViewId {
  // rendering.test.ts
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
  SlotView = 'slot-view',
  // api.test.ts
  InitView = 'init-view',
  // interactions.test.ts
  Panel1 = 'panel-1',
  Panel2 = 'panel-2',
  ExtPanel = 'ext-panel',
  // options.test.ts
  HoverView = 'hover-view',
  IaView = 'ia-view',
  CoView = 'co-view',
  // events.test.ts
  EvView = 'ev-view',
  // edge-cases.test.ts
  RapidV = 'rapid-v',
  StaticV = 'static-v',
  Extra = 'extra',
  Removable = 'removable',
  M1V = 'm1-v',
  M2V = 'm2-v',
  Sv = 'sv',
  TdV = 'td-v',
}

export enum TestId {
  // rendering.test.ts
  TriggerV1 = 'trigger-v1',
  TriggerV2 = 'trigger-v2',
  TriggerV3 = 'trigger-v3',
  ContentV1 = 'content-v1',
  ContentV2 = 'content-v2',
  ContentV3 = 'content-v3',
  SlotActive = 'slot-active',
  // api.test.ts
  SelectV1 = 'select-v1',
  SelectV2 = 'select-v2',
  UnselectV1 = 'unselect-v1',
  ActiveV1 = 'active-v1',
  ActiveV2 = 'active-v2',
  Active = 'active',
  // interactions.test.ts
  Trigger1 = 'trigger-1',
  Trigger2 = 'trigger-2',
  Active1 = 'active-1',
  Active2 = 'active-2',
  ExternalTrigger = 'external-trigger',
  // options.test.ts
  Content = 'content',
  // events.test.ts
  Open = 'open',
  Close = 'close',
  Events = 'events',
  PayloadId = 'payload-id',
  PayloadView = 'payload-view',
  // edge-cases.test.ts
  Toggle = 'toggle',
  Add = 'add',
  SelectExtra = 'select-extra',
  StaticActive = 'static-active',
  ExtraActive = 'extra-active',
  Remove = 'remove',
  RemovableContent = 'removable-content',
  Open1 = 'open-1',
  Open2 = 'open-2',
}
