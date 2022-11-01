import authority from '@/utils/authority'
import API from '@/services'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
const store = useUserStore()

// 角色管理
class Role {
  /**
   * @desc 获取角色维护数据
   * @param id 所选中的部门或集团或群 id
   * @return 角色数据
   */
  public async getAuthorityTree(id: string) {
    const { data, success } = await API.company.getAuthorityTree({ data: { id: id } })
    if (!success) {
      return
    }
    return data
  }

  /**
   * @desc 删除组织角色
   * @param id 所选择的角色id
   * @return 调用成功
   */
  public async deleteAuthority(id: string) {
    const { success } = await API.company.deleteAuthority({ data: { id: id } })
    if (success) {
      ElMessage({
        message: '删除成功!',
        type: 'success'
      })
      return success
    } else {
      ElMessage({
        message: '删除失败!',
        type: 'error'
      })
    }
  }

  /**
   * @desc 创建角色
   * @param params 所填写的内容
   * @param id 归属id
   * @return 调用成功
   */
  public async createAuthority(params: any, id: string) {
    const { success, msg } = await API.company.createAuthority({
      data: {
        id: params.id,
        code: params.code,
        name: params.name,
        parentId: params.parentId,
        public: params.public,
        remark: params.remark,
        belongId: id
      }
    })
    if (success) {
      ElMessage({
        message: msg,
        type: 'success'
      })
      return success
    } else {
      ElMessage({
        message: msg,
        type: 'error'
      })
    }
  }

  /**
   * @desc 创建角色
   * @param params 所填写的内容
   * @return 调用成功
   */
  public async updateAuthority(params: any) {
    const { success, msg } = await API.company.updateAuthority({
      data: params
    })
    if (success) {
      ElMessage({
        message: msg,
        type: 'success'
      })
      return success
    } else {
      ElMessage({
        message: msg,
        type: 'error'
      })
    }
  }
}

export const roleServices = new Role()
export default roleServices
