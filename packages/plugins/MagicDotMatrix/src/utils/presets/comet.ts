import { ringPath } from '../sequence/ringPath'
import { withTrail } from '../sequence/withTrail'
import type { DotMatrixGrid, DotMatrixSequence } from '../../types/index'

export function createComet({ cols, rows }: DotMatrixGrid): DotMatrixSequence {
  return withTrail({ path: ringPath({ cols, rows }) })
}
