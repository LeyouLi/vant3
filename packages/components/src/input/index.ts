import { observer } from '@formily/reactive-vue'
import { isVoidField } from '@formily/core'
import { connect, mapProps, mapReadPretty, h } from '@formily/vue'
import { defineComponent } from 'vue'
import type { FieldProps as VanInputProps } from 'vant'
import { Field as VanInput } from 'vant'
import { transformComponent } from '../__builtins__'
import { resolveComponent } from '../__builtins__/shared'
import { stylePrefix } from '../__builtins__/configs'
import { PreviewText } from '../preview-text'

export type InputProps = typeof VanInput

const TransformVanInput = transformComponent<InputProps>(VanInput, {
  change: 'update:modelValue',
})

export const BaseInput = observer(
  defineComponent({
    name: 'FBaseInput',
    setup(props, { attrs, slots, emit }) {
      return () => {
        return h(
          TransformVanInput,
          {
            class: [`${stylePrefix}-input`],
            attrs: {
              ...attrs,
              ...props,
              modelValue: attrs.value,
            },
            on: emit,
          },
          slots
        )
      }
    },
  })
)

export const inputValidate = mapProps<any>(
  { validateStatus: true, required: true },
  (props, field) => {
    if (isVoidField(field)) return props
    if (!field) return props
    const takeMessage = () => {
      const split = (messages: any[]) => {
        return messages.reduce((buf, text, index) => {
          if (!text) return buf
          return index < messages.length - 1
            ? buf.concat([text, ', '])
            : buf.concat([text])
        }, [])
      }

      if (field.validating) return
      if (props.feedbackText) return props.feedbackText
      if (field.selfErrors.length) return split(field.selfErrors)
      if (field.selfWarnings.length) return split(field.selfWarnings)
      if (field.selfSuccesses.length) return split(field.selfSuccesses)
    }
    const errorMessages = takeMessage()
    return {
      errorMessage: resolveComponent(
        Array.isArray(errorMessages) ? errorMessages.join('') : errorMessages
      ),
      extra: props.extra || field.description,
    }
  },
  (props, field) => {
    if (isVoidField(field)) return props
    if (!field) return props
    return {
      feedbackStatus:
        field.validateStatus === 'validating'
          ? 'pending'
          : (Array.isArray(field.decorator) &&
              field.decorator[1]?.feedbackStatus) ||
            field.validateStatus,
    }
  },
  (props, field) => {
    if (isVoidField(field)) return props

    if (!field) return props
    let asterisk = false
    if (field.required && field.pattern !== 'readPretty') {
      asterisk = true
    }
    if ('asterisk' in props) {
      asterisk = props.asterisk
    }

    return {
      asterisk,
    }
  }
)

export const Input = connect(
  BaseInput,
  mapReadPretty(PreviewText.Input)
  // inputValidate
)

export default Input
