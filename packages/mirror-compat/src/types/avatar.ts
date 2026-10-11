export type MAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type MAvatarMode = 'solid' | 'subtle' | 'outline'

export interface MAvatarProps {
  size?: MAvatarSize
  mode?: MAvatarMode
  initials?: string
  inline?: boolean
  image?: boolean
  round?: boolean
}
