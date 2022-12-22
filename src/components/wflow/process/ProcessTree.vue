<script lang="ts">
  import {
    ref,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance,
    reactive,
    toRefs,
    computed,
    h,
    inject,
    watch
  } from 'vue';

  import Node from './nodes/Node.vue'
  import Root from './nodes/RootNode.vue'
  import Approval from './nodes/ApprovalNode.vue'
  import Cc from './nodes/CcNode.vue'
  import Concurrent from './nodes/ConcurrentNode.vue'
  import Condition from './nodes/ConditionNode.vue'
  import Trigger from './nodes/TriggerNode.vue'
  import Delay from './nodes/DelayNode.vue'
  import Empty from './nodes/EmptyNode.vue'

  import DefaultProps from "./DefaultNodeProps"

  import { useAppwfConfig } from '@/store/wflow';

  export default defineComponent({
    name: 'ProcessTree',

    components: {
      Node,
      Root,
      Approval,
      Cc,
      Concurrent,
      Condition,
      Trigger,
      Delay,
      Empty,
    },

    render() {
      this.nodeMap.clear()
      let processTrees = this.getDomTree(h, this.dom)
      //插入末端节点
      processTrees.push(h('div', {style:{'text-align': 'center'}}, [
        h('div', {class:{'process-end': true}, innerHTML:'流程结束'})
      ]))
      
      return h('div', {class:{'_root': true}, ref:'_root'}, processTrees)
    },

		props: {
		},
    setup(props, {
      emit,
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;
      // const editFlag = inject('editFlag');
   
      const ctx = getCurrentInstance();

      const proxy = appContext.config.globalProperties;

      

      const stores = useAppwfConfig(proxy.$pinia);
      
      const nodeMap = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.nodeMap;
      });
      
      const dom = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.design.resource;
      });

      const state = reactive({
        valid: true,
      });
      const getDomTree = (h: any, node: any) => {
        toMapping(node);
        if(node?.type=='CC'){
          
        }
        
        if (isPrimaryNode(node)) {
          //普通业务节点
          let childDoms: any = getDomTree(h, node.children)
          
          decodeAppendDom(h, node, childDoms, { 
            _disabled: node?._disabled,
            _executable: node?._executable,
            _passed: node?._passed,
            _flowRecords: node?._flowRecords
          })
          return [h('div', {
            'class': {
              'primary-node': true
            }
          }, childDoms)];
        } else if (isBranchNode(node)) {
          let index = 0;
          //遍历分支节点，包含并行及条件节点
          let branchItems = node.branches.map((branchNode: any) => {
            //处理每个分支内子节点
            toMapping(branchNode);
            
            let childDoms = getDomTree(h, branchNode.children)
            decodeAppendDom(h, branchNode, childDoms, {
              level: index + 1,
              size: node.branches.length,
              _disabled: branchNode?._disabled,
              _executable: branchNode?._executable,
              _passed: branchNode?._passed
            })
            //插入4条横线，遮挡掉条件节点左右半边线条
            insertCoverLine(h, index, childDoms, node.branches)
            //遍历子分支尾部分支
            index++;
            return h('div', {
              'class': {
                'branch-node-item': true
              }
            }, childDoms);
          })
          
          //插入添加分支/条件的按钮
          branchItems.unshift(h('div', {
            'class': {
              'add-branch-btn': true
            },
          }, [
            h('el-button', {
              'class': {
                'add-branch-btn-el': true,
                'aaa': node?.branches[0]?._disabled
              },
              props: {
                size: 'small',
                round: true
              },
              onClick: () => addBranchNode(node),
              // domProps: {
              innerHTML: `添加${isConditionNode(node)?'条件':'分支'}`
              // },
            }, [])
          ]));
          let bchDom = [h('div', {
            'class': {
              'branch-node': true
            }
          }, branchItems)]
          //继续遍历分支后的节点
          let afterChildDoms: any = getDomTree(h, node.children)
          return [h('div', {}, [bchDom, afterChildDoms])]
        } else if (isEmptyNode(node)) {
          //空节点，存在于分支尾部
          let childDoms: any = getDomTree(h, node.children)
          decodeAppendDom(h, node, childDoms, {
            _disabled: node?._disabled,
            _executable: node?._executable,
            _passed: node?._passed
          })
          return [h('div', {
            'class': {
              'empty-node': true
            }
          }, childDoms)];
        } else {
          //遍历到了末端，无子节点
          return [];
        }
      };
      const compTrans = (comp:String) =>{
        if(comp == 'root'){
          return Root;
        } else if(comp == 'node'){
          return Node;
        } else if(comp == 'approval'){
          return Approval;
        } else if(comp == 'cc'){
          return Cc;
        } else if(comp == 'trigger'){
          return Trigger;
        } else if(comp == 'concurrent'){
          return Concurrent;
        } else if(comp == 'condition'){
          return Condition;
        } else if(comp == 'delay'){
          return Delay;
        } else if(comp == 'empty'){
          return Empty;
        } else {
          return comp
        } 
      };
      //解码渲染的时候插入dom到同级
      const decodeAppendDom = (h: any, node: any, dom: any, props = {}) => {
        if (!node || !node.nodeId) {
          return;
        }
        const Dom = h(
          compTrans(node.type.toLowerCase()),
          {
            config: node,
            // ref: node.nodeId,
            key: node.nodeId,
            ...props,
            //定义事件，插入节点，删除节点，选中节点，复制/移动
            onInsertNode: (type: any) => insertNode(type, node),
            onDelNode: () => delNode(node),
            onSelected: () => selectNode(node),
            onCopy: () => copyBranch(node),
            onLeftMove: () => branchMove(node, -1),
            onRightMove: () => branchMove(node, 1),
          },[],
        );
        dom.unshift(Dom);
      };
      // const decodeAppendDom = (h: any, node: any, dom: any, props = {}) => {
      //   dom.unshift(h(compTrans(node.type.toLowerCase()), {
      //     config: node,
      //     ref: node.nodeId,
      //     key: node.nodeId,
      //     ...props,
      //     //定义事件，插入节点，删除节点，选中节点，复制/移动
      //     // on: {
      //     onInsertNode: (type: any) => insertNode(type, node),
      //     onDelNode: () => delNode(node),
      //     onSelected: () => selectNode(node),
      //     onCopy: () => copyBranch(node),
      //     onLeftMove: () => branchMove(node, -1),
      //     onRightMove: () => branchMove(node, 1)
      //     // },
      //   }, []))
      // };
      // id映射到map，用来向上遍历
      const toMapping = (node: any) => {
        if (node && node.nodeId) {
					stores.addNodeMap({"nodeId":node.nodeId,"node":node});
        }
      };
      const insertCoverLine = (h: any, index: any, doms: any, branches: any) => {
        if (index === 0) {
          //最左侧分支
          doms.unshift(h('div', {
            'class': {
              'line-top-left': true
            }
          }, []))
          doms.unshift(h('div', {
            'class': {
              'line-bot-left': true
            }
          }, []))
        } else if (index === branches.length - 1) {
          //最右侧分支
          doms.unshift(h('div', {
            'class': {
              'line-top-right': true
            }
          }, []))
          doms.unshift(h('div', {
            'class': {
              'line-bot-right': true
            }
          }, []))
        }
      };
      const copyBranch = (node: any) => {
        let parentNode = nodeMap.value.get(node.parentId)
        let branchNode:any = deepCopy(node)
        branchNode.name = branchNode.name + '-copy'
        forEachNode(parentNode, branchNode, (parent: any, node: any) => {
          let id = getRandomId()
          node.nodeId = id
          node.parentId = parent.nodeId
        })
        parentNode.branches.splice(parentNode.branches.indexOf(node), 0, branchNode)
        // ctx.$forceUpdate()
      };

      const branchMove = (node: any, offset: any) => {
        let parentNode = nodeMap.value.get(node.parentId)
        let index = parentNode.branches.indexOf(node)
        let branch = parentNode.branches[index + offset]
        parentNode.branches[index + offset] = parentNode.branches[index]
        parentNode.branches[index] = branch
        // ctx.$forceUpdate()
      };
      //判断是否为主要业务节点
      const isPrimaryNode = (node: any) => {
        return node &&
          (node.type === 'ROOT' || node.type === 'APPROVAL' ||
            node.type === 'CC' || node.type === 'DELAY' ||
            node.type === 'TRIGGER');
      };
      const isBranchNode = (node: any) => {
        return node && (node.type === 'CONDITIONS' || node.type === 'CONCURRENTS');
      };
      const isEmptyNode = (node: any) => {
        return node && (node.type === 'EMPTY')
      };
      //是分支节点
      const isConditionNode = (node: any) => {
        return node.type === 'CONDITIONS';
      };
      //是分支节点
      const isBranchSubNode = (node: any) => {
        return node && (node.type === 'CONDITION' || node.type === 'CONCURRENT');
      };
      const isConcurrentNode = (node: any) => {
        return node.type === 'CONCURRENTS'
      };
      const getRandomId = () => {
        return `node_${new Date().getTime().toString().substring(5)}${Math.round(Math.random()*9000+1000)}`
      };
      //选中一个节点
      const selectNode = (node: any) => {
        stores.setSelectedNode(node);
        emit('selectedNode', node)
      };
      //处理节点插入逻辑
      const insertNode = (type: any, parentNode: any) => {
        // ctx.refs['_root'].click()
        //缓存一下后面的节点
        let afterNode = parentNode.children;
        //插入新节点
        parentNode.children = {
          nodeId: getRandomId(),
          parentId: parentNode.nodeId,
          props: {},
          type: type,
        }
        switch (type) {
          case 'APPROVAL':
            insertApprovalNode(parentNode, afterNode);
            break;
          case 'CC':
            insertCcNode(parentNode);
            break;
          case 'DELAY':
            insertDelayNode(parentNode);
            break;
          case 'TRIGGER':
            insertTriggerNode(parentNode);
            break;
          case 'CONDITIONS':
            insertConditionsNode(parentNode);
            break;
          case 'CONCURRENTS':
            insertConcurrentsNode(parentNode);
            break;
          default:
            break;
        }
        //拼接后续节点
        if (isBranchNode({
            type: type
          })) {
          if (afterNode && afterNode.nodeId) {
            afterNode.parentId = parentNode.children.children.nodeId
          }
          parentNode.children.children.children = afterNode;
        } else {
          if (afterNode && afterNode.nodeId) {
            afterNode.parentId = parentNode.children.nodeId
          }
          parentNode.children.children = afterNode;
        }
        // ctx.$forceUpdate()
      };
      const insertApprovalNode = (parentNode: any, afterNode: any) => {
        parentNode.children.name = '';
        parentNode.children.props = deepCopy(DefaultProps.APPROVAL_PROPS);
      };
      const insertCcNode = (parentNode: any) => {
        parentNode.children.name = '抄送对象';
        parentNode.children.props = deepCopy(DefaultProps.CC_PROPS);
      };
      const insertConditionsNode = (parentNode: any) => {
        parentNode.children.name = '条件分支';
        parentNode.children.children = {
          nodeId: getRandomId(),
          parentId: parentNode.children.nodeId,
          type: "EMPTY"
        };
        parentNode.children.branches = [{
          nodeId: getRandomId(),
          parentId: parentNode.children.nodeId,
          type: "CONDITION",
          // props: deepCopy(DefaultProps.CONDITION_PROPS),
          conditions: [],
          name: "条件1",
          children: {}
        }, {
          nodeId: getRandomId(),
          parentId: parentNode.children.nodeId,
          type: "CONDITION",
          // props: deepCopy(DefaultProps.CONDITION_PROPS),
          conditions: [],
          name: "条件2",
          children: {}
        }];
      };
      const insertConcurrentsNode = (parentNode: any) => {
        parentNode.children.name = '并行分支';
        parentNode.children.children = {
          nodeId: getRandomId(),
          parentId: parentNode.children.nodeId,
          type: "EMPTY"
        };
        parentNode.children.branches = [{
          nodeId: getRandomId(),
          name: "分支1",
          parentId: parentNode.children.nodeId,
          type: "CONCURRENT",
          props: {},
          children: {}
        }, {
          nodeId: getRandomId(),
          name: "分支2",
          parentId: parentNode.children.nodeId,
          type: "CONCURRENT",
          props: {},
          children: {}
        }];
      };
      const insertDelayNode = (parentNode: any) => {
        parentNode.children.name = '延时处理';
        parentNode.children.props = deepCopy(DefaultProps.DELAY_PROPS);
        // proxy.$set(parentNode.children, "name", "延时处理")
        // proxy.$set(parentNode.children, "props", proxy.$deepCopy(DefaultProps.DELAY_PROPS))
      };
      const insertTriggerNode = (parentNode: any) => {
        parentNode.children.name = '触发器';
        parentNode.children.props = deepCopy(DefaultProps.TRIGGER_PROPS);
        // proxy.$set(parentNode.children, "name", "触发器")
        // proxy.$set(parentNode.children, "props", proxy.$deepCopy(DefaultProps.TRIGGER_PROPS))
      };
      const getBranchEndNode:any = (conditionNode: any) => {
        if (!conditionNode.children || !conditionNode.children.nodeId) {
          return conditionNode;
        }
        return getBranchEndNode(conditionNode.children);
      };
      const addBranchNode = (node: any) => {
        
        if (node.branches.length < 8) {
          node.branches.push({
            nodeId: getRandomId(),
            parentId: node.nodeId,
            name: (isConditionNode(node) ? '条件' : '分支') + (node.branches.length + 1),
            // props: isConditionNode(node) ? deepCopy(DefaultProps.CONDITION_PROPS) : {},
            conditions: [],
            type: isConditionNode(node) ? "CONDITION" : "CONCURRENT",
            children: {}
          })
        } else {
          proxy.$message.warning("最多只能添加 8 项😥")
        }
      };
      //删除当前节点
      const delNode = (node: any) => {
        //获取该节点的父节点
        
        let parentNode = nodeMap.value.get(node.parentId)
        if (parentNode) {
          //判断该节点的父节点是不是分支节点
          if (isBranchNode(parentNode)) {
            //移除该分支
            parentNode.branches.splice(parentNode.branches.indexOf(node), 1)
            //处理只剩1个分支的情况
            if (parentNode.branches.length < 2) {
              //获取条件组的父节点
              let ppNode = nodeMap.value.get(parentNode.parentId)
              //判断唯一分支是否存在业务节点
              if (parentNode.branches[0].children && parentNode.branches[0].children.nodeId) {
                //将剩下的唯一分支头部合并到主干
                ppNode.children = parentNode.branches[0].children
                ppNode.children.parentId = ppNode.nodeId
                //搜索唯一分支末端最后一个节点
                let endNode = getBranchEndNode(parentNode.branches[0])
                //后续节点进行拼接, 这里要取EMPTY后的节点
                endNode.children = parentNode.children.children
                if (endNode.children && endNode.children.nodeId) {
                  endNode.children.parentId = endNode.nodeId
                }
              } else {
                //直接合并分支后面的节点，这里要取EMPTY后的节点
                ppNode.children = parentNode.children.children
                if (ppNode.children && ppNode.children.nodeId) {
                  ppNode.children.parentId = ppNode.nodeId
                }
              }
            }
          } else {
            //不是的话就直接删除
            if (node.children && node.children.nodeId) {
              node.children.parentId = parentNode.nodeId
            }
            parentNode.children = node.children
          }
          // ctx.$forceUpdate()
        } else {
          proxy.$message.warning("出现错误，找不到上级节点😥")
        }
      };
      const validateProcess = () => {
        state.valid = true
        let err: any = []
        validate(err, dom.value)
        return err
      };
      const validateNode = (err: any, node: any) => {
        var cmp:any = ctx.refs[node.nodeId];
        if (cmp.validate) {
          state.valid = cmp.validate(err)
        }
      };
      //更新指定节点的dom
      const nodeDomUpdate = (node: any) => {
        var cmp:any = ctx.refs[node.nodeId];
        cmp.$forceUpdate()
      };
      //给定一个起始节点，遍历内部所有节点
      const forEachNode = (parent: any, node: any, callback: any) => {
        if (isBranchNode(node)) {
          callback(parent, node)
          forEachNode(node, node.children, callback)
          node.branches.map((branchNode: any) => {
            callback(node, branchNode)
            forEachNode(branchNode, branchNode.children, callback)
          })
        } else if (isPrimaryNode(node) || isEmptyNode(node) || isBranchSubNode(node)) {
          callback(parent, node)
          forEachNode(node, node.children, callback)
        }
      };
      //校验所有节点设置
      const validate = (err: any, node: any) => {
        
        if (isPrimaryNode(node)) {
          validateNode(err, node)
          validate(err, node.children)
        } else if (isBranchNode(node)) {
          //校验每个分支
          node.branches.map((branchNode: any) => {
            //校验条件节点
            validateNode(err, branchNode)
            //校验条件节点后面的节点
            validate(err, branchNode.children)
          })
          validate(err, node.children)
        } else if (isEmptyNode(node)) {
          validate(err, node.children)
        }
      };

      const deepCopy = (obj: any) => {
        //判断 传入对象 为 数组 或者 对象
        var result:any = Array.isArray(obj) ? [] : {};
        // for in 遍历
        for (var key in obj) {
            // 判断 是否 为自身 的属性值（排除原型链干扰）
            if (obj.hasOwnProperty(key)) {
                // 判断 对象的属性值 中 存储的 数据类型 是否为对象
                if (typeof obj[key] === 'object') {
                    // 递归调用
                    result[key] = deepCopy(obj[key]);   //递归复制
                } 
                // 不是的话 直接 赋值 copy
                else {
                    result[key] = obj[key];
                }
            }
        }
        // 返回 新的对象
        return result;
      };
      
      return {
        nodeMap,
        // editFlag,
        dom,
        getDomTree,
        decodeAppendDom,
        toMapping,
        insertCoverLine,
        copyBranch,
        branchMove,
        isPrimaryNode,
        isBranchNode,
        isEmptyNode,
        isConditionNode,
        isBranchSubNode,
        isConcurrentNode,
        getRandomId,
        selectNode,
        insertNode,
        insertApprovalNode,
        insertCcNode,
        insertDelayNode,
        insertTriggerNode,
        insertConditionsNode,
        insertConcurrentsNode,
        getBranchEndNode,
        addBranchNode,
        delNode,
        validateProcess,
        validateNode,
        nodeDomUpdate,
        forEachNode,
        validate,
        deepCopy,
        ...toRefs(state),
      };

    },
  });
  
