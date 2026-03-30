import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

interface FormOptions {
  // 默认值
  defaultValue?: Record<string, any>
  // 提交方法
  submitFn?: (data: Record<string, any>) => Promise<any>
}

interface FormState {
  formRef: ReturnType<typeof ref<FormInstance | undefined>>
  formData: Record<string, any>
  loading: ReturnType<typeof ref<boolean>>
  // 方法
  validate: () => Promise<boolean>
  reset: () => void
  submit: () => Promise<boolean>
  setFormData: (data: Record<string, any>) => void
}

/**
 * 表单通用 Hook
 */
export function useForm(options: FormOptions): FormState {
  const { defaultValue = {}, submitFn } = options

  // 表单引用
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive<Record<string, any>>({ ...defaultValue })

  // 加载状态
  const loading = ref(false)

  // 验证表单
  const validate = async (): Promise<boolean> => {
    if (!formRef.value) return false
    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  // 重置表单
  const reset = () => {
    formRef.value?.resetFields()
    Object.keys(formData).forEach(key => {
      if (key in defaultValue) {
        formData[key] = defaultValue[key]
      } else {
        delete formData[key]
      }
    })
  }

  // 提交表单
  const submit = async (): Promise<boolean> => {
    const valid = await validate()
    if (!valid) return false

    if (!submitFn) return true

    loading.value = true
    try {
      // 深拷贝表单数据
      const data = JSON.parse(JSON.stringify(formData))
      await submitFn(data)
      return true
    } catch {
      return false
    } finally {
      loading.value = false
    }
  }

  // 设置表单数据
  const setFormData = (data: Record<string, any>) => {
    Object.assign(formData, data)
  }

  return {
    formRef,
    formData,
    loading,
    validate,
    reset,
    submit,
    setFormData
  }
}

/**
 * 表单规则生成器
 */
export const createRules = {
  required: (message: string = '此项为必填项') => ({
    required: true,
    message,
    trigger: 'blur'
  }),

  email: (message: string = '请输入正确的邮箱格式') => ({
    type: 'email' as const,
    message,
    trigger: 'blur'
  }),

  phone: (message: string = '请输入正确的手机号') => ({
    pattern: /^1[3-9]\d{9}$/,
    message,
    trigger: 'blur'
  }),

  minLength: (min: number, message?: string) => ({
    min,
    message: message || `长度不能少于 ${min} 个字符`,
    trigger: 'blur'
  }),

  maxLength: (max: number, message?: string) => ({
    max,
    message: message || `长度不能超过 ${max} 个字符`,
    trigger: 'blur'
  }),

  range: (min: number, max: number, message?: string) => ({
    min,
    max,
    message: message || `长度在 ${min} 到 ${max} 个字符`,
    trigger: 'blur'
  })
}
