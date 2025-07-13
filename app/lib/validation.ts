// 表单验证工具库
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// 基础验证函数
export const validators = {
  required: (value: any, fieldName: string): ValidationError | null => {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return { field: fieldName, message: `${fieldName}不能为空` };
    }
    return null;
  },

  email: (value: string, fieldName: string = 'email'): ValidationError | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { field: fieldName, message: '请输入有效的邮箱地址' };
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): ValidationError | null => {
    if (value.length < min) {
      return { field: fieldName, message: `${fieldName}至少需要${min}个字符` };
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): ValidationError | null => {
    if (value.length > max) {
      return { field: fieldName, message: `${fieldName}不能超过${max}个字符` };
    }
    return null;
  },

  phone: (value: string, fieldName: string = 'phone'): ValidationError | null => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      return { field: fieldName, message: '请输入有效的手机号码' };
    }
    return null;
  },

  pattern: (value: string, pattern: RegExp, fieldName: string, message: string): ValidationError | null => {
    if (!pattern.test(value)) {
      return { field: fieldName, message };
    }
    return null;
  },

  custom: (value: any, validator: (value: any) => boolean, fieldName: string, message: string): ValidationError | null => {
    if (!validator(value)) {
      return { field: fieldName, message };
    }
    return null;
  }
};

// 表单字段配置
export interface FieldConfig {
  name: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'password' | 'select';
  validations?: ((value: any) => ValidationError | null)[];
}

// 表单验证器
export class FormValidator {
  private fields: FieldConfig[];

  constructor(fields: FieldConfig[]) {
    this.fields = fields;
  }

  validate(formData: Record<string, any>): ValidationResult {
    const errors: ValidationError[] = [];

    for (const field of this.fields) {
      const value = formData[field.name];

      // 必填字段验证
      if (field.required) {
        const requiredError = validators.required(value, field.label);
        if (requiredError) {
          errors.push(requiredError);
          continue; // 如果必填验证失败，跳过其他验证
        }
      }

      // 只有当字段有值时才进行其他验证
      if (value && field.validations) {
        for (const validation of field.validations) {
          const error = validation(value);
          if (error) {
            errors.push(error);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getFieldErrors(errors: ValidationError[], fieldName: string): string[] {
    return errors
      .filter(error => error.field === fieldName)
      .map(error => error.message);
  }
}

// 预定义的验证器
export const createUserRegistrationValidator = () => {
  return new FormValidator([
    {
      name: 'name',
      label: '姓名',
      required: true,
      validations: [
        (value: string) => validators.minLength(value, 2, '姓名'),
        (value: string) => validators.maxLength(value, 50, '姓名'),
        (value: string) => validators.pattern(
          value,
          /^[\u4e00-\u9fa5a-zA-Z\s]+$/,
          '姓名',
          '姓名只能包含中文、英文和空格'
        )
      ]
    },
    {
      name: 'email',
      label: '邮箱地址',
      required: true,
      type: 'email',
      validations: [
        (value: string) => validators.email(value, '邮箱地址'),
        (value: string) => validators.maxLength(value, 100, '邮箱地址')
      ]
    },
    {
      name: 'phone',
      label: '手机号码',
      required: true,
      type: 'tel',
      validations: [
        (value: string) => validators.phone(value, '手机号码')
      ]
    },
    {
      name: 'selectedCourse',
      label: '选择课程',
      required: true,
      type: 'select',
      validations: [
        (value: string) => validators.custom(
          value,
          (v) => /^\d+$/.test(v),
          '选择课程',
          '请选择有效的课程'
        )
      ]
    }
  ]);
};

export const createUserLoginValidator = () => {
  return new FormValidator([
    {
      name: 'email',
      label: '邮箱地址',
      required: true,
      type: 'email',
      validations: [
        (value: string) => validators.email(value, '邮箱地址')
      ]
    }
  ]);
};

export const createCourseEnrollmentValidator = () => {
  return new FormValidator([
    {
      name: 'name',
      label: '姓名',
      required: true,
      validations: [
        (value: string) => validators.minLength(value, 2, '姓名'),
        (value: string) => validators.maxLength(value, 50, '姓名'),
        (value: string) => validators.pattern(
          value,
          /^[\u4e00-\u9fa5a-zA-Z\s]+$/,
          '姓名',
          '姓名只能包含中文、英文和空格'
        )
      ]
    },
    {
      name: 'email',
      label: '邮箱地址',
      required: true,
      type: 'email',
      validations: [
        (value: string) => validators.email(value, '邮箱地址')
      ]
    },
    {
      name: 'phone',
      label: '手机号码',
      required: true,
      type: 'tel',
      validations: [
        (value: string) => validators.phone(value, '手机号码')
      ]
    }
  ]);
};

// 错误消息转换
export const convertValidationErrorsToActionErrors = (errors: ValidationError[]): Record<string, string> => {
  const actionErrors: Record<string, string> = {};
  
  errors.forEach(error => {
    if (!actionErrors[error.field]) {
      actionErrors[error.field] = error.message;
    }
  });
  
  return actionErrors;
};

// 表单数据清理
export const sanitizeFormData = (formData: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// 成功消息生成器
export const successMessages = {
  userRegistered: '注册成功！欢迎加入爱学AI创富实训营！',
  userLoggedIn: '登录成功！欢迎回来！',
  courseEnrolled: '报名成功！我们将在24小时内与您联系。',
  formSubmitted: '表单提交成功！',
  dataUpdated: '数据更新成功！',
  dataSaved: '数据保存成功！'
};

// 错误消息生成器
export const errorMessages = {
  networkError: '网络错误，请检查您的网络连接后重试',
  serverError: '服务器错误，请稍后再试',
  validationFailed: '表单验证失败，请检查输入信息',
  userNotFound: '用户不存在，请先注册',
  userAlreadyExists: '用户已存在，请直接登录',
  courseNotFound: '课程不存在',
  alreadyEnrolled: '您已经报名过这个课程了',
  unauthorized: '未授权访问，请先登录',
  forbidden: '权限不足，无法执行此操作',
  generic: '操作失败，请稍后再试'
}; 

// 单独的验证函数，用于React组件
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return '邮箱不能为空'
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return '请输入有效的邮箱地址'
  }
  
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password || password.trim().length === 0) {
    return '密码不能为空'
  }
  
  if (password.length < 6) {
    return '密码至少需要6个字符'
  }
  
  return null
}

export const validateName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return '姓名不能为空'
  }
  
  if (name.length < 2) {
    return '姓名至少需要2个字符'
  }
  
  if (name.length > 50) {
    return '姓名不能超过50个字符'
  }
  
  return null
}

export const validatePhone = (phone: string): string | null => {
  if (!phone || phone.trim().length === 0) {
    return null // 手机号可选
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    return '请输入有效的手机号码'
  }
  
  return null
}

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName}不能为空`
  }
  
  return null
} 