</script>

<style lang="scss" scoped>
  ._root {
    margin: 0 auto;
  }

  .process-end {
    width: 80px;
    margin: 0 auto;
    margin-bottom: 20px;
    border-radius: 15px;
    padding: 5px 10px;
    font-size: small;
    color: #747474;
    background-color: #f2f2f2;
    box-shadow: 0 0 10px 0 #bcbcbc;
  }

  .primary-node {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .branch-node {
    display: flex;
    justify-content: center;
    /*border-top: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc;*/
  }

  .branch-node-item {
    position: relative;
    display: flex;
    background: #f5f6f6;
    flex-direction: column;
    align-items: center;
    border-top: 2px solid #cccccc;
    border-bottom: 2px solid #cccccc;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: calc(50% - 1px);
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #CACACA;
    }

    .line-top-left,
    .line-top-right,
    .line-bot-left,
    .line-bot-right {
      position: absolute;
      width: 50%;
      height: 4px;
      background-color: #f5f6f6;
    }

    .line-top-left {
      top: -2px;
      left: -1px;
    }

    .line-top-right {
      top: -2px;
      right: -1px;
    }

    .line-bot-left {
      bottom: -2px;
      left: -1px;
    }

    .line-bot-right {
      bottom: -2px;
      right: -1px;
    }
  }

  .add-branch-btn {
    position: absolute;
    width: 80px;

    .add-branch-btn-el {
      z-index: 999;
      position: absolute;
      top: -15px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 15px;
      padding: 5px 10px;
      box-sizing: border-box;
      cursor: pointer; 
    }
    .aaa{
      display: none;
    }

  }

  .empty-node {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
</style>