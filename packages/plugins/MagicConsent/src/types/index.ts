export type ConsentApiDefinition = {
  cookies: ConsentCookieRecord[]
  maxAge?: number
}

export type ConsentCookieRecord = {
  key: string
  optional?: boolean
  title?: string
  text?: string
  [key: string]: any
}

export type CookieConsentData = {
  timestamp: number | undefined
  cookies: Record<string, boolean>
}

export type ConsentEvents = {
  accept: CookieConsentData
  reject: CookieConsentData
  acceptSelected: CookieConsentData
}
