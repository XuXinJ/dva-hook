/*
 * @Author: xuxinjiang
 * @Date: 2021-04-09 22:46:48
 * @LastEditors: your name
 * @LastEditTime: 2021-12-22 19:55:37
 * @Description: file content
 */

import { useDispatch, useSelector,shallowEqual} from 'react-redux'

interface Model {
  state: object,
  effects: any,
  reducers: any,
  namespace: string
}

const dvaHook = <T extends Model>(modelParmas: T): {
  useBind: () => { Ef: { [key in keyof T['effects']]: Function } } & T['state'];
  useMdState: (F:(S:T['state'])=>any) => any
} => {
  modelParmas.reducers.$setState = (state: T['state'], action: { payload: any; }) => {
    return {
      ...state,
      ...action.payload,
    };
  }

  let dispatch: any = () => { }
  const obj: any = modelParmas.state
  const efKeys: any = Object.keys(modelParmas.effects)
  const objState = { Ef: {} } as any
  efKeys.forEach((k: any) => {
    objState.Ef[k] = (data: any) => dispatch({
      type: `${modelParmas.namespace}/${k}`,
      payload: data
    })
  })

  for (const k in obj) {
    objState[k] = null
    Object.defineProperty(objState, k, {
      set: (value) => {
        dispatch({
          type: `${modelParmas.namespace}/$setState`,
          payload: {
            [k]: value
          }
        })
        return value
      }
    })
  }

  const useMdState = (func:Function) => {
    const res = useSelector((item: any) => {
      const itemData = item[modelParmas.namespace];
      return func(itemData)
    },shallowEqual)
    return res
  }
  const useBind = () => {
    dispatch = useDispatch()
    return objState
  }
  return { useBind, useMdState }
}
export default dvaHook;