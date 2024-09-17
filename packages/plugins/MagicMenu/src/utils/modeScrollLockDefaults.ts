export class ModeScrollLock {
  static readonly menubar = new ModeScrollLock('menubar', false)
  static readonly dropdown = new ModeScrollLock('dropdown', { padding: true })
  static readonly context = new ModeScrollLock('context', { padding: true })
  static readonly navigation = new ModeScrollLock('navigation', false)

  private constructor(
    private readonly key: string,
    public readonly value: false | { padding: boolean }
  ) {}

  toString() {
    return this.key
  }
}
