// ─── Enums ────────────────────────────────────────────────────────────────────

export enum CookieId {
  // api.test.ts
  Show = 'api-show',
  Hide = 'api-hide',
  Toggle = 'api-toggle',
  Select = 'api-select',
  Unselect = 'api-unselect',
  ToggleItem = 'api-toggle-item',
  AcceptAll = 'api-accept-all',
  AcceptSet = 'api-accept-set',
  RejectAll = 'api-reject-all',
  RejectRequired = 'api-reject-required',
  AcceptSelected = 'api-accept-selected',
  CookiesState = 'api-cookies-state',
  NotSet = 'api-not-set',
  // edge-cases.test.ts
  AutoId = 'edge-auto-id',
  Required = 'edge-required',
  MultiItems = 'edge-multi-items',
  Cleanup = 'edge-cleanup',
  Rapid = 'edge-rapid',
  Sequence = 'edge-sequence',
  NoOpts = 'edge-no-opts',
  // events.test.ts
  Accept = 'event-accept',
  AcceptPayload = 'event-accept-payload',
  Reject = 'event-reject',
  RejectPayload = 'event-reject-payload',
  Selected = 'event-selected',
  SelectedPayload = 'event-selected-payload',
  // options.test.ts
  MaxAgeDefault = 'opt-max-age-default',
  MaxAgeOverride = 'opt-max-age-override',
  TransitionCustom = 'opt-transition-custom',
  AnimDuration = 'opt-animation-duration',
  AnimDefault = 'opt-animation-default',
  OptionalDefault = 'opt-optional-default',
  RequiredDefault = 'opt-required-default',
  OptionalUnset = 'opt-optional-unset',
  // rendering.test.ts
  ViewHidden = 'render-view-hidden',
  ViewVisible = 'render-view-visible',
  ScopedSlot = 'render-scoped-slot',
  CssVar = 'render-css-var',
  DataId = 'render-data-id',
  Optional = 'render-optional',
  Active = 'render-active',
  ItemSlot = 'render-item-slot',
}

export enum ItemId {
  // api.test.ts
  Analytics = 'analytics',
  Necessary = 'necessary',
  MyCookie = 'my-cookie',
  UnsCookie = 'uns-cookie',
  TogCookie = 'tog-cookie',
  SelAnalytics = 'sel-analytics',
  // edge-cases.test.ts
  RequiredCookie = 'required-cookie',
  CookieA = 'cookie-a',
  CookieB = 'cookie-b',
  TempCookie = 'temp-cookie',
  PermanentCookie = 'permanent-cookie',
  RapidCookie = 'rapid-cookie',
  SeqOpt = 'seq-opt',
  SeqReq = 'seq-req',
  BasicCookie = 'basic-cookie',
  // events.test.ts (prefixed to avoid collision with api Analytics/Necessary)
  EvtAnalytics = 'evt-analytics',
  EvtNecessary = 'evt-necessary',
  // options.test.ts
  AgeCookie = 'age-cookie',
  CustomAge = 'custom-age',
  OptCookie = 'opt-cookie',
  ReqCookie = 'req-cookie',
  UnsetCookie = 'unset-cookie',
  // rendering.test.ts
  ActiveCookie = 'active-cookie',
  SlotCookie = 'slot-cookie',
}

export enum TestId {
  // api.test.ts
  ShowView = 'show-view',
  HideView = 'hide-view',
  ToggleView = 'toggle-view',
  AcceptAll = 'accept-all',
  RejectAll = 'reject-all',
  AcceptSelected = 'accept-selected',
  Cookies = 'cookies',
  CookiesSet = 'cookies-set',
  Active = 'active',
  Select = 'select',
  Unselect = 'unselect',
  Toggle = 'toggle',
  // edge-cases.test.ts
  ItemId = 'item-id',
  Reject = 'reject',
  SelectA = 'select-a',
  AActive = 'a-active',
  BActive = 'b-active',
  Rapid = 'rapid',
  Accept = 'accept',
  OptActive = 'opt-active',
  ReqActive = 'req-active',
  View = 'view',
  // events.test.ts
  SelectAnalytics = 'select-analytics',
  Events = 'events',
  Payload = 'payload',
  // options.test.ts
  ItemData = 'item-data',
  Optional = 'optional',
  CustomContent = 'custom-content',
  // rendering.test.ts
  SlotValue = 'slot-value',
  ItemActive = 'item-active',
  ItemOptional = 'item-optional',
}
