import { provide, inject } from 'vue'
import { useControlsApi, type UseControlsApiReturn } from './useControlsApi'
import { ControlsApiInjectionKey } from './../symbols'
import type { UseControlsArgs } from '../types'

type UseControlsReturn = {
  controlsApi: UseControlsApiReturn
}

export function useProvideControls(args: UseControlsArgs): UseControlsReturn {
  const controlsApi = useControlsApi(args)
  provide(ControlsApiInjectionKey, controlsApi)

  return {
    controlsApi,
  }
}

export function useInjectControls(): UseControlsReturn {
  return {
    controlsApi: inject(ControlsApiInjectionKey) as UseControlsApiReturn,
  }
}
