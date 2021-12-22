# dva-hook

## 简介

dva-hook 使用hook的方式快速修改,获取state属性和effects方法

## 使用教程

注意:umi环境直接使用，其他环境需要安装dva >= 2.6.0版本和react-redux。

```bash
# 非umi环境安装相关依赖
npm i dva@2.6.0-beta.19 --save
npm i react-redux --save

```

安装插件

```bash
npm i dva-hook --save
```

### 调用 dvaHook 函数之后返回两个钩子useBind 和 useMdState
```ts
// dva model文件
import dvaHook from 'dva-hook'
const model = {
  ...
}
export const {useBind,useMdState} = dvaHook(model)
export default model
```
#### useBind 是绑定model的state对象钩子

```tsx
const bindObj = useBind()
bindObj.data = '需要修改的内容'

// 等价于dispatch写法调用reducers的setData方法去修改state的data属性
// dispatch({
//   type: `${namespace}/setData`,
//   payload: {
//     data: xxx,
//   },
// });



// 调用dva model里面的effects的 addTodo方法
bindObj.Ef.addTodo({ a: 111, b: 2222 })

// 等价于dispatch写法 调用effects的addTodo方法
// dispatch({
//   type: `${namespace}/addTodo`,
//   payload: { a: 111, b: 2222 },
// });

```
#### useMdState 类似react-redux的useSelector钩子。区别是useMdState里面函数参数是绑定model里面的state对象,并优化useSelector钩子返回多个属性时出现调用多次的性能问题。

```tsx
//获取model.state list 和 data 属性
const stateData = useMdState((state)=>{
  const {list,data} = state
  return {
    list,
    data
  }
})

// stateData  ==> {list:any,data:any}

```

## demo案例

model文件引入 dva-hook
```tsx
// dva model文件 /models/index.js
import dvaHook from 'dva-hook'

const model = {
  namespace: 'namespace',
  state: {
    list: [],
    data: 1,
  },
  reducers: {
    save(state:any, action:any) {
      return { ...state, ...action.payload };
    }
  },
  effects: {
    *addTodo({ payload }, { call, put, select }) {
      yield put({ type: 'save',payload:{data:payload}});
    },
    *getData({ payload }, { call, put, select }) {
      // 模拟网络请求
      const data = yield call(todoService, payload.id);
      return data; // 返回promise
    },
  },
}
export const {useBind,useMdState} = dvaHook(model)
export default model

```

组件内使用useBind, useMdState 钩子
```tsx
import React from 'react'
import { useBind, useMdState } from './models'
export default ()=>{
  const bindObj = useBind()
  const {list , data } = useMdState(({list,data})=>({list,data}))
  const getData = ()=>{
    // 修改dva model里面state的data属性(简化dispatch写法和省略编写reducers的方法去修改state属性)
    bindObj.data = data+1
    // 等价于dispatch写法  调用reducers的setData方法去修改state的data属性
    // dispatch({
    //   type: `${namespace}/setData`,
    //   payload: {
    //     data: xxx,
    //   },
    // });
  }
  const addTodoFun = ()=>{
    // 调用dva model里面的effects的 addTodo方法
    bindObj.Ef.addTodo({ a: 111, b: 2222 })
    // 等价于dispatch写法 调用effects的addTodo方法
    // dispatch({
    //   type: `${namespace}/addTodo`,
    //   payload: { a: 111, b: 2222 },
    // });
  }
  return (
    <div onClick={getData}>点我修改state</div>
    <div>{data}</div>
    <div onClick={addTodoFun}>点我调用Effect</div>
  )
}

```
